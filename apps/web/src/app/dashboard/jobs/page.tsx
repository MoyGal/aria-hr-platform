import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs, addDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { Briefcase, MapPin, Clock, Plus } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  location?: string | null;
  description?: string | null;
  status: "OPEN" | "CLOSED";
  createdAt: Timestamp;
}

export const dynamic = "force-dynamic";

export default async function Page() {
  const jobsQuery = query(collection(db, "jobs"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(jobsQuery);
  const jobs: Job[] = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<Job, 'id'>)
  }));

  async function createJob(formData: FormData) {
    "use server";
    const title = (formData.get("title") as string)?.trim();
    const location = (formData.get("location") as string)?.trim() || null;
    const description = (formData.get("description") as string)?.trim() || null;
    
    if (!title) return;

    await addDoc(collection(db, "jobs"), {
      title,
      location,
      description,
      status: "OPEN",
      createdAt: serverTimestamp()
    });

    revalidatePath("/dashboard/jobs");
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Jobs</h1>
          <p className="text-gray-400 mt-1">Manage your open positions and track applications</p>
        </div>
      </div>

      {/* Create Job Form */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Create New Job</h2>
        <form action={createJob} className="flex flex-col md:flex-row gap-3">
          <input 
            name="title" 
            placeholder="Job title" 
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50" 
            required 
          />
          <input 
            name="location" 
            placeholder="Location" 
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50" 
          />
          <input 
            name="description" 
            placeholder="Short description" 
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50" 
          />
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-purple-500/50">
            <Plus size={20} />
            Add Job
          </button>
        </form>
      </div>

      {/* Jobs List */}
      {jobs.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Briefcase className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No jobs yet</h3>
          <p className="text-gray-400">Create your first job posting using the form above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="glass-card p-6 hover:scale-[1.02] transition-all duration-300 cursor-pointer"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-500/20 rounded-xl">
                    <Briefcase className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{job.title}</h3>
                    {job.description && (
                      <p className="text-sm text-gray-400 mt-1">{job.description}</p>
                    )}
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  job.status === 'OPEN' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {job.status}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-3 mb-4">
                {job.location && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <MapPin size={16} className="text-gray-500" />
                    <span className="text-sm">{job.location}</span>
                  </div>