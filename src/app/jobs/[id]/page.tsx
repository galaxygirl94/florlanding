import Link from "next/link";
import { seedJobs } from "@/data/seed-jobs";
import JobDetailClient from "@/components/JobDetailClient";

export function generateStaticParams() {
  return seedJobs.map((job) => ({ id: job.id }));
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = seedJobs.find((j) => j.id === id);

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Job not found</h1>
        <Link href="/jobs" className="text-periwinkle hover:underline">Back to listings</Link>
      </div>
    );
  }

  return <JobDetailClient job={job} />;
}
