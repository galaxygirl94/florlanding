import { FacilityProfile } from "./types";

export const seedFacilities: FacilityProfile[] = [
  {
    id: "facility-paceri",
    name: "PACE-RI",
    description:
      "PACE-RI is a Not-for-Profit PACE (Program of All-inclusive Care for the Elderly) program serving frail elderly individuals in Providence, Rhode Island. We provide comprehensive, coordinated care enabling participants to live safely in the community.",
    location: { city: "Providence", state: "RI", zip: "02906" },
    type: "Not-for-Profit",
    culture:
      "Mission-driven interdisciplinary team committed to person-centered care for the elderly. Nurses build deep, lasting relationships with participants and families. Collaborative, supportive environment with strong work-life balance.",
    starRating: 4.7,
    reviewCount: 0,
    reviews: [],
  },
  {
    id: "facility-brown-health",
    name: "Brown University Health",
    description:
      "Brown University Health is Rhode Island's leading Not-for-Profit health system, affiliated with the Warren Alpert Medical School of Brown University. We provide comprehensive inpatient and outpatient care across the state, combining academic excellence with compassionate patient care.",
    location: { city: "Providence", state: "RI", zip: "02903" },
    type: "Not-for-Profit",
    culture:
      "Academic medical center with a culture of clinical excellence, innovation, and professional development. Strong nursing leadership and evidence-based practice. Brown University affiliation provides exceptional tuition and education benefits.",
    ehrSystem: "Epic",
    starRating: 4.2,
    reviewCount: 0,
    reviews: [],
  },
  {
    id: "facility-pchc",
    name: "Providence Community Health Centers",
    description:
      "Providence Community Health Centers (PCHC) is a Federally Qualified Health Center (FQHC) and Not-for-Profit organization providing comprehensive primary care, behavioral health, and specialty services to underserved populations across Providence, Rhode Island.",
    location: { city: "Providence", state: "RI", zip: "02907" },
    type: "Not-for-Profit",
    culture:
      "Mission-driven team dedicated to health equity and serving diverse communities. Collaborative interdisciplinary model with a strong focus on social determinants of health. FQHC status means loan forgiveness eligibility for qualifying nurses.",
    starRating: 4.5,
    reviewCount: 0,
    reviews: [],
  },
];
