"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";

/* ── Constants ────────────────────────────────────────────────────── */

const NURSING_STATUS_OPTIONS = [
  "Active RN (currently working)",
  "Active RN (currently on travel contract)",
  "RN seeking new position",
  "New graduate RN (within 12 months of graduation)",
  "Nursing student (graduating within 6 months)",
  "LPN/LVN",
  "Other",
];

const EXPERIENCE_OPTIONS = [
  "Less than 1 year",
  "1–3 years",
  "4–7 years",
  "8–15 years",
  "16+ years",
];

const SPECIALTIES = [
  "Med/Surg", "ICU/Critical Care", "Emergency", "Telemetry", "OR/Perioperative",
  "Pediatrics", "Postpartum/L&D", "Oncology", "Behavioral Health/Psych", "Rehab",
  "Long-Term Care/SNF", "Home Health", "Hospice/Palliative", "Outpatient/Clinic",
  "School Nursing", "Case Management", "Other",
];

const CERTIFICATIONS = [
  "BLS", "ACLS", "PALS", "NIH Stroke Scale", "CEN", "CCRN", "OCN",
  "Other specialty cert", "None currently",
];

const POSITION_TYPES = [
  "Full-time permanent", "Part-time permanent", "Per diem / PRN",
  "Contract (travel)", "I'm just exploring",
];

const SHIFT_PREFS = [
  "Days (7a–7p)", "Nights (7p–7a)", "Evening/Mid", "Rotating", "Flexible / No preference",
];

const PAY_RANGES = [
  "Under $30/hr", "$30–$40/hr", "$41–$55/hr", "$56–$75/hr", "$75+/hr", "I'm not sure yet",
];

const RELOCATION_OPTIONS = [
  "Yes, open to relocating anywhere",
  "Yes, within my region/state",
  "No, looking locally only",
];

const RANK_ITEMS = [
  "Pay/Compensation", "Shift schedule", "Specialty fit", "Team culture",
  "Benefits package", "Location", "Tuition reimbursement", "Sign-on bonus", "Magnet/award status",
];

const BENEFITS_OPTIONS = [
  "Health/dental/vision", "Tuition reimbursement", "Student loan repayment",
  "Retirement/401k", "Paid time off", "Childcare support",
  "Mental health support", "Relocation assistance", "Sign-on bonus",
];

const FRUSTRATION_LABELS = [
  "1 – Not frustrated at all", "2", "3 – Somewhat frustrated", "4", "5 – Extremely frustrated",
];

const PROBLEMS = [
  "Pay is hidden until far into the process",
  "Too much recruiter spam",
  "Ghost job postings (jobs that aren't real)",
  "Hard to know if I'm a good fit before applying",
  "Facilities don't respond after I apply",
  "Interviews feel like a formality — decision already made",
  "I can't find jobs that match my specialty",
  "Other",
];

const HEARD_FROM = [
  "Instagram", "TikTok", "LinkedIn", "A colleague/friend", "Reddit",
  "Google search", "A nursing school", "An email", "Other",
];

const WOULD_USE_OPTIONS = [
  "Yes, absolutely", "Probably yes", "Not sure", "Probably not", "No",
];

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby3-esP-wpf_fhrL4qPLaHKdGqFozYbfmjE0B0iDyUjrwD97flnzevy6iW-QwwkdIdg/exec";

/* ── Survey State ────────────────────────────────────────────────── */

interface SurveyState {
  nursingStatus: string;
  yearsExperience: string;
  specialty: string;
  certifications: string[];
  licensedStates: string;
  positionTypes: string[];
  shiftPreferences: string[];
  targetPay: string;
  openToRelocation: string;
  currentLocation: string;
  ranking: Record<string, number>;
  importantBenefits: string[];
  frustration: string;
  problems: string[];
  problemOther: string;
  heardFrom: string;
  wouldUse: string;
  willingToShare: string;
  email: string;
}

const INITIAL: SurveyState = {
  nursingStatus: "",
  yearsExperience: "",
  specialty: "",
  certifications: [],
  licensedStates: "",
  positionTypes: [],
  shiftPreferences: [],
  targetPay: "",
  openToRelocation: "",
  currentLocation: "",
  ranking: {},
  importantBenefits: [],
  frustration: "",
  problems: [],
  problemOther: "",
  heardFrom: "",
  wouldUse: "",
  willingToShare: "",
  email: "",
};

