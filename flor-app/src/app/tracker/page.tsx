"use client";

import Link from "next/link";
import { seedApplications } from "@/data/seed-applications";

const STATUS_CONFIG = {
  applied: {
    label: "Applied",
    color: "bg-blue-100 text-blue-700",
    icon: "📤",
    step: 1,
  },
  viewed: {
    label: "Viewed",
    color: "bg-amber/20 text-amber-dark",
    icon: "👁️",
    step: 2,
  },
  responded: {
    label: "Responded",
    color: "bg-green-100 text-green-700",
    icon: "✉️",
    step: 3,
  },
};

export default function TrackerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="animate-fade-in-up">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Application Tracker</h1>
        <p className="text-text-light mb-6 sm:mb-8 text-sm sm:text-base">
          Track the status of your job applications in one place.
        </p>

        {/* Status summary - horizontal on desktop, vertical on mobile */}
        <div className="bg-white rounded-2xl card-shadow p-5 sm:p-6 mb-6 sm:mb-8">
          {/* Desktop: horizontal steps */}
          <div className="hidden sm:flex items-center justify-between">
            {(["applied", "viewed", "responded"] as const).map((status, i) => {
              const config = STATUS_CONFIG[status];
              const count = seedApplications.filter((a) => a.status === status).length;
              return (
                <div key={status} className="flex items-center">
                  <div className="text-center">
                    <div className={`w-12 h-12 rounded-full ${config.color} flex items-center justify-center text-xl mx-auto`}>
                      {config.icon}
                    </div>
                    <div className="mt-2 text-sm font-semibold">{config.label}</div>
                    <div className="text-xs text-text-light">{count} application{count !== 1 ? "s" : ""}</div>
                  </div>
                  {i < 2 && (
                    <div className="w-16 lg:w-24 h-0.5 bg-periwinkle-100 mx-3 lg:mx-4" />
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
                    <div className={`w-10 h-10 rounded-full ${config.color} flex items-center justify-center text-lg flex-shrink-0`}>
                      {config.icon}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{config.label}</div>
                      <div className="text-xs text-text-light">{count} application{count !== 1 ? "s" : ""}</div>
                    </div>
                  </div>
                  {i < 2 && (
                    <div className="ml-5 w-0.5 h-4 bg-periwinkle-100" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Application cards */}
        <div className="space-y-4">
          {seedApplications.map((app, i) => {
            const config = STATUS_CONFIG[app.status];
            return (
              <div
                key={app.id}
                className={`bg-white rounded-2xl card-shadow p-5 sm:p-6 ${
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
                    <p className="text-sm text-text-light mt-0.5 truncate">{app.facilityName}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium self-start ${config.color}`}>
                    <span>{config.icon}</span>
                    {config.label}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex gap-1.5">
                    {[1, 2, 3].map((step) => (
                      <div
                        key={step}
                        className={`h-1.5 rounded-full flex-1 ${
                          step <= config.step ? "bg-periwinkle" : "bg-periwinkle-100"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-text-light">
                  <span>Applied: {app.appliedDate}</span>
                  <span className="hidden sm:inline">·</span>
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
