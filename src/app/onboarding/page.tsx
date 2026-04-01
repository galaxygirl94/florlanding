"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// ── helpers ──────────────────────────────────────────────────────────────────
const C = {
  periwinkle: "#7B8CDE",
  navy: "#1B2A6B",
  rose: "#E8A0B4",
  success: "#10B981",
  amber: "#F59E0B",
  red: "#EF4444",
  bg: "#F9FAFB",
  border: "#E5E7EB",
  muted: "#6B7280",
};

const inputCls =
  "w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B8CDE] bg-white";
const autoInputCls =
  "w-full border border-[#7B8CDE] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B8CDE] bg-periwinkle-50 bg-[#F0F2FC]";

// ── sub-components ────────────────────────────────────────────────────────────
function StepIndicator({ step }: { step: 1 | 2 | 3 }) {
  const steps = ["Resume", "Profile", "License"];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 32 }}>
      {steps.map((label, i) => {
        const n = i + 1;
        const done = n < step;
        const active = n === step;
        return (
          <div key={n} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: done ? C.periwinkle : active ? C.periwinkle : "#E5E7EB",
                  color: done || active ? "#fff" : C.muted,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 700,
                  border: active ? `2px solid ${C.navy}` : "2px solid transparent",
                  transition: "all 0.2s",
                }}
              >
                {done ? "✓" : n}
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: active ? 700 : 400,
                  color: active ? C.navy : C.muted,
                }}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                style={{
                  width: 60,
                  height: 2,
                  background: done ? C.periwinkle : "#E5E7EB",
                  margin: "-16px 4px 0",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function AutoBadge() {
  return (
    <span
      style={{
        fontSize: 9,
        fontWeight: 700,
        background: "#EEF0FB",
        color: C.periwinkle,
        borderRadius: 4,
        padding: "1px 5px",
        marginLeft: 6,
        verticalAlign: "middle",
        letterSpacing: "0.03em",
      }}
    >
      FROM RESUME
    </span>
  );
}

function FieldLabel({ label, auto }: { label: string; auto?: boolean }) {
  return (
    <label style={{ fontSize: 12, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
      {label}
      {auto && <AutoBadge />}
    </label>
  );
}

function ChipSelect({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map((opt) => {
        const selected = value.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(selected ? value.filter((x) => x !== opt) : [...value, opt])}
            style={{
              fontSize: 12,
              padding: "5px 12px",
              borderRadius: 20,
              border: `1.5px solid ${selected ? C.periwinkle : "#E5E7EB"}`,
              background: selected ? "#EEF0FB" : "#fff",
              color: selected ? C.navy : C.muted,
              fontWeight: selected ? 600 : 400,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

// ── types ─────────────────────────────────────────────────────────────────────
interface ProfileState {
  firstName: string;
  lastName: string;
  specialty: string;
  licenseType: string;
  licenseState: string;
  yearsExperience: string;
  longestRoleHeld: string;
  currentlyPerDiem: string;
  perDiemDuration: string;
  perDiemReason: string;
  caseloadExperience: string;
  languagesSpoken: string[];
  preferredSettings: string[];
  employmentTypes: string[];
  desiredPayMin: string;
  desiredPayMax: string;
  willingToRelocate: string;
  relocationStates: string;
  startAvailability: string;
  additionalNotes: string;
  autoFilled: Set<string>;
}

// ── constants ─────────────────────────────────────────────────────────────────
const SPECIALTIES = [
  "Med Surg", "ICU/Critical Care", "Community Health", "Pediatrics",
  "Geriatrics/Long-Term Care", "Psychiatric/Mental Health", "Oncology",
  "OR", "ED", "Labor & Delivery", "Home Health", "Other",
];
const LICENSE_TYPES = ["RN", "PN", "NP", "CNM", "CRNA", "CNS"];
const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
];
const YEARS_EXP = ["Less than 1", "1-3", "3-5", "5-10", "10+"];
const LONGEST_ROLE = ["Less than 1 year", "1-2 years", "2-5 years", "5+ years"];
const PER_DIEM_DURATIONS = ["Less than 6 months", "6-12 months", "1-2 years", "2+ years"];
const SETTINGS = ["Hospital", "Clinic", "Home Health", "SNF/LTC", "Correctional", "School", "Telehealth", "Other"];
const EMP_TYPES = ["Full-time", "Part-time", "Per Diem", "Contract/Travel"];
const RELOCATE_OPTIONS = ["Yes", "No", "Open to it"];
const AVAIL_OPTIONS = ["Immediately", "Within 2 weeks", "Within 1 month", "1-3 months", "Just exploring"];

// ── main component ─────────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1 – resume
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 2 – profile
  const [profile, setProfile] = useState<ProfileState>({
    firstName: "", lastName: "", specialty: "", licenseType: "",
    licenseState: "", yearsExperience: "", longestRoleHeld: "",
    currentlyPerDiem: "", perDiemDuration: "", perDiemReason: "",
    caseloadExperience: "", languagesSpoken: [], preferredSettings: [],
    employmentTypes: [], desiredPayMin: "", desiredPayMax: "",
    willingToRelocate: "", relocationStates: "", startAvailability: "",
    additionalNotes: "", autoFilled: new Set(),
  });
  const [saving, setSaving] = useState(false);

  // Step 3 – license verify
  const [licenseNum, setLicenseNum] = useState("");
  const [ssn4, setSsn4] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [address, setAddress] = useState({ street: "", city: "", state: "", zip: "" });
  const [verifyStatus, setVerifyStatus] = useState<"idle"|"pending"|"verified"|"flagged"|"failed">("idle");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auth guard
  useEffect(() => {
    if (typeof window !== "undefined") {
      const done = localStorage.getItem("flor_onboarding_complete");
      if (done === "true") router.replace("/dashboard");
    }
  }, [router]);

  // cleanup poll on unmount
  useEffect(() => {
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  const nurseId = user?.email ?? (typeof window !== "undefined" ? localStorage.getItem("flor_nurse_email") : "") ?? "";

  // ── Step 1: parse resume ───────────────────────────────────────────────────
  function applyParsed(parsed: Record<string, unknown>) {
    const auto = new Set<string>();
    const set = <K extends keyof ProfileState>(key: K, val: ProfileState[K]) => {
      if (val !== null && val !== undefined && val !== "") {
        setProfile((p) => ({ ...p, [key]: val }));
        auto.add(key);
      }
    };
    if (parsed.firstName) { set("firstName", parsed.firstName as string); }
    if (parsed.lastName) { set("lastName", parsed.lastName as string); }
    if (parsed.specialty) { set("specialty", parsed.specialty as string); }
    if (parsed.licenseType) { set("licenseType", parsed.licenseType as string); }
    if (parsed.licenseState) { set("licenseState", parsed.licenseState as string); }
    if (parsed.yearsExperience) { set("yearsExperience", parsed.yearsExperience as string); }
    if (parsed.longestRoleHeld) { set("longestRoleHeld", parsed.longestRoleHeld as string); }
    if (parsed.currentlyPerDiem !== null && parsed.currentlyPerDiem !== undefined) {
      set("currentlyPerDiem", parsed.currentlyPerDiem ? "yes" : "no");
    }
    if (parsed.perDiemDuration) { set("perDiemDuration", parsed.perDiemDuration as string); }
    if (parsed.caseloadExperience !== null && parsed.caseloadExperience !== undefined) {
      set("caseloadExperience", parsed.caseloadExperience ? "yes" : "no");
    }
    if (Array.isArray(parsed.languagesSpoken) && parsed.languagesSpoken.length > 0) {
      set("languagesSpoken", parsed.languagesSpoken as string[]);
    }
    setProfile((p) => ({ ...p, autoFilled: auto }));
  }

  async function parseResume() {
    if (!file) { setStep(2); return; }
    setParsing(true);
    setParseError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/parse-resume", { method: "POST", body: fd });
      const parsed = await res.json();
      applyParsed(parsed);
    } catch {
      setParseError("Couldn't parse your resume — you can fill in your details manually.");
    } finally {
      setParsing(false);
      setStep(2);
    }
  }

  // ── Step 2: save profile ──────────────────────────────────────────────────
  async function handleStep2Save() {
    if (!nurseId) return;
    setSaving(true);
    try {
      await fetch("/api/nurse/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nurse_id: nurseId,
          first_name: profile.firstName,
          last_name: profile.lastName,
          specialty: profile.specialty,
          license_type: profile.licenseType,
          license_state: profile.licenseState,
          years_experience: profile.yearsExperience,
          longest_role_held: profile.longestRoleHeld,
          currently_per_diem: profile.currentlyPerDiem === "yes",
          per_diem_duration: profile.perDiemDuration,
          per_diem_reason: profile.perDiemReason,
          caseload_experience: profile.caseloadExperience === "yes",
          languages_spoken: profile.languagesSpoken,
          preferred_settings: profile.preferredSettings,
          employment_types: profile.employmentTypes,
          desired_pay_min: profile.desiredPayMin ? parseFloat(profile.desiredPayMin) : null,
          desired_pay_max: profile.desiredPayMax ? parseFloat(profile.desiredPayMax) : null,
          willing_to_relocate: profile.willingToRelocate,
          relocation_states: profile.relocationStates ? profile.relocationStates.split(",").map(s => s.trim()) : [],
          start_availability: profile.startAvailability,
          additional_notes: profile.additionalNotes,
        }),
      });
    } catch {
      // non-blocking
    } finally {
      setSaving(false);
      setStep(3);
    }
  }

  // ── Step 3: verify license ────────────────────────────────────────────────
  async function handleVerify() {
    if (!nurseId || !licenseNum || !ssn4 || !birthYear) return;
    setVerifyStatus("pending");
    try {
      await fetch("/api/verify-license", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nurse_id: nurseId,
          license_number: licenseNum,
          license_type: profile.licenseType || "RN",
          license_state: profile.licenseState || address.state,
          ssn_last4: ssn4,
          birth_year: birthYear,
          address_street: address.street,
          address_city: address.city,
          address_state: address.state,
          address_zip: address.zip,
        }),
      });
      pollVerificationStatus();
    } catch {
      setVerifyStatus("failed");
    }
  }

  function pollVerificationStatus() {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/nurse/verification-status?nurse_id=${encodeURIComponent(nurseId)}`);
        const data = await res.json();
        if (data.flor_verified) {
          setVerifyStatus("verified");
          clearInterval(pollRef.current!);
        } else if (data.verification_status === "flagged") {
          setVerifyStatus("flagged");
          clearInterval(pollRef.current!);
        } else if (data.verification_status === "failed") {
          setVerifyStatus("failed");
          clearInterval(pollRef.current!);
        }
      } catch {
        // keep polling
      }
    }, 5000);
    // stop after 2 min
    setTimeout(() => { if (pollRef.current) clearInterval(pollRef.current); }, 120000);
  }

  async function finishOnboarding() {
    if (nurseId) {
      await fetch("/api/nurse/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nurse_id: nurseId, onboarding_complete: true }),
      });
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("flor_onboarding_complete", "true");
    }
    router.replace("/dashboard");
  }

  // ── field helper ──────────────────────────────────────────────────────────
  const auto = profile.autoFilled;
  const pset = (key: keyof ProfileState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setProfile((p) => ({ ...p, [key]: e.target.value }));

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #F0F2FC 0%, #FDF6F9 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 16px 80px",
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <span style={{ fontSize: 28, fontWeight: 800, color: C.navy, letterSpacing: "-0.02em" }}>
          flor<span style={{ color: C.periwinkle }}>.</span>
        </span>
        <p style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>
          Let&apos;s set up your nurse profile
        </p>
      </div>

      <div style={{ width: "100%", maxWidth: 560 }}>
        <StepIndicator step={step} />

        {/* ── STEP 1: Resume Upload ── */}
        {step === 1 && (
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "32px 28px",
              boxShadow: "0 2px 16px rgba(27,42,107,0.06)",
            }}
          >
            <h2 style={{ fontSize: 20, fontWeight: 700, color: C.navy, marginBottom: 6 }}>
              Upload your resume
            </h2>
            <p style={{ fontSize: 13, color: C.muted, marginBottom: 24 }}>
              We&apos;ll pull your details automatically so you don&apos;t have to retype everything.
            </p>

            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${file ? C.periwinkle : "#D1D5DB"}`,
                borderRadius: 12,
                padding: "36px 20px",
                textAlign: "center",
                cursor: "pointer",
                background: file ? "#F0F2FC" : "#FAFAFA",
                transition: "all 0.2s",
                marginBottom: 20,
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 10 }}>{file ? "📄" : "⬆️"}</div>
              {file ? (
                <>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{file.name}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>
                    {(file.size / 1024).toFixed(0)} KB · Click to change
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>
                    Drop your resume here
                  </div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>
                    PDF only · Max 10MB
                  </div>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                style={{ display: "none" }}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setFile(f);
                }}
              />
            </div>

            {parseError && (
              <div
                style={{
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  color: C.red,
                  borderRadius: 8,
                  padding: "10px 14px",
                  fontSize: 13,
                  marginBottom: 16,
                }}
              >
                {parseError}
              </div>
            )}

            <button
              onClick={parseResume}
              disabled={parsing}
              style={{
                width: "100%",
                padding: "12px",
                background: parsing ? "#D1D5DB" : C.periwinkle,
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 15,
                cursor: parsing ? "not-allowed" : "pointer",
                transition: "background 0.2s",
              }}
            >
              {parsing ? "Parsing resume…" : file ? "Continue →" : "Continue without resume →"}
            </button>

            {!file && (
              <p style={{ textAlign: "center", fontSize: 12, color: C.muted, marginTop: 12 }}>
                You can always upload your resume later from your profile.
              </p>
            )}
          </div>
        )}

        {/* ── STEP 2: Profile Form ── */}
        {step === 2 && (
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "32px 28px",
              boxShadow: "0 2px 16px rgba(27,42,107,0.06)",
            }}
          >
            <h2 style={{ fontSize: 20, fontWeight: 700, color: C.navy, marginBottom: 6 }}>
              Your nursing profile
            </h2>
            <p style={{ fontSize: 13, color: C.muted, marginBottom: 24 }}>
              {auto.size > 0
                ? `We pre-filled ${auto.size} field${auto.size > 1 ? "s" : ""} from your resume. Review and fill in the rest.`
                : "Tell us about your background so we can match you with the right opportunities."}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Name */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <FieldLabel label="First name" auto={auto.has("firstName")} />
                  <input
                    className={auto.has("firstName") ? autoInputCls : inputCls}
                    value={profile.firstName}
                    onChange={pset("firstName")}
                    placeholder="Jane"
                  />
                </div>
                <div>
                  <FieldLabel label="Last name" auto={auto.has("lastName")} />
                  <input
                    className={auto.has("lastName") ? autoInputCls : inputCls}
                    value={profile.lastName}
                    onChange={pset("lastName")}
                    placeholder="Doe"
                  />
                </div>
              </div>

              {/* License */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <FieldLabel label="License type" auto={auto.has("licenseType")} />
                  <select
                    className={auto.has("licenseType") ? autoInputCls : inputCls}
                    value={profile.licenseType}
                    onChange={pset("licenseType")}
                  >
                    <option value="">Select…</option>
                    {LICENSE_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <FieldLabel label="License state" auto={auto.has("licenseState")} />
                  <select
                    className={auto.has("licenseState") ? autoInputCls : inputCls}
                    value={profile.licenseState}
                    onChange={pset("licenseState")}
                  >
                    <option value="">Select…</option>
                    {US_STATES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Specialty */}
              <div>
                <FieldLabel label="Primary specialty" auto={auto.has("specialty")} />
                <select
                  className={auto.has("specialty") ? autoInputCls : inputCls}
                  value={profile.specialty}
                  onChange={pset("specialty")}
                >
                  <option value="">Select…</option>
                  {SPECIALTIES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>

              {/* Experience */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <FieldLabel label="Years of experience" auto={auto.has("yearsExperience")} />
                  <select
                    className={auto.has("yearsExperience") ? autoInputCls : inputCls}
                    value={profile.yearsExperience}
                    onChange={pset("yearsExperience")}
                  >
                    <option value="">Select…</option>
                    {YEARS_EXP.map((y) => <option key={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <FieldLabel label="Longest role held" auto={auto.has("longestRoleHeld")} />
                  <select
                    className={auto.has("longestRoleHeld") ? autoInputCls : inputCls}
                    value={profile.longestRoleHeld}
                    onChange={pset("longestRoleHeld")}
                  >
                    <option value="">Select…</option>
                    {LONGEST_ROLE.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              {/* Per diem */}
              <div>
                <FieldLabel label="Are you currently working per diem?" auto={auto.has("currentlyPerDiem")} />
                <div style={{ display: "flex", gap: 8 }}>
                  {["yes", "no"].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setProfile((p) => ({ ...p, currentlyPerDiem: v }))}
                      style={{
                        padding: "6px 20px",
                        borderRadius: 8,
                        border: `1.5px solid ${profile.currentlyPerDiem === v ? C.periwinkle : "#E5E7EB"}`,
                        background: profile.currentlyPerDiem === v ? "#EEF0FB" : "#fff",
                        color: profile.currentlyPerDiem === v ? C.navy : C.muted,
                        fontWeight: profile.currentlyPerDiem === v ? 700 : 400,
                        fontSize: 13,
                        cursor: "pointer",
                      }}
                    >
                      {v === "yes" ? "Yes" : "No"}
                    </button>
                  ))}
                </div>
              </div>

              {profile.currentlyPerDiem === "yes" && (
                <>
                  <div>
                    <FieldLabel label="How long have you been per diem?" auto={auto.has("perDiemDuration")} />
                    <select
                      className={auto.has("perDiemDuration") ? autoInputCls : inputCls}
                      value={profile.perDiemDuration}
                      onChange={pset("perDiemDuration")}
                    >
                      <option value="">Select…</option>
                      {PER_DIEM_DURATIONS.map((d) => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <FieldLabel label="Why did you go per diem? (optional)" />
                    <input
                      className={inputCls}
                      value={profile.perDiemReason}
                      onChange={pset("perDiemReason")}
                      placeholder="e.g. Flexibility, family, burnout recovery…"
                    />
                  </div>
                </>
              )}

              {/* Caseload */}
              <div>
                <FieldLabel label="Do you have caseload / patient panel experience?" auto={auto.has("caseloadExperience")} />
                <div style={{ display: "flex", gap: 8 }}>
                  {["yes", "no"].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setProfile((p) => ({ ...p, caseloadExperience: v }))}
                      style={{
                        padding: "6px 20px",
                        borderRadius: 8,
                        border: `1.5px solid ${profile.caseloadExperience === v ? C.periwinkle : "#E5E7EB"}`,
                        background: profile.caseloadExperience === v ? "#EEF0FB" : "#fff",
                        color: profile.caseloadExperience === v ? C.navy : C.muted,
                        fontWeight: profile.caseloadExperience === v ? 700 : 400,
                        fontSize: 13,
                        cursor: "pointer",
                      }}
                    >
                      {v === "yes" ? "Yes" : "No"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div>
                <FieldLabel label="Languages spoken" auto={auto.has("languagesSpoken")} />
                <input
                  className={auto.has("languagesSpoken") ? autoInputCls : inputCls}
                  value={profile.languagesSpoken.join(", ")}
                  onChange={(e) =>
                    setProfile((p) => ({
                      ...p,
                      languagesSpoken: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    }))
                  }
                  placeholder="English, Spanish, Tagalog…"
                />
              </div>

              {/* Preferred settings */}
              <div>
                <FieldLabel label="Preferred work settings" />
                <ChipSelect
                  options={SETTINGS}
                  value={profile.preferredSettings}
                  onChange={(v) => setProfile((p) => ({ ...p, preferredSettings: v }))}
                />
              </div>

              {/* Employment types */}
              <div>
                <FieldLabel label="Employment types open to" />
                <ChipSelect
                  options={EMP_TYPES}
                  value={profile.employmentTypes}
                  onChange={(v) => setProfile((p) => ({ ...p, employmentTypes: v }))}
                />
              </div>

              {/* Pay */}
              <div>
                <FieldLabel label="Desired hourly pay range ($/hr)" />
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input
                    className={inputCls}
                    style={{ width: 80 }}
                    type="number"
                    value={profile.desiredPayMin}
                    onChange={pset("desiredPayMin")}
                    placeholder="Min"
                  />
                  <span style={{ color: C.muted, fontSize: 13 }}>to</span>
                  <input
                    className={inputCls}
                    style={{ width: 80 }}
                    type="number"
                    value={profile.desiredPayMax}
                    onChange={pset("desiredPayMax")}
                    placeholder="Max"
                  />
                </div>
              </div>

              {/* Relocate */}
              <div>
                <FieldLabel label="Open to relocation?" />
                <select className={inputCls} value={profile.willingToRelocate} onChange={pset("willingToRelocate")}>
                  <option value="">Select…</option>
                  {RELOCATE_OPTIONS.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>

              {(profile.willingToRelocate === "Yes" || profile.willingToRelocate === "Open to it") && (
                <div>
                  <FieldLabel label="Which states? (comma-separated)" />
                  <input
                    className={inputCls}
                    value={profile.relocationStates}
                    onChange={pset("relocationStates")}
                    placeholder="CA, TX, NY…"
                  />
                </div>
              )}

              {/* Start availability */}
              <div>
                <FieldLabel label="When can you start?" />
                <select className={inputCls} value={profile.startAvailability} onChange={pset("startAvailability")}>
                  <option value="">Select…</option>
                  {AVAIL_OPTIONS.map((a) => <option key={a}>{a}</option>)}
                </select>
              </div>

              {/* Notes */}
              <div>
                <FieldLabel label="Anything else you want employers to know? (optional)" />
                <textarea
                  className={inputCls}
                  rows={3}
                  value={profile.additionalNotes}
                  onChange={pset("additionalNotes")}
                  placeholder="Certifications, equipment experience, scheduling preferences…"
                  style={{ resize: "vertical" }}
                />
              </div>
            </div>

            <button
              onClick={handleStep2Save}
              disabled={saving}
              style={{
                width: "100%",
                marginTop: 28,
                padding: "12px",
                background: saving ? "#D1D5DB" : C.periwinkle,
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 15,
                cursor: saving ? "not-allowed" : "pointer",
              }}
            >
              {saving ? "Saving…" : "Save & continue →"}
            </button>
          </div>
        )}

        {/* ── STEP 3: License Verification ── */}
        {step === 3 && (
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "32px 28px",
              boxShadow: "0 2px 16px rgba(27,42,107,0.06)",
            }}
          >
            <h2 style={{ fontSize: 20, fontWeight: 700, color: C.navy, marginBottom: 6 }}>
              Verify your license
            </h2>
            <p style={{ fontSize: 13, color: C.muted, marginBottom: 8 }}>
              We partner with Nursys e-Notify to confirm your license in real time. This earns you a
              verified badge and helps employers find you faster.
            </p>

            {/* Status banners */}
            {verifyStatus === "verified" && (
              <div
                style={{
                  background: "#ECFDF5",
                  border: "1px solid #6EE7B7",
                  color: "#065F46",
                  borderRadius: 10,
                  padding: "12px 16px",
                  marginBottom: 20,
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                ✅ License verified! You&apos;ve earned the Flor Verified badge.
              </div>
            )}
            {verifyStatus === "flagged" && (
              <div
                style={{
                  background: "#FFFBEB",
                  border: "1px solid #FDE68A",
                  color: "#92400E",
                  borderRadius: 10,
                  padding: "12px 16px",
                  marginBottom: 20,
                  fontSize: 14,
                }}
              >
                ⚠️ Your license has a flag on record. Our team will review and follow up within 24 hours.
              </div>
            )}
            {verifyStatus === "failed" && (
              <div
                style={{
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  color: "#991B1B",
                  borderRadius: 10,
                  padding: "12px 16px",
                  marginBottom: 20,
                  fontSize: 14,
                }}
              >
                ❌ Verification failed. Double-check your license number and try again, or skip and verify later.
              </div>
            )}
            {verifyStatus === "pending" && (
              <div
                style={{
                  background: "#EFF6FF",
                  border: "1px solid #BFDBFE",
                  color: "#1E40AF",
                  borderRadius: 10,
                  padding: "12px 16px",
                  marginBottom: 20,
                  fontSize: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: 16,
                    height: 16,
                    border: "2px solid #1E40AF",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                Verifying with Nursys… this usually takes under a minute.
              </div>
            )}

            {verifyStatus !== "verified" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <FieldLabel label="License number" />
                  <input
                    className={inputCls}
                    value={licenseNum}
                    onChange={(e) => setLicenseNum(e.target.value)}
                    placeholder="e.g. RN123456"
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <FieldLabel label="SSN last 4 digits" />
                    <input
                      className={inputCls}
                      value={ssn4}
                      onChange={(e) => setSsn4(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="••••"
                      maxLength={4}
                      inputMode="numeric"
                    />
                  </div>
                  <div>
                    <FieldLabel label="Birth year" />
                    <input
                      className={inputCls}
                      value={birthYear}
                      onChange={(e) => setBirthYear(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="YYYY"
                      maxLength={4}
                      inputMode="numeric"
                    />
                  </div>
                </div>

                <div>
                  <FieldLabel label="Street address" />
                  <input
                    className={inputCls}
                    value={address.street}
                    onChange={(e) => setAddress((a) => ({ ...a, street: e.target.value }))}
                    placeholder="123 Main St"
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12 }}>
                  <div>
                    <FieldLabel label="City" />
                    <input
                      className={inputCls}
                      value={address.city}
                      onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))}
                      placeholder="Providence"
                    />
                  </div>
                  <div>
                    <FieldLabel label="State" />
                    <select
                      className={inputCls}
                      value={address.state}
                      onChange={(e) => setAddress((a) => ({ ...a, state: e.target.value }))}
                    >
                      <option value="">ST</option>
                      {US_STATES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <FieldLabel label="ZIP" />
                    <input
                      className={inputCls}
                      value={address.zip}
                      onChange={(e) => setAddress((a) => ({ ...a, zip: e.target.value.replace(/\D/g, "").slice(0, 5) }))}
                      placeholder="02903"
                      maxLength={5}
                      inputMode="numeric"
                    />
                  </div>
                </div>

                <button
                  onClick={handleVerify}
                  disabled={verifyStatus === "pending" || !licenseNum || !ssn4 || !birthYear}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background:
                      verifyStatus === "pending" || !licenseNum || !ssn4 || !birthYear
                        ? "#D1D5DB"
                        : C.periwinkle,
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    fontWeight: 700,
                    fontSize: 15,
                    cursor:
                      verifyStatus === "pending" || !licenseNum || !ssn4 || !birthYear
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  {verifyStatus === "pending" ? "Verifying…" : "Verify my license"}
                </button>

                <div style={{ textAlign: "center" }}>
                  <button
                    type="button"
                    onClick={finishOnboarding}
                    style={{
                      background: "none",
                      border: "none",
                      color: C.muted,
                      fontSize: 13,
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    Skip for now →
                  </button>
                </div>

                <p style={{ fontSize: 11, color: "#9CA3AF", textAlign: "center", marginTop: 4 }}>
                  Your SSN digits are used only for identity verification with Nursys and are never stored.
                </p>
              </div>
            )}

            {verifyStatus === "verified" && (
              <button
                onClick={finishOnboarding}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: C.success,
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: "pointer",
                  marginTop: 8,
                }}
              >
                Go to my dashboard →
              </button>
            )}
          </div>
        )}

        {/* Spin keyframes */}
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
