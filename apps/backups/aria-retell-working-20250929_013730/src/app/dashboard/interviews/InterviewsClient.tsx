'use client';

import { useMemo, useState } from 'react';
import { Share2 } from 'lucide-react';

import { ShareInviteModal } from './ShareInviteModal';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/contexts/AuthContext';

export interface SerializableInterview {
  id: string;
  candidateId: string | null;
  jobId: string | null;
  mode: string | null;
  status: string | null;
  result: string | null;
  scheduledAt: string | null;
}

export interface SerializableCandidate {
  id: string;
  name: string | null;
  email: string | null;
}

export interface SerializableJob {
  id: string;
  title: string | null;
}

interface InterviewsClientProps {
  interviews: SerializableInterview[];
  candidates: SerializableCandidate[];
  jobs: SerializableJob[];
}

export function InterviewsClient({ interviews, candidates, jobs }: InterviewsClientProps) {
  const { profile, role } = useAuth();
  const [shareTarget, setShareTarget] = useState<SerializableInterview | null>(null);
  const [shareCandidate, setShareCandidate] = useState<SerializableCandidate | null>(null);
  const [shareJob, setShareJob] = useState<SerializableJob | null>(null);

  const candidateMap = useMemo(() => {
    return new Map(candidates.map((candidate) => [candidate.id, candidate]));
  }, [candidates]);

  const jobMap = useMemo(() => {
    return new Map(jobs.map((job) => [job.id, job]));
  }, [jobs]);

  const hasSharePermission = useMemo(() => {
    if (!role) return false;
    return ['master', 'company_admin', 'recruiter'].includes(role);
  }, [role]);

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60">
      <table className="w-full text-sm">
        <thead className="text-zinc-400">
          <tr className="[&>th]:px-4 [&>th]:py-3 text-left">
            <th>When</th>
            <th>Candidate</th>
            <th>Job</th>
            <th>Mode</th>
            <th>Status</th>
            <th>Result</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {interviews.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-12 text-center text-zinc-500">
                No interviews. Use “Add”.
              </td>
            </tr>
          ) : (
            interviews.map((interview) => {
              const candidate = interview.candidateId ? candidateMap.get(interview.candidateId) : null;
              const job = interview.jobId ? jobMap.get(interview.jobId) : null;

              return (
                <tr key={interview.id} className="[&>td]:px-4 [&>td]:py-3">
                  <td className="text-zinc-400">
                    {interview.scheduledAt ? new Date(interview.scheduledAt).toLocaleString() : '—'}
                  </td>
                  <td>
                    <div className="flex flex-col">
                      <span>{candidate?.name ?? '—'}</span>
                      {candidate?.email && <span className="text-xs text-zinc-500">{candidate.email}</span>}
                    </div>
                  </td>
                  <td>{job?.title ?? '—'}</td>
                  <td className="text-zinc-400">{interview.mode ?? '—'}</td>
                  <td className="text-zinc-400">{interview.status ?? '—'}</td>
                  <td className="text-zinc-400">{interview.result ?? '—'}</td>
                  <td className="text-right text-zinc-400">
                    {hasSharePermission ? (
                      <Button
                        type="button"
                        variant="outline"
                        className="inline-flex items-center gap-2 border-white/10 text-zinc-200 hover:bg-white/10"
                        onClick={() => {
                          setShareTarget(interview);
                          setShareCandidate(interview.candidateId ? candidateMap.get(interview.candidateId) ?? null : null);
                          setShareJob(interview.jobId ? jobMap.get(interview.jobId) ?? null : null);
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                        Share
                      </Button>
                    ) : (
                      <span className="text-zinc-600">—</span>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {shareTarget && (
        <ShareInviteModal
          open={true}
          onClose={() => {
            setShareTarget(null);
            setShareCandidate(null);
            setShareJob(null);
          }}
          interviewId={shareTarget.id}
          interviewName={shareJob?.title ?? null}
          candidateName={shareCandidate?.name ?? null}
          candidateEmail={shareCandidate?.email ?? null}
          userId={profile?.id ?? null}
        />
      )}
    </div>
  );
}
