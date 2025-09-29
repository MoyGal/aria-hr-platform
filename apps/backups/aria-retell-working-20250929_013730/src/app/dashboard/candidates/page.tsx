import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function Page() {
  const candidates = await prisma.candidate.findMany({
    orderBy: { createdAt: "desc" },
  });

  async function createCandidate(formData: FormData) {
    "use server";
    const name = (formData.get("name") as string)?.trim();
    const email = (formData.get("email") as string)?.trim() || null;
    const phone = (formData.get("phone") as string)?.trim() || null;
    if (!name) return;
    try {
      await prisma.candidate.create({
        data: { name, email, phone, status: "ACTIVE" },
      });
    } catch { /* ignore duplicates for now */ }
    revalidatePath("/dashboard/candidates");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Candidates</h2>
        <form action={createCandidate} className="flex gap-2">
          <input name="name" placeholder="Full name" className="px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800" />
          <input name="email" placeholder="Email (optional)" className="px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800" />
          <input name="phone" placeholder="Phone (optional)" className="px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800" />
          <button className="px-4 py-2 rounded-md bg-violet-600 hover:bg-violet-500 text-white">Add</button>
        </form>
      </div>

      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60">
        <table className="w-full text-sm">
          <thead className="text-zinc-400">
            <tr className="[&>th]:px-4 [&>th]:py-3 text-left">
              <th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Created</th><th>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {candidates.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-zinc-500">No candidates yet. Use “Add”.</td></tr>
            ) : candidates.map(c => (
              <tr key={c.id} className="[&>td]:px-4 [&>td]:py-3">
                <td>{c.name}</td>
                <td className="text-zinc-400">{c.email ?? "—"}</td>
                <td className="text-zinc-400">{c.phone ?? "—"}</td>
                <td><span className="text-emerald-400">{c.status}</span></td>
                <td className="text-zinc-400">{new Date(c.createdAt).toLocaleString()}</td>
                <td className="text-right text-zinc-400">—</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
