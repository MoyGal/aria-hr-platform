import { NextRequest } from 'next/server';
import prisma from '../../../../lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const item = await prisma.candidate.findUnique({ where: { id } });
  if (!item) return Response.json({ error: 'not found' }, { status: 404 });
  return Response.json(item);
}
