"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { seedJobs } from "@/data/seed-jobs";
import { seedApplications } from "@/data/seed-applications";

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600",
  published: "bg-green-100 text-green-700",
  closed: "bg-red-100 text-red-700",
  filled: "bg-periwinkle-100 text-periwinkle-dark",
};

export default function EmployerJobsPage() {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState("all");

  const myJobs = seedJobs.filter((j) => j.facilityId === user?.facilityId);
  const filtered = statusFilter === "all" ? myJobs : myJobs.filter((j) => j.status === statusFilter);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="animate-fade-in-up">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">My Job Listings</h1>
            <p className="text-text-light mt-1 text-sm">Create, edit, and manage your job postings</p>
          </div>
          <Link
            href="/employer/jobs/new"
            className="bg-amber hover:bg-amber-dark text-white font-bold px-6 py-3 rounded-full text-sm transition-colors shadow-lg shadow-amber/25 text-center min-h-[44px]"
          >
            + Post New Job
          </Link>
        </div>

        {/* Status filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {["all", "published", "draft", "closed", "filled"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors min-h-[44px] ${
                statusFilter === s
                  ? "bg-periwinkle text-white"
                  : "bg-white border border-periwinkle-100 text-text-light hover:border-periwinkle"
              }`}
            >
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* Jobs list */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl card-shadow">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-lg font-bold mb-2">No jobs found</h3>
              <p className="text-text-light text-sm mb-4">Post your first job to start finding great nurses.</p>
              <Link href="/employer/jobs/new" className="text-periwinkle font-semibold hover:underline">
                Create a job listing &rarr;
              </Link>
            </div>
          ) : (
            filtered.map((job) => {
              const appCount = seedApplications.filter((a) => a.jobId === job.id).length;
              return (
                <div key={job.id} className="bg-white rounded-2xl card-shadow p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-bold">{job.title}</h3>
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${STATUS_COLORS[job.status]}`}>
                          {job.status}
                        </span>
                      </div>
                      <p className="text-sm text-text-light mt-1">
                        {job.location.city}, {job.location.state} · {job.type} · ${job.payRange.min}-${job.payRange.max}/{job.payUnit}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {job.scheduleBadges.slice(0, 3).map((b) => (
                          <span key={b} className="text-xs bg-periwinkle-50 text-periwinkle-dark px-2 py-0.5 rounded-full">{b}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 self-start">
                      <div className="text-center">
                        <div className="text-lg font-bold text-periwinkle">{appCount}</div>
                        <div className="text-[10px] text-text-light">applicants</div>
                      </div>
                      <Link
                        href={`/employer/jobs/${job.id}/edit`}
                        className="bg-periwinkle-50 text-periwinkle-dark px-4 py-2 rounded-full text-sm font-medium hover:bg-periwinkle-100 transition-colors min-h-[44px] flex items-center"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-periwinkle-100 flex flex-wrap gap-4 text-xs text-text-light">
                    <span>Posted: {job.postedDate}</span>
                    {job.specialty && <span>Specialty: {job.specialty}</span>}
                    {job.union && <span className="text-amber-dark font-medium">Union position</span>}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
