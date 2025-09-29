'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import UserProfile from '@/components/user-profile'; // <-- NUESTRO NUEVO COMPONENTE

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: '📊' },
    { name: 'Jobs', href: '/dashboard/jobs', icon: '💼' },
    { name: 'Candidates', href: '/dashboard/candidates', icon: '👥' },
    { name: 'Interviews', href: '/dashboard/interviews', icon: '🎙️' },
    { name: 'AI Agents', href: '/dashboard/interviewers', icon: '🤖' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ff006e]/20 via-[#ff8800]/10 to-[#ffa500]/10">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff006e] to-[#ff8800] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">ARIA</h1>
            </Link>
            <nav className="hidden md:flex gap-1">
              {navigation.map((item) => {
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
            <button className="px-4 py-2 bg-gradient-to-r from-[#ff006e] to-[#ff8800] text-white rounded-lg font-medium hover:shadow-lg transition-all">
              + New Interview
            </button>
            <UserProfile /> {/* <-- AQUÍ ESTÁ EL REEMPLAZO */}
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}