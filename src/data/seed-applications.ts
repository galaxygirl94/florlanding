import { Application } from "./types";

export const seedApplications: Application[] = [
  {
    id: "app-1",
    jobId: "job-1",
    jobTitle: "CNA - Day Center",
    facilityName: "PACE Organization of Rhode Island",
    status: "viewed",
    appliedDate: "2026-02-25",
    lastUpdate: "2026-02-27",
  },
  {
    id: "app-2",
    jobId: "job-2",
    jobTitle: "Registered Nurse - Outpatient Behavioral Health",
    facilityName: "Brown University Health / Gateway Healthcare",
    status: "applied",
    appliedDate: "2026-03-01",
    lastUpdate: "2026-03-01",
  },
  {
    id: "app-3",
    jobId: "job-3",
    jobTitle: "Registered Nurse - Inpatient Operating Room",
    facilityName: "Rhode Island Hospital (Brown University Health)",
    status: "responded",
    appliedDate: "2026-02-20",
    lastUpdate: "2026-03-03",
  },
];
