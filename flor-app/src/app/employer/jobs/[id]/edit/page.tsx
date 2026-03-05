"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { seedJobs } from "@/data/seed-jobs";

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "closed", label: "Closed" },
  { value: "filled", label: "Filled" },
];

export default function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const job = seedJobs.find((j) => j.id === id);
  const [saved, setSaved] = useState(false);
  const [jobStatus, setJobStatus] = useState(job?.status || "draft");

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Job not found</h1>
        <Link href="/employer/jobs" className="text-periwinkle hover:underline">Back to My Jobs</Link>
      </div>
    );
  }

  if (saved) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 py-16 text-center animate-fade-in-up">
        <div className="bg-white rounded-2xl card-shadow p-8">
          <div className="text-4xl mb-4">✓</div>
          <h2 className="text-xl font-bold mb-2">Changes Saved</h2>
          <p className="text-text-light text-sm">Your job listing has been updated.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="animate-fade-in-up">
        <div className="mb-6">
          <Link href="/employer/jobs" className="text-sm text-periwinkle hover:underline">&larr; Back to My Jobs</Link>
          <h1 className="text-2xl sm:text-3xl font-bold mt-2">Edit: {job.title}</h1>
          <p className="text-text-light mt-1 text-sm">{job.facilityName}</p>
        </div>

        <div className="space-y-6">
          {/* Status Management */}
          <section className="bg-white rounded-2xl card-shadow p-5 sm:p-8">
            <h2 className="text-lg font-bold mb-4">Job Status</h2>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setJobStatus(s.value as typeof jobStatus)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors min-h-[44px] ${
                    jobStatus === s.value
                      ? "bg-periwinkle text-white"
                      : "bg-periwinkle-50 text-text-light hover:bg-periwinkle-100"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </section>

          {/* Current Details (read-only summary) */}
          <section className="bg-white rounded-2xl card-shadow p-5 sm:p-8">
            <h2 className="text-lg font-bold mb-4">Current Details</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-periwinkle-50 pb-2">
                <span className="text-text-light">Title</span>
                <span className="font-medium">{job.title}</span>
              </div>
              <div className="flex justify-between border-b border-periwinkle-50 pb-2">
                <span className="text-text-light">Location</span>
                <span className="font-medium">{job.location.city}, {job.location.state}</span>
              </div>
              <div className="flex justify-between border-b border-periwinkle-50 pb-2">
                <span className="text-text-light">Pay Range</span>
                <span className="font-medium">${job.payRange.min}-${job.payRange.max}/{job.payUnit}</span>
              </div>
              <div className="flex justify-between border-b border-periwinkle-50 pb-2">
                <span className="text-text-light">Schedule</span>
                <span className="font-medium">{job.scheduleType}</span>
              </div>
              <div className="flex justify-between border-b border-periwinkle-50 pb-2">
                <span className="text-text-light">License</span>
                <span className="font-medium">{job.licenseRequired.state} {job.licenseRequired.type}</span>
              </div>
              <div className="flex justify-between border-b border-periwinkle-50 pb-2">
                <span className="text-text-light">Type</span>
                <span className="font-medium">{job.type}</span>
              </div>
              {job.specialty && (
                <div className="flex justify-between border-b border-periwinkle-50 pb-2">
                  <span className="text-text-light">Specialty</span>
                  <span className="font-medium">{job.specialty}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-text-light">Posted</span>
                <span className="font-medium">{job.postedDate}</span>
              </div>
            </div>
          </section>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => { setSaved(true); setTimeout(() => router.push("/employer/jobs"), 1500); }}
              className="flex-1 bg-amber hover:bg-amber-dark text-white font-bold py-4 rounded-full text-base transition-colors shadow-lg shadow-amber/25 min-h-[44px]"
            >
              Save Changes
            </button>
            <Link
              href="/employer/jobs"
              className="flex-1 bg-white border border-periwinkle-100 text-text-light font-semibold py-4 rounded-full text-base text-center hover:border-periwinkle hover:text-periwinkle transition-colors min-h-[44px]"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
