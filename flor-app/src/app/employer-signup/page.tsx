"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import type { EmployerProfileRow, OrgType } from "@/data/types";

// ─── Step data shapes ──────────────────────────────────────────────────────

interface Step1 {
  org_name: string;
  org_type: OrgType | "";
  address: string;
  contact_name: string;
  contact_title: string;
  phone: string;
  email: string;
}

interface Step2 {
  is_nonprofit: boolean | null;
  verification_doc_url: string;
}

interface Step3 {
  password: string;
  confirm_password: string;
}

// ─── Constants ────────────────────────────────────────────────────────────

const ORG_TYPES: { value: OrgType; label: string }[] = [
  { value: "PACE", label: "PACE program" },
  { value: "FQHC", label: "FQHC / community health center" },
  { value: "School District", label: "School district" },
  { value: "Home Health", label: "Home health agency" },
  { value: "Other community health", label: "Other community health org" },
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
            ) : (i + 1)}
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

// ─── Main ─────────────────────────────────────────────────────────────────

export default function EmployerSignupPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);

  const [s1, setS1] = useState<Step1>({
    org_name: "", org_type: "", address: "",
    contact_name: "", contact_title: "", phone: "", email: "",
  });

  const [s2, setS2] = useState<Step2>({ is_nonprofit: null, verification_doc_url: "" });
  const [s3, setS3] = useState<Step3>({ password: "", confirm_password: "" });

  async function handleSubmit() {
    if (s3.password !== s3.confirm_password) {
      alert("Passwords don't match.");
      return;
    }
    setSubmitting(true);
    try {
      const row: EmployerProfileRow = {
        org_name: s1.org_name,
        org_type: s1.org_type as OrgType,
        address: s1.address,
        contact_name: s1.contact_name,
        contact_title: s1.contact_title || undefined,
        phone: s1.phone,
        email: s1.email,
        is_nonprofit: s2.is_nonprofit ?? false,
        flor_mission_eligible: s2.is_nonprofit === true,
        verification_doc_url: s2.verification_doc_url || undefined,
      };

      const { data, error } = await supabase
        .from("employer_profiles")
        .insert(row)
        .select("id")
        .single();

      if (error) throw error;
      setSavedId(data.id);
      setDone(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-offwhite flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl card-shadow p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-periwinkle-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-periwinkle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-text mb-2">Account created.</h1>
          <p className="text-text-light text-sm mb-6">
            Check your email to confirm your address. Once confirmed, you can post jobs and browse nurse profiles.
          </p>
          <a
            href={savedId ? `/employer-dashboard?id=${savedId}` : "/employer-dashboard"}
            className="block bg-periwinkle text-white rounded-xl py-3 font-semibold hover:bg-periwinkle-dark transition-colors text-sm"
          >
            Go to dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-offwhite flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text">Create your employer account</h1>
          <p className="text-text-light text-sm mt-1">For PACE programs, FQHCs, school districts, and community health orgs.</p>
        </div>

        <StepIndicator current={step} total={3} />

        <div className="bg-white rounded-2xl card-shadow p-6 sm:p-8">
          {/* ── Step 1: Org Info ── */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-text">Organization info</h2>

              <div>
                <Label>Organization name</Label>
                <Input
                  value={s1.org_name}
                  onChange={(e) => setS1((p) => ({ ...p, org_name: e.target.value }))}
                  placeholder="PACE of Rhode Island"
                />
              </div>

              <div>
                <Label>Organization type</Label>
                <Select
                  value={s1.org_type}
                  onChange={(e) => setS1((p) => ({ ...p, org_type: e.target.value as OrgType }))}
                >
                  <option value="">Select type</option>
                  {ORG_TYPES.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </Select>
              </div>

              <div>
                <Label>Address</Label>
                <Input
                  value={s1.address}
                  onChange={(e) => setS1((p) => ({ ...p, address: e.target.value }))}
                  placeholder="123 Main St, Providence, RI 02903"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Contact name</Label>
                  <Input
                    value={s1.contact_name}
                    onChange={(e) => setS1((p) => ({ ...p, contact_name: e.target.value }))}
                    placeholder="Jane Smith"
                  />
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={s1.contact_title}
                    onChange={(e) => setS1((p) => ({ ...p, contact_title: e.target.value }))}
                    placeholder="HR Director"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Phone</Label>
                  <Input
                    type="tel"
                    value={s1.phone}
                    onChange={(e) => setS1((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="401-555-0000"
                  />
                </div>
                <div>
                  <Label>Work email</Label>
                  <Input
                    type="email"
                    value={s1.email}
                    onChange={(e) => setS1((p) => ({ ...p, email: e.target.value }))}
                    placeholder="jane@org.org"
                  />
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!s1.org_name || !s1.org_type || !s1.contact_name || !s1.email}
                className="w-full bg-periwinkle text-white rounded-xl py-3 font-semibold hover:bg-periwinkle-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          )}

          {/* ── Step 2: Verification ── */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-text">Verification</h2>
              <p className="text-sm text-text-light">
                Verified nonprofits qualify for Flor&apos;s mission pricing. We&apos;ll review your documentation within 1 business day.
              </p>

              <div>
                <Label>Is your organization a nonprofit?</Label>
                <div className="flex gap-3 mt-1">
                  {[{ v: true, l: "Yes, 501(c)(3)" }, { v: false, l: "No / not sure" }].map(({ v, l }) => (
                    <button
                      key={String(v)}
                      type="button"
                      onClick={() => setS2((p) => ({ ...p, is_nonprofit: v }))}
                      className={`flex-1 py-2 rounded-xl text-sm border transition-colors font-medium ${
                        s2.is_nonprofit === v
                          ? "bg-periwinkle text-white border-periwinkle"
                          : "border-gray-200 text-text-light hover:border-periwinkle-light"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {s2.is_nonprofit === true && (
                <div className="bg-periwinkle-50 rounded-xl p-4">
                  <p className="text-sm font-semibold text-periwinkle-dark mb-2">Upload 501(c)(3) determination letter</p>
                  <p className="text-xs text-text-light mb-3">PDF or image. This unlocks mission pricing.</p>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="w-full text-sm text-text-light file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-periwinkle file:text-white file:font-medium file:cursor-pointer hover:file:bg-periwinkle-dark"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setS2((p) => ({ ...p, verification_doc_url: file.name }));
                    }}
                  />
                  <p className="text-xs text-text-light mt-2">File upload stored securely. Not shared externally.</p>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 border border-gray-200 text-text-light rounded-xl py-3 font-semibold hover:bg-gray-50 transition-colors text-sm">
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={s2.is_nonprofit === null}
                  className="flex-1 bg-periwinkle text-white rounded-xl py-3 font-semibold hover:bg-periwinkle-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: Password ── */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-text">Set your password</h2>

              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  value={s3.password}
                  onChange={(e) => setS3((p) => ({ ...p, password: e.target.value }))}
                  placeholder="8+ characters"
                />
              </div>

              <div>
                <Label>Confirm password</Label>
                <Input
                  type="password"
                  value={s3.confirm_password}
                  onChange={(e) => setS3((p) => ({ ...p, confirm_password: e.target.value }))}
                  placeholder="Same as above"
                />
                {s3.confirm_password && s3.password !== s3.confirm_password && (
                  <p className="text-xs text-red-600 mt-1">Passwords don&apos;t match.</p>
                )}
              </div>

              <p className="text-xs text-text-light">
                By creating an account you agree to Flor&apos;s terms. A confirmation email will be sent to <strong>{s1.email}</strong>.
              </p>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 border border-gray-200 text-text-light rounded-xl py-3 font-semibold hover:bg-gray-50 transition-colors text-sm">
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !s3.password || s3.password !== s3.confirm_password || s3.password.length < 8}
                  className="flex-1 bg-periwinkle text-white rounded-xl py-3 font-semibold hover:bg-periwinkle-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                >
                  {submitting ? "Creating account…" : "Create account"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
