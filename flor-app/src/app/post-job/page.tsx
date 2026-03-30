"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { JobPostingRow, EmploymentType, PayType } from "@/data/types";

// ─── Step shapes ──────────────────────────────────────────────────────────

interface Step1 {
  title: string;
  specialty_required: string;
  employment_type: EmploymentType | "";
  openings_count: string;
}

interface Step2 {
  pay_min: string;
  pay_max: string;
  pay_type: PayType;
  pay_negotiable: boolean;
  caseload: string;
  schedule: string;
  weekend_required: boolean;
  on_call_required: boolean;
  ehr_system: string;
}

interface Step3 {
  description: string;
  certifications_required: string;
  experience_preferred: string;
  pslf_eligible: boolean | null;
}

// ─── Constants ────────────────────────────────────────────────────────────

const SPECIALTIES = [
  "Med-Surg","Geriatrics","Pediatrics","Community Health","Behavioral Health",
  "Oncology","Cardiac","Emergency","ICU/Critical Care","OB/Labor & Delivery",
  "Orthopedics","Primary Care",
];

const EHR_SYSTEMS = [
  "Epic","Cerner","eClinicalWorks","Athenahealth","PointClickCare",
  "MatrixCare","OpenEMR","Other","None",
];

// ─── Helpers ──────────────────────────────────────────────────────────────

function StepIndicator({ current, total }: { current: number; total: number }) {
  const labels = ["Role basics","Pay & schedule","Details","Review"];
  return (
    <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 ${i + 1 === current ? "text-periwinkle" : i + 1 < current ? "text-periwinkle-dark" : "text-text-light"}`}>
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                i + 1 === current ? "bg-periwinkle text-white"
                : i + 1 < current ? "bg-periwinkle-dark text-white"
                : "bg-periwinkle-100 text-text-light"
              }`}
            >
              {i + 1 < current ? (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : i + 1}
            </div>
            <span className="text-xs font-medium whitespace-nowrap hidden sm:inline">{labels[i]}</span>
          </div>
          {i < total - 1 && <div className={`h-px w-4 flex-shrink-0 ${i + 1 < current ? "bg-periwinkle-dark" : "bg-periwinkle-100"}`} />}
        </div>
      ))}
    </div>
  );
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-semibold text-text mb-1">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
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

function ToggleChip({ label, value, checked, onChange }: {
  label: string; value: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`px-3 py-2 rounded-xl text-sm border transition-colors font-medium ${
        checked ? "bg-periwinkle text-white border-periwinkle" : "border-gray-200 text-text-light hover:border-periwinkle-light"
      }`}
    >
      {label}
    </button>
  );
  void value;
}

// ─── Review section helper ─────────────────────────────────────────────────

function ReviewRow({ label, value }: { label: string; value: string | React.ReactNode }) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-xs text-text-light">{label}</span>
      <span className="text-xs font-semibold text-text text-right max-w-xs">{value}</span>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────

