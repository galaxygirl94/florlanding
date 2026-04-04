"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

/* ── Constants ────────────────────────────────────────────────────────── */

const NURSE_TYPES = [
  "RN", "LPN", "CNA", "APRN", "NP",
  "DNP", "CRNA", "CNM", "FNP", "PNP", "PMHNP", "WHNP", "CNS",
  "Nurse Educator", "Nursing Student", "New Grad",
] as const;

const SPECIALTIES = [
  "Med Surg", "ICU", "ED", "OR", "L&D", "NICU", "Peds", "Psych",
  "Home Health", "Oncology", "Rehab", "School Nurse", "Telemetry",
  "Cardiac", "Outpatient/Clinic", "SNF/LTC",
  "Aesthetics", "Infusions", "Dialysis/Renal", "Neuro/Stroke", "Chemotherapy",
  "Respiratory", "Mother-Baby", "Dementia Care", "PICU", "PACU",
  "Step-Down", "Women's Health", "Community Health", "Occupational Health",
  "Nurse Administrator", "MDS Coordination", "Case Management",
  "Ambulatory Care", "Outpatient Care", "Hospice/Palliative", "School Nursing",
];

const SHIFT_OPTIONS = ["Days", "Nights", "Rotating", "Flexible"] as const;

const START_OPTIONS = ["ASAP", "Within a month", "Just exploring"] as const;

const PRIORITIES = [
  "Pay", "Benefits", "Schedule", "Growth", "Distance", "Facility type",
] as const;

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
];

const TOTAL_STEPS = 9; // 8 question steps + 1 final screen
const STORAGE_KEY = "flor_onboarding_data";

/* ── Types ─────────────────────────────────────────────────────────── */

interface WizardData {
  nurseType: string;
  specialty: string;
  location: string;
  shift: string;
  startTimeline: string;
  priorities: string[];
  resumeFile: string | null;
  licenseState: string;
  licenseNumber: string;
}

/* ── Component ─────────────────────────────────────────────────────── */

