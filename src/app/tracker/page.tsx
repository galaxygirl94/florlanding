"use client";

import Link from "next/link";
import { seedApplications } from "@/data/seed-applications";

const STATUS_CONFIG = {
  applied: {
    label: "Applied",
    color: "bg-info/10 text-info",
    dotColor: "bg-info",
    step: 1,
  },
  viewed: {
    label: "Viewed",
    color: "bg-amber/15 text-amber-dark",
    dotColor: "bg-amber",
    step: 2,
  },
  responded: {
    label: "Responded",
    color: "bg-success-light text-success",
    dotColor: "bg-success",
    step: 3,
  },
};

export default function TrackerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text mb-2">Application Tracker</h1>
        <p className="text-text-light mb-8 sm:mb-10 text-sm sm:text-base leading-relaxed">
          Track the status of your applications in real time. No more wondering.
        </p>

        {/* Status summary */}
        <div className="bg-white rounded-2xl section-shadow p-5 sm:p-6 mb-8 sm:mb-10">
          {/* Desktop: horizontal steps */}
          <div className="hidden sm:flex items-center justify-between">
            {(["applied", "viewed", "responded"] as const).map((status, i) => {
              const config = STATUS_CONFIG[status];
              const count = seedApplications.filter((a) => a.status === status).length;
              return (
                <div key={status} className="flex items-center">
                  <div className="text-center">
                    <div className={`w-14 h-14 rounded-2xl ${config.color} flex items-center justify-center mx-auto mb-2`}>
                      <div className="text-center">
                        <div className="text-lg font-extrabold">{count}</div>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-text">{config.label}</div>
                  </div>
                  {i < 2 && (
                    <div className="w-16 lg:w-24 h-0.5 bg-periwinkle-100 mx-4 lg:mx-6 rounded-full" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile: vertical steps */}
          <div className="sm:hidden space-y-4">
            {(["applied", "viewed", "responded"] as const).map((status, i) => {
              const config = STATUS_CONFIG[status];
              const count = seedApplications.filter((a) => a.status === status).length;
              return (
                <div key={status}>
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl ${config.color} flex items-center justify-center flex-shrink-0`}>
                      <span className="text-base font-extrabold">{count}</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-text">{config.label}</div>
                      <div className="text-xs text-text-muted">{count} application{count !== 1 ? "s" : ""}</div>
                    </div>
                  </div>
                  {i < 2 && (
                    <div className="ml-5 w-0.5 h-4 bg-periwinkle-100 rounded-full" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Application cards */}
        <div className="space-y-4 sm:space-y-5">
          {seedApplications.map((app, i) => {
            const config = STATUS_CONFIG[app.status];
            return (
              <div
                key={app.id}
                className={`bg-white rounded-2xl section-shadow p-5 sm:p-6 hover:-translate-y-0.5 transition-all duration-300 ${
                  i === 0 ? "animate-fade-in-up" : i === 1 ? "animate-fade-in-up-delay-1" : "animate-fade-in-up-delay-2"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/jobs/${app.jobId}`}
                      className="text-base sm:text-lg font-bold hover:text-periwinkle transition-colors"
                    >
                      {app.jobTitle}
                    </Link>
                    <p className="text-sm text-text-muted mt-0.5 truncate">{app.facilityName}</p>
                  </div>
                  <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold self-start ${config.color}`}>
                    <span className={`w-2 h-2 rounded-full ${config.dotColor}`} />
                    {config.label}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex gap-1.5">
                    {[1, 2, 3].map((step) => (
                      <div
                        key={step}
                        className={`h-2 rounded-full flex-1 transition-all duration-500 ${
                          step <= config.step ? "bg-periwinkle" : "bg-periwinkle-50"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-3.5 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-text-muted">
                  <span>Applied: {app.appliedDate}</span>
                  <span className="hidden sm:inline text-periwinkle-100">|</span>
                  <span>Last update: {app.lastUpdate}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
