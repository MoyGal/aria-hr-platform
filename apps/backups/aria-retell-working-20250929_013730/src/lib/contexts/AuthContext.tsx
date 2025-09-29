// src/lib/contexts/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { DEFAULT_USER_ROLE, isMasterRole, type UserRole } from '@/lib/auth/roles';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  profileLoading: boolean;
  role: UserRole;
  orgId: string | null;
  isMaster: boolean;
  status: string | null;
  profile: UserProfile | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

interface UserProfile {
  id: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  orgId: string | null;
  status: string | null;
  isMaster: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    let cancelled = false;

    const resolveProfile = async () => {
      if (!user) {
        setProfile(null);
        setProfileLoading(false);
        return;
      }

      setProfileLoading(true);

      try {
        const response = await fetch('/api/auth/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          }),
        });

        if (!response.ok) {
          console.warn(`Session API failed: ${response.status}. Using default role.`);
        }

        const data = await response.json();
        const payload = data?.user;

        if (!cancelled) {
          const resolvedRole: UserRole = payload?.role ?? DEFAULT_USER_ROLE;
          setProfile({
            id: payload?.id ?? user.uid,
            email: payload?.email ?? user.email ?? null,
            displayName: payload?.displayName ?? user.displayName ?? null,
            role: resolvedRole,
            orgId: payload?.orgId ?? null,
            status: payload?.status ?? 'active',
            isMaster: isMasterRole(resolvedRole),
          });
        }
      } catch (error) {
        console.error('Auth profile resolution error:', error);
        if (!cancelled) {
          setProfile({
            id: user.uid,
            email: user.email ?? null,
            displayName: user.displayName ?? null,
            role: DEFAULT_USER_ROLE,
            orgId: null,
            status: 'active',
            isMaster: false,
          });
        }
      } finally {
        if (!cancelled) {
          setProfileLoading(false);
        }
      }
    };

    resolveProfile();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const role = profile?.role ?? DEFAULT_USER_ROLE;
  const orgId = profile?.orgId ?? null;
  const status = profile?.status ?? null;
  const isMaster = profile?.isMaster ?? false;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        profileLoading,
        role,
        orgId,
        isMaster,
        status,
        profile,
        signIn,
        signUp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
