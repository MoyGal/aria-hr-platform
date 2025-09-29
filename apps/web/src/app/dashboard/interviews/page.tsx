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

    try {
      const response = await fetch('/api/retell/register-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: selectedAgent.id }),
      });

      if (!response.ok) throw new Error('Failed to register call');

      const { access_token } = await response.json();
      setShowConfirmationModal(false);

      const client = new RetellWebClient();
      setRetellClient(client);

      client.on('call_started', () => console.log("Call started"));
      client.on('call_ended', () => {
        setIsCalling(false);
        setRetellClient(null);
      });
      client.on('error', (error) => {
        console.error("Call error:", error);
        setIsCalling(false);
      });

      await client.startCall({ accessToken: access_token });

    } catch (error) {
      console.error(error);
      setIsCalling(false);
      setShowConfirmationModal(false);
    }
  };

  const handleEndCall = () => {
    if (retellClient) retellClient.stopCall();
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
              <p className="text-green-400 font-semibold">Interview in progress</p>
              <button onClick={handleEndCall} className="mt-2 px-4 py-2 bg-red-600 rounded-lg text-white">
                End Interview
              </button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviewers.map((agent) => (
            <div key={agent.name} className="group relative">
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${agent.gradient} rounded-2xl blur opacity-25`}></div>
              <div className="relative h-full rounded-2xl bg-black/50 backdrop-blur-xl border border-white/10 p-6">
                <div className={`w-16 h-16 bg-gradient-to-br ${agent.gradient} rounded-xl flex items-center justify-center mb-4`}>
                  <span className="text-2xl font-bold text-white">{agent.initial}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{agent.name}</h3>
                <p className="text-white/70 text-sm mb-4">{agent.description}</p>
                <button 
                  onClick={() => handleSelectInterviewer(agent.id!, agent.name)}
                  disabled={isCalling}
                  className={`w-full py-2 bg-gradient-to-r ${agent.gradient} rounded-lg text-white font-semibold`}
                >
                  Start Interview
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-black/90 border border-white/20 rounded-2xl p-8 max-w-md">
            <h3 className="text-2xl font-bold text-white mb-4">Start Interview</h3>
            <p className="text-white/70 mb-6">Ready to start interview with {selectedAgent?.name}?</p>
            <div className="flex gap-3">
              <button onClick={handleStartCall} className="flex-1 py-3 bg-violet-600 rounded-lg text-white">
                Start
              </button>
              <button onClick={() => setShowConfirmationModal(false)} className="flex-1 py-3 bg-white/10 rounded-lg text-white">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
