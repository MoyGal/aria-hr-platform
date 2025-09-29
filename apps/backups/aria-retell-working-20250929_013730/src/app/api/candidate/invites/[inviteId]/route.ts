import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/lib/db';
import { validateCandidateInvite } from '@/lib/candidates/invites';

type CandidateInviteRecord = {
  id: string;
  orgId?: string | null;
  interviewId?: string | null;
  candidateEmail?: string | null;
  candidateName?: string | null;
  status?: string;
  expiresAt?: Date | null;
};

interface Params {
  inviteId: string;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<Params> }
) {
  try {
    const params = await context.params;
    const inviteId = params.inviteId;
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }

    const validation = await validateCandidateInvite(token, inviteId);
    if (!validation.valid || !validation.invite) {
      return NextResponse.json({
        valid: false,
        reason: validation.reason ?? 'Invalid invite',
      });
    }

    const invite = validation.invite as CandidateInviteRecord;
    const interview = invite.interviewId
      ? await prisma.interview.findUnique({ where: { id: invite.interviewId } })
      : null;

    let interviewer = null;
    if (interview?.interviewerId) {
      interviewer = await prisma.interviewer.findUnique({ where: { id: interview.interviewerId } });
    }

    return NextResponse.json({
      valid: true,
      invite: {
        id: invite.id,
        orgId: invite.orgId,
        candidateEmail: invite.candidateEmail ?? null,
        candidateName: invite.candidateName ?? null,
        status: invite.status,
        expiresAt: invite.expiresAt ?? null,
      },
      interview: interview
        ? {
            id: interview.id,
            mode: interview.mode ?? null,
            status: interview.status ?? null,
            interviewerId: interview.interviewerId ?? null,
          }
        : null,
      interviewer: interviewer
        ? {
            id: interviewer.id,
            name: interviewer.name ?? null,
            retellAgentId: interviewer.retellAgentId ?? interviewer.externalId ?? null,
          }
        : null,
    });
  } catch (error) {
    console.error('GET /api/candidate/invites/[inviteId] error:', error);
    return NextResponse.json({ error: 'Failed to validate invite' }, { status: 500 });
  }
}
