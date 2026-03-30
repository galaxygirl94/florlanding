import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import type { NurseProfileRow } from "@/data/types";

const TEST_NURSES: NurseProfileRow[] = [
  {
    full_name: "Maria Reyes",
    email: "maria.reyes.test@flor.dev",
    phone: "401-555-0101",
    years_experience: 9,
    specialty: "Med-Surg",
    preferred_settings: ["FQHC", "home health"],
    availability: "full-time",
    license_number: "RN-RI-TEST-001",
    license_state: "RI",
    license_verified: true,
    license_expires: "2026-12-31",
    license_status: "active",
    discipline_flags: false,
    bio: "I've spent nine years on med-surg floors and I'm ready for something with a smaller panel and more continuity. I want to actually know my patients. FQHC or home health — I'm not picky as long as the mission is real.",
    pslf_interest: true,
    desired_pay_min: 38,
    desired_pay_max: 52,
    location_state: "RI",
    location_city: "Providence",
    willing_to_travel: true,
    is_test_profile: true,
  },
  {
    full_name: "James Okafor",
    email: "james.okafor.test@flor.dev",
    phone: "617-555-0202",
    years_experience: 15,
    specialty: "Geriatrics",
    preferred_settings: ["PACE"],
    availability: "full-time",
    license_number: "RN-MA-TEST-002",
    license_state: "MA",
    license_verified: true,
    license_expires: "2027-06-30",
    license_status: "active",
    discipline_flags: false,
    bio: "PACE is the model. I've worked with frail elders my entire career and I believe most nursing home admissions are preventable with the right team. Looking for a PACE program in greater Boston where I can put that to work every day.",
    pslf_interest: false,
    desired_pay_min: 45,
    desired_pay_max: 62,
    location_state: "MA",
    location_city: "Boston",
    willing_to_travel: false,
    is_test_profile: true,
  },
  {
    full_name: "Destiny Clark",
    email: "destiny.clark.test@flor.dev",
    phone: "203-555-0303",
    years_experience: 4,
    specialty: "Pediatrics",
    preferred_settings: ["school district", "FQHC"],
    availability: "per-diem",
    license_number: "RN-CT-TEST-003",
    license_state: "CT",
    license_verified: true,
    license_expires: "2025-11-30",
    license_status: "active",
    discipline_flags: false,
    bio: "School nursing was not what I expected — it's crisis response, chronic disease management, and advocacy all in one role. Per diem gives me flexibility while my kids are small. Happy to cover multiple districts.",
    pslf_interest: true,
    desired_pay_min: 32,
    desired_pay_max: 45,
    location_state: "CT",
    location_city: "New Haven",
    willing_to_travel: true,
    is_test_profile: true,
  },
  {
    full_name: "Tomás Villanueva",
    email: "tomas.villanueva.test@flor.dev",
    phone: "508-555-0404",
    years_experience: 7,
    specialty: "Community Health",
    preferred_settings: ["FQHC", "PACE", "home health"],
    availability: "part-time",
    license_number: "RN-MA-TEST-004",
    license_state: "MA",
    license_verified: true,
    license_expires: "2026-09-30",
    license_status: "active",
    discipline_flags: false,
    bio: "I came to nursing through community health work and I've never left it. Part-time by design — I also teach. Looking for a FQHC or PACE where the work is patient-centered and the team is actually collaborative.",
    pslf_interest: true,
    desired_pay_min: 40,
    desired_pay_max: 55,
    location_state: "MA",
    location_city: "Worcester",
    willing_to_travel: false,
    is_test_profile: true,
  },
];

export async function POST() {
  try {
    const db = getServiceClient();

    // Upsert by email so re-runs are idempotent
    const { data, error } = await db
      .from("nurse_profiles")
      .upsert(TEST_NURSES, { onConflict: "email" })
      .select();

    if (error) throw error;
    return NextResponse.json({ seeded: data?.length ?? 0, profiles: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Seed failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
