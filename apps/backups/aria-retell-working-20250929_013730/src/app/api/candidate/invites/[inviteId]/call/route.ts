import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/lib/db';
import { validateCandidateInvite } from '@/lib/candidates/invites';
import { createWebCall } from '@/lib/retell';

type CandidateInviteRecord = {
  id: string;
  orgId?: string | null;
  interviewId?: string | null;
  candidateName?: string | null;
  candidateEmail?: string | null;
};

type InterviewerRecord = {
  id: string;
  externalId?: string | null;
  retellAgentId?: string | null;
};

interface Params {
  inviteId: string;
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<Params> }
) {
  try {
    const params = await context.params;
    const inviteId = params.inviteId;
    const body = await request.json();
    const token = body?.token;

    if (typeof token !== 'string') {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }

    const validation = await validateCandidateInvite(token, inviteId);
    if (!validation.valid || !validation.invite) {
      return NextResponse.json({ error: validation.reason ?? 'Invalid invite' }, { status: 401 });
    }

    const invite = validation.invite as CandidateInviteRecord;
    if (!invite.interviewId) {
      return NextResponse.json({ error: 'Invite not linked to interview' }, { status: 400 });
    }

    const interview = await prisma.interview.findUnique({ where: { id: invite.interviewId } });
    if (!interview) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    const interviewerId = interview.interviewerId ?? process.env.RETELL_DEFAULT_AGENT_ID ?? null;

    if (!interviewerId) {
      return NextResponse.json({ error: 'Interview missing interviewer' }, { status: 400 });
    }

    if (!interview.interviewerId) {
      await prisma.interview
        .update({ where: { id: interview.id }, data: { interviewerId } })
        .catch(() => null);
    }

    let interviewer = (await prisma.interviewer.findUnique({ where: { id: interviewerId } })) as
      | InterviewerRecord
      | null;
    if (!interviewer) {
      await prisma.interviewer
        .create({
          data: {
            id: interviewerId,
            externalId: interviewerId,
            name: 'Default Retell Agent',
            description: 'Auto-generated agent link',
            retellAgentId: interviewerId,
          },
        })
        .catch(() => null);
      interviewer = (await prisma.interviewer.findUnique({ where: { id: interviewerId } })) as
        | InterviewerRecord
        | null;
    }

    const retellAgentId = interviewer?.retellAgentId ?? interviewer?.externalId ?? interviewerId;
    if (!retellAgentId) {
      return NextResponse.json({ error: 'Interviewer not configured with Retell agent' }, { status: 400 });
    }

    const webCall = (await createWebCall(retellAgentId, {
      candidateInviteId: inviteId,
      interviewId: interview.id,
      orgId: invite.orgId ?? interview.orgId ?? null,
      candidateName: invite.candidateName ?? null,
      candidateEmail: invite.candidateEmail ?? null,
      source: 'candidate-portal',
    })) as {
      call_id?: string;
      callId?: string;
      access_token?: string;
      accessToken?: string;
      web_call_link?: string;
      call_link?: string;
      join_url?: string;
      meeting_url?: string;
      room_url?: string;
      expires_at?: string;
      expiresAt?: string;
    };

    const callId = webCall.call_id ?? webCall.callId ?? randomUUID();
    const accessToken = webCall.access_token ?? webCall.accessToken ?? null;
    const callRoomId = callId.startsWith('call_')
      ? `web_call_${callId.slice('call_'.length)}`
      : callId;
    const computedLink = accessToken
      ? `https://app.retell.ai/call/${callRoomId}?accessToken=${encodeURIComponent(accessToken)}`
      : null;
    const webCallLink =
      computedLink ??
      webCall.web_call_link ??
      webCall.call_link ??
      webCall.join_url ??
      webCall.meeting_url ??
      webCall.room_url ??
      null;

    await prisma.interview.update({
      where: { id: interview.id },
      data: {
        status: 'in_progress',
        startedAt: interview.startedAt ?? new Date(),
        candidateInviteId: inviteId,
      },
    }).catch(() => null);

    return NextResponse.json({
      callId,
      accessToken,
      webCallLink,
      expiresAt: webCall.expires_at ?? webCall.expiresAt ?? null,
    });
  } catch (error) {
    console.error('POST /api/candidate/invites/[inviteId]/call error:', error);
    return NextResponse.json({ error: 'Failed to start call' }, { status: 500 });
  }
}
