export default function DashboardPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-gray-400">Welcome back! Here&apos;s what&apos;s happening with your recruitment pipeline.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">💼</span>
            <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded">+12%</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">24</div>
          <div className="text-sm text-gray-400">Open Positions</div>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">👥</span>
            <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded">+8%</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">156</div>
          <div className="text-sm text-gray-400">Total Candidates</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">🎙️</span>
            <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded">Today</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">8</div>
          <div className="text-sm text-gray-400">Scheduled Interviews</div>
        </div>

        <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 border border-amber-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">🤖</span>
            <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-1 rounded">Active</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">5</div>
          <div className="text-sm text-gray-400">AI Agents</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-white/10 hover:border-white/20 transition-all text-left">
            <div className="text-2xl mb-2">📝</div>
            <div className="text-white font-medium">Post New Job</div>
            <div className="text-sm text-gray-400">Create a new job opening</div>
          </button>
          <button className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-white/10 hover:border-white/20 transition-all text-left">
            <div className="text-2xl mb-2">🎙️</div>
            <div className="text-white font-medium">Schedule Interview</div>
            <div className="text-sm text-gray-400">Set up an AI interview</div>
          </button>
          <button className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-white/10 hover:border-white/20 transition-all text-left">
            <div className="text-2xl mb-2">🤖</div>
            <div className="text-white font-medium">Configure AI Agent</div>
            <div className="text-sm text-gray-400">Create or edit agents</div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <span className="text-blue-400">📥</span>
            </div>
            <div className="flex-1">
              <div className="text-white">New application received</div>
              <div className="text-sm text-gray-400">John Doe applied for Senior Developer</div>
            </div>
            <div className="text-sm text-gray-500">2 min ago</div>
          </div>
          <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <span className="text-green-400">✅</span>
            </div>
            <div className="flex-1">
              <div className="text-white">Interview completed</div>
              <div className="text-sm text-gray-400">AI Agent finished interviewing Sarah Smith</div>
            </div>
            <div className="text-sm text-gray-500">15 min ago</div>
          </div>
          <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
              <span className="text-purple-400">🤖</span>
            </div>
            <div className="flex-1">
              <div className="text-white">New AI Agent created</div>
              <div className="text-sm text-gray-400">Technical Interviewer agent is now active</div>
            </div>
            <div className="text-sm text-gray-500">1 hour ago</div>
          </div>
        </div>
      </div>
    </div>
  );
}