"use client";

import { useState } from "react";
import { seedJobs } from "@/data/seed-jobs";
import { seedFacilities } from "@/data/seed-facilities";
import EmployerSidebar, { type Screen } from "@/components/employer/EmployerSidebar";
import DashboardHome from "@/components/employer/DashboardHome";
import CandidateQueue from "@/components/employer/CandidateQueue";
import PostJobWizard from "@/components/employer/PostJobWizard";
import ActivePostings from "@/components/employer/ActivePostings";
import MessagesPlaceholder from "@/components/employer/MessagesPlaceholder";
import FacilityProfileEditor from "@/components/employer/FacilityProfileEditor";

const DEFAULT_FACILITY = seedFacilities.find((f) => f.id === "facility-bayside") || seedFacilities[0];
const facilityJobs = seedJobs.filter((j) => j.facilityId === DEFAULT_FACILITY.id);
const facilityApps: import("@/data/types").Application[] = [];

export default function EmployerDashboardPage() {
  const [screen, setScreen] = useState<Screen>("dashboard");

  return (
    <div className="flex min-h-[calc(100vh-64px)]" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
      <EmployerSidebar active={screen} onChange={setScreen} />

      <main className="flex-1 bg-[#FAFAFE] p-6 sm:p-8 lg:p-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {screen === "dashboard" && (
            <DashboardHome
              facilityName={DEFAULT_FACILITY.name}
              jobs={facilityJobs}
              apps={facilityApps}
              onNavigate={setScreen}
            />
          )}
          {screen === "candidates" && (
            <CandidateQueue jobs={facilityJobs} apps={facilityApps} />
          )}
          {screen === "post-job" && <PostJobWizard onComplete={() => setScreen("postings")} />}
          {screen === "postings" && (
            <ActivePostings
              jobs={facilityJobs}
              apps={facilityApps}
              onNavigate={setScreen}
            />
          )}
          {screen === "messages" && <MessagesPlaceholder />}
          {screen === "facility" && <FacilityProfileEditor />}
        </div>
      </main>
    </div>
  );
}
