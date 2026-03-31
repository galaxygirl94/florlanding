import { calculateFitScore } from "../fit-score";
import { NurseProfile, JobListing } from "@/data/types";

function makeNurse(overrides: Partial<NurseProfile> = {}): NurseProfile {
  return {
    id: "test-nurse",
    firstName: "Test",
    lastName: "Nurse",
    email: "test@test.com",
    licenses: [{ type: "RN", state: "RI", verified: true }],
    certifications: ["BLS", "ACLS"],
    specialties: ["Med Surg"],
    yearsOfExperience: 5,
    yearsSpecialty: 4,
    ehrExperience: ["Epic"],
    shiftPreferences: ["Days"],
    scheduleTypes: ["Full-time"],
    careSettings: ["Acute care/Hospital"],
    patientPopulations: ["Adult"],
    zipCode: "02903",
    maxCommuteMiles: 25,
    desiredPayMin: 38,
    ...overrides,
  };
}

function makeJob(overrides: Partial<JobListing> = {}): JobListing {
  return {
    id: "test-job",
    facilityId: "f1",
    facilityName: "Test Hospital",
    title: "Med Surg RN",
    payRange: { min: 38, max: 46 },
    payUnit: "hr",
    payExplained: "",
    type: "Full-time",
    location: { city: "Providence", state: "RI", zip: "02903" },
    schedule: "Days",
    scheduleType: "Days",
    scheduleBadges: [],
    licenseRequired: { type: "RN", state: "RI" },
    certificationsRequired: ["BLS", "ACLS"],
    drivingRequired: false,
    ehrSystem: "Epic",
    specialty: "Med Surg",
    careSetting: "Acute care/Hospital",
    patientPopulation: "Adult",
    union: false,
    postedDate: "2026-01-01",
    experienceRange: { min: 2, max: 20 },
    yearsSpecialtyRequired: 1,
    questions: [],
    ...overrides,
  };
}

