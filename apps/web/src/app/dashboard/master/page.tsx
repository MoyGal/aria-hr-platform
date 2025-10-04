'use client';

import { useEffect, useState } from 'react';
import { db } from "@/lib/firebase";
import { collection, query, getDocs, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { Building2, Users, Plus, Trash2, Edit2, Shield } from 'lucide-react';
import { usePermissions } from '@/lib/auth/usePermissions';
import { useRouter } from 'next/navigation';

interface Company {
  id: string;
  name: string;
  adminEmail?: string;
  createdAt: any;
  status: 'active' | 'inactive';
}

interface User {
  id: string;
  email: string;
  displayName: string;
  role: string;
  orgId?: string;
  status: string;
}

export default function MasterAdminPage() {
  const router = useRouter();
  const { isMasterAdmin, loading: permissionsLoading } = usePermissions();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateCompany, setShowCreateCompany] = useState(false);

  useEffect(() => {
    if (!permissionsLoading && !isMasterAdmin) {
      router.push('/dashboard');
      return;
    }
    if (isMasterAdmin) {
      loadData();
    }
  }, [isMasterAdmin, permissionsLoading, router]);

  async function loadData() {
    try {
      const [companiesSnapshot, usersSnapshot] = await Promise.all([
        getDocs(collection(db, "organizations")),
        getDocs(collection(db, "users"))
      ]);

      setCompanies(companiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Company)));
      setUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User)));
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateCompany(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const adminEmail = formData.get("adminEmail") as string;

    try {
      await addDoc(collection(db, "organizations"), {
        name,
        adminEmail,
        status: 'active',
        createdAt: serverTimestamp()
      });

      e.currentTarget.reset();
      setShowCreateCompany(false);
      await loadData();
      alert('Company created successfully');
    } catch (error) {
      console.error("Error creating company:", error);
      alert('Error creating company');
    }
  }

  async function handleDeleteCompany(companyId: string) {
    if (!confirm('Are you sure you want to delete this company? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteDoc(doc(db, "organizations", companyId));
      await loadData();
      alert('Company deleted successfully');
    } catch (error) {
      console.error("Error deleting company:", error);
      alert('Error deleting company');
    }
  }

  if (permissionsLoading || loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!isMasterAdmin) {
    return null;
  }

  const activeCompanies = companies.filter(c => c.status === 'active').length;
  const activeUsers = users.filter(u => u.status === 'active').length;

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Master Admin Dashboard</h1>
        <p className="text-gray-400 mt-1">Manage all companies and users across the platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Building2 className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Companies</p>
              <p className="text-2xl font-bold text-white">{activeCompanies}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">{activeUsers}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <Shield className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Admins</p>
              <p className="text-2xl font-bold text-white">
                {users.filter(u => u.role === 'company_admin').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Companies</h2>
          <button
            onClick={() => setShowCreateCompany(!showCreateCompany)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
          >
            <Plus size={20} />
            Create Company
          </button>
        </div>

        {showCreateCompany && (
          <form onSubmit={handleCreateCompany} className="mb-6 p-4 bg-white/5 rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                name="name"
                placeholder="Company name"
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                required
              />
              <input
                name="adminEmail"
                type="email"
                placeholder="Admin email (optional)"
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowCreateCompany(false)}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {companies.map((company) => (
            <div key={company.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex-1">
                <h3 className="text-white font-semibold">{company.name}</h3>
                {company.adminEmail && (
                  <p className="text-sm text-gray-400">Admin: {company.adminEmail}</p>
                )}
                <p className="text-xs text-gray-500">
                  Created: {company.createdAt ? new Date(company.createdAt.toDate()).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div className="flex gap-2">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  company.status === 'active' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {company.status}
                </span>
                <button
                  onClick={() => handleDeleteCompany(company.id)}
                  className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}

          {companies.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No companies yet</h3>
              <p className="text-gray-400">Create your first company to get started</p>
            </div>
          )}
        </div>
      </div>

      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-white mb-6">All Users</h2>
        <div className="space-y-3">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex-1">
                <h3 className="text-white font-semibold">{user.displayName}</h3>
                <p className="text-sm text-gray-400">{user.email}</p>
                <p className="text-xs text-gray-500">Org ID: {user.orgId || 'None'}</p>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-500/20 text-purple-400">
                  {user.role}
                </span>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  user.status === 'active' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {user.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
