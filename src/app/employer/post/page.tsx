"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { seedFacilities } from "@/data/seed-facilities";

/* ── Constants ────────────────────────────────────────────────────── */

const SPECIALTIES = [
  "Med Surg", "ICU", "ED", "OR", "L&D", "NICU", "Peds", "Psych",
  "Home Health", "Oncology", "Rehab", "School Nurse", "Telemetry",
  "Cardiac", "Outpatient/Clinic", "SNF/LTC",
];

const CERTIFICATIONS = ["BLS", "ACLS", "PALS", "NRP", "TNCC", "CCRN", "CEN", "RNC"];

const SHIFT_OPTIONS = ["Days", "Evenings", "Nights", "Rotating"];
const SCHEDULE_TYPES = ["Full-time", "Part-time", "Per diem"];

const CARE_SETTINGS = [
  "Acute care/Hospital", "SNF/Long-term care", "Outpatient clinic",
  "Home health", "School", "Ambulatory surgery", "Rehab", "Psych facility",
];

const PATIENT_POPULATIONS = ["Adult", "Geriatric", "Pediatric", "Neonatal", "Maternal", "Psychiatric"];

const EHR_SYSTEMS = ["Epic", "Cerner/Oracle Health", "Meditech", "PointClickCare", "Athenahealth"];

/* ── Types ────────────────────────────────────────────────────────── */

interface CertRequirement {
  name: string;
  level: "required" | "preferred";
}

const RANGE_REASONS = [
  "Range reflects shift differential (nights/weekends)",
  "Range reflects years of experience",
  "Range reflects PRN vs. full-time rate",
  "Range reflects unit or specialty placement",
  "Other — please specify",
];

interface JobForm {
  title: string;
  specialty: string;
  secondarySpecialty: string;
  certifications: CertRequirement[];
  minYearsTotal: string;
  minYearsSpecialty: string;
  experienceStrict: boolean;
  shift: string;
  scheduleType: string;
  careSetting: string;
  patientPopulation: string;
  payType: "single" | "range" | "";
  payFormat: "hr" | "yr";
  payMin: string;
  payMax: string;
  payRangeReason: string;
  ehrSystem: string;
  description: string;
  facilityAddress: string;
  facilityId: string;
  signOnBonus: string;
  shiftDifferentials: string;
  tuitionReimbursement: string;
  loanForgiveness: boolean;
  relocationAssistance: boolean;
  patientRatio: string;
}

/* ── Component ────────────────────────────────────────────────────── */

