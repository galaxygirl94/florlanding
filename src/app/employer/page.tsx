"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { seedJobs } from "@/data/seed-jobs";
import { seedFacilities } from "@/data/seed-facilities";
import { employerApplications } from "@/data/seed-applications";
import { demoNurses } from "@/data/demo-nurses";
import type { Application, Interview, JobListing, NurseProfile } from "@/data/types";

/* ── Constants ────────────────────────────────────────────────────── */

const TABS = ["Post & Manage Jobs", "Applicant Pipeline", "Interview Scheduling", "Hiring Dashboard"] as const;
type Tab = (typeof TABS)[number];

const PIPELINE_STAGES = ["new", "reviewing", "interview", "offer", "hired"] as const;
type PipelineStage = (typeof PIPELINE_STAGES)[number];

const STAGE_LABELS: Record<PipelineStage | "passed", string> = {
  new: "New",
  reviewing: "Reviewing",
  interview: "Interview",
  offer: "Offer",
  hired: "Hired",
  passed: "Passed",
};

const STATUS_BADGE: Record<string, string> = {
  active: "bg-success-light text-success",
  paused: "bg-amber/10 text-amber",
  closed: "bg-gray-100 text-text-muted",
  draft: "bg-periwinkle-50 text-periwinkle-dark",
};

const STATUS_LABEL: Record<string, string> = {
  active: "Active",
  paused: "Paused",
  closed: "Closed",
  draft: "Draft",
};

/* ── Helpers ──────────────────────────────────────────────────────── */

function nurseById(id?: string): NurseProfile | undefined {
  return demoNurses.find((n) => n.id === id);
}

function fitScoreColor(score: number): string {
  if (score >= 80) return "bg-success text-white";
  if (score >= 60) return "bg-amber text-white";
  return "bg-text-muted text-white";
}

function fitScoreBarColor(score: number): string {
  if (score >= 80) return "bg-success";
  if (score >= 60) return "bg-amber";
  return "bg-text-muted";
}

function formatDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/* ── Seed interviews ─────────────────────────────────────────────── */

const SEED_INTERVIEWS: Interview[] = [
  {
    id: "int-1",
    applicationId: "eapp-1",
    jobId: "job-bayside-medsurg",
    nurseId: "demo-sarah",
    nurseName: "Sarah Chen",
    date: "2026-03-12",
    time: "10:00",
    duration: 45,
    notes: "Panel interview with unit manager and charge nurse",
    status: "scheduled",
  },
  {
    id: "int-2",
    applicationId: "eapp-9",
    jobId: "job-osp-rn",
    nurseId: "nurse-4",
    nurseName: "Emily Rodriguez",
    date: "2026-03-11",
    time: "14:00",
    duration: 30,
    notes: "Phone screen with practice manager",
    status: "scheduled",
  },
  {
    id: "int-3",
    applicationId: "eapp-12",
    jobId: "job-6",
    nurseId: "nurse-5",
    nurseName: "James Okonkwo",
    date: "2026-03-08",
    time: "09:00",
    duration: 60,
    notes: "In-person clinical interview",
    status: "completed",
  },
  {
    id: "int-4",
    applicationId: "eapp-8",
    jobId: "job-narr-rehab",
    nurseId: "nurse-7",
    nurseName: "David Chen",
    date: "2026-03-13",
    time: "11:00",
    duration: 30,
    notes: "Virtual interview via Teams",
    status: "scheduled",
  },
];

/* ── Component ────────────────────────────────────────────────────── */

