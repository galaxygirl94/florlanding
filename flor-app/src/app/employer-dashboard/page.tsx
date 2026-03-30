"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { JobPostingRow, InterviewRequestRow } from "@/data/types";

function EmployerDashboardContent() {
  const searchParams = useSearchParams();
  const employerId = searchParams.get("id") ?? "";

  const [jobs, setJobs] = useState<JobPostingRow[]>([]);
  const [requests, setRequests] = useState<InterviewRequestRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!employerId) { setLoading(false); return; }
    async function load() {
      const [jobsRes, reqRes] = await Promise.all([
        supabase.from("job_postings").select("*").eq("employer_id", employerId).order("created_at", { ascending: false }),
        supabase.from("interview_requests").select("*").eq("employer_id", employerId).order("created_at", { ascending: false }),
      ]);
      setJobs(jobsRes.data ?? []);
      setRequests(reqRes.data ?? []);
      setLoading(false);
    }
    load();
  }, [employerId]);

  async function handleInterviewAction(id: string, status: "confirmed" | "declined") {
    await fetch("/api/interview-request", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-offwhite flex items-center justify-center">
        <div className="text-text-light text-sm">Loading dashboard…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-offwhite">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-text">Employer dashboard</h1>
            <p className="text-text-light text-sm mt-0.5">Manage your job postings and nurse connections.</p>
          </div>
          <Link
            href={`/post-job${employerId ? `?employer_id=${employerId}` : ""}`}
            className="bg-periwinkle text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-periwinkle-dark transition-colors"
          >
            + Post a job
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Active postings", value: jobs.filter((j) => j.status === "published").length },
            { label: "Interview requests sent", value: requests.length },
            { label: "Pending responses", value: requests.filter((r) => r.status === "pending").length },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-xl card-shadow px-5 py-4">
              <p className="text-2xl font-bold text-periwinkle">{value}</p>
              <p className="text-xs text-text-light mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Job postings */}
          <div>
            <h2 className="text-base font-bold text-text mb-3">Your job postings</h2>
            {jobs.length === 0 ? (
              <div className="bg-white rounded-xl card-shadow p-6 text-center">
                <p className="text-text-light text-sm mb-3">No jobs posted yet.</p>
                <Link
                  href={`/post-job${employerId ? `?employer_id=${employerId}` : ""}`}
                  className="text-periwinkle text-sm font-semibold hover:underline"
                >
                  Post your first job →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {jobs.map((job) => (
                  <div key={job.id} className="bg-white rounded-xl card-shadow px-4 py-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-text text-sm">{job.title}</p>
                        <p className="text-xs text-text-light mt-0.5">
                          {job.specialty_required} · {job.employment_type} · ${job.pay_min}–${job.pay_max}/{job.pay_type === "hourly" ? "hr" : "yr"}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          job.status === "published"
                            ? "bg-green-100 text-green-700"
                            : job.status === "draft"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interview requests */}
          <div>
            <h2 className="text-base font-bold text-text mb-3">Interview requests</h2>
            {requests.length === 0 ? (
              <div className="bg-white rounded-xl card-shadow p-6 text-center">
                <p className="text-text-light text-sm">No interview requests yet.</p>
                <p className="text-xs text-text-light mt-1">Browse nurse profiles to send requests.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map((req) => (
                  <div key={req.id} className="bg-white rounded-xl card-shadow px-4 py-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-semibold text-text">Nurse ID: {req.nurse_id.slice(0, 8)}…</p>
                        {req.job_id && <p className="text-xs text-text-light">Re: job {req.job_id.slice(0, 8)}…</p>}
                      </div>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          req.status === "pending"
                            ? "bg-amber-100 text-amber-700"
                            : req.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>
                    {req.message && <p className="text-xs text-text-light italic mb-2">&ldquo;{req.message}&rdquo;</p>}
                    {req.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleInterviewAction(req.id!, "confirmed")}
                          className="flex-1 text-xs bg-green-50 text-green-700 border border-green-200 rounded-lg py-1.5 font-semibold hover:bg-green-100 transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleInterviewAction(req.id!, "declined")}
                          className="flex-1 text-xs bg-red-50 text-red-700 border border-red-200 rounded-lg py-1.5 font-semibold hover:bg-red-100 transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Nurse matches — stub */}
        <div className="mt-6">
          <h2 className="text-base font-bold text-text mb-3">Nurse matches <span className="text-xs font-normal text-text-light">(coming soon)</span></h2>
          <div className="bg-white rounded-xl card-shadow p-6 text-center">
            <p className="text-text-light text-sm">Nurse matches and interest signals will appear here once your job is live.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EmployerDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-offwhite flex items-center justify-center"><div className="text-text-light text-sm">Loading…</div></div>}>
      <EmployerDashboardContent />
    </Suspense>
  );
}
