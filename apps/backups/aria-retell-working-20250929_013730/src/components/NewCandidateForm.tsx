'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function NewCandidateForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    if (name.trim().length < 2) {
      setErr('Name is required');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          status: 'ACTIVE',
        }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        // Si existe, mostrar mensaje explícito
        if (res.status === 409) throw new Error(j.error || 'Email already exists');
        throw new Error(j.error || 'Failed to create candidate');
      }

      // limpiar y refrescar tabla
      setName('');
      setEmail('');
      setPhone('');
      router.refresh();
    } catch (e: any) {
      setErr(e.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2">
      <input
        className="px-3 py-2 rounded-md bg-white/5 border border-white/10 placeholder-white/40"
        placeholder="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="px-3 py-2 rounded-md bg-white/5 border border-white/10 placeholder-white/40"
        placeholder="Email (optional)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="px-3 py-2 rounded-md bg-white/5 border border-white/10 placeholder-white/40"
        placeholder="Phone (optional)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button
        type="submit"
        disabled={loading}
        className="px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60"
      >
        {loading ? 'Adding…' : 'Add'}
      </button>
      {err && <span className="text-red-400 text-sm ml-2">{err}</span>}
    </form>
  );
}
