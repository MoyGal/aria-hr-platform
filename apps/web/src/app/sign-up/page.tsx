'use client';
import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <main className="min-h-screen grid place-items-center bg-gray-950">
      <SignUp routing="hash" afterSignUpUrl="/dashboard" />
    </main>
  );
}
