import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs, addDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { revalidatePath } from "next/cache";

// Importamos los nuevos componentes de la tabla desde shadcn/ui
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Jobs</h2>
        <form action={createJob} className="flex gap-2">
          {/* Aquí podríamos usar componentes de shadcn como <Input> y <Button> más adelante */}
          <input name="title" placeholder="Job title" className="px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800" required />
          <input name="location" placeholder="Location" className="px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800" />
          <input name="description" placeholder="Short description" className="px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 w-64" />
          <button className="px-4 py-2 rounded-md bg-violet-600 hover:bg-violet-500 text-white">Add</button>
        </form>
      </div>

      {/* REEMPLAZAMOS LA TABLA HTML POR EL COMPONENTE DE SHADCN */}
      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No jobs yet. Use “Add”.
                </TableCell>
              </TableRow>
            ) : jobs.map(j => (
              <TableRow key={j.id}>
                <TableCell className="font-medium">{j.title}</TableCell>
                <TableCell>{j.location ?? "—"}</TableCell>
                <TableCell><span className="text-emerald-500">{j.status}</span></TableCell>
                <TableCell>{j.createdAt ? j.createdAt.toDate().toLocaleString() : 'N/A'}</TableCell>
                <TableCell className="text-right">—</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}