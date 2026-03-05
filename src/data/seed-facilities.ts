import { FacilityProfile } from "./types";

export const seedFacilities: FacilityProfile[] = [
  {
    id: "facility-1",
    name: "PACE Organization of Rhode Island",
    description:
      "PACE-RI is a comprehensive care program for adults 55 and older who need a nursing-home level of care but want to remain living at home. Our interdisciplinary team works together to provide medical, social, and personal care services that keep participants healthy, independent, and engaged in their communities.",
    location: { city: "Newport", state: "RI", address: "One John Clarke Road, Newport, RI 02840" },
    type: "PACE (Program of All-Inclusive Care for the Elderly)",
    culture:
      "Team-oriented, compassionate environment focused on holistic elder care. We value work-life balance and invest in our staff's professional development. Our team regularly shares meals together and celebrates milestones with participants.",
    starRating: 4.7,
    reviewCount: 3,
    reviews: [
      {
        id: "r1-1",
        authorInitials: "MR",
        role: "CNA",
        rating: 5,
        date: "2026-01-15",
        text: "I've been at PACE-RI for two years and it's the best job I've ever had. The participants become like family, and the team genuinely supports each other. My schedule is consistent so I can actually plan my life outside of work. Management listens when you have concerns.",
      },
      {
        id: "r1-2",
        authorInitials: "JT",
        role: "RN",
        rating: 4,
        date: "2025-11-08",
        text: "Coming from a hospital setting, PACE was a breath of fresh air. The pace (no pun intended) allows you to actually get to know your patients and provide meaningful care. The interdisciplinary team model means you always have support. Only minor downside is the pay is slightly lower than hospital work, but the quality of life more than makes up for it.",
      },
      {
        id: "r1-3",
        authorInitials: "AL",
        role: "LPN",
        rating: 5,
        date: "2025-09-22",
        text: "What I love most about working here is that I leave work feeling like I actually made a difference. The participants light up when you walk in, and the staff treats each other with respect. They're also great about accommodating schedule needs — I'm a single mom and they've always worked with me.",
      },
    ],
  },
  {
    id: "facility-2",
    name: "Brown University Health / Gateway Healthcare",
    description:
      "Gateway Healthcare is the largest provider of behavioral health services in Rhode Island, affiliated with Brown University Health. We offer outpatient, residential, and community-based mental health and substance use treatment services.",
    location: { city: "Pawtucket", state: "RI" },
    type: "Behavioral Health / Outpatient",
    culture:
      "Mission-driven team dedicated to destigmatizing mental health care. Collaborative environment with ongoing clinical supervision and professional development opportunities.",
    ehrSystem: "LifeChart",
    starRating: 4.3,
    reviewCount: 0,
    reviews: [],
  },
  {
    id: "facility-3",
    name: "Rhode Island Hospital (Brown University Health)",
    description:
      "Rhode Island Hospital is the state's largest hospital and sole Level I Trauma Center, affiliated with the Warren Alpert Medical School of Brown University. Our nursing team is represented by United Nurses and Allied Professionals.",
    location: { city: "Providence", state: "RI" },
    type: "Acute Care Hospital / Level I Trauma Center",
    culture:
      "Fast-paced, high-acuity environment with strong union representation and competitive compensation. A teaching hospital that values evidence-based practice and professional growth.",
    ehrSystem: "Epic",
    starRating: 4.1,
    reviewCount: 0,
    reviews: [],
  },
];
