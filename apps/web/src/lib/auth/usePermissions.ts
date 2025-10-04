'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { hasPermission, canManageUsers, Role, ROLES } from './roles';

interface UserData {
  role: Role;
  email: string;
  displayName: string;
  orgId?: string;
  status: string;
}

export function usePermissions() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData);
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const checkPermission = (resource: string, action: 'create' | 'read' | 'update' | 'delete' | 'manage') => {
    if (!userData) return false;
    return hasPermission(userData.role, resource, action);
  };

  const isMasterAdmin = userData?.role === ROLES.MASTER_ADMIN;
  const isCompanyAdmin = userData?.role === ROLES.COMPANY_ADMIN;
  const isRecruiter = userData?.role === ROLES.RECRUITER;
  const isViewer = userData?.role === ROLES.VIEWER;

  return {
    userData,
    loading,
    checkPermission,
    canManageUsers: userData ? canManageUsers(userData.role) : false,
    isMasterAdmin,
    isCompanyAdmin,
    isRecruiter,
    isViewer,
  };
}
