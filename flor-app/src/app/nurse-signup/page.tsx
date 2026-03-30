"use client";

import { useState } from "react";
import FlorVerifiedBadge from "@/components/FlorVerifiedBadge";
import { supabase } from "@/lib/supabase";
import type { NurseProfileRow, AvailabilityType, PreferredSetting } from "@/data/types";

// ─── Step data shapes ──────────────────────────────────────────────────────

interface Step1 {
  full_name: string;
  email: string;
  phone: string;
  years_experience: string;
  employment_status: string;
}

interface Step2 {
  license_number: string;
  license_state: string;
  license_verified: boolean;
  license_expires: string | null;
  license_status: string;
  discipline_flags: boolean;
  verifyState: "idle" | "loading" | "success" | "error";
  verifyError: string;
}

interface Step3 {
  specialty: string;
  preferred_settings: PreferredSetting[];
  availability: AvailabilityType | "";
  pslf_interest: boolean | null;
  bio: string;
}

interface Step4 {
  desired_pay_min: string;
  desired_pay_max: string;
  location_city: string;
  location_state: string;
  willing_to_travel: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
];

const SPECIALTIES = [
  "Med-Surg","Geriatrics","Pediatrics","Community Health","Behavioral Health",
  "Oncology","Cardiac","Emergency","ICU/Critical Care","OB/Labor & Delivery",
  "Orthopedics","Primary Care",
];

const SETTINGS: { value: PreferredSetting; label: string }[] = [
  { value: "PACE", label: "PACE program" },
  { value: "FQHC", label: "FQHC / community health center" },
  { value: "school district", label: "School district" },
  { value: "home health", label: "Home health" },
  { value: "other", label: "Other community setting" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
              i + 1 === current
                ? "bg-periwinkle text-white"
                : i + 1 < current
                ? "bg-periwinkle-dark text-white"
                : "bg-periwinkle-100 text-text-light"
            }`}
          >
            {i + 1 < current ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              i + 1
            )}
          </div>
          {i < total - 1 && (
            <div className={`h-px w-8 ${i + 1 < current ? "bg-periwinkle-dark" : "bg-periwinkle-100"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-semibold text-text mb-1">{children}</label>;
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-periwinkle focus:border-transparent transition ${props.className ?? ""}`}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-periwinkle focus:border-transparent transition bg-white ${props.className ?? ""}`}
    />
  );
}

// ─── Main component ────────────────────────────────────────────────────────

