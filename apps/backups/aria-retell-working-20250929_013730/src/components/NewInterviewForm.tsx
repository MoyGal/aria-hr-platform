'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Candidate = { id: string; name: string };
type Job = { id: string; title: string };

export default function NewInterviewForm() {
  const r = useRouter();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidateId, setCandidateId] = useState('');
  const [jobId, setJobId] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [mode, setMode] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [cRes, jRes] = await Promise.all([
          fetch('/api/candidates', { cache: 'no-store' }),
          fetch('/api/jobs', { cache: 'no-store' }),
        ]);
        if (cRes.ok) {
          const cs = await cRes.json();
          setCandidates(cs.map((c: any) => ({ id: c.id, name: c.name })));
        }
        if (jRes.ok) {
          const js = await jRes.json();
          setJobs(js.map((j: any) => ({ id: j.id, title: j.title })));
        }
      } catch {}
    })();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!candidateId || !jobId || !scheduledAt) return;
    setLoading(true);
    try {
      const res = await fetch('/api/interviews', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ candidateId, jobId, scheduledAt, mode: mode || null, notes: notes || null }),
      });
      if (res.ok) {
        setCandidateId('');
        setJobId('');
        setScheduledAt('');
        setMode('');
        setNotes('');
        r.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-wrap items-end gap-2">
      <select
        value={candidateId}
        onChange={(e) => setCandidateId(e.target.value)}
        className="min-w-[180px] rounded border border-white/20 bg-white/5 px-3 py-2 text-sm"
      >
        <option value="">Candidate</option>
        {candidates.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <select
        value={jobId}
        onChange={(e) => setJobId(e.target.value)}
        className="min-w-[180px] rounded border border-white/20 bg-white/5 px-3 py-2 text-sm"
      >
        <option value="">Job</option>
        {jobs.map((j) => (
          <option key={j.id} value={j.id}>{j.title}</option>
        ))}
      </select>

      <input
        type="datetime-local"
        value={scheduledAt}
        onChange={(e) => setScheduledAt(e.target.value)}
        className="rounded border border-white/20 bg-white/5 px-3 py-2 text-sm"
      />

      <input
        placeholder="mode (phone/video/onsite)"
        value={mode}
        onChange={(e) => setMode(e.target.value)}
        className="w-40 rounded border border-white/20 bg-white/5 px-3 py-2 text-sm"
      />

      <input
        placeholder="notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-48 rounded border border-white/20 bg-white/5 px-3 py-2 text-sm"
      />

      <button
        type="submit"
        disabled={loading || !candidateId || !jobId || !scheduledAt}
        className="rounded bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/20 disabled:opacity-50"
      >
        Add
      </button>
    </form>
  );
}
