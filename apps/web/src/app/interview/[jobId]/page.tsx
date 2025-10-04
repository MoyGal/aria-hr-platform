'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { RetellWebClient } from 'retell-client-js-sdk';
import { Phone, PhoneOff } from 'lucide-react';

interface Job {
  title: string;
  description?: string;
  location?: string;
}

export default function PublicInterviewPage() {
  const params = useParams();
  const jobId = params.jobId as string;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCallActive, setIsCallActive] = useState(false);
  const [retellClient] = useState(() => new RetellWebClient());

  useEffect(() => {
    loadJob();
  }, [jobId]);

  async function loadJob() {
    try {
      const jobDoc = await getDoc(doc(db, "jobs", jobId));
      if (jobDoc.exists()) {
        setJob(jobDoc.data() as Job);
      }
    } catch (error) {
      console.error("Error loading job:", error);
    } finally {
      setLoading(false);
    }
  }

  async function startInterview() {
    try {
      const agentId = "agent_5f6354a921aceeda71064691e9"; // Jessica
      
      if (!agentId) {
        alert('Interview agent not configured');
        return;
      }

      const response = await fetch('/api/retell/register-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_id: agentId }),
      });

      if (!response.ok) {
        throw new Error('Failed to register call');
      }

      const { access_token } = await response.json();

      retellClient.on("call_started", () => {
        console.log("Call started");
        setIsCallActive(true);
      });

      retellClient.on("call_ended", () => {
        console.log("Call ended");
        setIsCallActive(false);
      });

      await retellClient.startCall({
        accessToken: access_token,
        sampleRate: 16000,
      });

    } catch (error) {
      console.error("Error starting interview:", error);
      alert('Error starting interview. Please try again.');
    }
  }

  function endInterview() {
    retellClient.stopCall();
    setIsCallActive(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
        <div className="glass-card p-12 text-center max-w-md">
          <h1 className="text-2xl font-bold text-white mb-4">Interview Not Found</h1>
          <p className="text-gray-300">This interview link may be invalid or expired.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="glass-card p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-purple-500/20 rounded-2xl mb-4">
            <Phone className="w-12 h-12 text-purple-300" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Voice Interview</h1>
          <h2 className="text-xl text-purple-200 mb-4">{job.title}</h2>
          {job.location && <p className="text-gray-300 mb-2">{job.location}</p>}
          {job.description && <p className="text-gray-400">{job.description}</p>}
        </div>

        <div className="bg-white/5 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Before you start:</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <span>Find a quiet place with good internet connection</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <span>Allow microphone access when prompted</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <span>The interview will take approximately 15-20 minutes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <span>Speak clearly and naturally with the AI interviewer</span>
            </li>
          </ul>
        </div>

        <div className="text-center">
          {!isCallActive ? (
            <button
              onClick={startInterview}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-green-500/50"
            >
              <Phone size={24} />
              Start Interview
            </button>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3 text-green-400 mb-4">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-semibold">Interview in progress...</span>
              </div>
              <button
                onClick={endInterview}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-red-500/50"
              >
                <PhoneOff size={24} />
                End Interview
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
