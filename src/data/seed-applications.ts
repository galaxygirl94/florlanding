import { Application } from "./types";

export const seedApplications: Application[] = [
  {
    id: "app-1",
    jobId: "job-1",
    jobTitle: "Med Surg RN — Day Center",
    facilityName: "PACE Organization of Rhode Island",
    status: "viewed",
    appliedDate: "2026-02-25",
    lastUpdate: "2026-02-27",
  },
  {
    id: "app-2",
    jobId: "job-2",
    jobTitle: "ICU RN — Intensive Care Unit",
    facilityName: "Brown University Health",
    status: "applied",
    appliedDate: "2026-03-01",
    lastUpdate: "2026-03-01",
  },
  {
    id: "app-3",
    jobId: "job-3",
    jobTitle: "Pediatric RN — Inpatient Pediatrics",
    facilityName: "Hasbro Children's Hospital",
    status: "responded",
    appliedDate: "2026-02-20",
    lastUpdate: "2026-03-03",
  },
];
