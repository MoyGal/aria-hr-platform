'use client';

import { useAuth } from '@/components/providers/auth-provider';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function UserProfile() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/sign-in');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Muestra un esqueleto de carga que combina con el diseño
  if (loading) {
    return <div className="flex items-center gap-2"><div className="w-24 h-4 bg-gray-200 rounded animate-pulse" /><div className="w-20 h-10 bg-gray-200 rounded-lg animate-pulse" /></div>;
  }

  // Muestra el perfil del usuario si está conectado
  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600 font-medium">{user.email}</span>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  // Muestra el botón de Sign In si no hay nadie conectado
  return (
    <button
      onClick={() => router.push('/sign-in')}
      className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#ff006e] to-[#ff8800] rounded-lg hover:shadow-lg transition-all"
    >
      Sign In
    </button>
  );
}