// Nombre del archivo: apps/web/src/app/dashboard/page.tsx
import { Briefcase, Users, Calendar, Bot, FileText, UserPlus, Settings } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400">
          Welcome back! Here's what's happening with your recruitment pipeline.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Open Positions */}
        <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl border border-blue-500/30 hover:scale-105 transition-transform duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Briefcase className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-xs font-semibold text-blue-400 bg-blue-500/20 px-3 py-1 rounded-full">
              +12%
            </span>
          </div>
          <div className="space-y-1">
            <h3 className="text-4xl font-bold text-white">24</h3>
            <p className="text-sm text-gray-400">Open Positions</p>
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
        </div>

        {/* Total Candidates */}
        <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-xl border border-green-500/30 hover:scale-105 transition-transform duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <Users className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-xs font-semibold text-green-400 bg-green-500/20 px-3 py-1 rounded-full">
              +8%
            </span>
          </div>
          <div className="space-y-1">
            <h3 className="text-4xl font-bold text-white">156</h3>
            <p className="text-sm text-gray-400">Total Candidates</p>
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-green-500/10 rounded-full blur-2xl"></div>
        </div>

        {/* Scheduled Interviews */}
        <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-purple-500/20 to-violet-600/20 backdrop-blur-xl border border-purple-500/30 hover:scale-105 transition-transform duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Calendar className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-xs font-semibold text-purple-400 bg-purple-500/20 px-3 py-1 rounded-full">
              Today
            </span>
          </div>
          <div className="space-y-1">
            <h3 className="text-4xl font-bold text-white">8</h3>
            <p className="text-sm text-gray-400">Scheduled Interviews</p>
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl"></div>
        </div>

        {/* AI Agents */}
        <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-orange-500/20 to-amber-600/20 backdrop-blur-xl border border-orange-500/30 hover:scale-105 transition-transform duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-orange-500/20 rounded-xl">
              <Bot className="w-6 h-6 text-orange-400" />
            </div>
            <span className="text-xs font-semibold text-orange-400 bg-orange-500/20 px-3 py-1 rounded-full">
              Active
            </span>
          </div>
          <div className="space-y-1">
            <h3 className="text-4xl font-bold text-white">3</h3>
            <p className="text-sm text-gray-400">AI Agents</p>
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl"></div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Post New Job */}
          <button className="group relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-purple-500/30 to-violet-600/30 hover:from-purple-500/40 hover:to-violet-600/40 border border-purple-500/30 transition-all duration-300 text-left">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-lg group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-purple-300" />
              </div>
              <span className="text-lg font-semibold text-white">Post New Job</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </button>

          {/* Schedule Interview */}
          <button className="group relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-green-500/30 to-emerald-600/30 hover:from-green-500/40 hover:to-emerald-600/40 border border-green-500/30 transition-all duration-300 text-left">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-lg group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6 text-green-300" />
              </div>
              <span className="text-lg font-semibold text-white">Schedule Interview</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </button>

          {/* Configure AI Agent */}
          <button className="group relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-pink-500/30 to-rose-600/30 hover:from-pink-500/40 hover:to-rose-600/40 border border-pink-500/30 transition-all duration-300 text-left">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-lg group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6 text-pink-300" />
              </div>
              <span className="text-lg font-semibold text-white">Configure AI Agent</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {/* Activity Item 1 */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <UserPlus className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">New application received</p>
              <p className="text-sm text-gray-400">Sarah Johnson applied for Senior Developer</p>
            </div>
            <span className="text-sm text-gray-500">2 min ago</span>
          </div>

          {/* Activity Item 2 */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Calendar className="w-5 h-5 text-green-400" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">Interview completed</p>
              <p className="text-sm text-gray-400">Michael Chen's interview for Senior UX Designer</p>
            </div>
            <span className="text-sm text-gray-500">15 min ago</span>
          </div>

          {/* Activity Item 3 */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Bot className="w-5 h-5 text-purple-400" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">New AI Agent created</p>
              <p className="text-sm text-gray-400">Maria - Technical Interviewer is now active</p>
            </div>
            <span className="text-sm text-gray-500">1 hour ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}