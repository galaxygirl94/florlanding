"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { seedJobs } from "@/data/seed-jobs";
import { seedApplications } from "@/data/seed-applications";
import { seedInterviews } from "@/data/seed-interviews";
import { seedNotifications } from "@/data/seed-notifications";

export default function EmployerDashboardPage() {
  const { user } = useAuth();
  const facilityName = user?.facilityName || "Your Facility";

  const myJobs = seedJobs.filter((j) => j.facilityId === user?.facilityId);
  const myApps = seedApplications.filter((a) => myJobs.some((j) => j.id === a.jobId));
  const myInterviews = seedInterviews.filter((i) => i.employerId === user?.id);
  const myNotifs = seedNotifications.filter((n) => n.userId === user?.id && !n.read);

  const stats = [
    { label: "Active Jobs", value: myJobs.filter((j) => j.status === "published").length, color: "bg-periwinkle-50 text-periwinkle", link: "/employer/jobs" },
    { label: "Total Applicants", value: myApps.length, color: "bg-blue-50 text-blue-600", link: "/employer/pipeline" },
    { label: "Interviews", value: myInterviews.filter((i) => i.status === "confirmed" || i.status === "requested").length, color: "bg-amber/10 text-amber-dark", link: "/employer/interviews" },
    { label: "Unread Notifications", value: myNotifs.length, color: "bg-green-50 text-green-600", link: "#" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="animate-fade-in-up">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Welcome back, {user?.firstName}</h1>
          <p className="text-text-light mt-1 text-sm">{facilityName} — Employer Dashboard</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Link key={stat.label} href={stat.link}>
              <div className={`${stat.color} rounded-2xl p-5 text-center hover:opacity-80 transition-opacity`}>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm font-medium mt-1">{stat.label}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Link href="/employer/jobs/new">
            <div className="bg-white rounded-2xl card-shadow p-6 hover:card-shadow-hover transition-all cursor-pointer group">
              <div className="text-2xl mb-3">+</div>
              <h3 className="font-bold text-base group-hover:text-periwinkle transition-colors">Post a New Job</h3>
              <p className="text-sm text-text-light mt-1">Create a new job listing for nurses</p>
            </div>
          </Link>
          <Link href="/employer/pipeline">
            <div className="bg-white rounded-2xl card-shadow p-6 hover:card-shadow-hover transition-all cursor-pointer group">
              <div className="text-2xl mb-3">📋</div>
              <h3 className="font-bold text-base group-hover:text-periwinkle transition-colors">View Pipeline</h3>
              <p className="text-sm text-text-light mt-1">Manage applicants across all your jobs</p>
            </div>
          </Link>
          <Link href="/employer/interviews">
            <div className="bg-white rounded-2xl card-shadow p-6 hover:card-shadow-hover transition-all cursor-pointer group">
              <div className="text-2xl mb-3">📅</div>
              <h3 className="font-bold text-base group-hover:text-periwinkle transition-colors">Interviews</h3>
              <p className="text-sm text-text-light mt-1">Schedule and manage interviews</p>
            </div>
          </Link>
        </div>

        {/* Recent applications */}
        <div className="bg-white rounded-2xl card-shadow p-5 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Recent Applications</h2>
            <Link href="/employer/pipeline" className="text-sm font-semibold text-periwinkle hover:text-periwinkle-dark">
              View all &rarr;
            </Link>
          </div>
          {myApps.length === 0 ? (
            <p className="text-sm text-text-light py-4 text-center">No applications yet. Post a job to start receiving applications.</p>
          ) : (
            <div className="space-y-3">
              {myApps.slice(0, 5).map((app) => (
                <div key={app.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border border-periwinkle-100 rounded-xl p-4">
                  <div>
                    <p className="font-semibold text-sm">{app.nurseName}</p>
                    <p className="text-xs text-text-light">{app.jobTitle} · {app.nurseSpecialty} · {app.nurseYearsExperience}yr exp</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full self-start ${
                    app.status === "applied" ? "bg-blue-100 text-blue-700" :
                    app.status === "screening" ? "bg-amber/20 text-amber-dark" :
                    app.status === "interview_scheduled" ? "bg-periwinkle-100 text-periwinkle-dark" :
                    app.status === "offer_extended" ? "bg-green-100 text-green-700" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    {app.status.replace(/_/g, " ")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
