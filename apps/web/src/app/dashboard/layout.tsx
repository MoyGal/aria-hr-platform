'use client';

import { useAuth } from '@/components/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { LayoutDashboard, Briefcase, Calendar, LogOut, Menu, X, Shield } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<string>('');
  const [loadingRole, setLoadingRole] = useState(true);

  useEffect(() => {
    async function fetchUserRole() {
      if (!user) return;
      
      console.log('🔍 Fetching role for user:', user.uid);
      
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log('✅ User data loaded:', userData);
          console.log('✅ Role is:', userData.role);
          setUserRole(userData.role || 'user');
        } else {
          console.log('❌ User document does not exist');
          setUserRole('user');
        }
      } catch (error) {
        console.error('❌ Error fetching user role:', error);
        setUserRole('user');
      } finally {
        setLoadingRole(false);
      }
    }

    fetchUserRole();
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/sign-in');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navigationItems = useMemo(() => {
    const baseNav = [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Jobs', href: '/dashboard/jobs', icon: Briefcase },
      { name: 'Interviews', href: '/dashboard/interviews', icon: Calendar },
    ];
    
    if (userRole === 'master_admin') {
      return [...baseNav, { name: 'Master Admin', href: '/dashboard/master', icon: Shield }];
    }
    return baseNav;
  }, [userRole]);

  const roleDisplayNames: Record<string, string> = {
    master_admin: 'Master Admin',
    company_admin: 'Company Admin',
    company_user: 'Company User',
    candidate: 'Candidate',
    user: 'User',
  };

  const roleColors: Record<string, string> = {
    master_admin: 'text-red-400 bg-red-500/20',
    company_admin: 'text-purple-400 bg-purple-500/20',
    company_user: 'text-blue-400 bg-blue-500/20',
    candidate: 'text-green-400 bg-green-500/20',
    user: 'text-gray-400 bg-gray-500/20',
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
        <div className="glass-card p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen w-64 
          bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1e] 
          border-r border-white/10 backdrop-blur-xl
          transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="h-full flex flex-col p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              ARIA
            </h1>
            <p className="text-xs text-gray-500 mt-1">HR Platform</p>
          </div>

          <nav className="flex-1 space-y-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                    isActive 
                      ? 'bg-purple-500/20 text-white border border-purple-500/30' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-white/10">
            {!loadingRole && userRole && (
              <div className="mb-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                <Shield className="w-4 h-4 text-purple-400" />
                <span className={`text-xs font-semibold px-2 py-1 rounded ${roleColors[userRole] || roleColors.user}`}>
                  {roleDisplayNames[userRole] || 'User'}
                </span>
              </div>
            )}

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.displayName || 'User'}
                </p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-red-500/20 transition-all duration-300 group"
            >
              <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <main className="min-h-screen">{children}</main>
      </div>

      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
