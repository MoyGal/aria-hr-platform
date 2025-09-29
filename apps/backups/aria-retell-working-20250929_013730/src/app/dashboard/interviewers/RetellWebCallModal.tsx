'use client';

import { useEffect, useRef, useState } from 'react';
import { RetellWebClient } from 'retell-client-js-sdk';
import { Button } from '@/components/ui/button';
import { Loader2, MicOff, PhoneOff } from 'lucide-react';

type CallStatus = 'connecting' | 'waiting' | 'active' | 'ended' | 'error';

interface RetellWebCallModalProps {
  accessToken: string;
  callId: string;
  onClose: () => void;
}

export function RetellWebCallModal({ accessToken, callId, onClose }: RetellWebCallModalProps) {
  const clientRef = useRef<RetellWebClient | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const retryRef = useRef(0);
  const hasConnectedRef = useRef(false);
  const [status, setStatus] = useState<CallStatus>('connecting');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [agentTalking, setAgentTalking] = useState(false);

  useEffect(() => {
    const client = new RetellWebClient();
    clientRef.current = client;

    const handleError = (error: unknown) => {
      const message =
        (typeof error === 'string' && error) ||
        (error instanceof Error && error.message) ||
        'Unexpected Retell call error';
      console.error('Retell web call error:', error);
      setErrorMessage(message);
      setStatus('error');
    };

    client.on('call_started', () => {
      setStatus('waiting');
    });

    client.on('call_ready', () => {
      hasConnectedRef.current = true;
      setStatus('active');
      client
        .startAudioPlayback()
        .catch((playbackError) => {
          console.warn('Could not automatically start audio playback. Asking user to resume.', playbackError);
          setErrorMessage('Click anywhere to allow audio playback and ensure your microphone is enabled.');
        });
    });

    client.on('call_ended', () => {
      if (!hasConnectedRef.current && retryRef.current < 1) {
        retryRef.current += 1;
        void startCall();
        return;
      }
      setStatus('ended');
    });

    client.on('agent_start_talking', () => setAgentTalking(true));
    client.on('agent_stop_talking', () => setAgentTalking(false));

    client.on('error', handleError);

    const startCall = async () => {
      try {
        setStatus('connecting');
        setErrorMessage(null);

        if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
          throw new Error('Your browser does not support microphone access required for the call.');
        }

        // Request mic permission before LiveKit publishes audio.
        micStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStreamRef.current.getTracks().forEach((track) => track.stop());

        await client.startCall({ accessToken });
      } catch (startError) {
        if (startError instanceof DOMException && (startError.name === 'NotAllowedError' || startError.name === 'SecurityError')) {
          handleError('Microphone permission is required to start the call.');
          return;
        }

        handleError(startError);
      }
    };

    void startCall();

    return () => {
      client.stopCall();
      micStreamRef.current?.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
      hasConnectedRef.current = false;
      retryRef.current = 0;
    };
  }, [accessToken]);

  const hangUp = () => {
    clientRef.current?.stopCall();
    micStreamRef.current?.getTracks().forEach((track) => track.stop());
    micStreamRef.current = null;
    onClose();
  };

  const statusText: Record<CallStatus, string> = {
    connecting: 'Connecting to your Retell interviewer…',
    waiting: 'Connected. Waiting for the agent to join the room…',
    active: agentTalking
      ? 'Agent is speaking — feel free to respond!'
      : 'Call is live. Say hello to your AI interviewer.',
    ended: 'Call ended.',
    error: 'Unable to start the call.',
  } as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Live Interview Call</h2>
          <span className="text-xs font-mono text-gray-500">
            {callId.replace('call_', '#')}
          </span>
        </div>

        <div className="flex flex-col items-center text-center space-y-4">
          {status === 'connecting' || status === 'waiting' ? (
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          ) : status === 'error' ? (
            <MicOff className="h-10 w-10 text-red-500" />
          ) : status === 'ended' ? (
            <PhoneOff className="h-10 w-10 text-gray-400" />
          ) : (
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${agentTalking ? 'bg-green-500' : 'bg-primary/10'}`}>
              <span className="text-lg font-semibold text-white">AI</span>
            </div>
          )}

          <p className="text-base font-medium text-gray-900 whitespace-pre-line">
            {statusText[status]}
          </p>
          {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
          {status !== 'ended' && status !== 'error' && (
            <p className="text-xs text-gray-500">
              Make sure your browser has microphone access enabled. Keep this window open during the call.
            </p>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <Button
            onClick={hangUp}
            variant={status === 'error' ? 'default' : 'destructive'}
            className="w-full"
          >
            <PhoneOff className="mr-2 h-4 w-4" />
            {status === 'ended' ? 'Close' : 'Hang Up'}
          </Button>
          {status === 'error' && (
            <Button variant="outline" className="w-full" onClick={onClose}>
              Dismiss
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
