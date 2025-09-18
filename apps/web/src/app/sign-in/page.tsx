'use client';
import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <main className="min-h-screen grid place-items-center bg-gray-950">
      <SignIn routing="hash" afterSignInUrl="/dashboard" />
    </main>
  );
}
