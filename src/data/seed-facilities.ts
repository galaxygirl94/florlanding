import { FacilityProfile } from "./types";

export const seedFacilities: FacilityProfile[] = [
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
  // ── Rhode Island Hospital ──
  {
    id: "facility-rih",
    name: "Rhode Island Hospital",
    description:
      "Rhode Island Hospital is the state's largest hospital and only Level I trauma center. As the principal teaching hospital of Brown University's Warren Alpert Medical School, we combine academic excellence with compassionate patient care. Over 1,200 registered nurses on staff.",
    location: { city: "Providence", state: "RI", address: "593 Eddy Street, Providence, RI 02903", zip: "02903" },
    type: "Acute Care Hospital / Level I Trauma Center",
    culture:
      "Fast-paced academic medical center with a culture of clinical excellence and innovation. Strong nursing leadership, evidence-based practice, and robust professional development programs.",
    ehrSystem: "Epic",
    starRating: 3.6,
    reviewCount: 2,
    reviews: [
      {
        id: "r-rih-1",
        authorInitials: "KM",
        role: "RN",
        rating: 4,
        date: "2026-01-05",
        text: "Great learning environment with Brown affiliation. High acuity keeps you sharp. Tuition remission is an incredible benefit. Parking is the biggest complaint.",
      },
      {
        id: "r-rih-2",
        authorInitials: "JW",
        role: "RN",
        rating: 3,
        date: "2025-09-15",
        text: "Busy and sometimes short-staffed, but the clinical experience is unmatched. Great for nurses who want to grow. Benefits and tuition assistance are solid.",
      },
    ],
    headerImage: "/nurse-hero.jpg",
  },
  // ── South County Health ──
  {
    id: "facility-southcounty",
    name: "South County Health",
    description:
      "South County Health is an independent, non-profit community hospital accredited by The Joint Commission with a 5-star CMS quality rating. We provide comprehensive medical and surgical services to the South County region of Rhode Island.",
    location: { city: "Wakefield", state: "RI", address: "100 Kenyon Avenue, Wakefield, RI 02879", zip: "02879" },
    type: "Acute Care Hospital",
    culture:
      "Community-focused, patient-first environment with strong benefits and a culture of clinical excellence. Our nurses enjoy a collaborative, supportive atmosphere with genuine work-life balance.",
    ehrSystem: "Epic",
    starRating: 3.4,
    reviewCount: 2,
    reviews: [
      {
        id: "r-sch-1",
        authorInitials: "LP",
        role: "RN",
        rating: 4,
        date: "2026-01-10",
        text: "Great community hospital feel. You actually get to know your patients here. The 401k match and tuition reimbursement are solid. Management is approachable.",
      },
      {
        id: "r-sch-2",
        authorInitials: "BK",
        role: "RN",
        rating: 3,
        date: "2025-08-20",
        text: "Good benefits package and nice location. Can feel understaffed during busy stretches, but the team pulls together. Wellness program is a nice perk.",
      },
    ],
    headerImage: "/nurse-community.jpg",
  },
  // ── Family Service of Rhode Island (FSRI) ──
  {
    id: "facility-fsri",
    name: "Family Service of Rhode Island",
    description:
      "FSRI is a 130-year-old statewide nonprofit dedicated to community and family health across Rhode Island. We provide a wide range of services including nursing, behavioral health, and family support programs in Providence, East Providence, and North Smithfield.",
    location: { city: "Providence", state: "RI", address: "134 Thurbers Avenue, Providence, RI 02905", zip: "02905" },
    type: "Community Health / Nonprofit",
    culture:
      "Mission-driven organization with a deep commitment to health equity. Our nurses work in the community, building meaningful relationships with families. We celebrate linguistic diversity with bilingual and multilingual pay differentials.",
    starRating: 4.2,
    reviewCount: 1,
    reviews: [
      {
        id: "r-fsri-1",
        authorInitials: "RS",
        role: "RN",
        rating: 4,
        date: "2025-12-15",
        text: "The most meaningful nursing work I've ever done. You genuinely change lives here. The bilingual differential is a nice bonus for my Spanish skills. Great benefits for a nonprofit.",
      },
    ],
  },
  // ── Emma Pendleton Bradley Hospital ──
  {
    id: "facility-bradley",
    name: "Emma Pendleton Bradley Hospital",
    description:
      "Bradley Hospital is the nation's first psychiatric hospital for children and adolescents, part of Brown University Health. We specialize in pediatric behavioral and mental health, offering inpatient, outpatient, and residential services for young people and their families.",
    location: { city: "East Providence", state: "RI", address: "1011 Veterans Memorial Parkway, East Providence, RI 02915", zip: "02915" },
    type: "Psychiatric Hospital (Pediatric)",
    culture:
      "Specialized, compassionate environment focused on children and adolescent mental health. Brown University affiliation means access to cutting-edge training, research opportunities, and tuition benefits. Our nursing team receives advanced training in de-escalation and therapeutic communication.",
    ehrSystem: "Epic",
    starRating: 4.0,
    reviewCount: 1,
    reviews: [
      {
        id: "r-brad-1",
        authorInitials: "CN",
        role: "RN",
        rating: 4,
        date: "2026-02-01",
        text: "Challenging but incredibly rewarding. The kids need us and the Brown affiliation gives great training opportunities. Tuition benefits are excellent if you want to pursue advanced degrees.",
      },
    ],
    headerImage: "/nurse-hands.jpg",
  },
];
