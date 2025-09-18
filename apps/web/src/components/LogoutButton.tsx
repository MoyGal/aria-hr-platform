'use client';

import { SignOutButton } from '@clerk/nextjs';

export default function LogoutButton() {
  return (
    <SignOutButton redirectUrl="/">
      <button className="rounded-md border px-4 py-2 text-sm font-semibold hover:bg-gray-50">
        Log out
      </button>
    </SignOutButton>
  );
}
