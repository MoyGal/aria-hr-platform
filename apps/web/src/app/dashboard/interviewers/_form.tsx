// src/app/dashboard/interviewers/_form.tsx
'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';

export default function InterviewerForm() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const body = {
      name: String(fd.get('name') || ''),
      language: (fd.get('language') as string) || null,
      voice: (fd.get('voice') as string) || null,
      notes: (fd.get('notes') as string) || null,
    };

    try {
      const res = await fetch('/api/interviewers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to create interviewer');
      }
      
      setSuccess(true);
      e.currentTarget.reset();
      
      setTimeout(() => {
        router.refresh();
        setSuccess(false);
      }, 1500);
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create interviewer';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            Agent Name *
          </label>
          <input
            name="name"
            required
            placeholder="e.g., Senior Technical Interviewer"
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700 placeholder:text-gray-400 focus:border-[#ff006e] focus:outline-none transition-colors"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            Language
          </label>
          <select
            name="language"
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700 focus:border-[#ff006e] focus:outline-none transition-colors"
          >
            <option value="">Default (en-US)</option>
            <option value="en-US">English (US)</option>
            <option value="en-GB">English (UK)</option>
            <option value="es-ES">Spanish (Spain)</option>
            <option value="es-MX">Spanish (Mexico)</option>
            <option value="fr-FR">French</option>
            <option value="de-DE">German</option>
            <option value="pt-BR">Portuguese (Brazil)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            Voice Profile
          </label>
          <select
            name="voice"
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700 focus:border-[#ff006e] focus:outline-none transition-colors"
          >
            <option value="">Default Voice</option>
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="formal">Formal</option>
            <option value="casual">Casual</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            Notes / Instructions
          </label>
          <input
            name="notes"
            placeholder="e.g., Focus on technical skills"
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700 placeholder:text-gray-400 focus:border-[#ff006e] focus:outline-none transition-colors"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-gradient-to-r from-[#ff006e] to-[#ff8800] text-white font-bold rounded-xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
        >
          {loading ? 'Creating...' : '+ Create AI Agent'}
        </button>
        
        {success && (
          <span className="text-emerald-600 font-semibold flex items-center gap-2">
            ✓ Agent created successfully!
          </span>
        )}
        
        {error && (
          <span className="text-red-500 flex items-center gap-2">
            ⚠️ {error}
          </span>
        )}
      </div>
    </form>
  );
}