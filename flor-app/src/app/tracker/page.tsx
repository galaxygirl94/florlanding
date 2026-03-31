"use client";

import Link from "next/link";
import { seedApplications } from "@/data/seed-applications";
import { Application } from "@/data/types";

const STAGES: { key: Application["status"]; label: string }[] = [
  { key: "applied", label: "Applied" },
  { key: "under-review", label: "Under Review" },
  { key: "viewed", label: "Viewed" },
  { key: "interview", label: "Interview" },
  { key: "offer", label: "Offer" },
];

const STATUS_COLORS: Record<Application["status"], string> = {
  applied: "bg-blue-100 text-blue-700",
  "under-review": "bg-purple-100 text-purple-700",
  viewed: "bg-amber/20 text-amber-dark",
  interview: "bg-green-100 text-green-700",
  offer: "bg-emerald-100 text-emerald-700",
};

function StageBar({ status }: { status: Application["status"] }) {
  const currentIdx = STAGES.findIndex((s) => s.key === status);
  return (
    <div className="flex items-center gap-1 mt-3">
      {STAGES.map((stage, i) => (
        <div key={stage.key} className="flex items-center gap-1 flex-1">
          <div
            className={`h-1.5 rounded-full w-full transition-all ${
              i <= currentIdx ? "bg-periwinkle" : "bg-periwinkle-100"
            }`}
          />
        </div>
      ))}
    </div>
  );
}

export default function TrackerPage() {
  const attentionApps = seedApplications.filter((a) => a.needsAttention);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="animate-fade-in-up">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1">Application Tracker</h1>
        <p className="text-text-light mb-6 sm:mb-8 text-sm sm:text-base">
          {seedApplications.length} active application{seedApplications.length !== 1 ? "s" : ""}
        </p>

        {/* Needs attention banner */}
        {attentionApps.length > 0 && (
          <div className="bg-amber/10 border border-amber/30 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber/20 flex items-center justify-center flex-shrink-0">
              <span className="text-amber-dark text-sm">!</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-dark mb-1">
                {attentionApps.length} application{attentionApps.length !== 1 ? "s" : ""} need{attentionApps.length === 1 ? "s" : ""} your attention
              </p>
              <p className="text-xs text-text-light">
                {attentionApps.map((a) => a.facilityName).join(" · ")}
              </p>
            </div>
          </div>
        )}

        {/* Stage summary */}
        <div className="bg-white rounded-2xl card-shadow p-5 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-sm font-semibold text-text-light uppercase tracking-wider mb-4">Pipeline</h2>
          <div className="hidden sm:flex items-center justify-between">
            {STAGES.map((stage, i) => {
              const count = seedApplications.filter((a) => a.status === stage.key).length;
              const isActive = count > 0;
              return (
                <div key={stage.key} className="flex items-center flex-1">
                  <div className="flex-1 text-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-1.5 ${isActive ? "bg-periwinkle text-white" : "bg-periwinkle-50 text-periwinkle-dark"}`}>
                      {count}
                    </div>
                    <div className={`text-xs font-medium ${isActive ? "text-text" : "text-text-light"}`}>{stage.label}</div>
                  </div>
                  {i < STAGES.length - 1 && (
                    <div className="w-8 h-0.5 bg-periwinkle-100 mx-1 flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
          {/* Mobile */}
          <div className="sm:hidden space-y-2">
            {STAGES.map((stage) => {
              const count = seedApplications.filter((a) => a.status === stage.key).length;
              if (count === 0) return null;
              return (
                <div key={stage.key} className="flex items-center justify-between text-sm">
                  <span className="text-text-light">{stage.label}</span>
                  <span className="font-semibold text-periwinkle">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Applications list */}
        <div className="space-y-4">
          {seedApplications.map((app) => (
            <div
              key={app.id}
              className={`bg-white rounded-2xl card-shadow p-5 sm:p-6 ${app.needsAttention ? "ring-2 ring-amber/40" : ""}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[app.status]}`}>
                      {STAGES.find((s) => s.key === app.status)?.label}
                    </span>
                    {app.needsAttention && (
                      <span className="text-xs font-semibold bg-amber/20 text-amber-dark px-2.5 py-1 rounded-full">
                        Needs attention
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-base text-text">{app.jobTitle}</h3>
                  <p className="text-sm text-text-light mt-0.5">{app.facilityName} · {app.location}</p>
                </div>
                <div className="flex-shrink-0 text-right sm:text-right">
                  <div className="text-sm font-semibold text-text">{app.payDisplay}</div>
                  <div className="text-xs text-text-light">Applied {app.appliedDaysAgo}d ago</div>
                  <div className="mt-1">
                    <div className="inline-flex items-center gap-1 bg-periwinkle-50 rounded-lg px-2.5 py-1">
                      <span className="text-sm font-bold text-periwinkle">{app.florFit}%</span>
                      <span className="text-[10px] text-periwinkle-dark">Flor Fit</span>
                    </div>
                  </div>
                </div>
              </div>

              <StageBar status={app.status} />

              <p className="text-xs text-text-light mt-3 italic">{app.statusMessage}</p>

              <div className="mt-4 flex gap-3">
                <Link
                  href={`/jobs/${app.jobId}`}
                  className="text-xs font-semibold text-periwinkle hover:underline"
                >
                  View listing →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/jobs" className="bg-periwinkle text-white font-bold px-8 py-4 rounded-full text-base hover:bg-periwinkle-dark transition-colors">
            Browse more jobs
          </Link>
        </div>
      </div>
    </div>
  );
}
