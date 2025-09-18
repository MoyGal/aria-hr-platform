import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function Page() {
  const jobs = await prisma.job.findMany({ orderBy: { createdAt: "desc" } });

  async function createJob(formData: FormData) {
    "use server";
    const title = (formData.get("title") as string)?.trim();
    const location = (formData.get("location") as string)?.trim() || null;
    const description = (formData.get("description") as string)?.trim() || null;
    if (!title) return;
    await prisma.job.create({ data: { title, location, description, status: "OPEN" } });
    revalidatePath("/dashboard/jobs");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Jobs</h2>
        <form action={createJob} className="flex gap-2">
          <input name="title" placeholder="Job title" className="px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800" />
          <input name="location" placeholder="Location" className="px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800" />
          <input name="description" placeholder="Short description" className="px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 w-64" />
          <button className="px-4 py-2 rounded-md bg-violet-600 hover:bg-violet-500 text-white">Add</button>
        </form>
      </div>

      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60">
        <table className="w-full text-sm">
          <thead className="text-zinc-400">
            <tr className="[&>th]:px-4 [&>th]:py-3 text-left">
              <th>Title</th><th>Location</th><th>Status</th><th>Created</th><th>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {jobs.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-zinc-500">No jobs yet. Use “Add”.</td></tr>
            ) : jobs.map(j => (
              <tr key={j.id} className="[&>td]:px-4 [&>td]:py-3">
                <td>{j.title}</td>
                <td className="text-zinc-400">{j.location ?? "—"}</td>
                <td><span className="text-emerald-400">{j.status}</span></td>
                <td className="text-zinc-400">{new Date(j.createdAt).toLocaleString()}</td>
                <td className="text-right text-zinc-400">—</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