export default function NurseSignupPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [savedProfile, setSavedProfile] = useState<NurseProfileRow | null>(null);

  const [s1, setS1] = useState<Step1>({
    full_name: "", email: "", phone: "", years_experience: "", employment_status: "",
  });

  const [s2, setS2] = useState<Step2>({
    license_number: "", license_state: "",
    license_verified: false, license_expires: null, license_status: "",
    discipline_flags: false, verifyState: "idle", verifyError: "",
  });

  const [s3, setS3] = useState<Step3>({
    specialty: "", preferred_settings: [], availability: "", pslf_interest: null, bio: "",
  });

  const [s4, setS4] = useState<Step4>({
    desired_pay_min: "", desired_pay_max: "", location_city: "",
    location_state: "", willing_to_travel: false,
  });

  // ── Step 2: verify license ───────────────────────────────────────────────
  async function handleVerifyLicense() {
    if (!s2.license_number.trim() || !s2.license_state) return;
    setS2((p) => ({ ...p, verifyState: "loading", verifyError: "" }));
    try {
      const res = await fetch("/api/verify-license", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseNumber: s2.license_number, state: s2.license_state }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");
      const verified = data.licenseStatus === "active" || data.licenseStatus === "current";
      setS2((p) => ({
        ...p,
        verifyState: verified ? "success" : "error",
        license_verified: verified,
        license_expires: data.expirationDate ?? null,
        license_status: data.licenseStatus ?? "",
        discipline_flags: data.disciplineFlags ?? false,
        verifyError: verified ? "" : `License status: ${data.licenseStatus || "not found"}. Check the number and state, or contact support.`,
      }));
    } catch (err) {
      setS2((p) => ({
        ...p,
        verifyState: "error",
        verifyError: err instanceof Error ? err.message : "Verification failed. Please try again.",
      }));
    }
  }

  // ── Final submit ─────────────────────────────────────────────────────────
  async function handleSubmit() {
    setSubmitting(true);
    try {
      const row: NurseProfileRow = {
        full_name: s1.full_name,
        email: s1.email,
        phone: s1.phone,
        years_experience: parseInt(s1.years_experience, 10) || 0,
        specialty: s3.specialty,
        preferred_settings: s3.preferred_settings,
        availability: s3.availability as AvailabilityType,
        license_number: s2.license_number,
        license_state: s2.license_state,
        license_verified: s2.license_verified,
        license_expires: s2.license_expires,
        license_status: s2.license_status,
        discipline_flags: s2.discipline_flags,
        bio: s3.bio,
        pslf_interest: s3.pslf_interest ?? false,
        desired_pay_min: parseFloat(s4.desired_pay_min) || undefined,
        desired_pay_max: parseFloat(s4.desired_pay_max) || undefined,
        location_city: s4.location_city,
        location_state: s4.location_state,
        willing_to_travel: s4.willing_to_travel,
        is_test_profile: false,
      };

      const { data, error } = await supabase
        .from("nurse_profiles")
        .insert(row)
        .select()
        .single();

      if (error) throw error;
      setSavedProfile(data);
      setDone(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Done screen ──────────────────────────────────────────────────────────
  if (done && savedProfile) {
    return (
      <div className="min-h-screen bg-offwhite flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full bg-white rounded-2xl card-shadow p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-text mb-2">You&apos;re in.</h1>
          <p className="text-text-light text-sm mb-6">Your profile is live. Employers can now see you.</p>

          {/* Profile card preview */}
          <div className="bg-periwinkle-50 rounded-xl p-5 text-left mb-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-bold text-text">{savedProfile.full_name}</p>
                <p className="text-sm text-text-light">{savedProfile.specialty} · {savedProfile.years_experience} yrs exp</p>
                <p className="text-sm text-text-light capitalize">{savedProfile.availability} · {savedProfile.location_city}, {savedProfile.location_state}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-periwinkle flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {savedProfile.full_name.charAt(0)}
              </div>
            </div>
            {savedProfile.license_verified && !savedProfile.discipline_flags && (
              <FlorVerifiedBadge size="sm" />
            )}
            {savedProfile.bio && (
              <p className="text-xs text-text-light mt-3 italic">&ldquo;{savedProfile.bio}&rdquo;</p>
            )}
          </div>

          <a href="/jobs" className="block bg-periwinkle text-white rounded-xl py-3 font-semibold hover:bg-periwinkle-dark transition-colors text-sm">
            Browse open jobs
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-offwhite flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text">Create your Flor profile</h1>
          <p className="text-text-light text-sm mt-1">Direct-hire only. No recruiters, no guesswork.</p>
        </div>

        <StepIndicator current={step} total={4} />

        <div className="bg-white rounded-2xl card-shadow p-6 sm:p-8">
          {/* ── Step 1: Basic Info ── */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-text">Basic info</h2>

              <div>
                <Label>Full name</Label>
                <Input
                  value={s1.full_name}
                  onChange={(e) => setS1((p) => ({ ...p, full_name: e.target.value }))}
                  placeholder="Maria Reyes"
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={s1.email}
                  onChange={(e) => setS1((p) => ({ ...p, email: e.target.value }))}
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <Label>Phone</Label>
                <Input
                  type="tel"
                  value={s1.phone}
                  onChange={(e) => setS1((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="401-555-0000"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Years of experience</Label>
                  <Select
                    value={s1.years_experience}
                    onChange={(e) => setS1((p) => ({ ...p, years_experience: e.target.value }))}
                  >
                    <option value="">Select</option>
                    {["< 1","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","15+"].map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label>Current status</Label>
                  <Select
                    value={s1.employment_status}
                    onChange={(e) => setS1((p) => ({ ...p, employment_status: e.target.value }))}
                  >
                    <option value="">Select</option>
                    <option>Currently employed</option>
                    <option>Actively looking</option>
                    <option>Open to the right role</option>
                    <option>Not currently working</option>
                  </Select>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!s1.full_name || !s1.email || !s1.years_experience}
                className="w-full bg-periwinkle text-white rounded-xl py-3 font-semibold hover:bg-periwinkle-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          )}

          {/* ── Step 2: License ── */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-text">Your nursing license</h2>
              <p className="text-sm text-text-light">We verify licenses in real time via Nursys. This takes a few seconds.</p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>License number</Label>
                  <Input
                    value={s2.license_number}
                    onChange={(e) => {
                      setS2((p) => ({ ...p, license_number: e.target.value, verifyState: "idle", verifyError: "" }));
                    }}
                    placeholder="RN-12345"
                  />
                </div>
                <div>
                  <Label>Issuing state</Label>
                  <Select
                    value={s2.license_state}
                    onChange={(e) => {
                      setS2((p) => ({ ...p, license_state: e.target.value, verifyState: "idle", verifyError: "" }));
                    }}
                  >
                    <option value="">State</option>
                    {US_STATES.map((s) => <option key={s}>{s}</option>)}
                  </Select>
                </div>
              </div>

              <button
                onClick={handleVerifyLicense}
                disabled={!s2.license_number || !s2.license_state || s2.verifyState === "loading"}
                className="w-full border-2 border-periwinkle text-periwinkle-dark rounded-xl py-3 font-semibold hover:bg-periwinkle-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {s2.verifyState === "loading" ? "Verifying license…" : "Verify license"}
              </button>

              {s2.verifyState === "success" && (
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-green-800">License verified</p>
                    {s2.license_expires && (
                      <p className="text-xs text-green-700">Expires {s2.license_expires}</p>
                    )}
                  </div>
                </div>
              )}

              {s2.verifyState === "error" && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <p className="text-sm font-semibold text-red-800 mb-1">Couldn&apos;t verify license</p>
                  <p className="text-xs text-red-700">{s2.verifyError}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 border border-gray-200 text-text-light rounded-xl py-3 font-semibold hover:bg-gray-50 transition-colors text-sm">
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!s2.license_number || !s2.license_state}
                  className="flex-1 bg-periwinkle text-white rounded-xl py-3 font-semibold hover:bg-periwinkle-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                >
                  {s2.verifyState === "success" ? "Continue" : "Skip for now"}
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: Profile ── */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-text">Your profile</h2>

              <div>
                <Label>Primary specialty</Label>
                <Select
                  value={s3.specialty}
                  onChange={(e) => setS3((p) => ({ ...p, specialty: e.target.value }))}
                >
                  <option value="">Select specialty</option>
                  {SPECIALTIES.map((s) => <option key={s}>{s}</option>)}
                </Select>
              </div>

              <div>
                <Label>Preferred care settings <span className="font-normal text-text-light">(select all that apply)</span></Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {SETTINGS.map(({ value, label }) => {
                    const checked = s3.preferred_settings.includes(value);
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setS3((p) => ({
                            ...p,
                            preferred_settings: checked
                              ? p.preferred_settings.filter((s) => s !== value)
                              : [...p.preferred_settings, value],
                          }))
                        }
                        className={`text-left px-3 py-2 rounded-xl text-sm border transition-colors ${
                          checked
                            ? "bg-periwinkle-50 border-periwinkle text-periwinkle-dark font-medium"
                            : "border-gray-200 text-text-light hover:border-periwinkle-light"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <Label>Availability</Label>
                <div className="flex gap-2 mt-1">
                  {(["full-time","part-time","per-diem"] as AvailabilityType[]).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setS3((p) => ({ ...p, availability: v }))}
                      className={`flex-1 py-2 rounded-xl text-sm border transition-colors font-medium ${
                        s3.availability === v
                          ? "bg-periwinkle text-white border-periwinkle"
                          : "border-gray-200 text-text-light hover:border-periwinkle-light"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>PSLF interest</Label>
                <p className="text-xs text-text-light mb-2">Public Service Loan Forgiveness — available at qualifying nonprofits</p>
                <div className="flex gap-2">
                  {[{ v: true, l: "Yes, interested" }, { v: false, l: "Not relevant to me" }].map(({ v, l }) => (
                    <button
                      key={String(v)}
                      type="button"
                      onClick={() => setS3((p) => ({ ...p, pslf_interest: v }))}
                      className={`flex-1 py-2 rounded-xl text-sm border transition-colors font-medium ${
                        s3.pslf_interest === v
                          ? "bg-periwinkle text-white border-periwinkle"
                          : "border-gray-200 text-text-light hover:border-periwinkle-light"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Short bio <span className="font-normal text-text-light">(3 sentences max)</span></Label>
                <p className="text-xs text-text-light mb-1">Say it in your own voice. What do you care about? What are you looking for?</p>
                <textarea
                  value={s3.bio}
                  onChange={(e) => setS3((p) => ({ ...p, bio: e.target.value }))}
                  rows={4}
                  placeholder="I've spent 7 years in med-surg and I'm looking for a role with more continuity of care..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-periwinkle focus:border-transparent transition resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 border border-gray-200 text-text-light rounded-xl py-3 font-semibold hover:bg-gray-50 transition-colors text-sm">
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  disabled={!s3.specialty || !s3.availability}
                  className="flex-1 bg-periwinkle text-white rounded-xl py-3 font-semibold hover:bg-periwinkle-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* ── Step 4: Preferences ── */}
          {step === 4 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-text">Preferences</h2>

              <div>
                <Label>Desired pay range (hourly)</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light text-sm">$</span>
                    <Input
                      type="number"
                      placeholder="Min"
                      value={s4.desired_pay_min}
                      onChange={(e) => setS4((p) => ({ ...p, desired_pay_min: e.target.value }))}
                      className="pl-7"
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light text-sm">$</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={s4.desired_pay_max}
                      onChange={(e) => setS4((p) => ({ ...p, desired_pay_max: e.target.value }))}
                      className="pl-7"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>City</Label>
                  <Input
                    value={s4.location_city}
                    onChange={(e) => setS4((p) => ({ ...p, location_city: e.target.value }))}
                    placeholder="Providence"
                  />
                </div>
                <div>
                  <Label>State</Label>
                  <Select
                    value={s4.location_state}
                    onChange={(e) => setS4((p) => ({ ...p, location_state: e.target.value }))}
                  >
                    <option value="">State</option>
                    {US_STATES.map((s) => <option key={s}>{s}</option>)}
                  </Select>
                </div>
              </div>

              <div>
                <Label>Willing to travel within state?</Label>
                <div className="flex gap-2 mt-1">
                  {[{ v: true, l: "Yes" }, { v: false, l: "No" }].map(({ v, l }) => (
                    <button
                      key={String(v)}
                      type="button"
                      onClick={() => setS4((p) => ({ ...p, willing_to_travel: v }))}
                      className={`flex-1 py-2 rounded-xl text-sm border transition-colors font-medium ${
                        s4.willing_to_travel === v
                          ? "bg-periwinkle text-white border-periwinkle"
                          : "border-gray-200 text-text-light hover:border-periwinkle-light"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(3)} className="flex-1 border border-gray-200 text-text-light rounded-xl py-3 font-semibold hover:bg-gray-50 transition-colors text-sm">
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 bg-periwinkle text-white rounded-xl py-3 font-semibold hover:bg-periwinkle-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                >
                  {submitting ? "Creating profile…" : "Create my profile"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
