'use client';
import { useRouter } from 'next/navigation';

type S = 'ACTIVE' | 'HIRED' | 'REJECTED' | 'ARCHIVED';
const ORDER: S[] = ['ACTIVE', 'HIRED', 'REJECTED', 'ARCHIVED'];
const nextS = (s: S): S => ORDER[(ORDER.indexOf(s) + 1) % ORDER.length];

type Props = {
  id: string;
  status: S;
  /** opcionales para futura edición inline */
  name?: string;
  email?: string | null;
  phone?: string | null;
};

export default function CandidateRowActions({ id, status }: Props) {
  const r = useRouter();
  return (
    <div className="flex gap-2">
      <button
        onClick={async () => {
          await fetch(`/api/candidates/${id}`, {
            method: 'PATCH',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ status: nextS(status) }),
          });
          r.refresh();
        }}
        className="rounded border px-2 py-1 text-xs hover:bg-white/10"
      >
        {status} → {nextS(status)}
      </button>

      <button
        onClick={async () => {
          if (!confirm('Delete candidate?')) return;
          await fetch(`/api/candidates/${id}`, { method: 'DELETE' });
          r.refresh();
        }}
        className="rounded border border-red-500/50 px-2 py-1 text-xs text-red-400 hover:bg-red-500/10"
      >
        Delete
      </button>
    </div>
  );
}
