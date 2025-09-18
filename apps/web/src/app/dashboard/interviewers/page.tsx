// src/app/dashboard/interviewers/page.tsx
import prisma from '@/lib/db';
import InterviewerForm from './_form';

export default async function InterviewersPage() {
  const list = await prisma.interviewer.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-8">
      {/* Gradientes de fondo sutiles */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, #ff006e 0%, transparent 50%),
                            radial-gradient(circle at 80% 80%, #ff8800 0%, transparent 50%),
                            radial-gradient(circle at 50% 50%, #10b981 0%, transparent 50%)`
          }}
        />
      </div>

      {/* Header Section */}
      <div className="relative mb-8">
        <h1 className="text-5xl font-black text-white drop-shadow-lg mb-3">AI Interview Agents</h1>
        <p className="text-xl text-gray-600">Configure intelligent voice agents to conduct automated interviews at scale</p>
      </div>

      {/* Stats Cards */}
      <div className="relative grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="text-gray-500 text-sm font-medium mb-1">Total Agents</div>
          <div className="text-3xl font-black bg-gradient-to-r from-[#ff006e] to-[#ff8800] bg-clip-text text-transparent">
            {list.length}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="text-gray-500 text-sm font-medium mb-1">Active Now</div>
          <div className="text-3xl font-black text-emerald-500">0</div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="text-gray-500 text-sm font-medium mb-1">Interviews Today</div>
          <div className="text-3xl font-black text-[#ff8800]">0</div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="text-gray-500 text-sm font-medium mb-1">Avg Duration</div>
          <div className="text-3xl font-black text-gray-700">0m</div>
        </div>
      </div>

      {/* Create New Agent Section */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-700 mb-6 flex items-center gap-3">
          <span className="text-3xl">🚀</span>
          Create New AI Agent
        </h2>
        <InterviewerForm />
      </div>

      {/* Agents List */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-[#ff006e]/5 to-[#ff8800]/5">
          <h2 className="text-2xl font-bold text-gray-700 flex items-center gap-3">
            <span className="text-3xl">🤖</span>
            Your AI Agents
          </h2>
        </div>
        
        {list.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Agent Name</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Language</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Voice Profile</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Retell ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {list.map((agent) => (
                  <tr key={agent.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff006e] to-[#ff8800] flex items-center justify-center text-white font-semibold shadow-lg">
                          {agent.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-gray-700 font-semibold">{agent.name}</div>
                          {agent.notes && <div className="text-gray-500 text-sm">{agent.notes}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{agent.language || 'en-US'}</td>
                    <td className="px-6 py-4 text-gray-600">{agent.voice || 'Default'}</td>
                    <td className="px-6 py-4">
                      {agent.retellAgentId ? (
                        <code className="bg-emerald-100 px-2 py-1 rounded text-xs text-emerald-700 font-medium">{agent.retellAgentId}</code>
                      ) : (
                        <span className="text-gray-400">Not configured</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                        Ready
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{new Date(agent.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="text-[#ff006e] hover:text-[#ff8800] font-medium transition-colors">Configure</button>
                        <button className="text-gray-500 hover:text-gray-700 font-medium transition-colors">Test</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <div className="text-7xl mb-4">🤖</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No AI Agents Yet</h3>
            <p className="text-gray-500 mb-6 text-lg">Create your first AI interviewer agent to start automating interviews</p>
          </div>
        )}
      </div>
    </div>
  );
}