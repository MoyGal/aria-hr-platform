'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, addDoc, query, where, getDocs, serverTimestamp, Timestamp } from "firebase/firestore";
import { ArrowLeft, Mail, Plus, CheckCircle, Clock, XCircle } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  location?: string | null;
  description?: string | null;
  status: "OPEN" | "CLOSED";
  createdAt: Timestamp;
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  invitedAt: Timestamp;
  interviewStatus: "pending" | "completed" | "expired";
  invitationLink?: string;
}

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;

  const [job, setJob] = useState<Job | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadJobAndCandidates();
  }, [jobId]);

  async function loadJobAndCandidates() {
    try {
      const jobDoc = await getDoc(doc(db, "jobs", jobId));
      if (jobDoc.exists()) {
        setJob({ id: jobDoc.id, ...jobDoc.data() } as Job);
      }

      const candidatesQuery = query(
        collection(db, "candidates"),
        where("jobId", "==", jobId)
      );
      const candidatesSnapshot = await getDocs(candidatesQuery);
      const candidatesData = candidatesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Candidate));
      setCandidates(candidatesData);
    } catch (error) {
      console.error("Error loading job:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddCandidate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);

    try {
      const formData = new FormData(e.currentTarget);
      const name = (formData.get("name") as string)?.trim();
      const email = (formData.get("email") as string)?.trim();

      if (!name || !email) return;

      const invitationLink = `${window.location.origin}/interview/${jobId}`;

      const candidateRef = await addDoc(collection(db, "candidates"), {
        jobId,
        name,
        email,
        invitedAt: serverTimestamp(),
        interviewStatus: "pending",
        invitationLink,
      });

      const response = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateEmail: email,
          candidateName: name,
          jobTitle: job?.title,
          companyName: "ARIA Platform",
          invitationLink,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send invitation');
      }

      e.currentTarget.reset();
      await loadJobAndCandidates();
      alert(`Invitación enviada a ${email}`);
    } catch (error) {
      console.error("Error adding candidate:", error);
      alert('Error al enviar la invitación');
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-8">
        <div className="glass-card p-12 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">Job not found</h3>
          <button
            onClick={() => router.push('/dashboard/jobs')}
            className="mt-4 px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <button
        onClick={() => router.push('/dashboard/jobs')}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Jobs
      </button>

      <div className="glass-card p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white">{job.title}</h1>
            {job.description && <p className="text-gray-400 mt-2">{job.description}</p>}
            {job.location && <p className="text-gray-500 mt-1">{job.location}</p>}
          </div>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${job.status === 'OPEN' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
            {job.status}
          </span>
        </div>
      </div>

      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Invite Candidate</h2>
        <form onSubmit={handleAddCandidate} className="flex flex-col md:flex-row gap-3">
          <input
            name="name"
            placeholder="Candidate name"
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email address"
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            required
          />
          <button
            type="submit"
            disabled={sending}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
          >
            <Mail size={20} />
            {sending ? 'Sending...' : 'Send Invitation'}
          </button>
        </form>
      </div>

      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          Candidates ({candidates.length})
        </h2>

        {candidates.length === 0 ? (
          <div className="text-center py-12">
            <Mail className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No candidates yet</h3>
            <p className="text-gray-400">Invite candidates using the form above</p>
          </div>
        ) : (
          <div className="space-y-3">
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all"
              >
                <div className="flex-1">
                  <h4 className="text-white font-semibold">{candidate.name}</h4>
                  <p className="text-sm text-gray-400">{candidate.email}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Invited: {candidate.invitedAt ? new Date(candidate.invitedAt.toDate()).toLocaleString() : 'N/A'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {candidate.interviewStatus === 'completed' && (
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle size={20} />
                      <span className="text-sm font-medium">Completed</span>
                    </div>
                  )}
                  {candidate.interviewStatus === 'pending' && (
                    <div className="flex items-center gap-2 text-yellow-400">
                      <Clock size={20} />
                      <span className="text-sm font-medium">Pending</span>
                    </div>
                  )}
                  {candidate.interviewStatus === 'expired' && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <XCircle size={20} />
                      <span className="text-sm font-medium">Expired</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
