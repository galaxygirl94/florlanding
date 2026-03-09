import { FacilityProfile } from "./types";

export const seedFacilities: FacilityProfile[] = [
  {
    id: "facility-1",
    name: "PACE Organization of Rhode Island",
    description:
      "PACE-RI is a comprehensive care program for adults 55 and older who need a nursing-home level of care but want to remain living at home. Our interdisciplinary team works together to provide medical, social, and personal care services that keep participants healthy, independent, and engaged in their communities.",
    location: { city: "Newport", state: "RI", address: "One John Clarke Road, Newport, RI 02840", zip: "02840" },
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
    location: { city: "Pawtucket", state: "RI", zip: "02860" },
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
    location: { city: "Providence", state: "RI", zip: "02903" },
    type: "Acute Care Hospital / Level I Trauma Center",
    culture:
      "Fast-paced, high-acuity environment with strong union representation and competitive compensation. A teaching hospital that values evidence-based practice and professional growth.",
    ehrSystem: "Epic",
    starRating: 4.1,
    reviewCount: 0,
    reviews: [],
  },
  // New fictional facilities
  {
    id: "facility-bayside",
    name: "Bayside Medical Center",
    description:
      "Bayside Medical Center is a 220-bed community hospital serving greater Providence and surrounding communities. We are a Magnet-designated facility known for exceptional nursing care and a supportive, team-based work environment.",
    location: { city: "Providence", state: "RI", address: "500 Bayside Avenue, Providence, RI 02905", zip: "02905" },
    type: "Acute Care Hospital",
    culture:
      "Magnet-designated with strong shared governance. Nurses lead practice councils and have real input into patient care standards. Supportive management and excellent retention.",
    ehrSystem: "Epic",
    starRating: 4.6,
    reviewCount: 2,
    reviews: [
      {
        id: "r-bay-1",
        authorInitials: "KP",
        role: "RN",
        rating: 5,
        date: "2026-01-20",
        text: "Bayside lives up to its Magnet designation. Nurses are respected, staffing ratios are enforced, and management actually listens. Best hospital I've worked at in 15 years.",
      },
      {
        id: "r-bay-2",
        authorInitials: "TS",
        role: "RN",
        rating: 4,
        date: "2025-10-12",
        text: "Great culture, solid benefits. The only downside is parking can be tough during shift change, but the shuttle from the remote lot runs every 10 minutes.",
      },
    ],
  },
  {
    id: "facility-narragansett",
    name: "Narragansett Bay SNF",
    description:
      "Narragansett Bay Skilled Nursing Facility provides long-term and rehabilitative care in a beautiful waterfront setting. We specialize in post-acute rehabilitation, memory care, and long-term skilled nursing.",
    location: { city: "Warwick", state: "RI", address: "75 Bay View Road, Warwick, RI 02886", zip: "02886" },
    type: "SNF/Long-term care",
    culture:
      "Family-oriented environment where residents and staff build lasting relationships. We believe in person-centered care and give our nurses the time to provide it.",
    ehrSystem: "PointClickCare",
    starRating: 4.4,
    reviewCount: 1,
    reviews: [
      {
        id: "r-nar-1",
        authorInitials: "DW",
        role: "LPN",
        rating: 4,
        date: "2025-12-05",
        text: "Love the residents and the team here. It's a peaceful environment compared to the hospital. Management is approachable and the schedule is predictable.",
      },
    ],
  },
  {
    id: "facility-providence-clinic",
    name: "Providence Family Health Clinic",
    description:
      "A network of community health centers providing primary care, behavioral health, and specialty services to underserved populations across Providence County. Federally Qualified Health Center (FQHC).",
    location: { city: "Providence", state: "RI", address: "200 Prairie Avenue, Providence, RI 02907", zip: "02907" },
    type: "Outpatient clinic",
    culture:
      "Mission-driven team serving diverse communities. Strong focus on health equity and social determinants of health. Collaborative interdisciplinary model.",
    ehrSystem: "Athenahealth",
    starRating: 4.5,
    reviewCount: 1,
    reviews: [
      {
        id: "r-prov-1",
        authorInitials: "MG",
        role: "NP",
        rating: 5,
        date: "2026-02-01",
        text: "If you want to make a real difference, this is the place. The patient population is diverse and the work is incredibly rewarding. Great loan forgiveness benefits too.",
      },
    ],
  },
  {
    id: "facility-coastal-rehab",
    name: "Coastal Rehabilitation Center",
    description:
      "Coastal Rehab is a 60-bed inpatient rehabilitation facility specializing in stroke recovery, traumatic brain injury, spinal cord injury, and orthopedic rehabilitation.",
    location: { city: "Cranston", state: "RI", address: "300 Rehabilitation Way, Cranston, RI 02910", zip: "02910" },
    type: "Rehab",
    culture:
      "Collaborative therapy-driven environment. Nurses work closely with PT, OT, and speech therapy to achieve patient goals. Strong sense of purpose as patients make visible progress.",
    ehrSystem: "Meditech",
    starRating: 4.3,
    reviewCount: 0,
    reviews: [],
  },
  {
    id: "facility-ocean-peds",
    name: "Ocean State Pediatrics",
    description:
      "Ocean State Pediatrics is a multi-site pediatric practice providing well-child care, acute illness visits, developmental assessments, and adolescent medicine across Rhode Island.",
    location: { city: "East Greenwich", state: "RI", address: "150 Main Street, East Greenwich, RI 02818", zip: "02818" },
    type: "Outpatient clinic",
    culture:
      "Fun, family-friendly practice that values its nurses as integral team members. Predictable schedules with no nights or weekends. Strong benefits and professional development.",
    ehrSystem: "Epic",
    starRating: 4.8,
    reviewCount: 1,
    reviews: [
      {
        id: "r-osp-1",
        authorInitials: "JR",
        role: "RN",
        rating: 5,
        date: "2025-11-18",
        text: "Best work-life balance I've ever had. The kids are wonderful, the providers are collaborative, and I actually get to eat lunch every day. Hard to find that in nursing!",
      },
    ],
  },
];
