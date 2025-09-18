import { NextRequest } from 'next/server';
import prisma from '../../../lib/db';

export async function GET() {
  const items = await prisma.interview.findMany({
    orderBy: { scheduledAt: 'desc' },
    include: { candidate: { select: { name: true } }, job: { select: { title: true } } },
  });
  return Response.json(items);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { candidateId, jobId, scheduledAt, mode, notes } = body ?? {};

  if (!candidateId || !jobId || !scheduledAt) {
    return Response.json({ error: 'candidateId, jobId y scheduledAt son requeridos' }, { status: 400 });
  }

  const date = new Date(scheduledAt);
  if (isNaN(date.getTime())) {
    return Response.json({ error: 'scheduledAt inválido' }, { status: 400 });
  }

  const created = await prisma.interview.create({
    data: {
      candidateId,
      jobId,
      scheduledAt: date,
      mode: typeof mode === 'string' ? mode : null,
      notes: typeof notes === 'string' ? notes : null,
    },
  });

  return Response.json(created, { status: 201 });
}