export default function OnboardingWizardPage() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [animating, setAnimating] = useState(false);

  /* Form state */
  const [nurseType, setNurseType] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [location, setLocation] = useState("");
  const [shift, setShift] = useState("");
  const [startTimeline, setStartTimeline] = useState("");
  const [priorities, setPriorities] = useState<string[]>([]);
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);
  const [licenseState, setLicenseState] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<{ verified: boolean; status: string; expirationDate?: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);

  /* Final screen */
  const [showFlower, setShowFlower] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── Load saved data on mount ──────────────────────────────────── */

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data: WizardData = JSON.parse(raw);
        if (data.nurseType) setNurseType(data.nurseType);
        if (data.specialty) setSpecialty(data.specialty);
        if (data.location) setLocation(data.location);
        if (data.shift) setShift(data.shift);
        if (data.startTimeline) setStartTimeline(data.startTimeline);
        if (data.priorities?.length) setPriorities(data.priorities);
        if (data.resumeFile) setResumeFileName(data.resumeFile);
        if (data.licenseState) setLicenseState(data.licenseState);
        if (data.licenseNumber) setLicenseNumber(data.licenseNumber);
      }
    } catch {
      // ignore
    }
  }, []);

  /* ── Persist to localStorage ─────────────────────────────────── */

  const persist = useCallback(() => {
    const data: WizardData = {
      nurseType,
      specialty,
      location,
      shift,
      startTimeline,
      priorities,
      resumeFile: resumeFileName,
      licenseState,
      licenseNumber,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore
    }
  }, [nurseType, specialty, location, shift, startTimeline, priorities, resumeFileName, licenseState, licenseNumber]);

  useEffect(() => {
    persist();
  }, [persist]);

  /* ── Navigation ──────────────────────────────────────────────── */

  function goNext() {
    if (animating) return;
    setDirection("forward");
    setAnimating(true);
    setTimeout(() => {
      setStep((s) => Math.min(s + 1, TOTAL_STEPS));
      setAnimating(false);
    }, 200);
  }

  function goBack() {
    if (animating || step <= 1) return;
    setDirection("back");
    setAnimating(true);
    setTimeout(() => {
      setStep((s) => Math.max(s - 1, 1));
      setAnimating(false);
    }, 200);
  }

  /* ── Step validation ────────────────────────────────────────── */

  function canContinue(): boolean {
    switch (step) {
      case 1: return !!nurseType;
      case 2: return !!specialty;
      case 3: return !!location.trim();
      case 4: return !!shift;
      case 5: return !!startTimeline;
      case 6: return priorities.length > 0;
      case 7: return true; // optional
      case 8: return true; // optional
      default: return true;
    }
  }

  /* ── Priority toggle ────────────────────────────────────────── */

  function togglePriority(value: string) {
    setPriorities((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  /* ── File handling ──────────────────────────────────────────── */

  function handleFile(file: File | undefined) {
    if (!file) return;
    setResumeFileName(file.name);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }

  /* ── Final screen trigger ───────────────────────────────────── */

  useEffect(() => {
    if (step === TOTAL_STEPS) {
      const timer = setTimeout(() => setShowFlower(true), 300);
      return () => clearTimeout(timer);
    }
  }, [step]);

  /* ── Progress bar width ─────────────────────────────────────── */

  const progressPercent = (step / TOTAL_STEPS) * 100;

  /* ── Transition classes ─────────────────────────────────────── */

  const contentClass = animating
    ? direction === "forward"
      ? "opacity-0 translate-x-8"
      : "opacity-0 -translate-x-8"
    : "opacity-100 translate-x-0";

  /* ── Render ─────────────────────────────────────────────────── */

  // Final screen
  if (step === TOTAL_STEPS) {
    return (
      <div className="min-h-screen bg-[#F8F8FA] flex flex-col">
        {/* Progress bar — full */}
        <div className="w-full h-1.5 bg-periwinkle-100/40">
          <div className="h-full bg-periwinkle rounded-r-full transition-all duration-500 ease-out" style={{ width: "100%" }} />
        </div>

        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-lg mx-auto">
            <div
              className={`text-7xl mb-8 transition-all duration-700 ease-out ${
                showFlower ? "opacity-100 scale-100" : "opacity-0 scale-50"
              }`}
            >
              &#10047;
            </div>
            <h1
              className={`text-3xl sm:text-4xl font-extrabold text-text mb-4 transition-all duration-500 delay-300 ${
                showFlower ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              Here are your matches
            </h1>
            <p
              className={`text-text-muted text-base mb-10 transition-all duration-500 delay-500 ${
                showFlower ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              We found jobs tailored to your preferences. Take a look.
            </p>
            <Link
              href="/jobs/matched"
              className={`inline-flex items-center justify-center gap-2 bg-periwinkle hover:bg-periwinkle-dark text-white rounded-2xl px-8 py-4 font-bold text-lg transition-all duration-500 delay-700 shadow-lg shadow-periwinkle/20 hover:shadow-xl hover:shadow-periwinkle/30 hover:-translate-y-0.5 w-full max-w-sm ${
                showFlower ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              See Your Matches
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8FA] flex flex-col">
      {/* ── Progress bar ──────────────────────────────────────────────── */}
      <div className="w-full h-1.5 bg-periwinkle-100/40">
        <div
          className="h-full bg-periwinkle rounded-r-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* ── Top bar with back arrow ───────────────────────────────────── */}
      <div className="w-full max-w-lg mx-auto px-6 pt-6">
        {step > 1 && (
          <button
            type="button"
            onClick={goBack}
            className="flex items-center gap-1.5 text-text-muted hover:text-text transition-colors text-sm font-semibold"
            aria-label="Go back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back
          </button>
        )}
      </div>

      {/* ── Card ──────────────────────────────────────────────────────── */}
      <div className="flex-1 flex items-start justify-center px-6 pt-8 pb-12">
        <div className="w-full max-w-lg">
          <div
            className={`bg-white rounded-2xl border border-periwinkle-100/40 p-8 sm:p-10 shadow-sm transition-all duration-200 ease-out ${contentClass}`}
          >
            {/* ── Step 1: Nurse Type ──────────────────────────────────── */}
            {step === 1 && (
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-text mb-8">
                  What type of nurse are you?
                </h1>
                <div className="space-y-3">
                  {NURSE_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNurseType(type)}
                      className={`w-full text-left rounded-2xl border-2 px-6 py-5 text-lg font-bold transition-all duration-200 ${
                        nurseType === type
                          ? "border-periwinkle bg-periwinkle-50 text-periwinkle-dark shadow-md shadow-periwinkle/10"
                          : "border-periwinkle-100/40 bg-white text-text hover:border-periwinkle/40 hover:bg-periwinkle-50/30"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Step 2: Specialty ───────────────────────────────────── */}
            {step === 2 && (
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-text mb-8">
                  What&apos;s your specialty?
                </h1>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full border border-periwinkle-100/60 rounded-2xl px-5 py-4 text-base hover:border-periwinkle/40 focus:outline-none focus:ring-2 focus:ring-periwinkle/30 transition-all bg-white text-text appearance-none cursor-pointer"
                >
                  <option value="">Select your specialty...</option>
                  {SPECIALTIES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            )}

            {/* ── Step 3: Location ────────────────────────────────────── */}
            {step === 3 && (
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-text mb-8">
                  Where are you located?
                </h1>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Providence, RI or 02903"
                  className="w-full border border-periwinkle-100/60 rounded-2xl px-5 py-4 text-base hover:border-periwinkle/40 focus:outline-none focus:ring-2 focus:ring-periwinkle/30 transition-all text-text placeholder:text-text-muted/50"
                />
              </div>
            )}

            {/* ── Step 4: Shift Preference ────────────────────────────── */}
            {step === 4 && (
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-text mb-8">
                  What shift do you prefer?
                </h1>
                <div className="flex flex-wrap gap-3">
                  {SHIFT_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setShift(option)}
                      className={`rounded-2xl px-6 py-4 text-base font-bold transition-all duration-200 border-2 ${
                        shift === option
                          ? "border-periwinkle bg-periwinkle-50 text-periwinkle-dark shadow-md shadow-periwinkle/10"
                          : "border-periwinkle-100/40 bg-white text-text hover:border-periwinkle/40 hover:bg-periwinkle-50/30"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Step 5: Start Timeline ──────────────────────────────── */}
            {step === 5 && (
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-text mb-8">
                  When can you start?
                </h1>
                <div className="space-y-3">
                  {START_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setStartTimeline(option)}
                      className={`w-full text-left rounded-2xl border-2 px-6 py-5 text-lg font-bold transition-all duration-200 ${
                        startTimeline === option
                          ? "border-periwinkle bg-periwinkle-50 text-periwinkle-dark shadow-md shadow-periwinkle/10"
                          : "border-periwinkle-100/40 bg-white text-text hover:border-periwinkle/40 hover:bg-periwinkle-50/30"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Step 6: Priorities (multi-select) ───────────────────── */}
            {step === 6 && (
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-text mb-3">
                  What matters most to you?
                </h1>
                <p className="text-text-muted text-sm mb-8">Select all that apply</p>
                <div className="flex flex-wrap gap-3">
                  {PRIORITIES.map((item) => {
                    const selected = priorities.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => togglePriority(item)}
                        className={`rounded-full px-5 py-3 text-sm font-semibold transition-all duration-200 border-2 ${
                          selected
                            ? "bg-periwinkle text-white border-periwinkle shadow-md shadow-periwinkle/20"
                            : "bg-white text-text-light border-periwinkle-100/40 hover:border-periwinkle/40 hover:bg-periwinkle-50/30"
                        }`}
                      >
                        {selected && (
                          <svg className="w-4 h-4 inline mr-1.5 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Step 7: Resume Upload ───────────────────────────────── */}
            {step === 7 && (
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-text mb-3">
                  Upload your resume
                </h1>
                <p className="text-text-muted text-sm mb-8">
                  We&apos;ll do the work — just drop your resume and we&apos;ll fill in the details.
                </p>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-200 ${
                    dragOver
                      ? "border-periwinkle bg-periwinkle-50/60"
                      : resumeFileName
                        ? "border-periwinkle/40 bg-periwinkle-50/30"
                        : "border-periwinkle-100/60 hover:border-periwinkle/40 hover:bg-periwinkle-50/20"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0])}
                  />
                  {resumeFileName ? (
                    <div>
                      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-periwinkle/10 flex items-center justify-center">
                        <svg className="w-6 h-6 text-periwinkle" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-text font-semibold text-sm">{resumeFileName}</p>
                      <p className="text-text-muted text-xs mt-1">Click to replace</p>
                    </div>
                  ) : (
                    <div>
                      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-periwinkle-100/30 flex items-center justify-center">
                        <svg className="w-6 h-6 text-periwinkle" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                      </div>
                      <p className="text-text font-semibold text-sm">
                        Drag & drop your resume here
                      </p>
                      <p className="text-text-muted text-xs mt-1">or click to browse (PDF, DOC, DOCX)</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Step 8: License Verification ────────────────────────── */}
            {step === 8 && (
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-text mb-3">
                  License verification
                </h1>
                <p className="text-text-muted text-sm mb-8">
                  Helps us verify you&apos;re ready to apply. You can always add this later.
                </p>
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">
                      State of License
                    </label>
                    <select
                      value={licenseState}
                      onChange={(e) => setLicenseState(e.target.value)}
                      className="w-full border border-periwinkle-100/60 rounded-2xl px-5 py-4 text-base hover:border-periwinkle/40 focus:outline-none focus:ring-2 focus:ring-periwinkle/30 transition-all bg-white text-text appearance-none cursor-pointer"
                    >
                      <option value="">Select state...</option>
                      {US_STATES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">
                      License Number
                    </label>
                    <input
                      type="text"
                      value={licenseNumber}
                      onChange={(e) => { setLicenseNumber(e.target.value); setVerifyResult(null); }}
                      placeholder="e.g. RN-2018-RI-44821"
                      className="w-full border border-periwinkle-100/60 rounded-2xl px-5 py-4 text-base hover:border-periwinkle/40 focus:outline-none focus:ring-2 focus:ring-periwinkle/30 transition-all text-text placeholder:text-text-muted/50"
                    />
                  </div>

                  {/* Verify button */}
                  {licenseState && licenseNumber && !verifyResult && (
                    <button
                      type="button"
                      onClick={async () => {
                        setVerifying(true);
                        try {
                          const res = await fetch("/api/verify-license", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ licenseState, licenseNumber, nameOnLicense: "Demo Nurse", licenseType: nurseType || "RN" }),
                          });
                          const data = await res.json();
                          setVerifyResult(data);
                        } catch {
                          setVerifyResult({ verified: false, status: "error" });
                        } finally {
                          setVerifying(false);
                        }
                      }}
                      disabled={verifying}
                      className="w-full bg-periwinkle/10 hover:bg-periwinkle/20 text-periwinkle rounded-2xl px-5 py-4 font-bold text-sm transition-all disabled:opacity-50"
                    >
                      {verifying ? "Verifying..." : "Verify My License"}
                    </button>
                  )}

                  {/* Verification result */}
                  {verifyResult && (
                    <div className={`rounded-2xl p-5 flex items-start gap-3 ${verifyResult.verified ? "bg-success-light" : "bg-amber-50 border border-amber-200"}`}>
                      {verifyResult.verified ? (
                        <>
                          <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-bold text-success text-sm">License Verified via Nursys e-Notify</p>
                            <p className="text-xs text-text-muted mt-1">
                              Status: Active{verifyResult.expirationDate ? ` · Expires ${new Date(verifyResult.expirationDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}` : ""}
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-8 h-8 rounded-full bg-amber flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-sm font-bold">!</span>
                          </div>
                          <div>
                            <p className="font-bold text-amber-dark text-sm">Could not verify license</p>
                            <p className="text-xs text-text-muted mt-1">
                              Check your license number and state. You can always verify later from your profile.
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Bottom actions ─────────────────────────────────────────── */}
          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={goNext}
              disabled={!canContinue()}
              className="w-full bg-periwinkle hover:bg-periwinkle-dark text-white rounded-2xl px-8 py-4 font-bold text-base transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-periwinkle/20 hover:shadow-xl hover:shadow-periwinkle/30 hover:-translate-y-0.5 disabled:hover:translate-y-0 disabled:hover:shadow-lg"
            >
              Continue
            </button>

            {(step === 7 || step === 8) && (
              <button
                type="button"
                onClick={goNext}
                className="w-full text-center text-text-muted hover:text-text font-semibold text-sm transition-colors py-2"
              >
                Skip
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
