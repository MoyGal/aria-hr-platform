'use client';

import { useState } from 'react';
import { RetellWebClient } from 'retell-client-js-sdk';

export default function InterviewsPage() {
  const [selectedAgent, setSelectedAgent] = useState<{ id: string; name: string } | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [retellClient, setRetellClient] = useState<RetellWebClient | null>(null);

  const interviewers = [
    { name: "Sarah Thompson", id: process.env.NEXT_PUBLIC_RETELL_AGENT_ID_SOPHIA_INTERVIEWER, gradient: "from-violet-600 to-purple-600", initial: "S", description: "Professional English interviewer." },
    { name: "Michael Chen", id: process.env.NEXT_PUBLIC_RETELL_AGENT_ID_JAMES_INTERVIEWER, gradient: "from-blue-600 to-cyan-600", initial: "M", description: "Technical interviewer for engineering roles." },
    { name: "Maria González", id: process.env.NEXT_PUBLIC_RETELL_AGENT_ID_MARIA_INTERVIEWER, gradient: "from-fuchsia-600 to-pink-600", initial: "M", description: "Bilingual interviewer (Spanish/English)." },
  ];

  const handleSelectInterviewer = (agentId: string, name: string) => {
    setSelectedAgent({ id: agentId, name });
    setShowConfirmationModal(true);
  };

  const handleStartCall = async () => {
    if (isCalling || !selectedAgent) return;
    setIsCalling(true);
    console.log(`Frontend: Attempting to start call with agent: ${selectedAgent.id}`);

    try {
      const response = await fetch('/api/retell/register-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: selectedAgent.id }),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(`Backend failed: ${errorBody.error || response.statusText}`);
      }

      // CORRECCIÓN: El backend devuelve call_id y access_token
      const { call_id, access_token } = await response.json();
      if (!call_id || !access_token) {
        throw new Error("Backend did not return call_id or access_token.");
      }

      console.log(`Frontend: Received call_id: ${call_id}. Starting conversation...`);
      setShowConfirmationModal(false);

      // Crear nueva instancia del cliente
      const client = new RetellWebClient();
      setRetellClient(client);

      // Configurar event listeners
      client.on('conversationStarted', () => {
        console.log("Frontend: Conversation started!");
      });
      
      client.on('conversationEnded', () => {
        console.log("Frontend: Conversation ended.");
        setIsCalling(false);
        setRetellClient(null);
      });
      
      client.on('error', (error) => {
        console.error("Frontend: An error occurred with the call:", error);
        setIsCalling(false);
        setRetellClient(null);
      });

      client.on('update', (update) => {
        console.log("Frontend: Call update:", update);
      });

      // CORRECCIÓN: Usar la API correcta del SDK
      await client.startCall({
        callId: call_id,
        sampleRate: 48000,
        enableUpdate: true,
        accessToken: access_token
      });

    } catch (error) {
      console.error("Frontend: Error in handleStartCall:", error);
      alert(`Could not start the interview: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsCalling(false);
      setShowConfirmationModal(false);
    }
  };

  const handleEndCall = () => {
    if (retellClient) {
      retellClient.stopCall();
      setRetellClient(null);
    }
    setIsCalling(false);
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">AI Interviewers</h1>
          <p className="text-white/70">Select your AI interview assistant</p>
          {isCalling && (
            <div className="mt-4 p-4 bg-green-600/20 border border-green-600/30 rounded-lg">
              <p className="text-green-400 font-semibold">Interview in progress with {selectedAgent?.name}</p>
              <button
                onClick={handleEndCall}
                className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold transition"
              >
                End Interview
              </button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviewers.map((agent) => (
            <div key={agent.name} className="group relative">
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${agent.gradient} rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300`}></div>
              <div className="relative h-full rounded-2xl bg-black/50 backdrop-blur-xl border border-white/10 p-6 hover:border-white/20 transition-all">
                <div className={`w-16 h-16 bg-gradient-to-br ${agent.gradient} rounded-xl flex items-center justify-center mb-4`}>
                  <span className="text-2xl font-bold text-white">{agent.initial}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{agent.name}</h3>
                <p className="text-white/70 text-sm mb-4">{agent.description}</p>
                <button 
                  onClick={() => handleSelectInterviewer(agent.id!, agent.name)}
                  disabled={isCalling}
                  className={`w-full py-2 bg-gradient-to-r ${agent.gradient} rounded-lg text-white font-semibold hover:opacity-90 transition disabled:opacity-50 ${isCalling ? 'cursor-not-allowed' : ''}`}
                >
                  {isCalling ? 'Interview Active' : 'Start Interview'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-black/90 border border-white/20 rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-white mb-4">Start Interview</h3>
            <p className="text-white/70 mb-6">Ready to start interview with {selectedAgent?.name}?</p>
            <div className="flex gap-3">
              <button
                onClick={handleStartCall}
                disabled={isCalling}
                className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                {isCalling ? 'Starting...' : 'Start'}
              </button>
              <button
                onClick={() => setShowConfirmationModal(false)}
                disabled={isCalling}
                className="flex-1 py-3 bg-white/10 border border-white/20 rounded-lg text-white font-semibold hover:bg-white/20 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
