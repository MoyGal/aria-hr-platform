'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuth } from '@/lib/contexts/AuthContext';
import { canAccessAdminPanel } from '@/lib/auth/roles';
import { Button } from '@/components/ui/button';

export default function AdminPage() {
  const { role, loading, profileLoading, isMaster } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !profileLoading && !canAccessAdminPanel(role)) {
      router.replace('/dashboard');
    }
  }, [loading, profileLoading, role, router]);

  if (loading || profileLoading || !canAccessAdminPanel(role)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-6">
        <div className="max-w-md space-y-3">
          <h1 className="text-2xl font-semibold text-gray-900">Checking permissions…</h1>
          <p className="text-sm text-gray-600">Please wait while we verify your access.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white">
      <div className="mx-auto max-w-5xl px-6 py-16 space-y-12">
        <header className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">Master Console</p>
          <h1 className="text-4xl font-bold">Administrator Panel</h1>
          <p className="text-base text-white/70">
            You are signed in with master privileges{isMaster ? ' (master UID detected).' : '.'} From here you will manage
            organizations, client admins, and global platform settings.
          </p>
        </header>

        <section className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-xl font-semibold">Organizations</h2>
            <p className="mt-2 text-sm text-white/70">
              Create or manage client companies, assign primary admins, and configure global interview defaults.
            </p>
            <div className="mt-6">
              <Button disabled className="w-full justify-center bg-white/10 hover:bg-white/20">
                Coming soon
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-xl font-semibold">Platform Settings</h2>
            <p className="mt-2 text-sm text-white/70">
              Configure AI models, Retell defaults, and feature flags across all organizations.
            </p>
            <div className="mt-6">
              <Button disabled className="w-full justify-center bg-white/10 hover:bg-white/20">
                Coming soon
              </Button>
            </div>
          </div>
        </section>

        <footer className="space-y-3 text-sm text-white/60">
          <p>
            Need to add a new organization right away? Contact support or jump into the Firestore console while we finish this
            UI.
          </p>
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-white hover:underline">
            ← Back to dashboard
          </Link>
        </footer>
      </div>
    </main>
  );
}