export default function PostJobPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState<JobForm>({
    title: "",
    specialty: "",
    secondarySpecialty: "",
    certifications: [],
    minYearsTotal: "",
    minYearsSpecialty: "",
    experienceStrict: false,
    shift: "",
    scheduleType: "",
    careSetting: "",
    patientPopulation: "",
    payType: "",
    payFormat: "hr",
    payMin: "",
    payMax: "",
    payRangeReason: "",
    ehrSystem: "",
    description: "",
    facilityAddress: "",
    facilityId: "",
    signOnBonus: "",
    shiftDifferentials: "",
    tuitionReimbursement: "",
    loanForgiveness: false,
    relocationAssistance: false,
    patientRatio: "",
  });

  /* Pre-fill address from facility */
  useEffect(() => {
    if (form.facilityId) {
      const fac = seedFacilities.find((f) => f.id === form.facilityId);
      if (fac?.location?.address) {
        setForm((prev) => ({ ...prev, facilityAddress: fac.location.address || "" }));
      }
    }
  }, [form.facilityId]);

  /* ── Cert helpers ───────────────────────────────────────────────── */

  function toggleCert(certName: string) {
    setForm((prev) => {
      const exists = prev.certifications.find((c) => c.name === certName);
      if (exists) {
        return { ...prev, certifications: prev.certifications.filter((c) => c.name !== certName) };
      }
      return { ...prev, certifications: [...prev.certifications, { name: certName, level: "required" }] };
    });
  }

  function toggleCertLevel(certName: string) {
    setForm((prev) => ({
      ...prev,
      certifications: prev.certifications.map((c) =>
        c.name === certName ? { ...c, level: c.level === "required" ? "preferred" : "required" } : c,
      ),
    }));
  }

  function isCertSelected(certName: string) {
    return form.certifications.some((c) => c.name === certName);
  }

  function getCertLevel(certName: string) {
    return form.certifications.find((c) => c.name === certName)?.level || "required";
  }

  /* ── Submit ─────────────────────────────────────────────────────── */

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.payMin || !form.payMax) return;

    const fac = seedFacilities.find((f) => f.id === form.facilityId);

    const newJob = {
      id: `job-post-${Date.now()}`,
      facilityId: form.facilityId || "facility-bayside",
      facilityName: fac?.name || "Your Facility",
      title: form.title,
      payRange: { min: Number(form.payMin), max: Number(form.payMax) },
      payUnit: "hr",
      payExplained: `$${form.payMin}–$${form.payMax}/hr`,
      type: form.scheduleType || "Full-time",
      location: fac?.location || { city: "Providence", state: "RI" },
      schedule: `${form.shift || "Days"}`,
      scheduleType: form.shift || "Days",
      scheduleBadges: [form.scheduleType || "Full-time", form.shift || "Days"],
      licenseRequired: { type: "RN", state: "RI" },
      certificationsRequired: form.certifications.filter((c) => c.level === "required").map((c) => c.name),
      certificationsPreferred: form.certifications.filter((c) => c.level === "preferred").map((c) => c.name),
      experienceRange: { min: Number(form.minYearsTotal) || 0, max: 20 },
      yearsSpecialtyRequired: Number(form.minYearsSpecialty) || 0,
      experienceStrict: form.experienceStrict,
      drivingRequired: false,
      ehrSystem: form.ehrSystem || undefined,
      specialty: form.specialty || undefined,
      secondarySpecialty: form.secondarySpecialty || undefined,
      careSetting: form.careSetting || undefined,
      patientPopulation: form.patientPopulation || undefined,
      union: false,
      description: form.description || undefined,
      postedDate: new Date().toISOString().slice(0, 10),
      status: "active" as const,
      questions: [],
    };

    /* Save to localStorage */
    try {
      const existing = JSON.parse(localStorage.getItem("flor-employer-jobs") || "null");
      const allJobs = existing ? [newJob, ...existing] : [newJob, ...[]];
      localStorage.setItem("flor-employer-jobs", JSON.stringify(allJobs));
    } catch {
      localStorage.setItem("flor-employer-jobs", JSON.stringify([newJob]));
    }

    setSubmitted(true);
    setTimeout(() => router.push("/employer"), 1500);
  }

  /* ── Validation ─────────────────────────────────────────────────── */

  const payValid = form.payType === "single"
    ? !!form.payMin
    : form.payType === "range"
    ? form.payMin && form.payMax && Number(form.payMax) >= Number(form.payMin) && !!form.payRangeReason
    : false;
  const canSubmit = form.title && form.specialty && payValid && form.shift && form.scheduleType;

  /* ── Render ─────────────────────────────────────────────────────── */

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#FAFAFE] flex items-center justify-center">
        <div className="animate-fade-in-up text-center">
          <div className="w-20 h-20 rounded-full bg-success-light flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-text mb-2">Job Posted Successfully!</h1>
          <p className="text-text-light">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFE]">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-8 sm:py-12">
        <div className="animate-fade-in-up">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/employer"
              className="rounded-full w-10 h-10 flex items-center justify-center border border-periwinkle-100/60 text-text-light hover:border-periwinkle hover:text-periwinkle transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-text">Post a New Job</h1>
              <p className="text-text-light mt-1">Create a listing that matches nurses to your needs</p>
            </div>
          </div>

          {/* Onboarding checklist */}
          <div className="bg-[#1E1E2E] rounded-2xl p-6 sm:p-8 mb-8 max-w-3xl">
            <h2 className="text-lg font-extrabold text-white mb-1">Complete listings get 3x more qualified applicants</h2>
            <p className="text-sm text-white/60 mb-5">Nurses filter by pay, shift, and benefits before they read a job description. Fill in every field.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { label: "Pay", done: payValid },
                { label: "Shift times", done: !!form.shift },
                { label: "Specialty", done: !!form.specialty },
                { label: "Employment type", done: !!form.scheduleType },
                { label: "Location", done: !!form.facilityId },
                { label: "Certifications", done: form.certifications.length > 0 },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${item.done ? "bg-[#2ECC71]" : "bg-white/10"}`}>
                    {item.done && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm ${item.done ? "text-white font-semibold" : "text-white/50"}`}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="max-w-3xl">
            <div className="space-y-8">
              {/* ── Facility ─────────────────────────────────────── */}
              <Section num={0} title="Facility" subtitle="Which facility is this job for?">
                <select
                  value={form.facilityId}
                  onChange={(e) => setForm({ ...form, facilityId: e.target.value })}
                  className="w-full rounded-xl border border-periwinkle-100/60 bg-white px-4 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-periwinkle/40"
                >
                  <option value="">Select a facility...</option>
                  {seedFacilities.map((f) => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </Section>

              {/* ── 1. Job Title ──────────────────────────────────── */}
              <Section num={1} title="Job Title" subtitle="Be specific — nurses search by title">
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder='e.g. "ICU RN — Night Shift" or "Med Surg / Telemetry RN"'
                  className="w-full rounded-xl border border-periwinkle-100/60 bg-white px-4 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-periwinkle/40"
                />
              </Section>

              {/* ── 2. Specialty ──────────────────────────────────── */}
              <Section num={2} title="Required Specialty" subtitle="Primary specialty for this role">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-text-light mb-1.5">Primary Specialty *</label>
                    <select
                      value={form.specialty}
                      onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                      className="w-full rounded-xl border border-periwinkle-100/60 bg-white px-4 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-periwinkle/40"
                    >
                      <option value="">Select specialty...</option>
                      {SPECIALTIES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-light mb-1.5">Secondary Specialty (optional)</label>
                    <select
                      value={form.secondarySpecialty}
                      onChange={(e) => setForm({ ...form, secondarySpecialty: e.target.value })}
                      className="w-full rounded-xl border border-periwinkle-100/60 bg-white px-4 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-periwinkle/40"
                    >
                      <option value="">None</option>
                      {SPECIALTIES.filter((s) => s !== form.specialty).map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </Section>

              {/* ── 3. Certifications ─────────────────────────────── */}
              <Section num={3} title="Certifications" subtitle="Select certs and mark each as Required or Preferred">
                <div className="space-y-2">
                  {CERTIFICATIONS.map((cert) => {
                    const selected = isCertSelected(cert);
                    const level = getCertLevel(cert);
                    return (
                      <div key={cert} className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => toggleCert(cert)}
                          className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
                            selected
                              ? "bg-periwinkle text-white"
                              : "bg-white border border-periwinkle-100/60 text-text-light hover:border-periwinkle hover:text-periwinkle"
                          }`}
                        >
                          {cert}
                        </button>
                        {selected && (
                          <button
                            type="button"
                            onClick={() => toggleCertLevel(cert)}
                            className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
                              level === "required"
                                ? "bg-success-light text-success"
                                : "bg-amber/10 text-amber"
                            }`}
                          >
                            {level === "required" ? "Required" : "Preferred"}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Section>

              {/* ── 4. Experience Requirements ────────────────────── */}
              <Section num={4} title="Experience Requirements" subtitle="Set minimums for total and specialty experience">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-text-light mb-1.5">Min Total Years</label>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={form.minYearsTotal}
                      onChange={(e) => setForm({ ...form, minYearsTotal: e.target.value })}
                      placeholder="0"
                      className="w-full rounded-xl border border-periwinkle-100/60 bg-white px-4 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-periwinkle/40"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-light mb-1.5">Min Years in Specialty</label>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={form.minYearsSpecialty}
                      onChange={(e) => setForm({ ...form, minYearsSpecialty: e.target.value })}
                      placeholder="0"
                      className="w-full rounded-xl border border-periwinkle-100/60 bg-white px-4 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-periwinkle/40"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, experienceStrict: true })}
                    className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
                      form.experienceStrict
                        ? "bg-periwinkle text-white"
                        : "bg-white border border-periwinkle-100/60 text-text-light hover:border-periwinkle"
                    }`}
                  >
                    Strict minimum
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, experienceStrict: false })}
                    className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
                      !form.experienceStrict
                        ? "bg-periwinkle text-white"
                        : "bg-white border border-periwinkle-100/60 text-text-light hover:border-periwinkle"
                    }`}
                  >
                    Preferred — open to strong candidates with less
                  </button>
                </div>
              </Section>

              {/* ── 5. Shift ──────────────────────────────────────── */}
              <Section num={5} title="Shift" subtitle="When does this role work?">
                <div className="flex flex-wrap gap-2">
                  {SHIFT_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setForm({ ...form, shift: opt })}
                      className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
                        form.shift === opt
                          ? "bg-periwinkle text-white"
                          : "bg-white border border-periwinkle-100/60 text-text-light hover:border-periwinkle hover:text-periwinkle"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </Section>

              {/* ── 6. Schedule Type ──────────────────────────────── */}
              <Section num={6} title="Schedule Type" subtitle="Employment type for this position">
                <div className="flex flex-wrap gap-2">
                  {SCHEDULE_TYPES.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setForm({ ...form, scheduleType: opt })}
                      className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
                        form.scheduleType === opt
                          ? "bg-periwinkle text-white"
                          : "bg-white border border-periwinkle-100/60 text-text-light hover:border-periwinkle hover:text-periwinkle"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </Section>

              {/* ── 7. Care Setting ───────────────────────────────── */}
              <Section num={7} title="Care Setting" subtitle="Where will this nurse work?">
                <div className="flex flex-wrap gap-2">
                  {CARE_SETTINGS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setForm({ ...form, careSetting: opt })}
                      className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
                        form.careSetting === opt
                          ? "bg-periwinkle text-white"
                          : "bg-white border border-periwinkle-100/60 text-text-light hover:border-periwinkle hover:text-periwinkle"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </Section>

              {/* ── 8. Patient Population ─────────────────────────── */}
              <Section num={8} title="Patient Population" subtitle="Who will this nurse care for?">
                <div className="flex flex-wrap gap-2">
                  {PATIENT_POPULATIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setForm({ ...form, patientPopulation: opt })}
                      className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
                        form.patientPopulation === opt
                          ? "bg-periwinkle text-white"
                          : "bg-white border border-periwinkle-100/60 text-text-light hover:border-periwinkle hover:text-periwinkle"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </Section>

              {/* ── 9. Pay — Redesigned ────────────────────────────── */}
              <Section num={9} title="Pay" subtitle="Pay is required. The form cannot progress without it.">
                {/* Step 1: Pay type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, payType: "single", payMax: form.payMin })}
                    className={`rounded-2xl border-2 p-5 text-left transition-all ${
                      form.payType === "single"
                        ? "border-periwinkle bg-periwinkle-50"
                        : "border-periwinkle-100/60 hover:border-periwinkle/40"
                    }`}
                  >
                    <div className="text-sm font-bold text-text mb-1">Single Rate</div>
                    <div className="text-xs text-periwinkle font-semibold">✦ Nurses prefer a clear number over a range</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, payType: "range" })}
                    className={`rounded-2xl border-2 p-5 text-left transition-all ${
                      form.payType === "range"
                        ? "border-periwinkle bg-periwinkle-50"
                        : "border-periwinkle-100/60 hover:border-periwinkle/40"
                    }`}
                  >
                    <div className="text-sm font-bold text-text mb-1">Pay Range</div>
                    <div className="text-xs text-text-muted">Min and max with required explanation</div>
                  </button>
                </div>

                {/* Step 2: Format toggle */}
                {form.payType && (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-bold text-text-light">Format:</span>
                    <button type="button" onClick={() => setForm({ ...form, payFormat: "hr" })}
                      className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${form.payFormat === "hr" ? "bg-periwinkle text-white" : "bg-white border border-periwinkle-100/60 text-text-light"}`}>
                      $/hr
                    </button>
                    <button type="button" onClick={() => setForm({ ...form, payFormat: "yr" })}
                      className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${form.payFormat === "yr" ? "bg-periwinkle text-white" : "bg-white border border-periwinkle-100/60 text-text-light"}`}>
                      $/yr
                    </button>
                  </div>
                )}

                {/* Step 3: Pay inputs */}
                {form.payType === "single" && (
                  <div className="mb-3">
                    <label className="block text-xs font-bold text-text-light mb-1.5">Rate *</label>
                    <input
                      type="number" min="0" step="0.5"
                      value={form.payMin}
                      onChange={(e) => setForm({ ...form, payMin: e.target.value, payMax: e.target.value })}
                      placeholder={form.payFormat === "hr" ? "45" : "85000"}
                      className="w-full rounded-xl border border-periwinkle-100/60 bg-white px-4 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-periwinkle/40"
                    />
                  </div>
                )}

                {form.payType === "range" && (
                  <>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-xs font-bold text-text-light mb-1.5">Min *</label>
                        <input type="number" min="0" step="0.5" value={form.payMin}
                          onChange={(e) => setForm({ ...form, payMin: e.target.value })}
                          placeholder={form.payFormat === "hr" ? "35" : "65000"}
                          className="w-full rounded-xl border border-periwinkle-100/60 bg-white px-4 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-periwinkle/40" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-text-light mb-1.5">Max *</label>
                        <input type="number" min="0" step="0.5" value={form.payMax}
                          onChange={(e) => setForm({ ...form, payMax: e.target.value })}
                          placeholder={form.payFormat === "hr" ? "52" : "95000"}
                          className="w-full rounded-xl border border-periwinkle-100/60 bg-white px-4 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-periwinkle/40" />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="block text-xs font-bold text-text-light mb-1.5">What explains this range? *</label>
                      <select value={form.payRangeReason} onChange={(e) => setForm({ ...form, payRangeReason: e.target.value })}
                        className="w-full rounded-xl border border-periwinkle-100/60 bg-white px-4 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-periwinkle/40">
                        <option value="">Select a reason...</option>
                        {RANGE_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  </>
                )}

                <div className="flex items-start gap-2 bg-periwinkle-50 rounded-xl p-3">
                  <svg className="w-4 h-4 text-periwinkle mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs text-periwinkle-dark leading-relaxed">
                    Flor requires transparent pay. Nurses see this upfront — it&apos;s why they trust the platform.
                  </p>
                </div>
              </Section>

              {/* ── 9b. Encouraged Fields ───────────────────────────── */}
              <Section num={0} title="Benefits & Perks" subtitle="Encouraged — complete listings get 3x more qualified applicants">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-text-light mb-1.5">
                      Sign-on bonus amount
                      {!form.signOnBonus && <span className="text-periwinkle ml-1">✦ Nurses love this</span>}
                    </label>
                    <input type="text" value={form.signOnBonus} onChange={(e) => setForm({ ...form, signOnBonus: e.target.value })}
                      placeholder="$5,000"
                      className="w-full rounded-xl border border-periwinkle-100/60 bg-white px-4 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-periwinkle/40" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-light mb-1.5">
                      Shift differentials
                      {!form.shiftDifferentials && <span className="text-periwinkle ml-1">✦ Nurses love this</span>}
                    </label>
                    <input type="text" value={form.shiftDifferentials} onChange={(e) => setForm({ ...form, shiftDifferentials: e.target.value })}
                      placeholder="Night $5/hr, Weekend $6/hr"
                      className="w-full rounded-xl border border-periwinkle-100/60 bg-white px-4 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-periwinkle/40" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-light mb-1.5">
                      Tuition reimbursement details
                      {!form.tuitionReimbursement && <span className="text-periwinkle ml-1">✦ Nurses love this</span>}
                    </label>
                    <input type="text" value={form.tuitionReimbursement} onChange={(e) => setForm({ ...form, tuitionReimbursement: e.target.value })}
                      placeholder="Up to $5,250/yr"
                      className="w-full rounded-xl border border-periwinkle-100/60 bg-white px-4 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-periwinkle/40" />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" checked={form.loanForgiveness} onChange={(e) => setForm({ ...form, loanForgiveness: e.target.checked })}
                        className="w-4 h-4 rounded border-periwinkle-100 accent-periwinkle" />
                      <span className="text-sm text-text">Loan forgiveness eligible</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" checked={form.relocationAssistance} onChange={(e) => setForm({ ...form, relocationAssistance: e.target.checked })}
                        className="w-4 h-4 rounded border-periwinkle-100 accent-periwinkle" />
                      <span className="text-sm text-text">Relocation assistance</span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-light mb-1.5">
                      Nurse-to-patient ratio
                      {!form.patientRatio && <span className="text-periwinkle ml-1">✦ Nurses love this</span>}
                    </label>
                    <input type="text" value={form.patientRatio} onChange={(e) => setForm({ ...form, patientRatio: e.target.value })}
                      placeholder="5:1"
                      className="w-full rounded-xl border border-periwinkle-100/60 bg-white px-4 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-periwinkle/40" />
                  </div>
                </div>
              </Section>

              {/* ── 10. EHR System ────────────────────────────────── */}
              <Section num={10} title="EHR System" subtitle="Which electronic health record do you use?">
                <select
                  value={form.ehrSystem}
                  onChange={(e) => setForm({ ...form, ehrSystem: e.target.value })}
                  className="w-full rounded-xl border border-periwinkle-100/60 bg-white px-4 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-periwinkle/40"
                >
                  <option value="">Select EHR...</option>
                  {EHR_SYSTEMS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Section>

              {/* ── 11. Description ───────────────────────────────── */}
              <Section num={11} title="Job Description" subtitle="Describe the role, unit, and what makes it great">
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={5}
                  placeholder="Tell nurses about the unit culture, team, patient population, and why they'd love working here..."
                  className="w-full rounded-xl border border-periwinkle-100/60 bg-white px-4 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-periwinkle/40 resize-none"
                />
              </Section>

              {/* ── 12. Facility Address ──────────────────────────── */}
              <Section num={12} title="Facility Address" subtitle="Where is this position located?">
                <input
                  type="text"
                  value={form.facilityAddress}
                  onChange={(e) => setForm({ ...form, facilityAddress: e.target.value })}
                  placeholder="123 Main Street, Providence, RI 02903"
                  className="w-full rounded-xl border border-periwinkle-100/60 bg-white px-4 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-periwinkle/40"
                />
              </Section>

              {/* ── Submit ────────────────────────────────────────── */}
              <div className="pt-4 pb-12 flex items-center gap-4">
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={`text-white rounded-full px-8 py-3 font-bold text-sm transition-all duration-300 ${
                    canSubmit
                      ? "bg-periwinkle hover:bg-periwinkle-dark shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  Post Job
                </button>
                <Link
                  href="/employer"
                  className="rounded-full px-8 py-3 text-sm font-bold border border-periwinkle-100/60 text-text-light hover:border-periwinkle hover:text-periwinkle transition-colors"
                >
                  Cancel
                </Link>
                {!payValid && (form.payMin || form.payMax) && (
                  <p className="text-xs text-danger font-medium">Max must be greater than or equal to min.</p>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ── Section wrapper ──────────────────────────────────────────────── */

function Section({
  num,
  title,
  subtitle,
  children,
}: {
  num: number;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-periwinkle-100/40 section-shadow p-6">
      <div className="flex items-start gap-4 mb-4">
        {num > 0 && (
          <div className="w-8 h-8 rounded-full bg-periwinkle-50 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-extrabold text-periwinkle">{num}</span>
          </div>
        )}
        <div>
          <h2 className="text-base font-extrabold text-text">{title}</h2>
          <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
