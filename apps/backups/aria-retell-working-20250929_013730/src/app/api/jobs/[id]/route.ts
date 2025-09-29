import { NextRequest } from 'next/server';
import prisma from '@/lib/db'; // o '../../../lib/db'

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const interviewer = await prisma.interviewer.findUnique({ where: { id } });
  if (!interviewer) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(interviewer);
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  await prisma.interviewer.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
