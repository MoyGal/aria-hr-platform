'use client';

import { useRouter } from 'next/navigation';

export default function InterviewRowActions({ id }: { id: string }) {
  const r = useRouter();

  async function remove() {
    if (!confirm('Delete interview?')) return;
    await fetch(`/api/interviews/${id}`, { method: 'DELETE' });
    r.refresh();
  }

  return (
    <button onClick={remove} className="rounded border border-red-500/50 px-2 py-1 text-xs text-red-400 hover:bg-red-500/10">
      Delete
    </button>
  );
}
