import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/lib/db';
import { createCandidateInvite } from '@/lib/candidates/invites';
import { resolveMasterUids } from '@/lib/auth/roles';

interface CreateInviteBody {
  interviewId: string;
  candidateEmail?: string | null;
  candidateName?: string | null;
}

async function validateMaster(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return null;
  }

  const [type, token] = authHeader.split(' ');
  if (type !== 'Bearer' || !token) {
    return null;
  }

  // Expecting the master to pass their uid as token for now (simple guard).
  // Later we can replace with Firebase Admin token verifying logic.
  const masterUids = resolveMasterUids();
  return masterUids.has(token) ? token : null;
}

export async function POST(request: NextRequest) {
  try {
    const masterUid = await validateMaster(request);
    if (!masterUid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as CreateInviteBody;
    if (!body?.interviewId) {
      return NextResponse.json({ error: 'interviewId is required' }, { status: 400 });
    }

    const interview = await prisma.interview.findUnique({ where: { id: body.interviewId } });
    if (!interview) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    const orgId = interview.orgId ?? 'org_master';

    const inviteToken = await createCandidateInvite({
      orgId,
      interviewId: interview.id,
      candidateEmail: body.candidateEmail ?? null,
      candidateName: body.candidateName ?? null,
      createdBy: masterUid,
    });

    return NextResponse.json({
      inviteId: inviteToken.inviteId,
      url: inviteToken.url,
      expiresAt: inviteToken.expiresAt,
      note: 'Share this link with the candidate. Token must remain private.',
    });
  } catch (error) {
    console.error('POST /api/admin/invites error:', error);
    return NextResponse.json({ error: 'Failed to create invite' }, { status: 500 });
  }
}
