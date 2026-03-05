"use client";

import Link from "next/link";
import { seedApplications } from "@/data/seed-applications";
import { ApplicationStatus } from "@/data/types";

const STATUS_CONFIG: Record<string, { label: string; color: string; step: number }> = {
  applied: { label: "Applied", color: "bg-blue-100 text-blue-700", step: 1 },
  viewed: { label: "Viewed", color: "bg-blue-100 text-blue-700", step: 2 },
  screening: { label: "Screening", color: "bg-amber/20 text-amber-dark", step: 3 },
  interview_requested: { label: "Interview Requested", color: "bg-periwinkle-100 text-periwinkle-dark", step: 4 },
  interview_scheduled: { label: "Interview Scheduled", color: "bg-periwinkle-100 text-periwinkle-dark", step: 5 },
  interview_completed: { label: "Interview Completed", color: "bg-periwinkle-100 text-periwinkle-dark", step: 6 },
  offer_extended: { label: "Offer Extended", color: "bg-green-100 text-green-700", step: 7 },
  offer_accepted: { label: "Offer Accepted", color: "bg-green-100 text-green-700", step: 8 },
  offer_declined: { label: "Offer Declined", color: "bg-red-100 text-red-700", step: 7 },
  hired: { label: "Hired!", color: "bg-green-200 text-green-800", step: 9 },
  rejected: { label: "Not Selected", color: "bg-gray-100 text-gray-600", step: 0 },
};

const PIPELINE_STEPS = [
  "Applied",
  "Screening",
  "Interview",
  "Offer",
  "Hired",
];

function getProgressStep(status: ApplicationStatus): number {
  if (status === "applied" || status === "viewed") return 1;
  if (status === "screening") return 2;
  if (status === "interview_requested" || status === "interview_scheduled" || status === "interview_completed") return 3;
  if (status === "offer_extended" || status === "offer_accepted" || status === "offer_declined") return 4;
  if (status === "hired") return 5;
  return 0;
}

export default function TrackerPage() {
  // For demo, show a nurse's applications
  const nurseApps = seedApplications.filter((a) => ["nurse-1", "nurse-3", "nurse-5"].includes(a.nurseId));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="animate-fade-in-up">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Application Tracker</h1>
        <p className="text-text-light mb-6 sm:mb-8 text-sm sm:text-base">
          Track the status of your job applications in one place.
        </p>

        {/* Pipeline overview */}
        <div className="bg-white rounded-2xl card-shadow p-5 sm:p-6 mb-6 sm:mb-8">
          <div className="hidden sm:flex items-center justify-between">
            {PIPELINE_STEPS.map((step, i) => {
              const appsAtStep = nurseApps.filter((a) => getProgressStep(a.status) === i + 1).length;
              return (
                <div key={step} className="flex items-center">
                  <div className="text-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold mx-auto ${
                      appsAtStep > 0 ? "bg-periwinkle text-white" : "bg-periwinkle-50 text-text-light"
                    }`}>
                      {appsAtStep}
                    </div>
                    <div className="mt-2 text-sm font-semibold">{step}</div>
                  </div>
                  {i < PIPELINE_STEPS.length - 1 && (
                    <div className="w-16 lg:w-24 h-0.5 bg-periwinkle-100 mx-3 lg:mx-4" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile: vertical steps */}
          <div className="sm:hidden space-y-4">
            {PIPELINE_STEPS.map((step, i) => {
              const appsAtStep = nurseApps.filter((a) => getProgressStep(a.status) === i + 1).length;
              return (
                <div key={step}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      appsAtStep > 0 ? "bg-periwinkle text-white" : "bg-periwinkle-50 text-text-light"
                    }`}>
                      {appsAtStep}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{step}</div>
                      <div className="text-xs text-text-light">{appsAtStep} application{appsAtStep !== 1 ? "s" : ""}</div>
                    </div>
                  </div>
                  {i < PIPELINE_STEPS.length - 1 && (
                    <div className="ml-5 w-0.5 h-4 bg-periwinkle-100" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Application cards */}
        <div className="space-y-4">
          {nurseApps.map((app, i) => {
            const config = STATUS_CONFIG[app.status] || STATUS_CONFIG.applied;
            const progress = getProgressStep(app.status);
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
                    {config.label}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((step) => (
                      <div
                        key={step}
                        className={`h-1.5 rounded-full flex-1 ${
                          step <= progress ? "bg-periwinkle" : "bg-periwinkle-100"
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

                {/* Interview action for nurse */}
                {app.status === "interview_requested" && (
                  <div className="mt-3 pt-3 border-t border-periwinkle-100 flex gap-2">
                    <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors min-h-[44px]">
                      Confirm Interview
                    </button>
                    <button className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-red-100 transition-colors min-h-[44px]">
                      Decline
                    </button>
                  </div>
                )}

                {app.status === "offer_extended" && (
                  <div className="mt-3 pt-3 border-t border-periwinkle-100">
                    <div className="bg-green-50 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <p className="text-sm font-medium text-green-700">You have an offer from {app.facilityName}!</p>
                      <div className="flex gap-2">
                        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors min-h-[44px]">
                          Accept
                        </button>
                        <button className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-red-100 transition-colors min-h-[44px]">
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
