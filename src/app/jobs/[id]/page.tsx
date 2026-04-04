import Link from "next/link";
import { seedJobs } from "@/data/seed-jobs";
import { seedFacilities } from "@/data/seed-facilities";
import JobDetailClient from "@/components/JobDetailClient";

export function generateStaticParams() {
  return seedJobs.map((job) => ({ id: job.id }));
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = seedJobs.find((j) => j.id === id);

  if (!job) {
    return (
      <div className="min-h-screen bg-[#F4F4FB] flex items-center justify-center px-6">
        <div className="text-center max-w-md animate-fade-in-up">
          {/* Flower icon */}
          <div className="flex justify-center mb-8">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="text-periwinkle">
              <circle cx="32" cy="32" r="8" fill="currentColor" opacity="0.9" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                <ellipse
                  key={i}
                  cx="32"
                  cy="16"
                  rx="5"
                  ry="10"
                  fill="currentColor"
                  opacity="0.35"
                  transform={`rotate(${deg} 32 32)`}
                />
              ))}
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E1E2E] mb-4 leading-tight" style={{ fontFamily: "var(--font-display)" }}>
            This position has been filled
          </h1>
          <p className="text-base text-[#6B7280] leading-relaxed mb-8">
            We remove listings within 48 hours of a hire — which means this one just went to a great nurse. Check what&apos;s still available:
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/jobs"
              className="bg-[#8B8FD4] hover:bg-[#7175C0] text-white font-bold px-8 py-4 rounded-full text-base transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-center"
            >
              Browse open positions →
            </Link>
          </div>
          <p className="mt-6 text-sm text-[#9CA3AF]">
            Want to be notified when similar roles open?{" "}
            <Link href="/jobs" className="text-[#8B8FD4] font-semibold hover:underline">
              Set up a job alert →
            </Link>
          </p>
        </div>
      </div>
    );
  }

  const facility = seedFacilities.find((f) => f.id === job.facilityId) ?? null;

  return <JobDetailClient job={job} facility={facility} />;
}
