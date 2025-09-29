import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/lib/db';
import { enforceRoleConsistency, DEFAULT_USER_ROLE, type UserRole } from '@/lib/auth/roles';

interface SessionRequestBody {
  uid?: string;
  email?: string | null;
  displayName?: string | null;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SessionRequestBody;
    const uid = typeof body.uid === 'string' ? body.uid : null;

    if (!uid) {
      return NextResponse.json({ error: 'Missing uid' }, { status: 400 });
    }

    const normalizedEmail = typeof body.email === 'string' ? body.email.toLowerCase() : null;
    const displayName = typeof body.displayName === 'string' ? body.displayName : null;

    const existing = await prisma.user.findUnique({ where: { id: uid } });
    const enforcedRole: UserRole = enforceRoleConsistency(uid, existing?.role as UserRole | undefined | null);

    const userRecord = await prisma.user.upsert({
      where: { id: uid },
      update: {
        email: normalizedEmail ?? existing?.email ?? null,
        displayName: displayName ?? existing?.displayName ?? null,
        role: enforcedRole,
        lastSeenAt: new Date(),
      },
      create: {
        id: uid,
        email: normalizedEmail,
        displayName,
        role: enforcedRole ?? DEFAULT_USER_ROLE,
        orgId: existing?.orgId ?? null,
        status: existing?.status ?? 'active',
        lastSeenAt: new Date(),
      },
    });

    const resolvedRole = enforceRoleConsistency(uid, (userRecord?.role as UserRole | undefined | null) ?? enforcedRole);

    const responsePayload = {
      id: userRecord?.id ?? uid,
      email: userRecord?.email ?? normalizedEmail,
      displayName: userRecord?.displayName ?? displayName,
      role: resolvedRole,
      orgId: userRecord?.orgId ?? null,
      status: userRecord?.status ?? 'active',
      isMaster: resolvedRole === 'master',
      lastSeenAt: userRecord?.lastSeenAt ?? null,
    };

    return NextResponse.json({ user: responsePayload });
  } catch (error) {
    console.error('POST /api/auth/session error:', error);
    return NextResponse.json({ error: 'Failed to resolve user session' }, { status: 500 });
  }
}
