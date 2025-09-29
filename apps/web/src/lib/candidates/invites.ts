import crypto from 'crypto';

import prisma from '@/lib/db';

const TOKEN_BYTES = 32;
const DEFAULT_EXPIRATION_HOURS = 48;

export interface InviteTokenPayload {
  token: string;
  expiresAt: Date;
  inviteId: string;
  url: string;
}

export interface CreateInviteInput {
  orgId: string;
  interviewId: string;
  candidateEmail?: string | null;
  candidateName?: string | null;
  createdBy: string;
  expiresAt?: Date;
}

export function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function generateToken(length = TOKEN_BYTES) {
  return crypto.randomBytes(length).toString('hex');
}

export async function createCandidateInvite(input: CreateInviteInput): Promise<InviteTokenPayload> {
  const token = generateToken();
  const tokenHash = hashToken(token);
  const expiresAt = input.expiresAt ?? new Date(Date.now() + DEFAULT_EXPIRATION_HOURS * 3600 * 1000);

  const invite = await prisma.candidateInvite.create({
    data: {
      orgId: input.orgId,
      interviewId: input.interviewId,
      candidateEmail: input.candidateEmail ?? null,
      candidateName: input.candidateName ?? null,
      createdBy: input.createdBy,
      tokenHash,
      status: 'pending',
      expiresAt,
    },
  });

  const searchParams = new URLSearchParams({ token });
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  const url = `${baseUrl}/candidate/${invite.id}?${searchParams.toString()}`;

  return {
    token,
    expiresAt,
    inviteId: invite.id,
    url,
  };
}

export async function validateCandidateInvite(token: string, inviteId: string) {
  const tokenHash = hashToken(token);
  const invite = await prisma.candidateInvite.findUnique({ where: { id: inviteId } });

  if (!invite) {
    return { valid: false, reason: 'Invite not found' as const };
  }

  if (invite.tokenHash !== tokenHash) {
    return { valid: false, reason: 'Invalid token' as const };
  }

  const now = new Date();
  if (invite.expiresAt && invite.expiresAt < now) {
    return { valid: false, reason: 'Invite expired' as const };
  }

  return { valid: true, invite } as const;
}

export async function markInviteUsed(inviteId: string, metadata: Record<string, unknown> = {}) {
  return prisma.candidateInvite.update({
    where: { id: inviteId },
    data: {
      status: 'used',
      usedAt: new Date(),
      metadata,
    },
  });
}
