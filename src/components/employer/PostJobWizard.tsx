"use client";

import { useState, useCallback } from "react";

/* ── Constants ────────────────────────────────────────────────────── */

const SPECIALTIES = [
  "Med Surg",
  "Telemetry",
  "ICU",
  "ED",
  "L&D",
  "NICU",
  "Peds",
  "Oncology",
  "Cardiac",
  "OR/Periop",
  "Psych",
  "Rehab",
  "Home Health",
  "SNF/LTC",
  "Outpatient",
  "Infusion",
  "Case Management",
  "Other",
];

const SHIFT_TYPES = [
  "Days",
  "Evenings",
  "Nights",
  "Rotating",
  "Weekends Only",
];

const SCHEDULE_STRUCTURES = [
  "3x12hr",
  "4x10hr",
  "5x8hr",
  "Self-Schedule",
  "Flexible",
];

const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Per diem",
  "Contract",
];

const TOTAL_STEPS = 7;

/* ── Component ────────────────────────────────────────────────────── */

export default function PostJobWizard({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [step, setStep] = useState(1);

  // Step 1: Position
  const [title, setTitle] = useState("");
  const [specialty, setSpecialty] = useState("");

  // Step 2: Employer type
  const [employerType, setEmployerType] = useState<"direct" | "internal">(
    "direct"
  );

  // Step 3: Pay
  const [payMin, setPayMin] = useState("");
  const [payMax, setPayMax] = useState("");

  // Step 4: Shift & schedule
  const [selectedShifts, setSelectedShifts] = useState<Set<string>>(new Set());
  const [scheduleStructure, setScheduleStructure] = useState("");
  const [employmentType, setEmploymentType] = useState("");

  // Step 5: Details
  const [patientRatio, setPatientRatio] = useState("");
  const [signOnBonus, setSignOnBonus] = useState("");
  const [description, setDescription] = useState("");

  // Step 6: Commitment
  const [responseCommit, setResponseCommit] = useState(false);

  const toggleShift = (s: string) => {
    setSelectedShifts((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  };

  const paySpread =
    payMin && payMax ? Number(payMax) - Number(payMin) : 0;

  const canAdvance = useCallback(() => {
    switch (step) {
      case 1:
        return title.trim().length > 0 && specialty.length > 0;
      case 2:
        return true;
      case 3:
        return payMin.trim().length > 0 && payMax.trim().length > 0;
      case 4:
        return (
          selectedShifts.size > 0 &&
          scheduleStructure.length > 0 &&
          employmentType.length > 0
        );
      case 5:
        return patientRatio.trim().length > 0;
      case 6:
        return responseCommit;
      case 7:
        return true;
      default:
        return false;
    }
  }, [
    step,
    title,
    specialty,
    payMin,
    payMax,
    selectedShifts,
    scheduleStructure,
    employmentType,
    patientRatio,
    responseCommit,
  ]);

  const next = () => {
    if (step < TOTAL_STEPS) setStep(step + 1);
  };
  const back = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1
          className="text-2xl sm:text-3xl font-extrabold mb-1"
          style={{ color: "#1E1E2E" }}
        >
          Post a New Job
        </h1>
        <p className="text-sm" style={{ color: "#6B7280" }}>
          Step {step} of {TOTAL_STEPS}
        </p>
      </div>

      {/* Progress bar */}
      <div
        className="w-full h-2 rounded-full mb-8 overflow-hidden"
        style={{ background: "#EEEEF9" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${(step / TOTAL_STEPS) * 100}%`,
            background: "#8B8FD4",
          }}
        />
      </div>

      {/* Step content */}
      <div
        className="rounded-2xl border p-6 sm:p-8 mb-6"
        style={{ background: "white", borderColor: "#E4E4EC" }}
      >
        {/* Step 1: Position */}
        {step === 1 && (
          <div>
            <h2
              className="text-lg font-extrabold mb-1"
              style={{ color: "#1E1E2E" }}
            >
              Position Details
            </h2>
            <p className="text-sm mb-6" style={{ color: "#6B7280" }}>
              What role are you hiring for?
            </p>

            <div className="space-y-4">
              <div>
                <label
                  className="block text-xs font-bold mb-2"
                  style={{ color: "#6B7280", letterSpacing: "0.05em" }}
                >
                  POSITION TITLE
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. ICU RN — Critical Care"
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-[#8B8FD4]"
                  style={{
                    borderColor: "#E4E4EC",
                    color: "#1E1E2E",
                    fontFamily: "'Manrope', system-ui, sans-serif",
                  }}
                />
              </div>

              <div>
                <label
                  className="block text-xs font-bold mb-2"
                  style={{ color: "#6B7280", letterSpacing: "0.05em" }}
                >
                  SPECIALTY
                </label>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-[#8B8FD4]"
                  style={{
                    borderColor: "#E4E4EC",
                    color: specialty ? "#1E1E2E" : "#9CA3AF",
                    fontFamily: "'Manrope', system-ui, sans-serif",
                  }}
                >
                  <option value="">Select a specialty</option>
                  {SPECIALTIES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Employer type */}
        {step === 2 && (
          <div>
            <h2
              className="text-lg font-extrabold mb-1"
              style={{ color: "#1E1E2E" }}
            >
              Employer Type
            </h2>
            <p className="text-sm mb-6" style={{ color: "#6B7280" }}>
              How is this position being hired?
            </p>

            <div className="space-y-3">
              {(
                [
                  {
                    id: "direct",
                    label: "Direct HR",
                    desc: "We are hiring directly for our facility.",
                  },
                  {
                    id: "internal",
                    label: "Internal Recruitment",
                    desc: "Our internal recruitment team manages hiring.",
                  },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setEmployerType(opt.id)}
                  className="w-full text-left p-4 rounded-xl border-2 transition-all"
                  style={{
                    borderColor:
                      employerType === opt.id ? "#8B8FD4" : "#E4E4EC",
                    background:
                      employerType === opt.id ? "#EEEEF9" : "white",
                  }}
                >
                  <div
                    className="text-sm font-bold"
                    style={{ color: "#1E1E2E" }}
                  >
                    {opt.label}
                  </div>
                  <div className="text-xs mt-1" style={{ color: "#6B7280" }}>
                    {opt.desc}
                  </div>
                </button>
              ))}
            </div>

            <div
              className="mt-5 p-4 rounded-xl flex gap-3"
              style={{ background: "#EEEEF9" }}
            >
              <span className="text-base flex-shrink-0">ℹ️</span>
              <div className="text-xs" style={{ color: "#6B7280" }}>
                <span className="font-bold" style={{ color: "#1E1E2E" }}>
                  Flor is direct-hire only.
                </span>{" "}
                We do not support staffing agencies or travel nurse contracts.
                All positions must be for direct employment at your facility.
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Pay range */}
        {step === 3 && (
          <div>
            <h2
              className="text-lg font-extrabold mb-1"
              style={{ color: "#1E1E2E" }}
            >
              Pay Range
            </h2>
            <p className="text-sm mb-6" style={{ color: "#6B7280" }}>
              Transparent pay is required on Flor. Nurses see your exact range.
            </p>

            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <label
                  className="block text-xs font-bold mb-2"
                  style={{ color: "#6B7280", letterSpacing: "0.05em" }}
                >
                  MIN HOURLY ($)
                </label>
                <input
                  type="number"
                  value={payMin}
                  onChange={(e) => setPayMin(e.target.value)}
                  placeholder="38"
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-[#8B8FD4]"
                  style={{
                    borderColor: "#E4E4EC",
                    color: "#1E1E2E",
                    fontFamily: "'Manrope', system-ui, sans-serif",
                  }}
                />
              </div>
              <div className="flex-1">
                <label
                  className="block text-xs font-bold mb-2"
                  style={{ color: "#6B7280", letterSpacing: "0.05em" }}
                >
                  MAX HOURLY ($)
                </label>
                <input
                  type="number"
                  value={payMax}
                  onChange={(e) => setPayMax(e.target.value)}
                  placeholder="46"
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-[#8B8FD4]"
                  style={{
                    borderColor: "#E4E4EC",
                    color: "#1E1E2E",
                    fontFamily: "'Manrope', system-ui, sans-serif",
                  }}
                />
              </div>
            </div>

            {paySpread > 15 && (
              <div
                className="p-4 rounded-xl flex gap-3"
                style={{ background: "#FFFBEB", border: "1px solid #FDE68A" }}
              >
                <span className="text-base flex-shrink-0">⚠️</span>
                <div
                  className="text-xs font-medium"
                  style={{ color: "#92400E" }}
                >
                  Narrowing your range attracts better-matched candidates.
                  Spreads over $15/hr can signal uncertainty to job seekers.
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Shift & schedule */}
        {step === 4 && (
          <div>
            <h2
              className="text-lg font-extrabold mb-1"
              style={{ color: "#1E1E2E" }}
            >
              Shift & Schedule
            </h2>
            <p className="text-sm mb-6" style={{ color: "#6B7280" }}>
              Select all that apply.
            </p>

            {/* Shift type tiles */}
            <label
              className="block text-xs font-bold mb-3"
              style={{ color: "#6B7280", letterSpacing: "0.05em" }}
            >
              SHIFT TYPE
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
              {SHIFT_TYPES.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleShift(s)}
                  className="px-4 py-3 rounded-xl text-sm font-bold border-2 transition-all"
                  style={{
                    borderColor: selectedShifts.has(s)
                      ? "#8B8FD4"
                      : "#E4E4EC",
                    background: selectedShifts.has(s)
                      ? "#EEEEF9"
                      : "white",
                    color: selectedShifts.has(s) ? "#6C70B8" : "#1E1E2E",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Schedule structure */}
            <label
              className="block text-xs font-bold mb-3"
              style={{ color: "#6B7280", letterSpacing: "0.05em" }}
            >
              SCHEDULE STRUCTURE
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
              {SCHEDULE_STRUCTURES.map((s) => (
                <button
                  key={s}
                  onClick={() => setScheduleStructure(s)}
                  className="px-4 py-3 rounded-xl text-sm font-bold border-2 transition-all"
                  style={{
                    borderColor:
                      scheduleStructure === s ? "#8B8FD4" : "#E4E4EC",
                    background:
                      scheduleStructure === s ? "#EEEEF9" : "white",
                    color: scheduleStructure === s ? "#6C70B8" : "#1E1E2E",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Employment type */}
            <label
              className="block text-xs font-bold mb-3"
              style={{ color: "#6B7280", letterSpacing: "0.05em" }}
            >
              EMPLOYMENT TYPE
            </label>
            <div className="grid grid-cols-2 gap-2">
              {EMPLOYMENT_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setEmploymentType(t)}
                  className="px-4 py-3 rounded-xl text-sm font-bold border-2 transition-all"
                  style={{
                    borderColor:
                      employmentType === t ? "#8B8FD4" : "#E4E4EC",
                    background:
                      employmentType === t ? "#EEEEF9" : "white",
                    color: employmentType === t ? "#6C70B8" : "#1E1E2E",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Details */}
        {step === 5 && (
          <div>
            <h2
              className="text-lg font-extrabold mb-1"
              style={{ color: "#1E1E2E" }}
            >
              Job Details
            </h2>
            <p className="text-sm mb-6" style={{ color: "#6B7280" }}>
              Required transparency fields plus your job description.
            </p>

            <div className="space-y-5">
              <div>
                <label
                  className="block text-xs font-bold mb-2"
                  style={{ color: "#6B7280", letterSpacing: "0.05em" }}
                >
                  PATIENT-TO-NURSE RATIO *
                </label>
                <input
                  value={patientRatio}
                  onChange={(e) => setPatientRatio(e.target.value)}
                  placeholder="e.g. 5:1"
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-[#8B8FD4]"
                  style={{
                    borderColor: "#E4E4EC",
                    color: "#1E1E2E",
                    fontFamily: "'Manrope', system-ui, sans-serif",
                  }}
                />
              </div>

              <div>
                <label
                  className="block text-xs font-bold mb-2"
                  style={{ color: "#6B7280", letterSpacing: "0.05em" }}
                >
                  SIGN-ON BONUS (OPTIONAL)
                </label>
                <input
                  type="number"
                  value={signOnBonus}
                  onChange={(e) => setSignOnBonus(e.target.value)}
                  placeholder="e.g. 10000"
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-[#8B8FD4]"
                  style={{
                    borderColor: "#E4E4EC",
                    color: "#1E1E2E",
                    fontFamily: "'Manrope', system-ui, sans-serif",
                  }}
                />
              </div>

              <div>
                <label
                  className="flex items-center justify-between text-xs font-bold mb-2"
                  style={{ color: "#6B7280", letterSpacing: "0.05em" }}
                >
                  <span>JOB DESCRIPTION</span>
                  <span
                    style={{
                      color:
                        description.length >= 500 ? "#059669" : "#9CA3AF",
                      letterSpacing: 0,
                      fontWeight: 600,
                    }}
                  >
                    {description.length}/500 min
                  </span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the role, unit culture, what makes this position unique..."
                  rows={6}
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-[#8B8FD4] resize-none"
                  style={{
                    borderColor: "#E4E4EC",
                    color: "#1E1E2E",
                    fontFamily: "'Manrope', system-ui, sans-serif",
                  }}
                />
                {description.length > 0 && description.length < 500 && (
                  <p
                    className="text-xs mt-1"
                    style={{ color: "#F4A942" }}
                  >
                    Keep going! Detailed descriptions attract more qualified
                    candidates.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Commitment */}
        {step === 6 && (
          <div>
            <h2
              className="text-lg font-extrabold mb-1"
              style={{ color: "#1E1E2E" }}
            >
              Response Commitment
            </h2>
            <p className="text-sm mb-6" style={{ color: "#6B7280" }}>
              Flor stands for transparency. Part of that is committing to
              respond to every applicant.
            </p>

            <div
              className="p-5 rounded-2xl border-2 transition-all"
              style={{
                borderColor: responseCommit ? "#8B8FD4" : "#E4E4EC",
                background: responseCommit ? "#EEEEF9" : "white",
              }}
            >
              <label className="flex items-start gap-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={responseCommit}
                  onChange={(e) => setResponseCommit(e.target.checked)}
                  className="mt-1 rounded"
                  style={{ accentColor: "#8B8FD4", width: 18, height: 18 }}
                />
                <div>
                  <div
                    className="text-sm font-bold mb-1"
                    style={{ color: "#1E1E2E" }}
                  >
                    I commit to responding to all applicants within 14 days.
                  </div>
                  <div className="text-xs" style={{ color: "#6B7280" }}>
                    This means every nurse who applies will receive a response
                    — even if it&apos;s a decline. Ghosting erodes trust in the
                    profession. Facilities that honor this commitment earn a
                    Response badge visible to all candidates.
                  </div>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Step 7: Preview */}
        {step === 7 && (
          <div>
            <h2
              className="text-lg font-extrabold mb-1"
              style={{ color: "#1E1E2E" }}
            >
              Preview Your Listing
            </h2>
            <p className="text-sm mb-6" style={{ color: "#6B7280" }}>
              This is how nurses will see your posting.
            </p>

            <div
              className="rounded-2xl border p-5"
              style={{ borderColor: "#E4E4EC" }}
            >
              {/* Title */}
              <h3
                className="text-lg font-extrabold mb-1"
                style={{ color: "#1E1E2E" }}
              >
                {title || "Untitled Position"}
              </h3>
              <p className="text-sm mb-4" style={{ color: "#8B8FD4" }}>
                Bayside Medical Center — Providence, RI
              </p>

              {/* Details grid */}
              <div
                className="grid grid-cols-2 gap-3 text-sm mb-4 p-4 rounded-xl"
                style={{ background: "#FAFAFE" }}
              >
                <div>
                  <div
                    className="text-xs font-bold mb-0.5"
                    style={{ color: "#9CA3AF" }}
                  >
                    Pay
                  </div>
                  <div style={{ color: "#1E1E2E", fontWeight: 700 }}>
                    ${payMin}–${payMax}/hr
                  </div>
                </div>
                <div>
                  <div
                    className="text-xs font-bold mb-0.5"
                    style={{ color: "#9CA3AF" }}
                  >
                    Specialty
                  </div>
                  <div style={{ color: "#1E1E2E", fontWeight: 700 }}>
                    {specialty || "—"}
                  </div>
                </div>
                <div>
                  <div
                    className="text-xs font-bold mb-0.5"
                    style={{ color: "#9CA3AF" }}
                  >
                    Shift
                  </div>
                  <div style={{ color: "#1E1E2E", fontWeight: 700 }}>
                    {Array.from(selectedShifts).join(", ") || "—"}
                  </div>
                </div>
                <div>
                  <div
                    className="text-xs font-bold mb-0.5"
                    style={{ color: "#9CA3AF" }}
                  >
                    Schedule
                  </div>
                  <div style={{ color: "#1E1E2E", fontWeight: 700 }}>
                    {scheduleStructure || "—"} · {employmentType || "—"}
                  </div>
                </div>
                <div>
                  <div
                    className="text-xs font-bold mb-0.5"
                    style={{ color: "#9CA3AF" }}
                  >
                    Patient Ratio
                  </div>
                  <div style={{ color: "#1E1E2E", fontWeight: 700 }}>
                    {patientRatio || "—"}
                  </div>
                </div>
                {signOnBonus && (
                  <div>
                    <div
                      className="text-xs font-bold mb-0.5"
                      style={{ color: "#9CA3AF" }}
                    >
                      Sign-On Bonus
                    </div>
                    <div style={{ color: "#059669", fontWeight: 700 }}>
                      ${Number(signOnBonus).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              {description && (
                <div>
                  <div
                    className="text-xs font-bold mb-2"
                    style={{ color: "#9CA3AF" }}
                  >
                    About this role
                  </div>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#374151" }}
                  >
                    {description}
                  </p>
                </div>
              )}

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-4">
                {responseCommit && (
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full"
                    style={{ background: "#ECFDF5", color: "#059669" }}
                  >
                    Response Committed
                  </span>
                )}
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: "#EEEEF9", color: "#6C70B8" }}
                >
                  Direct Hire
                </span>
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: "#EEEEF9", color: "#6C70B8" }}
                >
                  Magnet Designated
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-3">
        {step > 1 && (
          <button
            onClick={back}
            className="px-6 py-3 rounded-full text-sm font-bold border transition-colors hover:bg-[#FAFAFE]"
            style={{ borderColor: "#E4E4EC", color: "#6B7280" }}
          >
            Back
          </button>
        )}
        {step < TOTAL_STEPS ? (
          <button
            onClick={next}
            disabled={!canAdvance()}
            className="px-6 py-3 rounded-full text-sm font-bold text-white transition-opacity disabled:opacity-40"
            style={{ background: "#8B8FD4" }}
          >
            Continue
          </button>
        ) : (
          <button
            onClick={onComplete}
            className="px-8 py-3 rounded-full text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: "#059669" }}
          >
            Publish Job Listing
          </button>
        )}
      </div>
    </div>
  );
}
