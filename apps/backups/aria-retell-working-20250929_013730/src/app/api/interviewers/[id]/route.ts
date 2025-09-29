import { NextRequest } from 'next/server';
import prisma from '@/lib/db';

type Params = { id: string };

export async function GET(_req: NextRequest, context: { params: Promise<Params> }) {
  const { id } = await context.params;
  const interviewer = await prisma.interviewer.findUnique({ where: { id } });
  if (!interviewer) return new Response('Not found', { status: 404 });
  return Response.json(interviewer);
}

export async function PATCH(req: NextRequest, context: { params: Promise<Params> }) {
  const { id } = await context.params;
  const data = await req.json().catch(() => ({}));
  const { name, language, voice, notes, retellAgentId, orgId } = data;
  const updated = await prisma.interviewer.update({
    where: { id },
    data: { name, language, voice, notes, retellAgentId, orgId },
  });
  return Response.json(updated);
}

export async function DELETE(_req: NextRequest, context: { params: Promise<Params> }) {
  const { id } = await context.params;
  await prisma.interviewer.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
