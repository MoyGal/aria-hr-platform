import { NextRequest } from 'next/server';
import prisma from '../../../../lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const item = await prisma.interview.findUnique({ where: { id } });
  if (!item) return Response.json({ error: 'not found' }, { status: 404 });
  return Response.json(item);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const data: any = {};
  if (typeof body.scheduledAt === 'string') data.scheduledAt = new Date(body.scheduledAt);
  if (typeof body.mode === 'string') data.mode = body.mode.trim();
  if (typeof body.result === 'string') data.result = body.result.trim();
  if (typeof body.notes === 'string') data.notes = body.notes.trim();
  if (typeof body.candidateId === 'string') data.candidateId = body.candidateId;
  if (typeof body.jobId === 'string') data.jobId = body.jobId;

  const updated = await prisma.interview.update({ where: { id }, data });
  return Response.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.interview.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
