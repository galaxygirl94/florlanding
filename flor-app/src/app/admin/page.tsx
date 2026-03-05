"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { seedJobs } from "@/data/seed-jobs";
import { seedFacilities } from "@/data/seed-facilities";
import { seedApplications } from "@/data/seed-applications";

const DEMO_EMPLOYERS = [
  { id: "employer-1", name: "Helen Crawford", facility: "Narragansett Elder Services", email: "employer@flor.com", approved: true, date: "2026-01-15" },
  { id: "employer-2", name: "Tom Rivera", facility: "Bay Coast Care Partners", email: "employer2@flor.com", approved: true, date: "2026-01-20" },
  { id: "employer-3", name: "Sandra Mitchell", facility: "Providence Continuum Care", email: "employer3@flor.com", approved: true, date: "2026-02-01" },
  { id: "employer-pending-1", name: "Karen White", facility: "Elmwood Health Group", email: "karen@elmwood.com", approved: false, date: "2026-03-04" },
  { id: "employer-pending-2", name: "Mike Torres", facility: "Aquidneck Community Care", email: "mike@aquidneck.com", approved: false, date: "2026-03-05" },
];

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [employers, setEmployers] = useState(DEMO_EMPLOYERS);
  const [activeTab, setActiveTab] = useState<"overview" | "employers" | "jobs" | "reports">("overview");

  const totalJobs = seedJobs.length;
  const publishedJobs = seedJobs.filter((j) => j.status === "published").length;
  const totalApps = seedApplications.length;
  const totalFacilities = seedFacilities.length;
  const pendingEmployers = employers.filter((e) => !e.approved);
  const approvedEmployers = employers.filter((e) => e.approved);

  const handleApprove = (id: string) => {
    setEmployers((prev) => prev.map((e) => e.id === id ? { ...e, approved: true } : e));
  };

  if (user?.role !== "admin") {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-text-light text-sm mb-4">You need admin access to view this page.</p>
        <Link href="/login" className="text-periwinkle hover:underline">Sign in as admin</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="animate-fade-in-up">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-text-light mt-1 text-sm">Manage employers, jobs, and platform activity</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(["overview", "employers", "jobs", "reports"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors min-h-[44px] ${
                activeTab === tab ? "bg-periwinkle text-white" : "bg-white border border-periwinkle-100 text-text-light hover:border-periwinkle"
              }`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl card-shadow p-5 text-center">
                <div className="text-3xl font-bold text-periwinkle">{totalJobs}</div>
                <div className="text-sm text-text-light mt-1">Total Jobs</div>
              </div>
              <div className="bg-white rounded-2xl card-shadow p-5 text-center">
                <div className="text-3xl font-bold text-green-600">{publishedJobs}</div>
                <div className="text-sm text-text-light mt-1">Published</div>
              </div>
              <div className="bg-white rounded-2xl card-shadow p-5 text-center">
                <div className="text-3xl font-bold text-amber-dark">{totalApps}</div>
                <div className="text-sm text-text-light mt-1">Applications</div>
              </div>
              <div className="bg-white rounded-2xl card-shadow p-5 text-center">
                <div className="text-3xl font-bold text-periwinkle">{totalFacilities}</div>
                <div className="text-sm text-text-light mt-1">Facilities</div>
              </div>
            </div>

            {/* Pending approvals */}
            {pendingEmployers.length > 0 && (
              <div className="bg-amber/10 rounded-2xl p-5 sm:p-6">
                <h2 className="text-lg font-bold text-amber-dark mb-4">
                  Pending Employer Approvals ({pendingEmployers.length})
                </h2>
                <div className="space-y-3">
                  {pendingEmployers.map((emp) => (
                    <div key={emp.id} className="bg-white rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <p className="font-semibold text-sm">{emp.name}</p>
                        <p className="text-xs text-text-light">{emp.facility} · {emp.email}</p>
                        <p className="text-xs text-text-light">Applied: {emp.date}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleApprove(emp.id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors min-h-[44px]">
                          Approve
                        </button>
                        <button className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-red-100 transition-colors min-h-[44px]">
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Employers Tab */}
        {activeTab === "employers" && (
          <div className="bg-white rounded-2xl card-shadow p-5 sm:p-8">
            <h2 className="text-lg font-bold mb-4">All Employers</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-periwinkle-100">
                    <th className="text-left py-3 px-2 text-xs font-semibold text-text-light uppercase">Contact</th>
                    <th className="text-left py-3 px-2 text-xs font-semibold text-text-light uppercase">Facility</th>
                    <th className="text-left py-3 px-2 text-xs font-semibold text-text-light uppercase">Email</th>
                    <th className="text-center py-3 px-2 text-xs font-semibold text-text-light uppercase">Status</th>
                    <th className="text-center py-3 px-2 text-xs font-semibold text-text-light uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employers.map((emp) => (
                    <tr key={emp.id} className="border-b border-periwinkle-50">
                      <td className="py-3 px-2 font-medium">{emp.name}</td>
                      <td className="py-3 px-2">{emp.facility}</td>
                      <td className="py-3 px-2 text-text-light">{emp.email}</td>
                      <td className="py-3 px-2 text-center">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          emp.approved ? "bg-green-100 text-green-700" : "bg-amber/20 text-amber-dark"
                        }`}>
                          {emp.approved ? "Approved" : "Pending"}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center">
                        {!emp.approved && (
                          <button onClick={() => handleApprove(emp.id)}
                            className="text-xs text-periwinkle hover:underline font-medium">
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === "jobs" && (
          <div className="bg-white rounded-2xl card-shadow p-5 sm:p-8">
            <h2 className="text-lg font-bold mb-4">All Job Listings</h2>
            <div className="space-y-3">
              {seedJobs.map((job) => (
                <div key={job.id} className="border border-periwinkle-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="font-semibold text-sm">{job.title}</p>
                    <p className="text-xs text-text-light">{job.facilityName} · {job.location.city}, {job.location.state}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      job.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                    }`}>{job.status}</span>
                    <Link href={`/jobs/${job.id}`} className="text-xs text-periwinkle hover:underline font-medium">View</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl card-shadow p-5 sm:p-8">
              <h2 className="text-lg font-bold mb-4">Platform Activity</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-periwinkle-50 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-periwinkle-dark mb-3">Applications by Status</h3>
                  <div className="space-y-2">
                    {["applied", "screening", "interview_requested", "interview_scheduled", "offer_extended", "hired"].map((status) => {
                      const count = seedApplications.filter((a) => a.status === status).length;
                      return (
                        <div key={status} className="flex items-center justify-between">
                          <span className="text-xs capitalize">{status.replace(/_/g, " ")}</span>
                          <span className="text-xs font-bold">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="bg-periwinkle-50 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-periwinkle-dark mb-3">Jobs by Facility</h3>
                  <div className="space-y-2">
                    {seedFacilities.map((f) => {
                      const count = seedJobs.filter((j) => j.facilityId === f.id).length;
                      return (
                        <div key={f.id} className="flex items-center justify-between">
                          <span className="text-xs truncate mr-2">{f.name}</span>
                          <span className="text-xs font-bold">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
