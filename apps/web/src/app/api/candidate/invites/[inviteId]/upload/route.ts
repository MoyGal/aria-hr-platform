import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/lib/db';
import { validateCandidateInvite, hashToken } from '@/lib/candidates/invites';

type CandidateInviteRecord = {
  id: string;
  orgId?: string | null;
  interviewId?: string | null;
};

interface Params {
  inviteId: string;
}

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(
  request: NextRequest,
  context: { params: Promise<Params> }
) {
  try {
    const params = await context.params;
    const inviteId = params.inviteId;
    const formData = await request.formData();
    const token = formData.get('token');
    const file = formData.get('file');

    if (typeof token !== 'string' || !file) {
      return NextResponse.json({ error: 'Missing token or file' }, { status: 400 });
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Invalid file' }, { status: 400 });
    }

    if (file.size <= 0) {
      return NextResponse.json({ error: 'Empty file' }, { status: 400 });
    }

    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: 'File is too large (max 5MB)' }, { status: 413 });
    }

    const validation = await validateCandidateInvite(token, inviteId);
    if (!validation.valid || !validation.invite) {
      return NextResponse.json({ error: validation.reason ?? 'Invalid invite' }, { status: 401 });
    }

    const invite = validation.invite as CandidateInviteRecord;
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString('base64');

    const upload = await prisma.candidateUpload.create({
      data: {
        inviteId,
        interviewId: invite.interviewId ?? null,
        orgId: invite.orgId ?? null,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        fileBase64: base64,
        tokenHash: hashToken(token),
        analysisStatus: 'pending',
        uploadedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      uploadId: upload?.id,
      fileName: file.name,
      fileSize: file.size,
    });
  } catch (error) {
    console.error('POST /api/candidate/invites/[inviteId]/upload error:', error);
    return NextResponse.json({ error: 'Failed to upload CV' }, { status: 500 });
  }
}