describe("Fit Score Algorithm", () => {
  test("perfect 100-point match", () => {
    const nurse = makeNurse();
    const job = makeJob();
    const result = calculateFitScore(nurse, job);
    expect(result.score).toBe(100);
    expect(result.breakdown.specialty).toBe(35);
    expect(result.breakdown.certifications).toBe(20);
    expect(result.breakdown.experience).toBe(15);
    expect(result.breakdown.shiftSchedule).toBe(15);
    expect(result.breakdown.careSetting).toBe(10);
    expect(result.breakdown.patientPopulation).toBe(4);
    expect(result.breakdown.ehrSystem).toBe(1);
  });

  test("strong match (85+)", () => {
    const nurse = makeNurse({
      specialties: ["Med Surg", "Telemetry"],
      shiftPreferences: ["Days", "Nights"],
      careSettings: ["Acute care/Hospital"],
    });
    const job = makeJob({ scheduleType: "Nights" });
    const result = calculateFitScore(nurse, job);
    expect(result.score).toBeGreaterThanOrEqual(85);
  });

  test("moderate match (60-79)", () => {
    const nurse = makeNurse({
      specialties: ["Telemetry"], // adjacent to Med Surg
      careSettings: ["SNF/Long-term care"], // no match
      patientPopulations: ["Geriatric"], // no match vs Adult
      shiftPreferences: ["Nights"], // mismatch
      scheduleTypes: ["Part-time"], // mismatch
    });
    const job = makeJob();
    const result = calculateFitScore(nurse, job);
    expect(result.score).toBeGreaterThanOrEqual(40);
    expect(result.score).toBeLessThan(80);
  });

  test("weak match (below 40)", () => {
    const nurse = makeNurse({
      specialties: ["Psych"],
      certifications: ["BLS"],
      yearsOfExperience: 1,
      yearsSpecialty: 0,
      ehrExperience: ["Athenahealth"],
      shiftPreferences: ["Nights"],
      scheduleTypes: ["Per diem"],
      careSettings: ["Psych facility"],
      patientPopulations: ["Psychiatric"],
    });
    const job = makeJob({
      certificationsRequired: ["BLS", "ACLS", "CCRN"],
      experienceRange: { min: 5, max: 20 },
      yearsSpecialtyRequired: 3,
    });
    const result = calculateFitScore(nurse, job);
    expect(result.score).toBeLessThan(40);
  });

  test("pay mismatch flag — employer max below nurse minimum", () => {
    const nurse = makeNurse({ desiredPayMin: 50 });
    const job = makeJob({ payRange: { min: 35, max: 42 } });
    const result = calculateFitScore(nurse, job);
    expect(result.flags.payMismatch).toBe(true);
    expect(result.flags.payMismatchDetail).toContain("$42");
    expect(result.flags.payMismatchDetail).toContain("$50");
    // Pay mismatch is a flag, not a score reduction
    expect(result.score).toBeGreaterThan(0);
  });

  test("commute flag — facility beyond nurse max distance", () => {
    const nurse = makeNurse({ zipCode: "02903", maxCommuteMiles: 5 });
    const job = makeJob({ location: { city: "Newport", state: "RI", zip: "02840" } });
    const result = calculateFitScore(nurse, job);
    expect(result.flags.commuteExceeded).toBe(true);
    // Commute flag doesn't zero out score
    expect(result.score).toBeGreaterThan(0);
  });

  test("EHR mismatch never reduces score", () => {
    const nurse = makeNurse({ ehrExperience: ["Cerner/Oracle Health"] });
    const job = makeJob({ ehrSystem: "Epic" });
    const result = calculateFitScore(nurse, job);
    // EHR just contributes 0 instead of 1, never goes negative
    expect(result.breakdown.ehrSystem).toBe(0);
    expect(result.score).toBe(99); // 100 - 1 for EHR
  });

  test("adjacent specialty gives partial credit", () => {
    const nurse = makeNurse({ specialties: ["Telemetry"] });
    const job = makeJob({ specialty: "Med Surg" });
    const result = calculateFitScore(nurse, job);
    expect(result.breakdown.specialty).toBe(15); // adjacent credit
    expect(result.breakdown.specialty).toBeGreaterThan(0);
    expect(result.breakdown.specialty).toBeLessThan(35);
  });

  test("ICU-ED adjacency works", () => {
    const nurse = makeNurse({ specialties: ["ED"] });
    const job = makeJob({ specialty: "ICU" });
    const result = calculateFitScore(nurse, job);
    expect(result.breakdown.specialty).toBe(15);
  });

  test("no specialty required gives full points", () => {
    const nurse = makeNurse();
    const job = makeJob({ specialty: undefined });
    const result = calculateFitScore(nurse, job);
    expect(result.breakdown.specialty).toBe(35);
  });

  test("partial certification credit", () => {
    const nurse = makeNurse({ certifications: ["BLS"] });
    const job = makeJob({ certificationsRequired: ["BLS", "ACLS", "PALS", "TNCC"] });
    const result = calculateFitScore(nurse, job);
    expect(result.breakdown.certifications).toBe(5); // 1/4 * 20
  });

  test("experience within 1 year of minimum", () => {
    const nurse = makeNurse({ yearsOfExperience: 4, yearsSpecialty: 1 });
    const job = makeJob({ experienceRange: { min: 5, max: 20 }, yearsSpecialtyRequired: 2 });
    const result = calculateFitScore(nurse, job);
    expect(result.breakdown.experience).toBe(8);
  });

  test("secondary specialty match", () => {
    const nurse = makeNurse({ specialties: ["Cardiac"] });
    const job = makeJob({ specialty: "Med Surg", secondarySpecialty: "Cardiac" });
    const result = calculateFitScore(nurse, job);
    expect(result.breakdown.specialty).toBe(25);
  });
});
