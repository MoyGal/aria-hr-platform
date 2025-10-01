// Nombre del archivo: apps/web/src/app/dashboard/interviews/page.tsx
'use client';

import { useAuth } from '@/components/providers/auth-provider';
import { useEffect, useState } from 'react';
import { RetellWebClient } from 'retell-client-js-sdk';
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

// Configuración de agentes disponibles
const AGENTS = [
  {
    id: process.env.NEXT_PUBLIC_RETELL_AGENT_ID_SOPHIA_INTERVIEWER || '',
    name: 'Sarah',
    role: 'Technical Recruiter',
    description: 'Specializes in technical interviews for software engineering roles',
    avatar: '👩‍💼',
    color: 'from-blue-500/20 to-blue-600/20',
    borderColor: 'border-blue-500/30',
  },
  {
    id: process.env.NEXT_PUBLIC_RETELL_AGENT_ID_JAMES_INTERVIEWER || '',
    name: 'Michael',
    role: 'Senior HR Manager',
    description: 'Expert in behavioral and cultural fit assessments',
    avatar: '👨‍💼',
    color: 'from-purple-500/20 to-purple-600/20',
    borderColor: 'border-purple-500/30',
  },
  {
    id: process.env.NEXT_PUBLIC_RETELL_AGENT_ID_MARIA_INTERVIEWER || '',
    name: 'María',
    role: 'Leadership Interviewer',
    description: 'Focuses on leadership potential and management skills',
    avatar: '👩‍💻',
    color: 'from-pink-500/20 to-pink-600/20',
    borderColor: 'border-pink-500/30',
  },
];

export default function InterviewsPage() {
  const { user } = useAuth();
  const [retellClient, setRetellClient] = useState<RetellWebClient | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [callStatus, setCallStatus] = useState<string>('');

  // Inicializar Retell Client
  useEffect(() => {
    const client = new RetellWebClient();
    setRetellClient(client);

    // Event listeners
    client.on('call_started', () => {
      setCallStatus('Call connected');
      setIsCallActive(true);
    });

    client.on('call_ended', () => {
      setCallStatus('Call ended');
      setIsCallActive(false);
      setSelectedAgent('');
    });

    client.on('agent_start_talking', () => {
      setCallStatus('Agent speaking...');
    });

    client.on('agent_stop_talking', () => {
      setCallStatus('Listening...');
    });

    client.on('error', (error) => {
      console.error('Retell error:', error);
      setCallStatus(`Error: ${error.message}`);
      setIsCallActive(false);
    });

    return () => {
      if (client) {
        client.stopCall();
      }
    };
  }, []);

  // Iniciar llamada
  const startCall = async (agentId: string) => {
    if (!retellClient || !user) return;

    try {
      setCallStatus('Connecting...');
      setSelectedAgent(agentId);

      // Registrar la llamada con tu backend
      const response = await fetch('/api/retell/register-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent_id: agentId,
          user_id: user.uid,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to register call');
      }

      const { access_token } = await response.json();

      // Iniciar la llamada con Retell - SIN enableUpdate
      await retellClient.startCall({
        accessToken: access_token,
        sampleRate: 16000,
        // enableUpdate: true, // ❌ REMOVIDO - no existe en el SDK actual
      });

      setCallStatus('Call started successfully');
    } catch (error) {
      console.error('Error starting call:', error);
      setCallStatus('Failed to start call');
      setSelectedAgent('');
    }
  };

  // Terminar llamada
  const endCall = () => {
    if (retellClient) {
      retellClient.stopCall();
      setIsCallActive(false);
      setSelectedAgent('');
      setCallStatus('');
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    if (retellClient && isCallActive) {
      if (isMuted) {
        retellClient.unmute();
      } else {
        retellClient.mute();
      }
      setIsMuted(!isMuted);
    }
  };

  // Toggle Speaker (simulado - Retell maneja esto internamente)
  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">AI Voice Interviews</h1>
        <p className="text-gray-400">
          Select an AI agent to conduct a voice interview with candidates
        </p>
      </div>

      {/* Call Status */}
      {isCallActive && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-semibold text-white">Call Active</h3>
              <p className="text-gray-400">{callStatus}</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Mute Button */}
              <button
                onClick={toggleMute}
                className={`p-4 rounded-full transition-all ${
                  isMuted
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
              </button>

              {/* Speaker Button */}
              <button
                onClick={toggleSpeaker}
                className={`p-4 rounded-full transition-all ${
                  !isSpeakerOn
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {isSpeakerOn ? <Volume2 size={24} /> : <VolumeX size={24} />}
              </button>

              {/* End Call Button */}
              <button
                onClick={endCall}
                className="px-6 py-4 bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold transition-all flex items-center gap-2"
              >
                <PhoneOff size={20} />
                End Call
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {AGENTS.map((agent) => (
          <div
            key={agent.id}
            className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${agent.color} backdrop-blur-xl border ${agent.borderColor} transition-all duration-300 ${
              selectedAgent === agent.id ? 'ring-4 ring-purple-500' : ''
            } ${isCallActive && selectedAgent !== agent.id ? 'opacity-50' : 'hover:scale-105'}`}
          >
            {/* Avatar */}
            <div className="text-6xl mb-4">{agent.avatar}</div>

            {/* Info */}
            <div className="space-y-2 mb-6">
              <h3 className="text-2xl font-bold text-white">{agent.name}</h3>
              <p className="text-sm font-medium text-purple-300">{agent.role}</p>
              <p className="text-sm text-gray-400">{agent.description}</p>
            </div>

            {/* Action Button */}
            {selectedAgent === agent.id && isCallActive ? (
              <div className="flex items-center gap-2 text-green-400">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-semibold">Active Call</span>
              </div>
            ) : (
              <button
                onClick={() => startCall(agent.id)}
                disabled={isCallActive}
                className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  isCallActive
                    ? 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <Phone size={20} />
                Start Interview
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Instructions */}
      {!isCallActive && (
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-4">How it works</h3>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start gap-3">
              <span className="text-purple-400 font-bold">1.</span>
              <span>Select an AI agent based on the interview type you need</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-400 font-bold">2.</span>
              <span>Click "Start Interview" to begin a voice conversation</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-400 font-bold">3.</span>
              <span>The AI will conduct the interview naturally and evaluate responses</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-400 font-bold">4.</span>
              <span>Use the controls to mute/unmute or end the call when finished</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}