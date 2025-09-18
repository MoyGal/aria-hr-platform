'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SignedIn, SignedOut, SignOutButton } from '@clerk/nextjs';

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const close = () => setOpen(false);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-gradient-to-r from-indigo-600/20 via-fuchsia-600/20 to-cyan-500/10 text-white backdrop-blur supports-[backdrop-filter]:bg-white/0">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" onClick={close} className="text-xl font-bold tracking-tight">
          ARIA
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {mounted ? (
            <>
              <SignedOut>
                <Link href="/" className="text-sm font-medium text-white/85 hover:text-white">Home</Link>
                <Link href="/#learn-more" className="text-sm font-medium text-white/85 hover:text-white">Learn More</Link>
                <Link href="/sign-in" className="rounded-md bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20">
                  Sign in
                </Link>
              </SignedOut>

              <SignedIn>
                <Link href="/dashboard" className="text-sm font-medium text-white/85 hover:text-white">Dashboard</Link>
                <Link href="/dashboard/candidates" className="text-sm font-medium text-white/85 hover:text-white">Candidates</Link>
                <Link href="/dashboard/jobs" className="text-sm font-medium text-white/85 hover:text-white">Jobs</Link>
                <Link href="/dashboard/interviews" className="text-sm font-medium text-white/85 hover:text-white">Interviews</Link>
                <SignOutButton redirectUrl="/">
                  <button className="rounded-md border border-white/20 px-4 py-2 text-sm font-semibold hover:bg-white/10">
                    Log out
                  </button>
                </SignOutButton>
              </SignedIn>
            </>
          ) : (
            <div className="h-6 w-40" />
          )}
        </div>

        <button
          aria-label="Toggle menu"
          className="inline-flex items-center justify-center rounded-md border border-white/20 px-3 py-2 md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <div className="space-y-1.5">
            <span className="block h-0.5 w-5 bg-white" />
            <span className="block h-0.5 w-5 bg-white" />
            <span className="block h-0.5 w-5 bg-white" />
          </div>
        </button>
      </div>

      {mounted ? (
        <div className={`md:hidden ${open ? 'block' : 'hidden'} border-t border-white/10 bg-[#0b1020]`} onClick={close}>
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3">
            <SignedOut>
              <Link href="/" className="rounded px-2 py-2 text-sm hover:bg-white/10">Home</Link>
              <Link href="/#learn-more" className="rounded px-2 py-2 text-sm hover:bg-white/10">Learn More</Link>
              <Link href="/sign-in" className="rounded bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/20">
                Sign in
              </Link>
            </SignedOut>

            <SignedIn>
              <Link href="/dashboard" className="rounded px-2 py-2 text-sm hover:bg-white/10">Dashboard</Link>
              <Link href="/dashboard/candidates" className="rounded px-2 py-2 text-sm hover:bg-white/10">Candidates</Link>
              <Link href="/dashboard/jobs" className="rounded px-2 py-2 text-sm hover:bg-white/10">Jobs</Link>
              <Link href="/dashboard/interviews" className="rounded px-2 py-2 text-sm hover:bg-white/10">Interviews</Link>
              <SignOutButton redirectUrl="/">
                <button className="rounded border border-white/20 px-3 py-2 text-sm font-semibold hover:bg-white/10">
                  Log out
                </button>
              </SignOutButton>
            </SignedIn>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
