'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevenimos que la página se recargue
    setError(null);

    try {
      // Usamos la función de Firebase para iniciar sesión
      await signInWithEmailAndPassword(auth, email, password);
      // Si el inicio de sesión es exitoso, redirigimos al dashboard
      router.push('/dashboard');
    } catch (err: any) {
      // Si hay un error, lo mostramos al usuario
      console.error("Firebase Auth Error:", err);
      setError("Failed to sign in. Please check your email and password.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center">Sign In to ARIA</h1>
        
        <form onSubmit={handleSignIn} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-400">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-semibold text-white bg-violet-600 rounded-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-violet-500"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}