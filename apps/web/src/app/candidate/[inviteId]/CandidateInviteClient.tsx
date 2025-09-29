'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, UploadCloud, PhoneCall } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RetellWebCallModal } from '@/app/dashboard/interviewers/RetellWebCallModal';

interface InviteResponse {
  valid: boolean;
  invite?: {
    id: string;
    candidateName: string | null;
    candidateEmail: string | null;
    status: string | null;
    expiresAt: string | null;
  };
  interview?: {
    id: string;
    mode: string | null;
    status: string | null;
    interviewerId: string | null;
  } | null;
  interviewer?: {
    id: string;
    name: string | null;
    retellAgentId: string | null;
  } | null;
  reason?: string;
}

interface UploadState {
  status: 'idle' | 'uploading' | 'success' | 'error';
  message?: string;
}

interface CallState {
  status: 'idle' | 'starting' | 'ready' | 'error';
  link?: string | null;
  message?: string;
}

interface CandidateInviteClientProps {
  inviteId: string;
  initialToken: string | null;
}

export function CandidateInviteClient({ inviteId, initialToken }: CandidateInviteClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = useMemo(() => searchParams.get('token') ?? initialToken, [searchParams, initialToken]);

  const [loading, setLoading] = useState(true);
  const [inviteData, setInviteData] = useState<InviteResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>({ status: 'idle' });
  const [callState, setCallState] = useState<CallState>({ status: 'idle' });
  const [callOverlay, setCallOverlay] = useState<{ callId: string; accessToken: string } | null>(null);

  const expiresAt = useMemo(() => {
    if (!inviteData?.invite?.expiresAt) return null;
    const date = new Date(inviteData.invite.expiresAt);
    return Number.isNaN(date.getTime()) ? null : date;
  }, [inviteData]);

  useEffect(() => {
    const loadInvite = async () => {
      if (!token) {
        setError('Este enlace no es válido. Falta el token.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/candidate/invites/${inviteId}?token=${encodeURIComponent(token)}`);
        const data = (await response.json()) as InviteResponse;
        if (!response.ok || !data.valid) {
          setError(data.reason ?? 'Este enlace no es válido o expiró.');
        } else {
          setInviteData(data);
        }
      } catch (err) {
        console.error('Failed to verify invite', err);
        setError('Ocurrió un error verificando tu invitación.');
      } finally {
        setLoading(false);
      }
    };

    loadInvite();
  }, [inviteId, token]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    setUploadState({ status: 'idle' });
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadState({ status: 'error', message: 'Selecciona un archivo antes de subirlo.' });
      return;
    }
    if (!token) {
      setUploadState({ status: 'error', message: 'Token faltante en el enlace.' });
      return;
    }

    const formData = new FormData();
    formData.append('token', token);
    formData.append('file', selectedFile);

    setUploadState({ status: 'uploading' });

    try {
      const response = await fetch(`/api/candidate/invites/${inviteId}/upload`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'No se pudo subir el CV.');
      }

      setUploadState({ status: 'success', message: 'CV subido con éxito. Tu información está segura.' });
    } catch (err) {
      console.error('Upload error', err);
      setUploadState({ status: 'error', message: err instanceof Error ? err.message : 'Error al subir el CV.' });
    }
  };

  const handleStartCall = async () => {
    if (!token) {
      setCallState({ status: 'error', message: 'Token faltante en el enlace.' });
      return;
    }

    setCallState({ status: 'starting' });

    try {
      const response = await fetch(`/api/candidate/invites/${inviteId}/call`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const result = await response.json();
      if (!response.ok || !result.webCallLink) {
        throw new Error(result.error || 'No se pudo iniciar la entrevista.');
      }

      setCallOverlay({ callId: result.callId, accessToken: result.accessToken });
      setCallState({ status: 'ready', link: result.webCallLink });
    } catch (err) {
      console.error('Start call error', err);
      let message = err instanceof Error ? err.message : 'Error iniciando la entrevista.';
      if (message.includes('Interview missing interviewer')) {
        message = 'Esta entrevista todavía no tiene un agente configurado. Notifica al reclutador para asignar un entrevistador.';
      }
      if (message.includes('Interviewer not configured with Retell agent')) {
        message = 'El entrevistador asignado no tiene un agente de voz configurado. Pide al equipo que complete la configuración.';
      }
      setCallState({ status: 'error', message });
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white">
        <Loader2 className="h-10 w-10 animate-spin" />
        <p className="mt-4 text-sm text-white/70">Verificando tu invitación…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-900 via-gray-900 to-black text-white px-6 text-center">
        <Card className="max-w-md bg-black/40 text-left border border-red-500/30">
          <CardHeader>
            <CardTitle>Enlace no válido</CardTitle>
            <CardDescription className="text-white/70">{error}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-white/60">
              Revisa que hayas utilizado el enlace más reciente enviado por el equipo de reclutamiento. Si necesitas ayuda,
              responde al correo que recibiste o contacta al reclutador.
            </p>
            <Button variant="outline" onClick={() => router.push('/')}>Volver al inicio</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const candidateName = inviteData?.invite?.candidateName ?? 'Candidato';

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-black text-white py-16 px-6">
      {callOverlay && (
        <RetellWebCallModal
          accessToken={callOverlay.accessToken}
          callId={callOverlay.callId}
          onClose={() => setCallOverlay(null)}
        />
      )}

      <div className="mx-auto max-w-3xl space-y-10">
        <header className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-white/60">Portal del Candidato</p>
          <h1 className="text-3xl font-bold">Hola, {candidateName} 👋</h1>
          <p className="text-sm text-white/70">
            Sube tu CV y luego inicia tu entrevista conversacional con nuestro agente AI.
          </p>
          {expiresAt && (
            <p className="text-xs text-white/50">
              Este enlace expira el {expiresAt.toLocaleString()}.
            </p>
          )}
        </header>

        <section>
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle>1. Sube tu CV</CardTitle>
              <CardDescription className="text-white/70">
                Formatos aceptados: PDF, DOCX. Tamaño máximo: 5MB.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cv-upload" className="text-white/80">
                  Archivo
                </Label>
                <Input
                  id="cv-upload"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
              </div>

              <Button
                onClick={handleUpload}
                disabled={uploadState.status === 'uploading'}
                className="inline-flex items-center gap-2"
              >
                {uploadState.status === 'uploading' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Subiendo…
                  </>
                ) : (
                  <>
                    <UploadCloud className="h-4 w-4" /> Subir CV
                  </>
                )}
              </Button>

              {uploadState.status === 'success' && (
                <p className="text-sm text-green-400">{uploadState.message}</p>
              )}
              {uploadState.status === 'error' && (
                <p className="text-sm text-red-400">{uploadState.message}</p>
              )}
            </CardContent>
          </Card>
        </section>

        <section>
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle>2. Inicia la entrevista</CardTitle>
              <CardDescription className="text-white/70">
                Cuando estés listo, haz clic para abrir la entrevista en una nueva pestaña. Asegúrate de permitir acceso al
                micrófono.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleStartCall}
                disabled={callState.status === 'starting'}
                className="inline-flex items-center gap-2"
              >
                {callState.status === 'starting' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Conectando…
                  </>
                ) : (
                  <>
                    <PhoneCall className="h-4 w-4" /> Iniciar entrevista
                  </>
                )}
              </Button>

              {callState.status === 'ready' && (
                <p className="text-sm text-green-400">
                  La entrevista se abrió en esta misma página. Si no escuchas audio, revisa los permisos del micrófono y
                  selecciona los dispositivos correctos.
                </p>
              )}
              {callState.status === 'error' && (
                <p className="text-sm text-red-400">{callState.message}</p>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
