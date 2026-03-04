import { JobListing } from "./types";

export const seedJobs: JobListing[] = [
  {
    id: "job-1",
    facilityId: "facility-1",
    facilityName: "PACE Organization of Rhode Island",
    title: "CNA - Day Center",
    payRange: { min: 19, max: 22 },
    payUnit: "hr",
    payExplained:
      "$19/hr starting rate, up to $22/hr based on years of experience",
    type: "Full Time",
    location: { city: "Newport", state: "RI" },
    schedule: "Monday-Friday 7:30AM-3:00PM",
    scheduleType: "Days",
    scheduleBadges: ["Mon-Fri", "7:30AM-3:00PM", "No Weekends"],
    licenseRequired: { type: "CNA", state: "RI" },
    certificationsRequired: ["CPR Certification", "Driver's License"],
    preferredExperience:
      "1 year CNA experience, 1 year working with frail or elderly population",
    experienceRange: { min: 0, max: 3 },
    drivingRequired: true,
    union: false,
    postedDate: "2026-02-20",
    questions: [
      {
        id: "q1-1",
        question: "Is there a shift differential for picking up extra hours?",
        answer:
          "We offer overtime pay at 1.5x for any hours beyond your scheduled 37.5/week. We do not currently have a separate shift differential since this is a day-shift-only position.",
        answeredBy: "HR Team",
        answeredDate: "2026-02-22",
        askedDate: "2026-02-21",
      },
      {
        id: "q1-2",
        question: "What is the patient-to-CNA ratio at the day center?",
        answer:
          "We maintain a ratio of approximately 6-8 participants per CNA. Our PACE model emphasizes quality time with each participant.",
        answeredBy: "Day Center Director",
        answeredDate: "2026-02-25",
        askedDate: "2026-02-23",
      },
    ],
  },
  {
    id: "job-2",
    facilityId: "facility-2",
    facilityName: "Brown University Health / Gateway Healthcare",
    title: "Registered Nurse - Outpatient Behavioral Health",
    payRange: { min: 35.7, max: 71.4 },
    payUnit: "hr",
    payExplained:
      "Range reflects new grad through highly experienced RN. Starting rate determined at offer based on years of experience and prior behavioral health background.",
    type: "Full Time",
    hoursPerWeek: 40,
    location: { city: "Pawtucket", state: "RI" },
    schedule: "Monday-Friday, days, flexible",
    scheduleType: "Days",
    scheduleBadges: ["Mon-Fri", "Days", "Flexible"],
    licenseRequired: { type: "RN", state: "RI" },
    certificationsRequired: [],
    drivingRequired: true,
    ehrSystem: "LifeChart",
    specialty: "Behavioral Health",
    union: false,
    note: "Behavioral health specialty certification required within 2 years of hire",
    experienceRange: { min: 0, max: 15 },
    postedDate: "2026-02-18",
    questions: [
      {
        id: "q2-1",
        question:
          "What does the behavioral health certification requirement look like?",
        answer:
          "We support you through the certification process. The facility covers exam fees and provides study time. Most nurses complete it within 18 months.",
        answeredBy: "Nursing Manager",
        answeredDate: "2026-02-20",
        askedDate: "2026-02-19",
      },
    ],
  },
  {
    id: "job-3",
    facilityId: "facility-3",
    facilityName: "Rhode Island Hospital (Brown University Health)",
    title: "Registered Nurse - Inpatient Operating Room",
    payRange: { min: 34.52, max: 58.24 },
    payUnit: "hr",
    payExplained:
      "Range based on years of OR and perioperative experience and relevant certifications",
    type: "Full Time",
    hoursPerWeek: 40,
    location: { city: "Providence", state: "RI" },
    schedule: "Monday-Friday, weekends and holidays as needed, call requirement",
    scheduleType: "Days",
    scheduleBadges: ["Mon-Fri", "Weekend/Holiday Rotation", "On-Call"],
    licenseRequired: { type: "RN", state: "RI" },
    certificationsRequired: [],
    drivingRequired: false,
    ehrSystem: "Epic",
    specialty: "OR/Perioperative",
    union: true,
    unionName: "United Nurses and Allied Professionals",
    experienceRange: { min: 1, max: 20 },
    postedDate: "2026-02-15",
    questions: [
      {
        id: "q3-1",
        question: "What does the on-call rotation look like?",
        answer:
          "On-call is typically one weeknight per week and one weekend per month. Call-back pay is at 1.5x your base rate with a 2-hour minimum guarantee.",
        answeredBy: "OR Nurse Manager",
        answeredDate: "2026-02-18",
        askedDate: "2026-02-16",
      },
      {
        id: "q3-2",
        question: "What surgical specialties will I be trained in?",
        answer:
          "New OR nurses rotate through general surgery, orthopedics, and cardiovascular. After orientation, you can express preference for a primary service line.",
        answeredBy: "OR Nurse Manager",
        answeredDate: "2026-02-20",
        askedDate: "2026-02-19",
      },
    ],
  },
];
