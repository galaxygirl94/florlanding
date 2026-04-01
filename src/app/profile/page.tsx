"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const C = {
  periwinkle: "#7B8CDE",
  navy: "#1B2A6B",
  rose: "#E8A0B4",
  success: "#10B981",
  muted: "#6B7280",
  border: "#E5E7EB",
};

const inputCls =
  "w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B8CDE] bg-white";

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

interface ProfileForm {
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
  languagesSpoken: string;
  preferredSettings: string[];
  employmentTypes: string[];
  desiredPayMin: string;
  desiredPayMax: string;
  willingToRelocate: string;
  relocationStates: string;
  startAvailability: string;
  additionalNotes: string;
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

function FieldLabel({ label }: { label: string }) {
  return (
    <label style={{ fontSize: 12, fontWeight: 600, color: C.navy, display: "block", marginBottom: 4 }}>
      {label}
    </label>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();

  const [form, setForm] = useState<ProfileForm>({
    firstName: "", lastName: "", specialty: "", licenseType: "",
    licenseState: "", yearsExperience: "", longestRoleHeld: "",
    currentlyPerDiem: "", perDiemDuration: "", perDiemReason: "",
    caseloadExperience: "", languagesSpoken: "", preferredSettings: [],
    employmentTypes: [], desiredPayMin: "", desiredPayMax: "",
    willingToRelocate: "", relocationStates: "", startAvailability: "",
    additionalNotes: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const nurseId =
    user?.email ??
    (typeof window !== "undefined" ? localStorage.getItem("flor_nurse_email") : "") ??
    "";

  // Auth guard
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("flor_user");
      if (!stored) router.replace("/login");
    }
  }, [router]);

  // Load existing profile
  useEffect(() => {
    if (!nurseId) return;
    async function load() {
      try {
        const res = await fetch(`/api/nurse/profile?nurse_id=${encodeURIComponent(nurseId)}`);
        const p = await res.json();
        if (p) {
          setForm({
            firstName: p.first_name ?? "",
            lastName: p.last_name ?? "",
            specialty: p.specialty ?? "",
            licenseType: p.license_type ?? "",
            licenseState: p.license_state ?? "",
            yearsExperience: p.years_experience ?? "",
            longestRoleHeld: p.longest_role_held ?? "",
            currentlyPerDiem: p.currently_per_diem === true ? "yes" : p.currently_per_diem === false ? "no" : "",
            perDiemDuration: p.per_diem_duration ?? "",
            perDiemReason: p.per_diem_reason ?? "",
            caseloadExperience: p.caseload_experience === true ? "yes" : p.caseload_experience === false ? "no" : "",
            languagesSpoken: Array.isArray(p.languages_spoken) ? p.languages_spoken.join(", ") : "",
            preferredSettings: p.preferred_settings ?? [],
            employmentTypes: p.employment_types ?? [],
            desiredPayMin: p.desired_pay_min != null ? String(p.desired_pay_min) : "",
            desiredPayMax: p.desired_pay_max != null ? String(p.desired_pay_max) : "",
            willingToRelocate: p.willing_to_relocate ?? "",
            relocationStates: Array.isArray(p.relocation_states) ? p.relocation_states.join(", ") : "",
            startAvailability: p.start_availability ?? "",
            additionalNotes: p.additional_notes ?? "",
          });
        }
      } catch {
        // non-blocking
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [nurseId]);

  const fset = (key: keyof ProfileForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [key]: e.target.value }));

  async function handleSave() {
    if (!nurseId) return;
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/nurse/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nurse_id: nurseId,
          first_name: form.firstName,
          last_name: form.lastName,
          specialty: form.specialty,
          license_type: form.licenseType,
          license_state: form.licenseState,
          years_experience: form.yearsExperience,
          longest_role_held: form.longestRoleHeld,
          currently_per_diem: form.currentlyPerDiem === "yes",
          per_diem_duration: form.perDiemDuration,
          per_diem_reason: form.perDiemReason,
          caseload_experience: form.caseloadExperience === "yes",
          languages_spoken: form.languagesSpoken
            ? form.languagesSpoken.split(",").map((s) => s.trim()).filter(Boolean)
            : [],
          preferred_settings: form.preferredSettings,
          employment_types: form.employmentTypes,
          desired_pay_min: form.desiredPayMin ? parseFloat(form.desiredPayMin) : null,
          desired_pay_max: form.desiredPayMax ? parseFloat(form.desiredPayMax) : null,
          willing_to_relocate: form.willingToRelocate,
          relocation_states: form.relocationStates
            ? form.relocationStates.split(",").map((s) => s.trim()).filter(Boolean)
            : [],
          start_availability: form.startAvailability,
          additional_notes: form.additionalNotes,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // non-blocking
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #F0F2FC 0%, #FDF6F9 100%)",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            border: `3px solid ${C.periwinkle}`,
            borderTopColor: "transparent",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #F0F2FC 0%, #FDF6F9 100%)",
        padding: "0 0 80px",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          background: "#fff",
          borderBottom: `1px solid ${C.border}`,
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <Link
          href="/dashboard"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: C.muted,
            textDecoration: "none",
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          ← Dashboard
        </Link>
        <span style={{ fontSize: 20, fontWeight: 800, color: C.navy, letterSpacing: "-0.02em" }}>
          flor<span style={{ color: C.periwinkle }}>.</span>
        </span>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: "7px 18px",
            background: saved ? C.success : C.periwinkle,
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            cursor: saving ? "not-allowed" : "pointer",
            transition: "background 0.2s",
          }}
        >
          {saving ? "Saving…" : saved ? "Saved ✓" : "Save"}
        </button>
      </div>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "28px 16px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: C.navy, marginBottom: 4 }}>
          Edit your profile
        </h1>
        <p style={{ fontSize: 13, color: C.muted, marginBottom: 28 }}>
          Keep your profile up to date so employers can find the right match.
        </p>

        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: "28px 24px",
            boxShadow: "0 2px 16px rgba(27,42,107,0.06)",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {/* Name */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <FieldLabel label="First name" />
              <input className={inputCls} value={form.firstName} onChange={fset("firstName")} placeholder="Jane" />
            </div>
            <div>
              <FieldLabel label="Last name" />
              <input className={inputCls} value={form.lastName} onChange={fset("lastName")} placeholder="Doe" />
            </div>
          </div>

          {/* License */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <FieldLabel label="License type" />
              <select className={inputCls} value={form.licenseType} onChange={fset("licenseType")}>
                <option value="">Select…</option>
                {LICENSE_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <FieldLabel label="License state" />
              <select className={inputCls} value={form.licenseState} onChange={fset("licenseState")}>
                <option value="">Select…</option>
                {US_STATES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Specialty */}
          <div>
            <FieldLabel label="Primary specialty" />
            <select className={inputCls} value={form.specialty} onChange={fset("specialty")}>
              <option value="">Select…</option>
              {SPECIALTIES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          {/* Experience */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <FieldLabel label="Years of experience" />
              <select className={inputCls} value={form.yearsExperience} onChange={fset("yearsExperience")}>
                <option value="">Select…</option>
                {YEARS_EXP.map((y) => <option key={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <FieldLabel label="Longest role held" />
              <select className={inputCls} value={form.longestRoleHeld} onChange={fset("longestRoleHeld")}>
                <option value="">Select…</option>
                {LONGEST_ROLE.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>

          {/* Per diem */}
          <div>
            <FieldLabel label="Currently working per diem?" />
            <div style={{ display: "flex", gap: 8 }}>
              {["yes", "no"].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, currentlyPerDiem: v }))}
                  style={{
                    padding: "6px 20px",
                    borderRadius: 8,
                    border: `1.5px solid ${form.currentlyPerDiem === v ? C.periwinkle : "#E5E7EB"}`,
                    background: form.currentlyPerDiem === v ? "#EEF0FB" : "#fff",
                    color: form.currentlyPerDiem === v ? C.navy : C.muted,
                    fontWeight: form.currentlyPerDiem === v ? 700 : 400,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  {v === "yes" ? "Yes" : "No"}
                </button>
              ))}
            </div>
          </div>

          {form.currentlyPerDiem === "yes" && (
            <>
              <div>
                <FieldLabel label="Per diem duration" />
                <select className={inputCls} value={form.perDiemDuration} onChange={fset("perDiemDuration")}>
                  <option value="">Select…</option>
                  {PER_DIEM_DURATIONS.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <FieldLabel label="Why did you go per diem? (optional)" />
                <input
                  className={inputCls}
                  value={form.perDiemReason}
                  onChange={fset("perDiemReason")}
                  placeholder="e.g. Flexibility, family, burnout recovery…"
                />
              </div>
            </>
          )}

          {/* Caseload */}
          <div>
            <FieldLabel label="Caseload / patient panel experience?" />
            <div style={{ display: "flex", gap: 8 }}>
              {["yes", "no"].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, caseloadExperience: v }))}
                  style={{
                    padding: "6px 20px",
                    borderRadius: 8,
                    border: `1.5px solid ${form.caseloadExperience === v ? C.periwinkle : "#E5E7EB"}`,
                    background: form.caseloadExperience === v ? "#EEF0FB" : "#fff",
                    color: form.caseloadExperience === v ? C.navy : C.muted,
                    fontWeight: form.caseloadExperience === v ? 700 : 400,
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
            <FieldLabel label="Languages spoken" />
            <input
              className={inputCls}
              value={form.languagesSpoken}
              onChange={fset("languagesSpoken")}
              placeholder="English, Spanish, Tagalog…"
            />
          </div>

          {/* Preferred settings */}
          <div>
            <FieldLabel label="Preferred work settings" />
            <ChipSelect
              options={SETTINGS}
              value={form.preferredSettings}
              onChange={(v) => setForm((p) => ({ ...p, preferredSettings: v }))}
            />
          </div>

          {/* Employment types */}
          <div>
            <FieldLabel label="Employment types" />
            <ChipSelect
              options={EMP_TYPES}
              value={form.employmentTypes}
              onChange={(v) => setForm((p) => ({ ...p, employmentTypes: v }))}
            />
          </div>

          {/* Pay range */}
          <div>
            <FieldLabel label="Desired hourly pay range ($/hr)" />
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                className={inputCls}
                style={{ width: 80 }}
                type="number"
                value={form.desiredPayMin}
                onChange={fset("desiredPayMin")}
                placeholder="Min"
              />
              <span style={{ color: C.muted, fontSize: 13 }}>to</span>
              <input
                className={inputCls}
                style={{ width: 80 }}
                type="number"
                value={form.desiredPayMax}
                onChange={fset("desiredPayMax")}
                placeholder="Max"
              />
            </div>
          </div>

          {/* Relocate */}
          <div>
            <FieldLabel label="Open to relocation?" />
            <select className={inputCls} value={form.willingToRelocate} onChange={fset("willingToRelocate")}>
              <option value="">Select…</option>
              {RELOCATE_OPTIONS.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>

          {(form.willingToRelocate === "Yes" || form.willingToRelocate === "Open to it") && (
            <div>
              <FieldLabel label="Which states? (comma-separated)" />
              <input
                className={inputCls}
                value={form.relocationStates}
                onChange={fset("relocationStates")}
                placeholder="CA, TX, NY…"
              />
            </div>
          )}

          {/* Start availability */}
          <div>
            <FieldLabel label="When can you start?" />
            <select className={inputCls} value={form.startAvailability} onChange={fset("startAvailability")}>
              <option value="">Select…</option>
              {AVAIL_OPTIONS.map((a) => <option key={a}>{a}</option>)}
            </select>
          </div>

          {/* Additional notes */}
          <div>
            <FieldLabel label="Anything else for employers? (optional)" />
            <textarea
              className={inputCls}
              rows={3}
              value={form.additionalNotes}
              onChange={fset("additionalNotes")}
              placeholder="Certifications, equipment experience, scheduling preferences…"
              style={{ resize: "vertical" }}
            />
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              width: "100%",
              padding: "13px",
              background: saved ? C.success : saving ? "#D1D5DB" : C.periwinkle,
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 15,
              cursor: saving ? "not-allowed" : "pointer",
              transition: "background 0.2s",
              marginTop: 4,
            }}
          >
            {saving ? "Saving…" : saved ? "Saved ✓" : "Save changes"}
          </button>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
