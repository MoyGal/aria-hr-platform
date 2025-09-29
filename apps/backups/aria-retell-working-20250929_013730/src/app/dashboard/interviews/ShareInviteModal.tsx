'use client';

import { useState, useEffect } from 'react';
import { Copy, Loader2, Share2, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ShareInviteModalProps {
  open: boolean;
  onClose: () => void;
  interviewId: string;
  interviewName?: string | null;
  candidateName?: string | null;
  candidateEmail?: string | null;
  userId?: string | null;
}

interface InviteResponse {
  inviteId: string;
  url: string;
  expiresAt: string;
  candidateEmail: string | null;
  candidateName: string | null;
}

export function ShareInviteModal({
  open,
  onClose,
  interviewId,
  interviewName,
  candidateEmail: initialEmail,
  candidateName: initialName,
  userId,
}: ShareInviteModalProps) {
  const [email, setEmail] = useState(initialEmail ?? '');
  const [name, setName] = useState(initialName ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invite, setInvite] = useState<InviteResponse | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) {
      setEmail(initialEmail ?? '');
      setName(initialName ?? '');
      setInvite(null);
      setError(null);
      setCopied(false);
    }
  }, [open, initialEmail, initialName]);

  const handleGenerate = async () => {
    if (!userId) {
      setError('Tu sesión no está lista. Vuelve a intentar.');
      return;
    }

    setLoading(true);
    setError(null);
    setInvite(null);
    setCopied(false);

    try {
      const response = await fetch(`/api/interviews/${interviewId}/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          candidateEmail: email || undefined,
          candidateName: name || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error ?? 'No se pudo generar la invitación');
      }

      setInvite({
        inviteId: data.inviteId,
        url: data.url,
        expiresAt: data.expiresAt,
        candidateEmail: data.candidateEmail ?? null,
        candidateName: data.candidateName ?? null,
      });
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Error inesperado generando la invitación');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!invite?.url) return;
    try {
      await navigator.clipboard.writeText(invite.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed', err);
      setError('No se pudo copiar el enlace. Copia manualmente.');
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-zinc-950 border border-white/10 p-6 shadow-2xl text-white relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-white/60 hover:text-white"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-2 mb-6">
          <h2 className="text-xl font-semibold">Compartir entrevista</h2>
          <p className="text-sm text-white/60">
            Genera un enlace único para que el candidato acceda al portal y realice su entrevista.
          </p>
          {interviewName && (
            <p className="text-sm text-white/70">
              Entrevista: <span className="font-medium text-white">{interviewName}</span>
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="candidate-name">Nombre del candidato</Label>
            <Input
              id="candidate-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ej. Ana Martínez"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="candidate-email">Email del candidato (opcional)</Label>
            <Input
              id="candidate-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="candidato@empresa.com"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button onClick={handleGenerate} disabled={loading} className="inline-flex items-center gap-2">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Generando…
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4" /> Generar enlace
                </>
              )}
            </Button>
            {invite?.url && (
              <Button variant="outline" onClick={handleCopy} className="inline-flex items-center gap-2 text-zinc-200">
                <Copy className="h-4 w-4" /> {copied ? 'Copiado' : 'Copiar enlace'}
              </Button>
            )}
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          {invite?.url && (
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-3">
              <div>
                <p className="text-xs uppercase text-white/50">Enlace generado</p>
                <p className="break-all text-sm text-white/90">{invite.url}</p>
              </div>
              {invite.expiresAt && (
                <p className="text-xs text-white/60">
                  Expira el {new Date(invite.expiresAt).toLocaleString()} (puedes generar uno nuevo cuando quieras).
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
