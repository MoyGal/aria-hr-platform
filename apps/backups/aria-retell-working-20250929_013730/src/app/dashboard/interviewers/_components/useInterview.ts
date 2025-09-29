// src/app/dashboard/interviewers/_components/useInterview.ts
import { useState } from 'react';

export function useInterview() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startInterview = async (
    interviewerId: string,
    candidateInfo: {
      id: string;
      name: string;
      phone: string;
      jobId: string;
      jobTitle: string;
    }
  ) => {
    setLoading(true);
    setError(null);

    try {
      // First, ensure interviewer is configured
      const configResponse = await fetch('/api/interviewers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interviewerId })
      });

      if (!configResponse.ok) {
        throw new Error('Failed to configure interviewer');
      }

      const { interviewer } = await configResponse.json();

      // Start the call
      const callResponse = await fetch(`/api/interviewers/${interviewer.id}/call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: candidateInfo.phone,
          candidateName: candidateInfo.name,
          candidateId: candidateInfo.id,
          jobId: candidateInfo.jobId,
          jobTitle: candidateInfo.jobTitle
        })
      });

      if (!callResponse.ok) {
        throw new Error('Failed to initiate interview call');
      }

      const result = await callResponse.json();
      return result;

    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    startInterview,
    loading,
    error
  };
}