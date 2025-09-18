'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewJobForm() {
  const r = useRouter();
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(null);
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title, location, description }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(j?.error || 'Could not create job');
      setBusy(false);
      return;
    }
    setTitle(''); setLocation(''); setDescription('');
    r.refresh();
    setBusy(false);
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-wrap gap-2">
      <input
        className="px-3 py-2 rounded-md bg-white/10 text-white placeholder-white/50"
        placeholder="Job title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <input
        className="px-3 py-2 rounded-md bg-white/10 text-white placeholder-white/50"
        placeholder="Location"
        value={location}
        onChange={e => setLocation(e.target.value)}
      />
      <input
        className="flex-1 px-3 py-2 rounded-md bg-white/10 text-white placeholder-white/50"
        placeholder="Short description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <button
        disabled={busy}
        className="px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
      >
        {busy ? 'Saving…' : 'Add'}
      </button>
      {err && <span className="text-red-400 text-sm w-full">{err}</span>}
    </form>
  );
}