/* ── Required fields ─────────────────────────────────────────────── */

const REQUIRED_FIELDS: { key: keyof SurveyState; ref: string }[] = [
  { key: "nursingStatus", ref: "q1" },
  { key: "yearsExperience", ref: "q2" },
  { key: "specialty", ref: "q3" },
  { key: "positionTypes", ref: "q6" },
  { key: "targetPay", ref: "q8" },
  { key: "openToRelocation", ref: "q9" },
  { key: "currentLocation", ref: "q10" },
  { key: "frustration", ref: "q13" },
  { key: "problems", ref: "q14" },
  { key: "wouldUse", ref: "q16" },
  { key: "willingToShare", ref: "q17" },
];

/* ── Component ────────────────────────────────────────────────────── */

export default function SurveyPage() {
  const [form, setForm] = useState<SurveyState>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorField, setErrorField] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  /* ── Helpers ──────────────────────────────────────────────────── */

  const toggleArray = useCallback((key: keyof SurveyState, value: string, maxItems?: number) => {
    setForm((prev) => {
      const arr = prev[key] as string[];
      if (arr.includes(value)) {
        return { ...prev, [key]: arr.filter((v) => v !== value) };
      }
      if (maxItems && arr.length >= maxItems) return prev;
      return { ...prev, [key]: [...arr, value] };
    });
  }, []);

  const setRank = useCallback((item: string, rank: number) => {
    setForm((prev) => {
      const newRanking = { ...prev.ranking };
      // Remove any existing item with this rank
      Object.entries(newRanking).forEach(([k, v]) => {
        if (v === rank) delete newRanking[k];
      });
      newRanking[item] = rank;
      return { ...prev, ranking: newRanking };
    });
  }, []);

  /* ── Progress ─────────────────────────────────────────────────── */

  const totalQuestions = 18;
  const answeredCount = [
    form.nursingStatus,
    form.yearsExperience,
    form.specialty,
    form.certifications.length > 0,
    form.licensedStates,
    form.positionTypes.length > 0,
    form.shiftPreferences.length > 0,
    form.targetPay,
    form.openToRelocation,
    form.currentLocation,
    Object.keys(form.ranking).length > 0,
    form.importantBenefits.length > 0,
    form.frustration,
    form.problems.length > 0,
    form.heardFrom,
    form.wouldUse,
    form.willingToShare,
    form.willingToShare === "Yes" ? form.email : true,
  ].filter(Boolean).length;
  const progressPct = Math.round((answeredCount / totalQuestions) * 100);

  /* ── Validation + Submit ──────────────────────────────────────── */

  function validate(): boolean {
    for (const { key, ref } of REQUIRED_FIELDS) {
      const val = form[key];
      if (Array.isArray(val) ? val.length === 0 : !val) {
        setErrorField(ref);
        document.getElementById(ref)?.scrollIntoView({ behavior: "smooth", block: "center" });
        return false;
      }
    }
    if (form.willingToShare === "Yes" && !form.email) {
      setErrorField("q18");
      document.getElementById("q18")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }
    setErrorField(null);
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    const data = new URLSearchParams();
    data.append("nursingStatus", form.nursingStatus);
    data.append("yearsExperience", form.yearsExperience);
    data.append("specialty", form.specialty);
    data.append("certifications", form.certifications.join(", "));
    data.append("licensedStates", form.licensedStates);
    data.append("positionTypes", form.positionTypes.join(", "));
    data.append("shiftPreferences", form.shiftPreferences.join(", "));
    data.append("targetPay", form.targetPay);
    data.append("openToRelocation", form.openToRelocation);
    data.append("currentLocation", form.currentLocation);
    // Ranking: comma-separated in rank order
    const rankSorted = RANK_ITEMS
      .filter((item) => form.ranking[item] != null)
      .sort((a, b) => (form.ranking[a] ?? 99) - (form.ranking[b] ?? 99));
    data.append("ranking", rankSorted.join(", "));
    data.append("importantBenefits", form.importantBenefits.join(", "));
    data.append("frustration", form.frustration);
    data.append("problems", form.problems.join(", "));
    if (form.problems.includes("Other") && form.problemOther) {
      data.append("problemOther", form.problemOther);
    }
    data.append("heardFrom", form.heardFrom);
    data.append("wouldUse", form.wouldUse);
    data.append("willingToShare", form.willingToShare);
    if (form.willingToShare === "Yes") {
      data.append("email", form.email);
    }
    data.append("source", "flor-app");
    data.append("submittedAt", new Date().toISOString());

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: data,
      });
    } catch {
      // no-cors means we can't read the response; treat as success
    }

    setSubmitting(false);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ── Thank You State ──────────────────────────────────────────── */

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F7F7FF] flex items-center justify-center px-4">
        <div className="bg-[#1E1E2E] rounded-3xl p-8 sm:p-12 max-w-lg w-full text-center animate-fade-in-up">
          <div className="text-periwinkle text-2xl mb-4">✦</div>
          <h1
            className="text-2xl sm:text-3xl font-extrabold text-white mb-3"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Thank you — you&apos;re helping build something better.
          </h1>
          <p className="text-white/60 leading-relaxed mb-6">
            Your answers are shaping Flor.
            {form.willingToShare === "Yes" && " We'll be in touch when we launch in your area."}
          </p>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 bg-periwinkle hover:bg-periwinkle-dark text-white font-bold px-8 py-3.5 rounded-full text-sm transition-all duration-200"
          >
            Browse Jobs →
          </Link>
        </div>
      </div>
    );
  }

  /* ── Survey Form ──────────────────────────────────────────────── */

  return (
    <div className="min-h-screen bg-[#F7F7FF]">
      {/* Hero header */}
      <section className="bg-[#1E1E2E] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-periwinkle/8 rounded-full blur-[120px]" />
        <div className="relative max-w-[900px] mx-auto px-6 sm:px-10 py-16 sm:py-20 text-center">
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-3"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Help Us Build Flor For You
          </h1>
          <p className="text-lg text-white/60 leading-relaxed max-w-xl mx-auto">
            Takes ~5 minutes. Your answers shape the platform.
          </p>
          <div className="mt-4 text-periwinkle text-lg">✦</div>
        </div>
      </section>

      {/* Progress bar */}
      <div className="sticky top-[60px] sm:top-[72px] z-30 bg-white border-b border-periwinkle-100/30">
        <div className="max-w-[900px] mx-auto px-6 sm:px-10 py-3 flex items-center gap-4">
          <div className="flex-1 h-2 bg-periwinkle-50 rounded-full overflow-hidden">
            <div
              className="h-full bg-periwinkle rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-xs font-bold text-periwinkle whitespace-nowrap">{progressPct}% complete</span>
        </div>
      </div>

      {/* Form */}
      <form ref={formRef} onSubmit={handleSubmit} className="max-w-[900px] mx-auto px-6 sm:px-10 py-10 sm:py-14">
        <div className="space-y-10">
          {/* ── SECTION: About You ──────────────────────────────── */}
          <SectionHeader title="About You" />

          {/* Q1 */}
          <Question id="q1" num={1} label="What is your current nursing status?" required error={errorField === "q1"}>
            <RadioGroup options={NURSING_STATUS_OPTIONS} value={form.nursingStatus} onChange={(v) => setForm({ ...form, nursingStatus: v })} />
          </Question>

          {/* Q2 */}
          <Question id="q2" num={2} label="How many years of nursing experience do you have?" required error={errorField === "q2"}>
            <RadioGroup options={EXPERIENCE_OPTIONS} value={form.yearsExperience} onChange={(v) => setForm({ ...form, yearsExperience: v })} />
          </Question>

          {/* Q3 */}
          <Question id="q3" num={3} label="What is your primary specialty or area of practice?" required error={errorField === "q3"}>
            <select
              value={form.specialty}
              onChange={(e) => setForm({ ...form, specialty: e.target.value })}
              className="w-full rounded-xl border border-periwinkle-100/60 bg-white px-4 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-periwinkle/40"
            >
              <option value="">Select specialty...</option>
              {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Question>

          {/* Q4 */}
          <Question id="q4" num={4} label="Do you hold any of the following certifications?" helper="Select all that apply">
            <CheckboxGroup options={CERTIFICATIONS} selected={form.certifications} onToggle={(v) => toggleArray("certifications", v)} />
          </Question>

          {/* Q5 */}
          <Question id="q5" num={5} label="What state(s) are you licensed in?" helper="e.g. RI, MA, CT — enter all active compact or single-state licenses">
            <input
              type="text"
              value={form.licensedStates}
              onChange={(e) => setForm({ ...form, licensedStates: e.target.value })}
              placeholder="RI, MA, CT"
              className="w-full rounded-xl border border-periwinkle-100/60 bg-white px-4 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-periwinkle/40"
            />
          </Question>

          {/* ── SECTION: What You're Looking For ────────────────── */}
          <SectionHeader title="What You're Looking For" />

          {/* Q6 */}
          <Question id="q6" num={6} label="What type of position are you looking for?" required helper="Select all that apply" error={errorField === "q6"}>
            <CheckboxGroup options={POSITION_TYPES} selected={form.positionTypes} onToggle={(v) => toggleArray("positionTypes", v)} />
          </Question>

          {/* Q7 */}
          <Question id="q7" num={7} label="What shift preference do you have?" helper="Select all that apply">
            <CheckboxGroup options={SHIFT_PREFS} selected={form.shiftPreferences} onToggle={(v) => toggleArray("shiftPreferences", v)} />
          </Question>

          {/* Q8 */}
          <Question id="q8" num={8} label="What is your target hourly rate or salary range?" required error={errorField === "q8"}>
            <RadioGroup options={PAY_RANGES} value={form.targetPay} onChange={(v) => setForm({ ...form, targetPay: v })} />
          </Question>

          {/* Q9 */}
          <Question id="q9" num={9} label="Are you open to relocation?" required error={errorField === "q9"}>
            <RadioGroup options={RELOCATION_OPTIONS} value={form.openToRelocation} onChange={(v) => setForm({ ...form, openToRelocation: v })} />
          </Question>

          {/* Q10 */}
          <Question id="q10" num={10} label="What is your current location (city and state)?" required error={errorField === "q10"}>
            <input
              type="text"
              value={form.currentLocation}
              onChange={(e) => setForm({ ...form, currentLocation: e.target.value })}
              placeholder="Providence, RI"
              className="w-full rounded-xl border border-periwinkle-100/60 bg-white px-4 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-periwinkle/40"
            />
          </Question>

          {/* ── SECTION: What Matters Most ──────────────────────── */}
          <SectionHeader title="What Matters Most" />

          {/* Q11 */}
          <Question id="q11" num={11} label="Rank the following in order of importance to you when choosing a job:" helper="Use the dropdowns to rank 1 (most important) through 9. No item can share a rank.">
            <div className="space-y-2">
              {RANK_ITEMS.map((item) => (
                <div key={item} className="flex items-center gap-3 bg-white rounded-xl border border-periwinkle-100/40 px-4 py-2.5">
                  <select
                    value={form.ranking[item] ?? ""}
                    onChange={(e) => setRank(item, Number(e.target.value))}
                    className="w-14 rounded-lg border border-periwinkle-100/60 bg-white px-2 py-1.5 text-sm text-periwinkle font-bold focus:outline-none focus:ring-2 focus:ring-periwinkle/40"
                  >
                    <option value="">—</option>
                    {Array.from({ length: 9 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                  <span className="text-sm text-text">{item}</span>
                </div>
              ))}
            </div>
          </Question>

          {/* Q12 */}
          <Question id="q12" num={12} label="Which benefits are most important to you?" helper="Select up to 3">
            <CheckboxGroup options={BENEFITS_OPTIONS} selected={form.importantBenefits} onToggle={(v) => toggleArray("importantBenefits", v, 3)} />
          </Question>

          {/* Q13 */}
          <Question id="q13" num={13} label="How frustrated are you with the current nursing job search experience?" required error={errorField === "q13"}>
            <RadioGroup options={FRUSTRATION_LABELS} value={form.frustration} onChange={(v) => setForm({ ...form, frustration: v })} />
          </Question>

          {/* Q14 */}
          <Question id="q14" num={14} label="What is the biggest problem with how you find nursing jobs today?" required helper="Select all that apply" error={errorField === "q14"}>
            <CheckboxGroup options={PROBLEMS} selected={form.problems} onToggle={(v) => toggleArray("problems", v)} />
            {form.problems.includes("Other") && (
              <input
                type="text"
                value={form.problemOther}
                onChange={(e) => setForm({ ...form, problemOther: e.target.value })}
                placeholder="Please describe..."
                className="mt-2 w-full rounded-xl border border-periwinkle-100/60 bg-white px-4 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-periwinkle/40"
              />
            )}
          </Question>

          {/* ── SECTION: Flor Specifics ─────────────────────────── */}
          <SectionHeader title="Flor Specifics" />

          {/* Q15 */}
          <Question id="q15" num={15} label="How did you hear about Flor?">
            <select
              value={form.heardFrom}
              onChange={(e) => setForm({ ...form, heardFrom: e.target.value })}
              className="w-full rounded-xl border border-periwinkle-100/60 bg-white px-4 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-periwinkle/40"
            >
              <option value="">Select...</option>
              {HEARD_FROM.map((h) => <option key={h} value={h}>{h}</option>)}
            </select>
          </Question>

          {/* Q16 */}
          <Question id="q16" num={16} label="Would you use a platform where pay is shown upfront and you apply directly to facilities — no recruiters involved?" required error={errorField === "q16"}>
            <RadioGroup options={WOULD_USE_OPTIONS} value={form.wouldUse} onChange={(v) => setForm({ ...form, wouldUse: v })} />
          </Question>

          {/* Q17 */}
          <Question id="q17" num={17} label="Would you be willing to share your contact info to be notified when Flor launches in your area?" required error={errorField === "q17"}>
            <RadioGroup options={["Yes", "No"]} value={form.willingToShare} onChange={(v) => setForm({ ...form, willingToShare: v })} />
          </Question>

          {/* Q18 — conditional */}
          {form.willingToShare === "Yes" && (
            <Question id="q18" num={18} label="Email address" required helper="We'll only contact you about Flor. No spam, ever." error={errorField === "q18"}>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-periwinkle-100/60 bg-white px-4 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-periwinkle/40"
              />
            </Question>
          )}
        </div>

        {/* Submit */}
        <div className="mt-12 max-w-md mx-auto">
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-periwinkle hover:bg-periwinkle-dark disabled:opacity-60 text-white font-bold py-4 rounded-full text-sm transition-all duration-200 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Submitting...
              </>
            ) : (
              "Submit Survey →"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────────────── */

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="pt-4">
      <h2 className="text-xs font-bold text-periwinkle uppercase tracking-wider">{title}</h2>
      <div className="mt-2 h-px bg-periwinkle/20" />
    </div>
  );
}

function Question({
  id,
  num,
  label,
  required,
  helper,
  error,
  children,
}: {
  id: string;
  num: number;
  label: string;
  required?: boolean;
  helper?: string;
  error?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className={`bg-white rounded-2xl border ${error ? "border-danger" : "border-periwinkle-100/40"} section-shadow p-5 sm:p-6 transition-colors`}>
      <div className="flex items-start gap-3 mb-3">
        <div className="w-7 h-7 rounded-full bg-periwinkle-50 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-extrabold text-periwinkle">{num}</span>
        </div>
        <div>
          <label className="text-sm font-bold text-text">
            {label}
            {required && <span className="text-periwinkle ml-1">*</span>}
          </label>
          {helper && <p className="text-xs text-text-muted mt-0.5">{helper}</p>}
        </div>
      </div>
      {error && (
        <p className="text-xs text-danger font-medium mb-2 ml-10">This field is required</p>
      )}
      <div className="ml-0 sm:ml-10">{children}</div>
    </div>
  );
}

function RadioGroup({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-3 cursor-pointer group">
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
            value === opt ? "border-periwinkle bg-periwinkle" : "border-periwinkle-100/60 group-hover:border-periwinkle/60"
          }`}>
            {value === opt && <div className="w-2 h-2 rounded-full bg-white" />}
          </div>
          <span className="text-sm text-text">{opt}</span>
        </label>
      ))}
    </div>
  );
}

function CheckboxGroup({ options, selected, onToggle }: { options: string[]; selected: string[]; onToggle: (v: string) => void }) {
  return (
    <div className="space-y-2">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-3 cursor-pointer group">
          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
            selected.includes(opt) ? "border-periwinkle bg-periwinkle" : "border-periwinkle-100/60 group-hover:border-periwinkle/60"
          }`}>
            {selected.includes(opt) && (
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <span className="text-sm text-text">{opt}</span>
        </label>
      ))}
    </div>
  );
}
