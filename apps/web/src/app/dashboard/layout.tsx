<<<<<<< Updated upstream
import Link from 'next/link';
import { AuthProvider } from '@/components/providers/auth-provider';
import UserProfile from '@/components/user-profile';

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Jobs', href: '/dashboard/jobs' },
  { name: 'Interviews', href: '/dashboard/interviews' },
  // REMOVIDO: candidates y interviewers ya no existen
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider requireAuth>
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          {/* Sidebar */}
          <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
            <div className="flex min-h-0 flex-1 flex-col bg-gray-800">
              <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
                <div className="flex flex-shrink-0 items-center px-4">
                  <span className="text-2xl font-bold text-white">ARIA</span>
                </div>
                <nav className="mt-5 flex-1 space-y-1 px-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="flex flex-shrink-0 bg-gray-700 p-4">
                <UserProfile />
=======
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Sparkles, LogOut, User } from 'lucide-react';

import { useAuth } from '@/lib/contexts/AuthContext';
import { canAccessAdminPanel, canAccessDashboard } from '@/lib/auth/roles';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading, role, profileLoading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/sign-in');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: '📊' },
    { name: 'Jobs', href: '/dashboard/jobs', icon: '💼' },
    { name: 'Candidates', href: '/dashboard/candidates', icon: '👥' },
    { name: 'Interviews', href: '/dashboard/interviews', icon: '🎙️' },
    { name: 'AI Agents', href: '/dashboard/interviewers', icon: '🤖' },
  ];

  const navigationItems = canAccessAdminPanel(role)
    ? [...navigation, { name: 'Admin', href: '/admin', icon: '🛠️' }]
    : navigation;

  if (loading || profileLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!canAccessDashboard(role)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-6">
        <div className="max-w-md space-y-4">
          <h1 className="text-2xl font-semibold text-gray-900">Access restricted</h1>
          <p className="text-sm text-gray-600">
            Your account does not have access to the dashboard.
          </p>
          <button onClick={() => router.push('/')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
            Go back home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ff006e]/20 via-[#ff8800]/10 to-[#ffa500]/10">
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200">
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff006e] to-[#ff8800] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
>>>>>>> Stashed changes
              </div>
            </div>
<<<<<<< Updated upstream
          </div>

          {/* Main content */}
          <div className="flex flex-1 flex-col md:pl-64">
            <main className="flex-1">
              <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  {children}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </AuthProvider>
=======
            <nav className="flex gap-1">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#ff006e]/10 to-[#ff8800]/10 text-gray-800 border border-[#ff006e]/20'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    <span>{item.icon}</span>
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{user.email ?? 'Authenticated user'}</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs uppercase tracking-wide">
                  {role}
                </span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 border border-[#ff006e]/40 text-[#ff006e] hover:bg-[#ff006e]/10 rounded"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <main className="p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
>>>>>>> Stashed changes
  );
}
