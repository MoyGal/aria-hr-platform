import { NextRequest } from 'next/server';
// Usa este import si tienes alias "@": 
import prisma from '@/lib/db';
// Si NO tienes alias "@", cambia la línea de arriba por:
// import prisma from '../../../lib/db';

export async function GET() {
  const items = await prisma.candidate.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return Response.json(items);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const name = String(body.name ?? '').trim();
  const email: string | null = body.email ? String(body.email).trim().toLowerCase() : null;
  const phone: string | null = body.phone ? String(body.phone).trim() : null;
  const orgId: string | null = body.orgId ?? null;

  const allowed = ['ACTIVE', 'HIRED', 'REJECTED', 'ARCHIVED'] as const;
  const status = allowed.includes(body.status) ? body.status : 'ACTIVE';

  if (!name) {
    return Response.json({ error: 'Name is required' }, { status: 400 });
  }

  let created;

  // Usa la clave compuesta SOLO si ambos existen
  if (email && orgId) {
    created = await prisma.candidate.upsert({
      where: { orgId_email: { orgId, email } },
      update: { name, phone, status },
      create: { orgId, name, email, phone, status },
    });
  } else {
    created = await prisma.candidate.create({
      data: { orgId, name, email, phone, status },
    });
  }

  return Response.json(created, { status: 201 });
}
