"use client";

import type { Application, JobListing } from "@/data/types";
import type { Screen } from "./EmployerSidebar";

function formatDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function fitBadgeColor(score: number): string {
  if (score >= 85) return "bg-[#059669] text-white";
  if (score >= 70) return "bg-[#F4A942] text-white";
  return "bg-[#9CA3AF] text-white";
}

function timeAgo(dateStr: string): string {
  const now = new Date("2026-03-22T12:00:00");
  const then = new Date(dateStr + "T00:00:00");
  const days = Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return formatDate(dateStr);
}

export default function DashboardHome({
  facilityName,
  jobs,
  apps,
  onNavigate,
}: {
  facilityName: string;
  jobs: JobListing[];
  apps: Application[];
  onNavigate: (s: Screen) => void;
}) {
  const activePostings = jobs.filter((j) => j.status === "active").length;
  const candidatesInQueue = apps.filter(
    (a) => a.status === "new" || a.status === "reviewing"
  ).length;
  const interviewsSent = apps.filter((a) => a.status === "interview").length;

  const recentApps = [...apps]
    .sort((a, b) => b.appliedDate.localeCompare(a.appliedDate))
    .slice(0, 6);

  const stats = [
    {
      label: "Active Postings",
      value: activePostings,
      color: "#7BA68E",
      bg: "#ECFDF5",
    },
    {
      label: "Candidates in Queue",
      value: candidatesInQueue,
      color: "#8B8FD4",
      bg: "#EEEEF9",
    },
    {
      label: "Interview Requests Sent",
      value: interviewsSent,
      color: "#E97D6B",
      bg: "#FEF2F0",
    },
  ];

  return (
    <div>
      {/* Welcome header */}
      <div className="mb-8">
        <h1
          className="text-2xl sm:text-3xl font-extrabold"
          style={{ color: "#1E1E2E" }}
        >
          Welcome back, {facilityName}
        </h1>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
          Here&apos;s what&apos;s happening with your hiring pipeline.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: "white",
              borderColor: "#E4E4EC",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold mb-3"
              style={{ background: s.bg, color: s.color }}
            >
              {s.value}
            </div>
            <div
              className="text-2xl font-extrabold mb-1"
              style={{ color: "#1E1E2E" }}
            >
              {s.value}
            </div>
            <div className="text-sm font-medium" style={{ color: "#6B7280" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Recent activity feed */}
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-lg font-extrabold"
          style={{ color: "#1E1E2E" }}
        >
          Recent Activity
        </h2>
        <button
          onClick={() => onNavigate("candidates")}
          className="text-sm font-bold hover:underline"
          style={{ color: "#8B8FD4" }}
        >
          View All Candidates
        </button>
      </div>

      <div
        className="rounded-2xl border overflow-hidden"
        style={{ background: "white", borderColor: "#E4E4EC" }}
      >
        {recentApps.length === 0 ? (
          <div className="p-8 text-center" style={{ color: "#9CA3AF" }}>
            No recent applications yet.
          </div>
        ) : (
          recentApps.map((app, i) => (
            <div
              key={app.id}
              className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-[#FAFAFE]"
              style={{
                borderBottom:
                  i < recentApps.length - 1 ? "1px solid #F0F0F5" : "none",
              }}
            >
              {/* Initials avatar */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                style={{ background: "#8B8FD4" }}
              >
                {app.nurseName
                  ? app.nurseName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                  : "?"}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="text-sm font-bold"
                    style={{ color: "#1E1E2E" }}
                  >
                    {app.nurseName || "Unknown Candidate"}
                  </span>
                  {app.fitScore && (
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${fitBadgeColor(
                        app.fitScore
                      )}`}
                    >
                      {app.fitScore}% Fit
                    </span>
                  )}
                </div>
                <div className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
                  Applied for{" "}
                  <span className="font-semibold">{app.jobTitle}</span>
                </div>
              </div>

              <div
                className="text-xs font-medium flex-shrink-0"
                style={{ color: "#9CA3AF" }}
              >
                {timeAgo(app.appliedDate)}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick action */}
      <div className="mt-6">
        <button
          onClick={() => onNavigate("post-job")}
          className="rounded-full px-6 py-3 text-sm font-bold text-white transition-colors hover:opacity-90"
          style={{ background: "#8B8FD4" }}
        >
          + Post a New Job
        </button>
      </div>
    </div>
  );
}