export default function EmployerDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("Post & Manage Jobs");
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>("all");

  /* Pipeline state persisted to localStorage */
  const [pipelineApps, setPipelineApps] = useState<Application[]>(employerApplications);
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);
  const [pipelineJobFilter, setPipelineJobFilter] = useState<string>("all");

  /* Jobs with local overrides */
  const [jobs, setJobs] = useState<JobListing[]>(seedJobs);

  /* Interview state */
  const [interviews, setInterviews] = useState<Interview[]>(SEED_INTERVIEWS);
  const [intForm, setIntForm] = useState({ applicantId: "", date: "", time: "", duration: "30", notes: "" });

  /* ── localStorage hydration ─────────────────────────────────────── */

  useEffect(() => {
    try {
      const saved = localStorage.getItem("flor-employer-pipeline");
      if (saved) setPipelineApps(JSON.parse(saved));
      const savedJobs = localStorage.getItem("flor-employer-jobs");
      if (savedJobs) setJobs(JSON.parse(savedJobs));
      const savedInts = localStorage.getItem("flor-employer-interviews");
      if (savedInts) setInterviews(JSON.parse(savedInts));
    } catch { /* ignore parse errors */ }
  }, []);

  const persistPipeline = useCallback((apps: Application[]) => {
    setPipelineApps(apps);
    localStorage.setItem("flor-employer-pipeline", JSON.stringify(apps));
  }, []);

  const persistJobs = useCallback((j: JobListing[]) => {
    setJobs(j);
    localStorage.setItem("flor-employer-jobs", JSON.stringify(j));
  }, []);

  const persistInterviews = useCallback((ints: Interview[]) => {
    setInterviews(ints);
    localStorage.setItem("flor-employer-interviews", JSON.stringify(ints));
  }, []);

  /* ── Derived data ───────────────────────────────────────────────── */

  const facilityJobs = selectedFacilityId === "all" ? jobs : jobs.filter((j) => j.facilityId === selectedFacilityId);
  const facilityJobIds = new Set(facilityJobs.map((j) => j.id));
  const facilityApps = pipelineApps.filter((a) => facilityJobIds.has(a.jobId));

  const pipelineFilteredApps =
    pipelineJobFilter === "all" ? facilityApps : facilityApps.filter((a) => a.jobId === pipelineJobFilter);

  /* ── Actions ────────────────────────────────────────────────────── */

  function moveAppTo(appId: string, newStatus: Application["status"]) {
    const updated = pipelineApps.map((a) =>
      a.id === appId ? { ...a, status: newStatus, lastUpdate: new Date().toISOString().slice(0, 10) } : a,
    );
    persistPipeline(updated);
  }

  function toggleJobStatus(jobId: string, newStatus: "active" | "paused" | "closed") {
    persistJobs(jobs.map((j) => (j.id === jobId ? { ...j, status: newStatus } : j)));
  }

  function duplicateJob(job: JobListing) {
    const dup: JobListing = {
      ...job,
      id: `job-dup-${Date.now()}`,
      title: `${job.title} (Copy)`,
      status: "draft",
      postedDate: new Date().toISOString().slice(0, 10),
      applicantCount: 0,
    };
    persistJobs([dup, ...jobs]);
  }

  function scheduleInterview() {
    if (!intForm.applicantId || !intForm.date || !intForm.time) return;
    const app = pipelineApps.find((a) => a.id === intForm.applicantId);
    if (!app) return;
    const newInt: Interview = {
      id: `int-${Date.now()}`,
      applicationId: intForm.applicantId,
      jobId: app.jobId,
      nurseId: app.nurseId || "",
      nurseName: app.nurseName || "Unknown",
      date: intForm.date,
      time: intForm.time,
      duration: Number(intForm.duration),
      notes: intForm.notes,
      status: "scheduled",
    };
    persistInterviews([...interviews, newInt]);
    setIntForm({ applicantId: "", date: "", time: "", duration: "30", notes: "" });
  }

  /* ── Render ─────────────────────────────────────────────────────── */

  return (
    <div className="min-h-screen bg-[#FAFAFE]">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-8 sm:py-12">
        <div className="animate-fade-in-up">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-text">Employer Dashboard</h1>
              <p className="text-text-light mt-1">Manage your jobs, applicants, and hiring pipeline</p>
            </div>
            <select
              value={selectedFacilityId}
              onChange={(e) => setSelectedFacilityId(e.target.value)}
              className="w-full sm:w-72 rounded-xl border border-periwinkle-100/60 bg-white px-4 py-3 text-sm font-medium text-text focus:outline-none focus:ring-2 focus:ring-periwinkle/40"
            >
              <option value="all">All Facilities</option>
              {seedFacilities.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tab navigation */}
          <div className="flex flex-wrap gap-2 mb-8">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-periwinkle text-white shadow-md"
                    : "bg-white text-text-light border border-periwinkle-100/40 hover:border-periwinkle/40 hover:text-periwinkle"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === "Post & Manage Jobs" && (
            <TabJobs
              jobs={facilityJobs}
              apps={facilityApps}
              onToggleStatus={toggleJobStatus}
              onDuplicate={duplicateJob}
            />
          )}
          {activeTab === "Applicant Pipeline" && (
            <TabPipeline
              apps={pipelineFilteredApps}
              allApps={facilityApps}
              jobs={facilityJobs}
              jobFilter={pipelineJobFilter}
              onJobFilterChange={setPipelineJobFilter}
              expandedAppId={expandedAppId}
              onToggleExpand={(id) => setExpandedAppId(expandedAppId === id ? null : id)}
              onMoveApp={moveAppTo}
            />
          )}
          {activeTab === "Interview Scheduling" && (
            <TabInterviews
              interviews={interviews.filter((i) => facilityJobIds.has(i.jobId))}
              apps={facilityApps}
              form={intForm}
              onFormChange={setIntForm}
              onSchedule={scheduleInterview}
            />
          )}
          {activeTab === "Hiring Dashboard" && (
            <TabHiringDashboard jobs={facilityJobs} apps={facilityApps} interviews={interviews.filter((i) => facilityJobIds.has(i.jobId))} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TAB 1 — POST & MANAGE JOBS
   ═══════════════════════════════════════════════════════════════════ */

function TabJobs({
  jobs,
  apps,
  onToggleStatus,
  onDuplicate,
}: {
  jobs: JobListing[];
  apps: Application[];
  onToggleStatus: (id: string, s: "active" | "paused" | "closed") => void;
  onDuplicate: (j: JobListing) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-extrabold text-text">Jobs ({jobs.length})</h2>
        <Link
          href="/employer/post"
          className="bg-periwinkle hover:bg-periwinkle-dark text-white rounded-full px-8 py-3 font-bold text-sm transition-colors"
        >
          + Post New Job
        </Link>
      </div>

      {jobs.length === 0 && (
        <div className="bg-white rounded-2xl border border-periwinkle-100/40 section-shadow p-12 text-center">
          <p className="text-text-muted mb-4">No jobs posted for this facility yet.</p>
          <Link href="/employer/post" className="text-periwinkle font-bold hover:underline">
            Post your first job
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {jobs.map((job) => {
          const status = job.status || "active";
          const appCount = apps.filter((a) => a.jobId === job.id).length;
          return (
            <div
              key={job.id}
              className="bg-white rounded-2xl border border-periwinkle-100/40 section-shadow p-5 sm:p-6 hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-lg font-bold text-text">{job.title}</h3>
                    <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${STATUS_BADGE[status]}`}>
                      {STATUS_LABEL[status]}
                    </span>
                  </div>
                  <p className="text-sm text-text-muted mt-1">{job.facilityName}</p>
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-text-light">
                    {job.specialty && (
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-periwinkle" />
                        {job.specialty}
                      </span>
                    )}
                    <span>${job.payRange.min}–${job.payRange.max}/{job.payUnit}</span>
                    <span>Posted {formatDate(job.postedDate)}</span>
                    <span className="font-bold text-periwinkle">{appCount} applicant{appCount !== 1 ? "s" : ""}</span>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button className="rounded-full px-4 py-2 text-xs font-bold border border-periwinkle-100/60 text-text-light hover:border-periwinkle hover:text-periwinkle transition-colors">
                    Edit
                  </button>
                  {status === "active" ? (
                    <button
                      onClick={() => onToggleStatus(job.id, "paused")}
                      className="rounded-full px-4 py-2 text-xs font-bold border border-amber/30 text-amber hover:bg-amber/10 transition-colors"
                    >
                      Pause
                    </button>
                  ) : status === "paused" ? (
                    <button
                      onClick={() => onToggleStatus(job.id, "active")}
                      className="rounded-full px-4 py-2 text-xs font-bold border border-success/30 text-success hover:bg-success-light transition-colors"
                    >
                      Unpause
                    </button>
                  ) : null}
                  {status !== "closed" && (
                    <button
                      onClick={() => onToggleStatus(job.id, "closed")}
                      className="rounded-full px-4 py-2 text-xs font-bold border border-danger/30 text-danger hover:bg-danger-light transition-colors"
                    >
                      Close
                    </button>
                  )}
                  <button
                    onClick={() => onDuplicate(job)}
                    className="rounded-full px-4 py-2 text-xs font-bold border border-periwinkle-100/60 text-text-light hover:border-periwinkle hover:text-periwinkle transition-colors"
                  >
                    Duplicate
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TAB 2 — APPLICANT PIPELINE
   ═══════════════════════════════════════════════════════════════════ */

function TabPipeline({
  apps,
  allApps,
  jobs,
  jobFilter,
  onJobFilterChange,
  expandedAppId,
  onToggleExpand,
  onMoveApp,
}: {
  apps: Application[];
  allApps: Application[];
  jobs: JobListing[];
  jobFilter: string;
  onJobFilterChange: (v: string) => void;
  expandedAppId: string | null;
  onToggleExpand: (id: string) => void;
  onMoveApp: (id: string, status: Application["status"]) => void;
}) {
  const jobsWithApps = jobs.filter((j) => allApps.some((a) => a.jobId === j.id));

  return (
    <div>
      {/* Job filter */}
      <div className="mb-6">
        <select
          value={jobFilter}
          onChange={(e) => onJobFilterChange(e.target.value)}
          className="w-full sm:w-80 rounded-xl border border-periwinkle-100/60 bg-white px-4 py-3 text-sm font-medium text-text focus:outline-none focus:ring-2 focus:ring-periwinkle/40"
        >
          <option value="all">All Jobs</option>
          {jobsWithApps.map((j) => (
            <option key={j.id} value={j.id}>
              {j.title} — {j.facilityName}
            </option>
          ))}
        </select>
      </div>

      {/* Pipeline columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {([...PIPELINE_STAGES, "passed"] as const).map((stage) => {
          const stageApps = apps.filter((a) => a.status === stage);
          return (
            <div key={stage} className="min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-sm font-extrabold text-text uppercase tracking-wide">{STAGE_LABELS[stage]}</h3>
                <span className="rounded-full bg-periwinkle-50 text-periwinkle-dark text-xs font-bold px-2 py-0.5">
                  {stageApps.length}
                </span>
              </div>
              <div className="space-y-3">
                {stageApps.map((app) => (
                  <ApplicantCard
                    key={app.id}
                    app={app}
                    expanded={expandedAppId === app.id}
                    onToggle={() => onToggleExpand(app.id)}
                    onMove={onMoveApp}
                    currentStage={stage}
                  />
                ))}
                {stageApps.length === 0 && (
                  <div className="rounded-xl border-2 border-dashed border-periwinkle-100/40 p-4 text-center text-xs text-text-muted">
                    No applicants
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Applicant Card ───────────────────────────────────────────────── */

function ApplicantCard({
  app,
  expanded,
  onToggle,
  onMove,
  currentStage,
}: {
  app: Application;
  expanded: boolean;
  onToggle: () => void;
  onMove: (id: string, status: Application["status"]) => void;
  currentStage: string;
}) {
  const nurse = nurseById(app.nurseId);
  const fitScore = app.fitScore ?? 0;
  const stageIdx = PIPELINE_STAGES.indexOf(currentStage as PipelineStage);
  const nextStage = stageIdx >= 0 && stageIdx < PIPELINE_STAGES.length - 1 ? PIPELINE_STAGES[stageIdx + 1] : null;
  const prevStage = stageIdx > 0 ? PIPELINE_STAGES[stageIdx - 1] : null;

  /* Fit score breakdown (synthetic) */
  const breakdown = {
    Specialty: Math.min(100, fitScore + 2),
    Experience: Math.min(100, fitScore - 3),
    Certs: Math.min(100, fitScore + 5),
    Schedule: Math.min(100, fitScore - 8),
    Location: Math.min(100, fitScore + 1),
  };

  return (
    <div
      className="bg-white rounded-2xl border border-periwinkle-100/40 section-shadow p-4 cursor-pointer hover:-translate-y-0.5 transition-all duration-300"
      onClick={onToggle}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-text truncate">{app.nurseName}</p>
          {nurse && (
            <p className="text-xs text-text-muted mt-0.5 truncate">{nurse.specialties?.[0] || "—"}</p>
          )}
          {nurse && (
            <p className="text-xs text-text-muted">{nurse.yearsOfExperience} yrs exp</p>
          )}
        </div>
        {/* Fit Score circle */}
        <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${fitScoreColor(fitScore)}`}>
          <span className="text-sm font-extrabold">{fitScore}</span>
        </div>
      </div>

      {/* License badge */}
      {nurse && (
        <div className="mt-2">
          {nurse.licenses?.[0]?.verified ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-success">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
              </svg>
              License Verified
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-text-muted">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              Pending
            </span>
          )}
        </div>
      )}

      <p className="text-xs text-text-muted mt-2">{app.jobTitle}</p>

      {/* Expanded detail */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-periwinkle-100/40" onClick={(e) => e.stopPropagation()}>
          {nurse && (
            <div className="space-y-2 mb-4">
              <div className="text-xs text-text-light">
                <span className="font-bold">Specialties:</span> {nurse.specialties?.join(", ") || "—"}
              </div>
              <div className="text-xs text-text-light">
                <span className="font-bold">Certs:</span> {nurse.certifications?.join(", ") || "—"}
              </div>
              <div className="text-xs text-text-light">
                <span className="font-bold">EHR:</span> {nurse.ehrExperience?.join(", ") || "—"}
              </div>
              <div className="text-xs text-text-light">
                <span className="font-bold">Schedule:</span> {nurse.shiftPreferences?.join(", ") || "—"} / {nurse.scheduleTypes?.join(", ") || "—"}
              </div>
              <div className="text-xs text-text-light">
                <span className="font-bold">Location:</span> {nurse.locationCity}, {nurse.locationState}
              </div>
              {nurse.bio && (
                <p className="text-xs text-text-light italic mt-1">&quot;{nurse.bio}&quot;</p>
              )}
            </div>
          )}

          {/* Fit score breakdown */}
          <div className="mb-4">
            <p className="text-xs font-bold text-text mb-2">Fit Score Breakdown</p>
            <div className="space-y-1.5">
              {Object.entries(breakdown).map(([label, val]) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="text-[10px] text-text-muted w-16 text-right">{label}</span>
                  <div className="flex-1 h-2 bg-periwinkle-50 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${fitScoreBarColor(val)}`} style={{ width: `${val}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-text-light w-7">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {app.note && <p className="text-xs text-text-muted italic mb-3">{app.note}</p>}

          {/* Stage actions */}
          <div className="flex flex-wrap gap-2">
            {nextStage && currentStage !== "passed" && (
              <button
                onClick={() => onMove(app.id, nextStage)}
                className="rounded-full px-3 py-1.5 text-xs font-bold bg-periwinkle text-white hover:bg-periwinkle-dark transition-colors"
              >
                Move to {STAGE_LABELS[nextStage]}
              </button>
            )}
            {prevStage && currentStage !== "passed" && (
              <button
                onClick={() => onMove(app.id, prevStage)}
                className="rounded-full px-3 py-1.5 text-xs font-bold border border-periwinkle-100/60 text-text-light hover:text-periwinkle transition-colors"
              >
                Back to {STAGE_LABELS[prevStage]}
              </button>
            )}
            {currentStage !== "passed" && currentStage !== "hired" && (
              <button
                onClick={() => onMove(app.id, "passed")}
                className="rounded-full px-3 py-1.5 text-xs font-bold border border-danger/30 text-danger hover:bg-danger-light transition-colors"
              >
                Pass
              </button>
            )}
            {currentStage === "passed" && (
              <button
                onClick={() => onMove(app.id, "new")}
                className="rounded-full px-3 py-1.5 text-xs font-bold bg-periwinkle text-white hover:bg-periwinkle-dark transition-colors"
              >
                Reopen
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TAB 3 — INTERVIEW SCHEDULING
   ═══════════════════════════════════════════════════════════════════ */

function TabInterviews({
  interviews,
  apps,
  form,
  onFormChange,
  onSchedule,
}: {
  interviews: Interview[];
  apps: Application[];
  form: { applicantId: string; date: string; time: string; duration: string; notes: string };
  onFormChange: (f: { applicantId: string; date: string; time: string; duration: string; notes: string }) => void;
  onSchedule: () => void;
}) {
  const upcoming = interviews.filter((i) => i.status === "scheduled").sort((a, b) => a.date.localeCompare(b.date));
  const past = interviews.filter((i) => i.status !== "scheduled").sort((a, b) => b.date.localeCompare(a.date));

  const eligibleApps = apps.filter((a) => ["reviewing", "interview", "new"].includes(a.status));

  return (
    <div className="space-y-8">
      {/* Schedule form */}
      <div className="bg-white rounded-2xl border border-periwinkle-100/40 section-shadow p-6">
        <h2 className="text-lg font-extrabold text-text mb-5">Schedule an Interview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold text-text-light mb-1.5">Applicant</label>
            <select
              value={form.applicantId}
              onChange={(e) => onFormChange({ ...form, applicantId: e.target.value })}
              className="w-full rounded-xl border border-periwinkle-100/60 bg-white px-4 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-periwinkle/40"
            >
              <option value="">Select applicant...</option>
              {eligibleApps.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nurseName} — {a.jobTitle}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-text-light mb-1.5">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => onFormChange({ ...form, date: e.target.value })}
              className="w-full rounded-xl border border-periwinkle-100/60 bg-white px-4 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-periwinkle/40"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-text-light mb-1.5">Time</label>
            <input
              type="time"
              value={form.time}
              onChange={(e) => onFormChange({ ...form, time: e.target.value })}
              className="w-full rounded-xl border border-periwinkle-100/60 bg-white px-4 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-periwinkle/40"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-text-light mb-1.5">Duration</label>
            <select
              value={form.duration}
              onChange={(e) => onFormChange({ ...form, duration: e.target.value })}
              className="w-full rounded-xl border border-periwinkle-100/60 bg-white px-4 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-periwinkle/40"
            >
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-xs font-bold text-text-light mb-1.5">Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => onFormChange({ ...form, notes: e.target.value })}
            rows={2}
            placeholder="Interview format, who will attend, any prep info..."
            className="w-full rounded-xl border border-periwinkle-100/60 bg-white px-4 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-periwinkle/40 resize-none"
          />
        </div>
        <button
          onClick={onSchedule}
          disabled={!form.applicantId || !form.date || !form.time}
          className="bg-periwinkle hover:bg-periwinkle-dark disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-full px-8 py-3 font-bold text-sm transition-colors"
        >
          Schedule Interview
        </button>
      </div>

      {/* Upcoming */}
      <div>
        <h2 className="text-lg font-extrabold text-text mb-4">Upcoming Interviews ({upcoming.length})</h2>
        {upcoming.length === 0 ? (
          <p className="text-sm text-text-muted">No upcoming interviews.</p>
        ) : (
          <div className="space-y-3">
            {upcoming.map((int) => (
              <InterviewCard key={int.id} interview={int} />
            ))}
          </div>
        )}
      </div>

      {/* Past */}
      {past.length > 0 && (
        <div>
          <h2 className="text-lg font-extrabold text-text mb-4">Past Interviews ({past.length})</h2>
          <div className="space-y-3">
            {past.map((int) => (
              <InterviewCard key={int.id} interview={int} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InterviewCard({ interview }: { interview: Interview }) {
  const isUpcoming = interview.status === "scheduled";
  return (
    <div className={`bg-white rounded-2xl border border-periwinkle-100/40 section-shadow p-5 ${!isUpcoming ? "opacity-70" : ""}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-text">{interview.nurseName}</p>
          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-text-light">
            <span>{formatDate(interview.date)}</span>
            <span>{interview.time}</span>
            <span>{interview.duration} min</span>
            <span className={`rounded-full px-2.5 py-1 font-bold ${isUpcoming ? "bg-periwinkle-50 text-periwinkle-dark" : "bg-success-light text-success"}`}>
              {isUpcoming ? "Scheduled" : "Completed"}
            </span>
          </div>
        </div>
      </div>
      {interview.notes && <p className="text-xs text-text-muted mt-2 italic">{interview.notes}</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TAB 4 — HIRING DASHBOARD
   ═══════════════════════════════════════════════════════════════════ */

function TabHiringDashboard({
  jobs,
  apps,
  interviews,
}: {
  jobs: JobListing[];
  apps: Application[];
  interviews: Interview[];
}) {
  const activeJobs = jobs.filter((j) => (j.status || "active") === "active").length;
  const totalApplicants = apps.length;
  const scheduledInterviews = interviews.filter((i) => i.status === "scheduled").length;
  const hires = apps.filter((a) => a.status === "hired").length;

  const stats = [
    { label: "Active Jobs", value: activeJobs, color: "text-periwinkle" },
    { label: "Total Applicants", value: totalApplicants, color: "text-info" },
    { label: "Interviews Scheduled", value: scheduledInterviews, color: "text-amber" },
    { label: "Hires Made", value: hires, color: "text-success" },
  ];

  return (
    <div>
      {/* Overview stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-periwinkle-100/40 section-shadow p-5 text-center">
            <p className={`text-3xl sm:text-4xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-text-light mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Per-job stats */}
      <h2 className="text-lg font-extrabold text-text mb-4">Per-Job Breakdown</h2>
      <div className="space-y-3">
        {jobs.map((job) => {
          const jobApps = apps.filter((a) => a.jobId === job.id);
          const avgFit = jobApps.length > 0
            ? Math.round(jobApps.reduce((sum, a) => sum + (a.fitScore || 0), 0) / jobApps.length)
            : 0;
          const status = job.status || "active";

          return (
            <div key={job.id} className="bg-white rounded-2xl border border-periwinkle-100/40 section-shadow p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-sm font-bold text-text">{job.title}</h3>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_BADGE[status]}`}>
                      {STATUS_LABEL[status]}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mt-1">{job.facilityName}</p>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="text-lg font-extrabold text-text">{jobApps.length}</p>
                    <p className="text-xs text-text-muted">Applicants</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-lg font-extrabold ${avgFit >= 80 ? "text-success" : avgFit >= 60 ? "text-amber" : "text-text-muted"}`}>
                      {avgFit > 0 ? avgFit : "—"}
                    </p>
                    <p className="text-xs text-text-muted">Avg Fit</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-extrabold text-periwinkle">
                      {jobApps.filter((a) => a.status === "hired").length}
                    </p>
                    <p className="text-xs text-text-muted">Hired</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
