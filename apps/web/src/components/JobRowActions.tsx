'use client';

import { useRouter } from 'next/navigation';

type Status = 'OPEN' | 'PAUSED' | 'CLOSED';
type Props = { id: string; status: Status };

function nextStatus(s: Status): Status {
  const order: Status[] = ['OPEN', 'PAUSED', 'CLOSED'];
  const i = order.indexOf(s);
  return order[(i + 1) % order.length];
}

export default function JobRowActions({ id, status }: Props) {
  const r = useRouter();

  async function cycle() {
    await fetch(`/api/jobs/${id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ status: nextStatus(status) }),
    });
    r.refresh();
  }

  async function remove() {
    if (!confirm('Delete job?')) return;
    await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
    r.refresh();
  }

  return (
    <div className="flex gap-2">
      <button onClick={cycle} className="rounded border px-2 py-1 text-xs hover:bg-white/10">
        {status} → {nextStatus(status)}
      </button>
      <button onClick={remove} className="rounded border border-red-500/50 px-2 py-1 text-xs text-red-400 hover:bg-red-500/10">
        Delete
      </button>
    </div>
  );
}