function PostJobContent() {
  const searchParams = useSearchParams();
  const employerId = searchParams.get("employer_id") ?? "";

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [savedJobId, setSavedJobId] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const [s1, setS1] = useState<Step1>({ title: "", specialty_required: "", employment_type: "", openings_count: "1" });
  const [s2, setS2] = useState<Step2>({
    pay_min: "", pay_max: "", pay_type: "hourly", pay_negotiable: false,
    caseload: "", schedule: "", weekend_required: false, on_call_required: false, ehr_system: "",
  });
  const [s3, setS3] = useState<Step3>({ description: "", certifications_required: "", experience_preferred: "", pslf_eligible: null });

  async function handlePublish() {
    if (!confirmed) { alert("Please confirm the pay and caseload fields are accurate before publishing."); return; }
    setSubmitting(true);
    try {
      const row: JobPostingRow = {
        employer_id: employerId || "demo",
        title: s1.title,
        specialty_required: s1.specialty_required,
        employment_type: s1.employment_type as EmploymentType,
        openings_count: parseInt(s1.openings_count, 10) || 1,
        pay_min: parseFloat(s2.pay_min) || 0,
        pay_max: parseFloat(s2.pay_max) || 0,
        pay_type: s2.pay_type,
        pay_negotiable: s2.pay_negotiable,
        caseload: s2.caseload || undefined,
        schedule: s2.schedule || undefined,
        weekend_required: s2.weekend_required,
        on_call_required: s2.on_call_required,
        ehr_system: s2.ehr_system || undefined,
        description: s3.description || undefined,
        certifications_required: s3.certifications_required ? s3.certifications_required.split(",").map((c) => c.trim()).filter(Boolean) : [],
        experience_preferred: s3.experience_preferred || undefined,
        pslf_eligible: s3.pslf_eligible ?? false,
        status: "published",
      };

      const { data, error } = await supabase
        .from("job_postings")
        .insert(row)
        .select("id")
        .single();

      if (error) throw error;
      setSavedJobId(data.id);
      setDone(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-offwhite flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl card-shadow p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-text mb-2">Job is live.</h1>
          <p className="text-text-light text-sm mb-6">
            Nurses can now find <strong>{s1.title}</strong> and see the full pay and schedule details.
          </p>
          <div className="space-y-2">
            <a
              href={employerId ? `/employer-dashboard?id=${employerId}` : "/employer-dashboard"}
              className="block bg-periwinkle text-white rounded-xl py-3 font-semibold hover:bg-periwinkle-dark transition-colors text-sm"
            >
              Back to dashboard
            </a>
            <a
              href={`/post-job${employerId ? `?employer_id=${employerId}` : ""}`}
              className="block border border-gray-200 text-text-light rounded-xl py-3 font-semibold hover:bg-gray-50 transition-colors text-sm"
            >
              Post another job
            </a>
          </div>
          {savedJobId && <p className="text-xs text-text-light mt-4">Job ID: {savedJobId}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-offwhite flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text">Post a job</h1>
          <p className="text-text-light text-sm mt-1">Pay and caseload fields are required — not optional. That&apos;s the point.</p>
        </div>

        <StepIndicator current={step} total={4} />

        <div className="bg-white rounded-2xl card-shadow p-6 sm:p-8">

          {/* ── Step 1: Role basics ── */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-text">Role basics</h2>

              <div>
                <Label required>Job title</Label>
                <Input
                  value={s1.title}
                  onChange={(e) => setS1((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Registered Nurse — PACE Day Center"
                />
              </div>

              <div>
                <Label required>Specialty required</Label>
                <Select
                  value={s1.specialty_required}
                  onChange={(e) => setS1((p) => ({ ...p, specialty_required: e.target.value }))}
                >
                  <option value="">Select specialty</option>
                  {SPECIALTIES.map((s) => <option key={s}>{s}</option>)}
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label required>Employment type</Label>
                  <div className="flex flex-col gap-2 mt-1">
                    {(["full-time","part-time","per-diem"] as EmploymentType[]).map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setS1((p) => ({ ...p, employment_type: v }))}
                        className={`py-2 rounded-xl text-sm border transition-colors font-medium text-left px-3 ${
                          s1.employment_type === v ? "bg-periwinkle text-white border-periwinkle" : "border-gray-200 text-text-light hover:border-periwinkle-light"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Number of openings</Label>
                  <Input
                    type="number"
                    min="1"
                    value={s1.openings_count}
                    onChange={(e) => setS1((p) => ({ ...p, openings_count: e.target.value }))}
                  />
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!s1.title || !s1.specialty_required || !s1.employment_type}
                className="w-full bg-periwinkle text-white rounded-xl py-3 font-semibold hover:bg-periwinkle-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          )}

          {/* ── Step 2: Pay & schedule ── */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-text">Pay & schedule</h2>
              <p className="text-xs text-text-light bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                These fields are required. Nurses see this before deciding to apply — no surprises.
              </p>

              {/* Pay */}
              <div>
                <Label required>Pay range</Label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light text-sm">$</span>
                    <Input type="number" placeholder="Min" value={s2.pay_min} onChange={(e) => setS2((p) => ({ ...p, pay_min: e.target.value }))} className="pl-7" />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light text-sm">$</span>
                    <Input type="number" placeholder="Max" value={s2.pay_max} onChange={(e) => setS2((p) => ({ ...p, pay_max: e.target.value }))} className="pl-7" />
                  </div>
                  <Select value={s2.pay_type} onChange={(e) => setS2((p) => ({ ...p, pay_type: e.target.value as PayType }))}>
                    <option value="hourly">/ hour</option>
                    <option value="salary">/ year</option>
                  </Select>
                </div>
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={s2.pay_negotiable}
                    onChange={(e) => setS2((p) => ({ ...p, pay_negotiable: e.target.checked }))}
                    className="w-4 h-4 accent-periwinkle"
                  />
                  <span className="text-sm text-text-light">Pay is negotiable</span>
                </label>
              </div>

              {/* Caseload */}
              <div>
                <Label required>Caseload / patient ratio</Label>
                <Input
                  value={s2.caseload}
                  onChange={(e) => setS2((p) => ({ ...p, caseload: e.target.value }))}
                  placeholder="e.g. 1:8 patients, or 30 patients/day"
                />
              </div>

              {/* Schedule */}
              <div>
                <Label required>Schedule</Label>
                <Input
                  value={s2.schedule}
                  onChange={(e) => setS2((p) => ({ ...p, schedule: e.target.value }))}
                  placeholder="e.g. Mon–Fri 8am–4pm, no evenings"
                />
                <div className="flex gap-3 mt-2">
                  <ToggleChip label="Weekend shifts" value="weekend" checked={s2.weekend_required} onChange={(v) => setS2((p) => ({ ...p, weekend_required: v }))} />
                  <ToggleChip label="On-call required" value="oncall" checked={s2.on_call_required} onChange={(v) => setS2((p) => ({ ...p, on_call_required: v }))} />
                </div>
              </div>

              {/* EHR */}
              <div>
                <Label>EHR / charting system</Label>
                <Select value={s2.ehr_system} onChange={(e) => setS2((p) => ({ ...p, ehr_system: e.target.value }))}>
                  <option value="">Select (optional)</option>
                  {EHR_SYSTEMS.map((e) => <option key={e}>{e}</option>)}
                </Select>
                <p className="text-xs text-text-light mt-1">Informational only — not a dealbreaker for candidates.</p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 border border-gray-200 text-text-light rounded-xl py-3 font-semibold hover:bg-gray-50 transition-colors text-sm">Back</button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!s2.pay_min || !s2.pay_max || !s2.caseload || !s2.schedule}
                  className="flex-1 bg-periwinkle text-white rounded-xl py-3 font-semibold hover:bg-periwinkle-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: Role details ── */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-text">Role details</h2>

              <div>
                <Label>Job description</Label>
                <textarea
                  value={s3.description}
                  onChange={(e) => setS3((p) => ({ ...p, description: e.target.value }))}
                  rows={5}
                  placeholder="What does this role actually involve day-to-day? What makes it a good place to work?"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-periwinkle focus:border-transparent transition resize-none"
                />
              </div>

              <div>
                <Label>Required certifications</Label>
                <Input
                  value={s3.certifications_required}
                  onChange={(e) => setS3((p) => ({ ...p, certifications_required: e.target.value }))}
                  placeholder="BLS, ACLS (comma-separated)"
                />
              </div>

              <div>
                <Label>Preferred experience</Label>
                <Input
                  value={s3.experience_preferred}
                  onChange={(e) => setS3((p) => ({ ...p, experience_preferred: e.target.value }))}
                  placeholder="e.g. 2+ years in community health"
                />
              </div>

              <div>
                <Label>PSLF-eligible position?</Label>
                <div className="flex items-start gap-2 mb-2">
                  <p className="text-xs text-text-light">
                    Public Service Loan Forgiveness — available to nurses with federal student loans at qualifying nonprofits and government employers.
                  </p>
                </div>
                <div className="flex gap-2">
                  {[{ v: true, l: "Yes — PSLF-eligible" }, { v: false, l: "No / not sure" }].map(({ v, l }) => (
                    <button
                      key={String(v)}
                      type="button"
                      onClick={() => setS3((p) => ({ ...p, pslf_eligible: v }))}
                      className={`flex-1 py-2 rounded-xl text-sm border transition-colors font-medium ${
                        s3.pslf_eligible === v ? "bg-periwinkle text-white border-periwinkle" : "border-gray-200 text-text-light hover:border-periwinkle-light"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 border border-gray-200 text-text-light rounded-xl py-3 font-semibold hover:bg-gray-50 transition-colors text-sm">Back</button>
                <button
                  onClick={() => setStep(4)}
                  disabled={s3.pslf_eligible === null}
                  className="flex-1 bg-periwinkle text-white rounded-xl py-3 font-semibold hover:bg-periwinkle-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                >
                  Review posting
                </button>
              </div>
            </div>
          )}

          {/* ── Step 4: Review & publish ── */}
          {step === 4 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-text">Review before publishing</h2>
              <p className="text-xs text-text-light">This is exactly what nurses will see.</p>

              <div className="bg-periwinkle-50 rounded-xl p-4 space-y-1">
                <ReviewRow label="Job title" value={s1.title} />
                <ReviewRow label="Specialty" value={s1.specialty_required} />
                <ReviewRow label="Type" value={s1.employment_type} />
                <ReviewRow label="Openings" value={s1.openings_count} />
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 space-y-1">
                <p className="text-xs font-bold text-amber-800 mb-2">Pay & schedule — confirm these are accurate</p>
                <ReviewRow label="Pay range" value={`$${s2.pay_min}–$${s2.pay_max} / ${s2.pay_type === "hourly" ? "hr" : "yr"}${s2.pay_negotiable ? " (negotiable)" : ""}`} />
                <ReviewRow label="Caseload" value={s2.caseload} />
                <ReviewRow label="Schedule" value={s2.schedule} />
                <ReviewRow label="Weekends" value={s2.weekend_required ? "Yes" : "No"} />
                <ReviewRow label="On-call" value={s2.on_call_required ? "Yes" : "No"} />
                {s2.ehr_system && <ReviewRow label="EHR" value={s2.ehr_system} />}
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-1">
                {s3.certifications_required && <ReviewRow label="Certifications required" value={s3.certifications_required} />}
                {s3.experience_preferred && <ReviewRow label="Preferred experience" value={s3.experience_preferred} />}
                <ReviewRow label="PSLF-eligible" value={s3.pslf_eligible ? "Yes" : "No"} />
                {s3.description && (
                  <div className="pt-2">
                    <p className="text-xs text-text-light mb-1">Description</p>
                    <p className="text-xs text-text">{s3.description}</p>
                  </div>
                )}
              </div>

              {/* Confirmation checkbox */}
              <label className="flex items-start gap-3 cursor-pointer bg-white border-2 border-periwinkle-100 rounded-xl px-4 py-3 hover:border-periwinkle transition-colors">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-periwinkle flex-shrink-0"
                />
                <span className="text-sm text-text">
                  I confirm that the pay range and caseload information above is accurate. Flor holds employers to what&apos;s posted.
                </span>
              </label>

              <div className="flex gap-3">
                <button onClick={() => setStep(3)} className="flex-1 border border-gray-200 text-text-light rounded-xl py-3 font-semibold hover:bg-gray-50 transition-colors text-sm">Back</button>
                <button
                  onClick={handlePublish}
                  disabled={submitting || !confirmed}
                  className="flex-1 bg-periwinkle text-white rounded-xl py-3 font-semibold hover:bg-periwinkle-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                >
                  {submitting ? "Publishing…" : "Publish job"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PostJobPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-offwhite flex items-center justify-center"><div className="text-text-light text-sm">Loading…</div></div>}>
      <PostJobContent />
    </Suspense>
  );
}
