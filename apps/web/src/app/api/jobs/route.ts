import { NextRequest } from 'next/server';
import prisma from '@/lib/db'; // o '../../../lib/db' si no usas alias

export async function GET() {
  const items = await prisma.job.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return Response.json(items);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const title = String(body.title ?? '').trim();
  if (!title) return Response.json({ error: 'Title is required' }, { status: 400 });

  const allowed = ['OPEN', 'PAUSED', 'CLOSED'] as const;
  const status = allowed.includes(body.status) ? body.status : 'OPEN';

  const created = await prisma.job.create({
    data: {
      title,
      description: body.description ? String(body.description) : null,
      location: body.location ? String(body.location) : null,
      status,
      orgId: body.orgId ?? null,
    },
  });

  return Response.json(created, { status: 201 });
}
