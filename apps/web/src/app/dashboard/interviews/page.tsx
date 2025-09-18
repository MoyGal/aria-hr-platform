import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [interviews, candidates, jobs] = await Promise.all([
    prisma.interview.findMany({ orderBy: { scheduledAt: "desc" } }),
    prisma.candidate.findMany({ orderBy: { name: "asc" } }),
    prisma.job.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  async function createInterview(formData: FormData) {
    "use server";
    const candidateId = formData.get("candidateId") as string;
    const jobId = formData.get("jobId") as string;
    const scheduled = formData.get("scheduledAt") as string;
    const mode = (formData.get("mode") as string) || "phone";
    const notes = (formData.get("notes") as string) || null;
    if (!candidateId || !jobId || !scheduled) return;

    await prisma.interview.create({
      data: {
        candidateId,
        jobId,
        scheduledAt: new Date(scheduled),
        mode,
        notes,
      },
    });
    revalidatePath("/dashboard/interviews");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Interviews</h2>
        <form action={createInterview} className="flex gap-2">
          <select name="candidateId" className="px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800">
            <option value="">Candidate</option>
            {candidates.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select name="jobId" className="px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800">
            <option value="">Job</option>
            {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
          </select>
          <input type="datetime-local" name="scheduledAt" className="px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800" />
          <select name="mode" className="px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800">
            <option value="phone">phone</option>
            <option value="video">video</option>
          </select>
          <input name="notes" placeholder="notes" className="px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 w-48" />
          <button className="px-4 py-2 rounded-md bg-violet-600 hover:bg-violet-500 text-white">Add</button>
        </form>
      </div>

      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60">
        <table className="w-full text-sm">
          <thead className="text-zinc-400">
            <tr className="[&>th]:px-4 [&>th]:py-3 text-left">
              <th>When</th><th>Candidate</th><th>Job</th><th>Mode</th><th>Result</th><th>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {interviews.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-zinc-500">No interviews. Use “Add”.</td></tr>
            ) : interviews.map(i => (
              <tr key={i.id} className="[&>td]:px-4 [&>td]:py-3">
                <td className="text-zinc-400">{new Date(i.scheduledAt).toLocaleString()}</td>
                <td>{candidates.find(c => c.id === i.candidateId)?.name ?? "—"}</td>
                <td>{jobs.find(j => j.id === i.jobId)?.title ?? "—"}</td>
                <td className="text-zinc-400">{i.mode}</td>
                <td className="text-zinc-400">{i.result ?? "—"}</td>
                <td className="text-right text-zinc-400">—</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
