import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/lib/db';
import { createCandidateInvite } from '@/lib/candidates/invites';
import { resolveMasterUids } from '@/lib/auth/roles';

interface Params {
  id: string;
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<Params> }
) {
  try {
    const params = await context.params;
    const interviewId = params.id;

    const body = await request.json();
    const userId = typeof body?.userId === 'string' ? body.userId : null;
    const candidateEmail = typeof body?.candidateEmail === 'string' ? body.candidateEmail : null;
    const candidateName = typeof body?.candidateName === 'string' ? body.candidateName : null;

    if (!userId) {
      return NextResponse.json({ error: 'Missing user ID' }, { status: 401 });
    }

    const userRecord = await prisma.user.findUnique({ where: { id: userId } });
    const masterUids = resolveMasterUids();
    const role = typeof userRecord?.role === 'string' ? userRecord.role : null;

    const allowedRoles = new Set(['master', 'company_admin', 'recruiter']);
    if (!masterUids.has(userId) && (!role || !allowedRoles.has(role))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const interview = await prisma.interview.findUnique({ where: { id: interviewId } });
    if (!interview) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    let resolvedEmail = candidateEmail ?? null;
    let resolvedName = candidateName ?? null;

    if ((!resolvedEmail || !resolvedName) && interview.candidateId) {
      const candidate = await prisma.candidate.findUnique({ where: { id: interview.candidateId } });
      resolvedEmail = resolvedEmail ?? (candidate?.email as string | null | undefined) ?? null;
      resolvedName = resolvedName ?? (candidate?.name as string | null | undefined) ?? null;
    }

    const invite = await createCandidateInvite({
      orgId: (interview as any)?.orgId ?? userRecord?.orgId ?? 'org_master',
      interviewId: interview.id,
      candidateEmail: resolvedEmail,
      candidateName: resolvedName,
      createdBy: userId,
    });

    return NextResponse.json({
      inviteId: invite.inviteId,
      url: invite.url,
      expiresAt: invite.expiresAt,
      candidateEmail: resolvedEmail,
      candidateName: resolvedName,
    });
  } catch (error) {
    console.error('POST /api/interviews/[id]/invite error:', error);
    return NextResponse.json({ error: 'Failed to create invite' }, { status: 500 });
  }
}
