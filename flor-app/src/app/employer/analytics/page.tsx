"use client";

import { useAuth } from "@/contexts/AuthContext";
import { seedJobs } from "@/data/seed-jobs";
import { seedApplications } from "@/data/seed-applications";
import { seedInterviews } from "@/data/seed-interviews";

export default function AnalyticsPage() {
  const { user } = useAuth();
  const myJobs = seedJobs.filter((j) => j.facilityId === user?.facilityId);
  const myJobIds = myJobs.map((j) => j.id);
  const myApps = seedApplications.filter((a) => myJobIds.includes(a.jobId));
  const myInterviews = seedInterviews.filter((i) => myJobIds.includes(i.jobId));

  const totalApplicants = myApps.length;
  const interviewsScheduled = myInterviews.filter((i) => i.status === "confirmed" || i.status === "requested").length;
  const interviewsCompleted = myInterviews.filter((i) => i.status === "completed").length;
  const offersExtended = myApps.filter((a) => a.status === "offer_extended" || a.status === "offer_accepted").length;
  const hired = myApps.filter((a) => a.status === "hired").length;
  const conversionRate = totalApplicants > 0 ? Math.round((interviewsCompleted / totalApplicants) * 100) : 0;

  const platformStats = [
    { label: "Total Applicants", value: totalApplicants },
    { label: "Interviews Scheduled", value: interviewsScheduled },
    { label: "Interviews Completed", value: interviewsCompleted },
    { label: "Offers Extended", value: offersExtended },
    { label: "Positions Filled", value: hired },
    { label: "Interview Conversion", value: `${conversionRate}%` },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="animate-fade-in-up">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Hiring Dashboard & Analytics</h1>
          <p className="text-text-light mt-1 text-sm">{user?.facilityName} — overview of your hiring activity</p>
        </div>

        {/* Platform-wide stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {platformStats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl card-shadow p-4 text-center">
              <div className="text-2xl font-bold text-periwinkle">{stat.value}</div>
              <div className="text-xs text-text-light mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Per-job metrics */}
        <div className="bg-white rounded-2xl card-shadow p-5 sm:p-8 mb-6">
          <h2 className="text-lg font-bold mb-4">Metrics by Job</h2>
          {myJobs.length === 0 ? (
            <p className="text-sm text-text-light text-center py-4">No jobs to show. Post a job to see metrics.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-periwinkle-100">
                    <th className="text-left py-3 px-2 text-xs font-semibold text-text-light uppercase tracking-wider">Job Title</th>
                    <th className="text-center py-3 px-2 text-xs font-semibold text-text-light uppercase tracking-wider">Status</th>
                    <th className="text-center py-3 px-2 text-xs font-semibold text-text-light uppercase tracking-wider">Applicants</th>
                    <th className="text-center py-3 px-2 text-xs font-semibold text-text-light uppercase tracking-wider">Interviews</th>
                    <th className="text-center py-3 px-2 text-xs font-semibold text-text-light uppercase tracking-wider">Offers</th>
                    <th className="text-center py-3 px-2 text-xs font-semibold text-text-light uppercase tracking-wider">Filled</th>
                  </tr>
                </thead>
                <tbody>
                  {myJobs.map((job) => {
                    const jobApps = myApps.filter((a) => a.jobId === job.id);
                    const jobInterviews = myInterviews.filter((i) => i.jobId === job.id);
                    const jobOffers = jobApps.filter((a) => ["offer_extended", "offer_accepted"].includes(a.status));
                    const jobHired = jobApps.filter((a) => a.status === "hired");
                    return (
                      <tr key={job.id} className="border-b border-periwinkle-50">
                        <td className="py-3 px-2">
                          <p className="font-medium">{job.title}</p>
                          <p className="text-xs text-text-light">{job.location.city}, {job.location.state}</p>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            job.status === "published" ? "bg-green-100 text-green-700" :
                            job.status === "draft" ? "bg-gray-100 text-gray-600" :
                            job.status === "filled" ? "bg-periwinkle-100 text-periwinkle-dark" :
                            "bg-red-100 text-red-700"
                          }`}>{job.status}</span>
                        </td>
                        <td className="py-3 px-2 text-center font-semibold">{jobApps.length}</td>
                        <td className="py-3 px-2 text-center font-semibold">{jobInterviews.length}</td>
                        <td className="py-3 px-2 text-center font-semibold">{jobOffers.length}</td>
                        <td className="py-3 px-2 text-center font-semibold">{jobHired.length}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Application volume bar chart (visual representation) */}
        <div className="bg-white rounded-2xl card-shadow p-5 sm:p-8">
          <h2 className="text-lg font-bold mb-4">Application Volume by Job</h2>
          <div className="space-y-4">
            {myJobs.map((job) => {
              const count = myApps.filter((a) => a.jobId === job.id).length;
              const maxCount = Math.max(...myJobs.map((j) => myApps.filter((a) => a.jobId === j.id).length), 1);
              const pct = (count / maxCount) * 100;
              return (
                <div key={job.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium truncate mr-4">{job.title}</span>
                    <span className="text-sm font-bold text-periwinkle">{count}</span>
                  </div>
                  <div className="w-full bg-periwinkle-50 rounded-full h-3">
                    <div className="bg-periwinkle rounded-full h-3 transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
