import { CandidateInviteClient } from './CandidateInviteClient';

export default async function CandidateInvitePage({
  params,
  searchParams,
}: {
  params: Promise<{ inviteId: string }>;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const { inviteId } = await params;
  const tokenParam = searchParams?.token;
  const initialToken = typeof tokenParam === 'string' ? tokenParam : Array.isArray(tokenParam) ? tokenParam[0] ?? null : null;

  return <CandidateInviteClient inviteId={inviteId} initialToken={initialToken} />;
}
