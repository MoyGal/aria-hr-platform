'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface UserProfileProps {
  showRole?: boolean;
}

export default function UserProfile({ showRole = false }: UserProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user && showRole) {
        // Fetch user role from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserRole(userData.role || 'user');
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [showRole]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/auth/sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getRoleDisplay = () => {
    switch (userRole) {
      case 'master':
        return { label: 'Master Admin', color: 'text-purple-400' };
      case 'company_admin':
        return { label: 'Company Admin', color: 'text-blue-400' };
      case 'company_user':
        return { label: 'Company User', color: 'text-green-400' };
      case 'candidate':
        return { label: 'Candidate', color: 'text-gray-400' };
      default:
        return { label: 'User', color: 'text-gray-400' };
    }
  };

  if (loading) {
    return <div className="text-gray-400">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  const roleInfo = getRoleDisplay();

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {user.displayName || user.email}
          </p>
          {showRole && userRole && (
            <p className={`text-xs ${roleInfo.color} mt-1`}>
              {roleInfo.label}
            </p>
          )}
          <p className="text-xs text-gray-400 truncate">
            {user.email}
          </p>
        </div>
        <Button
          onClick={handleLogout}
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white hover:bg-white/10"
        >
          Logout
        </Button>
      </div>
    </div>
  );
}