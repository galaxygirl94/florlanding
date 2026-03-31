import { FacilityProfile } from "./types";

export const seedFacilities: FacilityProfile[] = [
  {
    id: "facility-bayside",
    name: "Bayside Medical Center",
    description:
      "Bayside Medical Center is a full-service acute care hospital serving the greater Providence area. Our 320-bed facility offers a wide range of medical and surgical services, with a commitment to evidence-based practice and exceptional patient outcomes.",
    location: { city: "Providence", state: "RI", address: "1 Hospital Drive, Providence, RI 02903" },
    type: "Acute Care Hospital",
    culture:
      "Fast-paced, team-oriented environment where excellence in patient care is the standard. We invest heavily in continuing education and promote from within. Staff-to-patient ratios are tightly managed and respected by leadership.",
    ehrSystem: "Epic",
    starRating: 4.3,
    reviewCount: 12,
    reviews: [
      {
        id: "r-bay-1",
        authorInitials: "SK",
        role: "RN, Med-Surg",
        rating: 4,
        date: "2026-01-20",
        text: "Good teamwork on the floor. Staffing has been consistent since the new CNO came on board. Epic is well-implemented. Night differential is real — not just on paper.",
      },
      {
        id: "r-bay-2",
        authorInitials: "MP",
        role: "ICU RN",
        rating: 5,
        date: "2025-12-10",
        text: "Best ICU I've worked in. The intensivist team is excellent, equipment is modern, and they actually listen to nursing when it comes to safety concerns. Sign-on bonus was paid as promised.",
      },
      {
        id: "r-bay-3",
        authorInitials: "TR",
        role: "Charge RN",
        rating: 4,
        date: "2025-10-05",
        text: "Strong protocols, good orientation program. The union contract makes scheduling predictable. Would recommend to any experienced nurse looking for stability.",
      },
    ],
  },
  {
    id: "facility-narragansett",
    name: "Narragansett Bay Hospital",
    description:
      "Narragansett Bay Hospital is a community hospital offering emergency, surgical, and inpatient medical services. Our 150-bed facility is known for its compassionate nursing staff and patient-centered approach to care.",
    location: { city: "Warwick", state: "RI", address: "500 Bay Road, Warwick, RI 02889" },
    type: "Hospital",
    culture:
      "Community-feel with hospital resources. Nurses here say they never feel like just a number. Leadership rounds regularly and actually acts on feedback. Great for nurses who want direct patient relationships.",
    ehrSystem: "Cerner",
    starRating: 4.1,
    reviewCount: 8,
    reviews: [
      {
        id: "r-nar-1",
        authorInitials: "BL",
        role: "ED RN",
        rating: 4,
        date: "2026-02-01",
        text: "Community hospital but the ED is well-run. Good mix of cases. Management is approachable and we have real input into policy decisions.",
      },
      {
        id: "r-nar-2",
        authorInitials: "JF",
        role: "Med-Surg RN",
        rating: 4,
        date: "2025-11-15",
        text: "Smaller feel than a big hospital which I love. My patients know my name. Cerner could be better but it works. Pay is competitive with the area.",
      },
    ],
  },
  {
    id: "facility-pfhc",
    name: "Providence Family Health Center",
    description:
      "Providence Family Health Center is a Federally Qualified Health Center (FQHC) providing comprehensive primary care, behavioral health, and preventive services regardless of ability to pay. We serve over 18,000 patients annually.",
    location: { city: "Providence", state: "RI", address: "100 Broad Street, Providence, RI 02903" },
    type: "Community Health/Nonprofit",
    culture:
      "Mission-driven to the core. Our staff believes healthcare is a right, not a privilege. Supportive supervision, PSLF-eligible employment, and real work-life balance. Bilingual skills are valued and compensated.",
    ehrSystem: "eClinicalWorks",
    starRating: 4.6,
    reviewCount: 9,
    reviews: [
      {
        id: "r-pfhc-1",
        authorInitials: "CL",
        role: "FNP",
        rating: 5,
        date: "2026-01-08",
        text: "Working here is why I went into healthcare. Our patients need us and we can actually help them. The PSLF benefit is real — I've had colleagues get significant forgiveness. Leadership is transparent and caring.",
      },
      {
        id: "r-pfhc-2",
        authorInitials: "RT",
        role: "RN, Outpatient",
        rating: 4,
        date: "2025-10-20",
        text: "Community health is different and better in so many ways. You build actual relationships. Pay isn't as high as hospital but the mission makes it worth it. Loan forgiveness after 10 years changes the math significantly.",
      },
    ],
  },
  {
    id: "facility-coastal",
    name: "Coastal Pediatric Group",
    description:
      "Coastal Pediatric Group is a large outpatient pediatric practice serving children from birth through age 21 across three locations in southern Rhode Island. We provide well-child visits, acute care, and chronic disease management.",
    location: { city: "South Kingstown", state: "RI" },
    type: "Outpatient clinic",
    culture:
      "Kid-friendly, family-centered environment. Our nursing staff is incredibly close-knit. No nights, no weekends, no holidays. The kids and families here are amazing — they remember you year after year.",
    ehrSystem: "Epic",
    starRating: 4.5,
    reviewCount: 6,
    reviews: [
      {
        id: "r-coast-1",
        authorInitials: "DM",
        role: "Pediatric RN",
        rating: 5,
        date: "2026-01-25",
        text: "I've been here 6 years and I'm staying forever. The schedule is perfect for a parent — I'm home for dinner every night. Epic is great. The kids are why I became a nurse.",
      },
      {
        id: "r-coast-2",
        authorInitials: "AN",
        role: "LPN",
        rating: 4,
        date: "2025-12-05",
        text: "Great work environment. Very organized clinic, good communication. My only wish is the pay was a bit higher but the schedule and environment are worth the trade-off.",
      },
    ],
  },
  {
    id: "facility-osp",
    name: "Ocean State Psychiatry",
    description:
      "Ocean State Psychiatry is an inpatient psychiatric hospital providing acute stabilization, crisis intervention, and comprehensive behavioral health services for adults and adolescents in Rhode Island.",
    location: { city: "Cranston", state: "RI" },
    type: "Psychiatric Hospital",
    culture:
      "Dedicated team passionate about mental health equity. Strong emphasis on trauma-informed care and staff safety. Continuing education is actively supported. Collaborative team approach where every voice matters.",
    ehrSystem: "LifeChart",
    starRating: 3.9,
    reviewCount: 7,
    reviews: [
      {
        id: "r-osp-1",
        authorInitials: "KW",
        role: "Psych RN",
        rating: 4,
        date: "2026-02-10",
        text: "Psych nursing isn't for everyone but this team makes it manageable. Good de-escalation training, clear safety protocols. LifeChart takes getting used to but it's fine.",
      },
      {
        id: "r-osp-2",
        authorInitials: "PT",
        role: "RN",
        rating: 4,
        date: "2025-09-30",
        text: "Night differential is solid. The patients are challenging but rewarding. Good union contract protects staffing ratios which is critical in psych.",
      },
    ],
  },
  {
    id: "facility-sch",
    name: "Sunrise Community Health",
    description:
      "Sunrise Community Health is a nonprofit community mental health organization providing outpatient behavioral health services, substance use counseling, and community support services across Rhode Island.",
    location: { city: "Woonsocket", state: "RI" },
    type: "Community Health/Nonprofit",
    culture:
      "Tight-knit, mission-centered team. We celebrate small wins because we understand how big they are for our clients. PSLF-eligible. Flexible scheduling accommodated for experienced staff.",
    starRating: 4.2,
    reviewCount: 5,
    reviews: [
      {
        id: "r-sch-1",
        authorInitials: "LN",
        role: "LCSW",
        rating: 4,
        date: "2026-01-15",
        text: "Great organization with real values. Caseload is manageable. The community we serve is lucky to have Sunrise and our team feels that every day.",
      },
    ],
  },
  {
    id: "facility-fsri",
    name: "Family Service of Rhode Island",
    description:
      "Family Service of Rhode Island is a comprehensive social services organization providing early childhood programs, home visiting, behavioral health services, and crisis intervention. We are a key partner in Rhode Island's social safety net.",
    location: { city: "Providence", state: "RI" },
    type: "Community Health/Nonprofit",
    culture:
      "Passionate team committed to breaking cycles of poverty and trauma. Supportive leadership, manageable caseloads, and meaningful work. PSLF eligible. Bilingual staff highly valued.",
    starRating: 4.4,
    reviewCount: 6,
    reviews: [
      {
        id: "r-fsri-1",
        authorInitials: "MV",
        role: "Home Visitor/RN",
        rating: 5,
        date: "2026-02-14",
        text: "This job changes families' lives. I drive to families' homes, build relationships over years, and watch kids thrive because of the early intervention we provide. Meaningful doesn't begin to cover it.",
      },
      {
        id: "r-fsri-2",
        authorInitials: "SP",
        role: "Case Manager",
        rating: 4,
        date: "2025-11-20",
        text: "Great team, real supervision and support. Loan forgiveness is not theoretical here — several colleagues have received it. Schedule is consistent.",
      },
    ],
  },
  {
    id: "facility-epbh",
    name: "East Providence Behavioral Health",
    description:
      "East Providence Behavioral Health provides intensive outpatient and partial hospitalization programs for adults with mental health and co-occurring substance use disorders.",
    location: { city: "East Providence", state: "RI" },
    type: "Psychiatric Hospital",
    culture:
      "Recovery-oriented, strengths-based clinical culture. Small team with big impact. Staff meet regularly to consult on complex cases and support each other.",
    starRating: 4.0,
    reviewCount: 4,
    reviews: [
      {
        id: "r-epbh-1",
        authorInitials: "GH",
        role: "Psych RN",
        rating: 4,
        date: "2025-12-20",
        text: "Solid place to work in behavioral health. Manageable caseload, good clinical supervision. The IOP model is different from inpatient and I prefer it.",
      },
    ],
  },
  {
    id: "facility-rih",
    name: "Rhode Island Hospital",
    description:
      "Rhode Island Hospital is the state's largest hospital and the principal teaching hospital of Brown University's Warren Alpert Medical School. Our 719-bed academic medical center provides tertiary and quaternary care to patients from across southern New England.",
    location: { city: "Providence", state: "RI", address: "593 Eddy Street, Providence, RI 02903" },
    type: "Acute Care Hospital",
    culture:
      "Academic medical center energy — fast-paced, complex cases, constant learning. Strong union presence. Research opportunities available. Competitive pay and comprehensive benefits. Best technology in the state.",
    ehrSystem: "Epic",
    starRating: 4.2,
    reviewCount: 15,
    reviews: [
      {
        id: "r-rih-1",
        authorInitials: "AK",
        role: "OR RN",
        rating: 4,
        date: "2026-01-30",
        text: "State-of-the-art ORs and equipment. Challenging cases every day. The learning never stops. Union keeps the ratios reasonable in most units.",
      },
      {
        id: "r-rih-2",
        authorInitials: "LC",
        role: "Peds RN",
        rating: 5,
        date: "2025-12-18",
        text: "Hasbro Children's floor is exceptional. The support staff, equipment, and team culture are all top-notch. Best decision I made was coming here.",
      },
      {
        id: "r-rih-3",
        authorInitials: "FO",
        role: "ICU RN",
        rating: 4,
        date: "2025-10-28",
        text: "Complex ICU cases you won't see elsewhere in RI. Great for learning but the pace is intense. Night differential is very good.",
      },
    ],
  },
  {
    id: "facility-buh",
    name: "Butler Hospital",
    description:
      "Butler Hospital is Rhode Island's premier psychiatric hospital, affiliated with Brown University Health. As a 140-bed inpatient facility, we provide specialized treatment for acute psychiatric conditions and complex mental health disorders.",
    location: { city: "Providence", state: "RI", address: "345 Blackstone Blvd, Providence, RI 02906" },
    type: "Psychiatric Hospital",
    culture:
      "Evidence-based psychiatric nursing in a supportive, collegial environment. Strong supervision structure and ongoing professional development. Work-life balance is genuinely respected here.",
    ehrSystem: "Epic",
    starRating: 4.3,
    reviewCount: 8,
    reviews: [
      {
        id: "r-buh-1",
        authorInitials: "EW",
        role: "Psych RN",
        rating: 4,
        date: "2026-02-20",
        text: "Best psych hospital in the state. The clinical team is excellent, good teaching environment. Epic makes documentation manageable. Strong support for nursing staff.",
      },
      {
        id: "r-buh-2",
        authorInitials: "NP",
        role: "RN",
        rating: 5,
        date: "2025-11-05",
        text: "I feel genuinely supported here. The unit culture is collaborative and patient-centered. Brown affiliation means we're always learning.",
      },
    ],
  },
  {
    id: "facility-hasbro",
    name: "Hasbro Children's Hospital",
    description:
      "Hasbro Children's Hospital is Rhode Island's only dedicated pediatric medical center, offering specialty and subspecialty care to children from throughout New England. Part of Brown University Health, we are recognized nationally for excellence in pediatric care.",
    location: { city: "Providence", state: "RI", address: "593 Eddy Street, Providence, RI 02903" },
    type: "Acute Care Hospital",
    culture:
      "Child-first, family-centered care is not just a motto — it's how every decision is made. Team morale is high. Difficult days are real but the wins keep everyone going. Child life team is exceptional.",
    ehrSystem: "Epic",
    starRating: 4.7,
    reviewCount: 11,
    reviews: [
      {
        id: "r-has-1",
        authorInitials: "TM",
        role: "Peds RN",
        rating: 5,
        date: "2026-02-28",
        text: "Hasbro is where I was meant to work. The kids are resilient and the team is incredible. Yes it's hard emotionally sometimes but I leave fulfilled every shift.",
      },
      {
        id: "r-has-2",
        authorInitials: "RL",
        role: "PICU RN",
        rating: 5,
        date: "2026-01-12",
        text: "Top-tier PICU. Intensivists are collaborative, family communication is built into the culture, and staffing ratios are safe. Best hospital I've ever worked at.",
      },
    ],
  },
  {
    id: "facility-carelink",
    name: "CareLink Home Health",
    description:
      "CareLink provides comprehensive home health nursing services including skilled nursing visits, wound care, medication management, and post-surgical follow-up across Providence and Kent counties.",
    location: { city: "Cranston", state: "RI" },
    type: "Home health",
    culture:
      "Autonomous, flexible work environment for experienced nurses. You set your schedule, work in the community, and build real patient relationships over time. Strong supervision and on-call support available.",
    ehrSystem: "Homecare Homebase",
    starRating: 4.1,
    reviewCount: 6,
    reviews: [
      {
        id: "r-care-1",
        authorInitials: "PP",
        role: "Home Health RN",
        rating: 4,
        date: "2026-01-22",
        text: "Love the autonomy. No two days are the same. The documentation is manageable in Homecare Homebase and mileage reimbursement is fair. Need a reliable car but it's worth it.",
      },
    ],
  },
  {
    id: "facility-cranston",
    name: "Cranston School Department",
    description:
      "Cranston Public Schools employs school nurses across 19 schools serving over 9,000 students. Our nurses provide health assessments, manage chronic conditions, administer medications, and serve as the first line of healthcare for thousands of Rhode Island children.",
    location: { city: "Cranston", state: "RI" },
    type: "School",
    culture:
      "Supportive school environment with regular school nurse peer supervision meetings. Great for nurses who want consistent hours, summers off, and meaningful work with children and families.",
    starRating: 4.3,
    reviewCount: 4,
    reviews: [
      {
        id: "r-cran-1",
        authorInitials: "HC",
        role: "School Nurse",
        rating: 4,
        date: "2025-12-15",
        text: "Best schedule in nursing. Home by 3pm, summers off, holidays off. The work is meaningful — I've caught things nobody else would have caught. PSLF eligible which is huge.",
      },
    ],
  },
  {
    id: "facility-kent",
    name: "Kent County Hospital",
    description:
      "Kent County Hospital is a 359-bed community hospital serving central Rhode Island. As a Level II Trauma Center, we provide emergency, surgical, and comprehensive inpatient services with a strong community focus.",
    location: { city: "Warwick", state: "RI", address: "455 Toll Gate Road, Warwick, RI 02886" },
    type: "Hospital",
    culture:
      "Community hospital pride with regional hospital resources. Nurses have real influence here. Leadership listens. Staffing is managed responsibly. Union contract protects nurses.",
    ehrSystem: "Epic",
    starRating: 4.2,
    reviewCount: 9,
    reviews: [
      {
        id: "r-kent-1",
        authorInitials: "OA",
        role: "ED RN",
        rating: 4,
        date: "2026-02-08",
        text: "Level II trauma keeps it interesting. Not as chaotic as RIH but enough volume to keep skills sharp. Good management in the ED. Sign-on bonus was paid on time.",
      },
      {
        id: "r-kent-2",
        authorInitials: "DT",
        role: "RN",
        rating: 4,
        date: "2025-10-18",
        text: "Solid community hospital. You know your patients and the community. Epic is the same as everywhere now. Good place to build a career.",
      },
    ],
  },
  {
    id: "facility-groton",
    name: "Groton Skilled Care Center",
    description:
      "Groton Skilled Care Center is a 120-bed skilled nursing and long-term care facility providing post-acute rehabilitation, memory care, and long-term residential care in a homelike setting.",
    location: { city: "North Kingstown", state: "RI" },
    type: "SNF/Long-term care",
    culture:
      "Resident-centered care with a strong team culture. Consistent assignment means you really know your residents. Manageable pace compared to hospital work. Staff stay here for years.",
    ehrSystem: "PointClickCare",
    starRating: 3.8,
    reviewCount: 5,
    reviews: [
      {
        id: "r-gro-1",
        authorInitials: "BC",
        role: "LPN",
        rating: 4,
        date: "2026-01-10",
        text: "I've been here 3 years. The residents become family. Management is fair and PointClickCare is easy to learn. Weekends required but the differential is worth it.",
      },
    ],
  },
  {
    id: "facility-harmony",
    name: "Harmony Rehabilitation Center",
    description:
      "Harmony Rehabilitation Center is a 90-bed inpatient rehabilitation facility specializing in recovery following orthopedic surgery, stroke, brain injury, and complex medical conditions.",
    location: { city: "Johnston", state: "RI" },
    type: "Rehab",
    culture:
      "Goal-oriented, team-based rehab environment. You watch patients go from dependent to independent week by week. Strong OT/PT/nursing collaboration. Manageable pace with real clinical complexity.",
    ehrSystem: "Meditech",
    starRating: 4.0,
    reviewCount: 5,
    reviews: [
      {
        id: "r-har-1",
        authorInitials: "VC",
        role: "Rehab RN",
        rating: 4,
        date: "2026-02-05",
        text: "Rehab nursing is deeply rewarding. Watching someone walk out who couldn't move 3 weeks ago is something else. Team is collaborative and supportive.",
      },
    ],
  },
];
