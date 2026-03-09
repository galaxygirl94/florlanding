"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { verifyLicense, isExpiringSoon } from "@/lib/nursys-mock";
import type { NursysVerificationResult } from "@/lib/nursys-mock";

/* ── Constants ────────────────────────────────────────────────────────── */

const SPECIALTIES = [
  "Med Surg", "ICU", "ED", "OR", "L&D", "NICU", "Peds", "Psych",
  "Home Health", "Oncology", "Rehab", "School Nurse", "Telemetry",
  "Cardiac", "Outpatient/Clinic", "SNF/LTC",
];

const CERTIFICATIONS = [
  "BLS", "ACLS", "PALS", "NRP", "TNCC", "CCRN", "CEN", "RNC",
];

const SHIFT_OPTIONS = ["Days", "Evenings", "Nights", "Rotating", "Weekends Only"];
const SCHEDULE_TYPES = ["Full-time", "Part-time", "Per diem"];

const CARE_SETTINGS = [
  "Acute care/Hospital", "SNF/Long-term care", "Outpatient clinic",
  "Home health", "School", "Ambulatory surgery", "Rehab", "Psych facility",
];

const PATIENT_POPULATIONS = [
  "Adult", "Geriatric", "Pediatric", "Neonatal", "Maternal", "Psychiatric",
];

const COMMUTE_OPTIONS = [5, 10, 15, 25, 50];

const EHR_SYSTEMS = [
  "Epic", "Cerner/Oracle Health", "Meditech", "PointClickCare", "Athenahealth",
];

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
];

const SECTIONS = [
  { id: "specialties", num: 1, title: "Your Specialties", subtitle: "What you're great at helps us find the right match" },
  { id: "certifications", num: 2, title: "Certifications", subtitle: "Current certs only — we'll never ask about expired ones" },
  { id: "experience", num: 3, title: "Experience", subtitle: "Helps us match you to roles at the right level" },
  { id: "schedule", num: 4, title: "Schedule Preferences", subtitle: "You set the terms" },
  { id: "care-settings", num: 5, title: "Care Settings", subtitle: "Where do you want to work?" },
  { id: "patient-populations", num: 6, title: "Patient Populations", subtitle: "Who do you love caring for?" },
  { id: "pay", num: 7, title: "Pay Preference", subtitle: "This is private. Employers never see your number. We use it to flag jobs below your minimum." },
  { id: "location", num: 8, title: "Location & Commute", subtitle: "We'll only show you jobs you can actually get to" },
  { id: "ehr", num: 9, title: "EHR Systems", subtitle: "Nice to know, never a dealbreaker" },
  { id: "license", num: 10, title: "License Verification", subtitle: "Verify your license so employers see the checkmark" },
];

/* ── Types ─────────────────────────────────────────────────────────── */

interface NurseProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  zipCode?: string;
  licenses: { type: string; state: string; number?: string; verified: boolean; verificationStatus?: string }[];
  certifications: string[];
  specialties: string[];
  yearsOfExperience: number;
  yearsSpecialty?: number;
  ehrExperience: string[];
  shiftPreferences?: string[];
  scheduleTypes?: string[];
  careSettings?: string[];
  patientPopulations?: string[];
  maxCommuteMiles?: number;
  desiredPayMin?: number;
  profileCompleted?: boolean;
}

/* ── Icons (inline SVGs) ──────────────────────────────────────────── */

function CheckIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function LockIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function ShieldCheckIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function SparklesIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  );
}

/* ── Helpers ───────────────────────────────────────────────────────── */

function generateId(): string {
  return `nurse_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/* ── Component ─────────────────────────────────────────────────────── */

export default function OnboardingPage() {
  /* Form state */
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [specialtyOther, setSpecialtyOther] = useState("");
  const [certifications, setCertifications] = useState<string[]>([]);
  const [certOther, setCertOther] = useState("");
  const [yearsExperience, setYearsExperience] = useState<number | "">("");
  const [yearsSpecialty, setYearsSpecialty] = useState<number | "">("");
  const [shiftPreferences, setShiftPreferences] = useState<string[]>([]);
  const [scheduleTypes, setScheduleTypes] = useState<string[]>([]);
  const [careSettings, setCareSettings] = useState<string[]>([]);
  const [careSettingOther, setCareSettingOther] = useState("");
  const [patientPopulations, setPatientPopulations] = useState<string[]>([]);
  const [desiredPayMin, setDesiredPayMin] = useState<number | "">("");
  const [zipCode, setZipCode] = useState("");
  const [maxCommuteMiles, setMaxCommuteMiles] = useState<number>(15);
  const [ehrExperience, setEhrExperience] = useState<string[]>([]);
  const [ehrOther, setEhrOther] = useState("");
  const [licenseState, setLicenseState] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  /* Verification state */
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<NursysVerificationResult | null>(null);

  /* UI state */
  const [activeSection, setActiveSection] = useState(0);
  const [hasResumeData, setHasResumeData] = useState(false);
  const [prefilledFields, setPrefilledFields] = useState<Set<string>>(new Set());
  const [profileComplete, setProfileComplete] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  /* Refs */
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  /* ── Load saved data on mount ──────────────────────────────────── */

  useEffect(() => {
    const prefilled = new Set<string>();

    // Check for existing profile first
    try {
      const savedProfile = localStorage.getItem("flor_nurse_profile");
      if (savedProfile) {
        const profile: NurseProfile = JSON.parse(savedProfile);
        applyProfile(profile, prefilled, false);
      }
    } catch {
      // ignore
    }

    // Check for resume data (overrides saved profile for pre-filled fields)
    try {
      const resumeRaw = localStorage.getItem("flor_resume_data");
      if (resumeRaw) {
        const resume = JSON.parse(resumeRaw);
        setHasResumeData(true);
        applyResumeData(resume, prefilled);
      }
    } catch {
      // ignore
    }

    setPrefilledFields(prefilled);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applyProfile(profile: NurseProfile, prefilled: Set<string>, markPrefilled: boolean) {
    if (profile.firstName) { setFirstName(profile.firstName); if (markPrefilled) prefilled.add("firstName"); }
    if (profile.lastName) { setLastName(profile.lastName); if (markPrefilled) prefilled.add("lastName"); }
    if (profile.email) { setEmail(profile.email); if (markPrefilled) prefilled.add("email"); }
    if (profile.phone) { setPhone(profile.phone); if (markPrefilled) prefilled.add("phone"); }
    if (profile.specialties?.length) { setSpecialties(profile.specialties); if (markPrefilled) prefilled.add("specialties"); }
    if (profile.certifications?.length) { setCertifications(profile.certifications); if (markPrefilled) prefilled.add("certifications"); }
    if (profile.yearsOfExperience) { setYearsExperience(profile.yearsOfExperience); if (markPrefilled) prefilled.add("yearsExperience"); }
    if (profile.yearsSpecialty) { setYearsSpecialty(profile.yearsSpecialty); if (markPrefilled) prefilled.add("yearsSpecialty"); }
    if (profile.shiftPreferences?.length) setShiftPreferences(profile.shiftPreferences);
    if (profile.scheduleTypes?.length) setScheduleTypes(profile.scheduleTypes);
    if (profile.careSettings?.length) setCareSettings(profile.careSettings);
    if (profile.patientPopulations?.length) setPatientPopulations(profile.patientPopulations);
    if (profile.desiredPayMin) setDesiredPayMin(profile.desiredPayMin);
    if (profile.zipCode) { setZipCode(profile.zipCode); if (markPrefilled) prefilled.add("zipCode"); }
    if (profile.maxCommuteMiles) setMaxCommuteMiles(profile.maxCommuteMiles);
    if (profile.ehrExperience?.length) { setEhrExperience(profile.ehrExperience); if (markPrefilled) prefilled.add("ehrExperience"); }
    if (profile.licenses?.length) {
      const lic = profile.licenses[0];
      if (lic.state) setLicenseState(lic.state);
      if (lic.number) setLicenseNumber(lic.number);
      if (markPrefilled) prefilled.add("license");
    }
  }

  function applyResumeData(resume: Record<string, unknown>, prefilled: Set<string>) {
    if (resume.firstName && typeof resume.firstName === "string") { setFirstName(resume.firstName); prefilled.add("firstName"); }
    if (resume.lastName && typeof resume.lastName === "string") { setLastName(resume.lastName); prefilled.add("lastName"); }
    if (resume.email && typeof resume.email === "string") { setEmail(resume.email); prefilled.add("email"); }
    if (resume.phone && typeof resume.phone === "string") { setPhone(resume.phone); prefilled.add("phone"); }
    if (Array.isArray(resume.specialties) && resume.specialties.length) { setSpecialties(resume.specialties); prefilled.add("specialties"); }
    if (Array.isArray(resume.certifications) && resume.certifications.length) { setCertifications(resume.certifications); prefilled.add("certifications"); }
    if (typeof resume.yearsOfExperience === "number") { setYearsExperience(resume.yearsOfExperience); prefilled.add("yearsExperience"); }
    if (typeof resume.yearsSpecialty === "number") { setYearsSpecialty(resume.yearsSpecialty); prefilled.add("yearsSpecialty"); }
    if (Array.isArray(resume.ehrExperience) && resume.ehrExperience.length) { setEhrExperience(resume.ehrExperience); prefilled.add("ehrExperience"); }
    if (resume.zipCode && typeof resume.zipCode === "string") { setZipCode(resume.zipCode); prefilled.add("zipCode"); }
    if (resume.licenseState && typeof resume.licenseState === "string") { setLicenseState(resume.licenseState as string); prefilled.add("license"); }
    if (resume.licenseNumber && typeof resume.licenseNumber === "string") { setLicenseNumber(resume.licenseNumber as string); prefilled.add("license"); }
  }

  /* ── Intersection observer for active section ──────────────────── */

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = sectionRefs.current.findIndex((ref) => ref === entry.target);
            if (idx !== -1) setActiveSection(idx);
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );

    const currentRefs = sectionRefs.current;
    currentRefs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      currentRefs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  /* ── Helpers ───────────────────────────────────────────────────── */

  function toggleMultiSelect(value: string, list: string[], setter: (v: string[]) => void) {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  function scrollToSection(index: number) {
    sectionRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const isPrefilled = useCallback(
    (field: string) => prefilledFields.has(field),
    [prefilledFields]
  );

  /* ── License verification ──────────────────────────────────────── */

  async function handleVerify() {
    if (!licenseState || !licenseNumber) return;
    setVerifying(true);
    setVerificationResult(null);
    try {
      const result = await verifyLicense(`${firstName} ${lastName}`, licenseState, licenseNumber);
      setVerificationResult(result);
    } catch {
      setVerificationResult({ status: "not_found", disciplineFlags: [] });
    } finally {
      setVerifying(false);
    }
  }

  /* ── Profile save ──────────────────────────────────────────────── */

  function handleComplete() {
    const allSpecialties = specialtyOther
      ? [...specialties, specialtyOther]
      : specialties;
    const allCerts = certOther
      ? [...certifications, certOther]
      : certifications;
    const allCareSettings = careSettingOther
      ? [...careSettings, careSettingOther]
      : careSettings;
    const allEhr = ehrOther
      ? [...ehrExperience, ehrOther]
      : ehrExperience;

    const profile: NurseProfile = {
      id: generateId(),
      firstName,
      lastName,
      email,
      phone: phone || undefined,
      zipCode: zipCode || undefined,
      licenses: licenseState
        ? [{
            type: "RN",
            state: licenseState,
            number: licenseNumber || undefined,
            verified: verificationResult?.status === "active",
            verificationStatus: verificationResult?.status,
          }]
        : [],
      certifications: allCerts,
      specialties: allSpecialties,
      yearsOfExperience: typeof yearsExperience === "number" ? yearsExperience : 0,
      yearsSpecialty: typeof yearsSpecialty === "number" ? yearsSpecialty : undefined,
      ehrExperience: allEhr,
      shiftPreferences: shiftPreferences.length ? shiftPreferences : undefined,
      scheduleTypes: scheduleTypes.length ? scheduleTypes : undefined,
      careSettings: allCareSettings.length ? allCareSettings : undefined,
      patientPopulations: patientPopulations.length ? patientPopulations : undefined,
      maxCommuteMiles: maxCommuteMiles || undefined,
      desiredPayMin: typeof desiredPayMin === "number" ? desiredPayMin : undefined,
      profileCompleted: true,
    };

    localStorage.setItem("flor_nurse_profile", JSON.stringify(profile));

    setShowSuccessAnimation(true);
    setTimeout(() => {
      setProfileComplete(true);
    }, 1800);
  }

  /* ── Render helpers ────────────────────────────────────────────── */

  function prefilledBg(field: string) {
    return isPrefilled(field) ? "bg-periwinkle-50/60" : "";
  }

  function PrefilledCheck({ field }: { field: string }) {
    if (!isPrefilled(field)) return null;
    return (
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-success/10 text-success ml-2 flex-shrink-0">
        <CheckIcon className="w-3 h-3" />
      </span>
    );
  }

  function SectionHeader({ index }: { index: number }) {
    const section = SECTIONS[index];
    return (
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1.5">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-periwinkle/10 text-periwinkle text-sm font-extrabold flex-shrink-0">
            {section.num}
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-text">{section.title}</h2>
        </div>
        <p className="text-sm text-text-muted ml-11">{section.subtitle}</p>
      </div>
    );
  }

  function MultiSelectGrid({
    options,
    selected,
    onToggle,
    field,
    hasOther = false,
    otherValue = "",
    onOtherChange,
  }: {
    options: string[];
    selected: string[];
    onToggle: (val: string) => void;
    field?: string;
    hasOther?: boolean;
    otherValue?: string;
    onOtherChange?: (val: string) => void;
  }) {
    const isOtherSelected = selected.includes("Other");
    return (
      <div className={`${field && isPrefilled(field) ? "bg-periwinkle-50/40 rounded-xl p-4 -m-4" : ""}`}>
        {field && isPrefilled(field) && (
          <div className="flex items-center gap-1.5 mb-3">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-success/10 text-success">
              <CheckIcon className="w-2.5 h-2.5" />
            </span>
            <span className="text-xs text-success font-semibold">Pre-filled from resume</span>
          </div>
        )}
        <div className="flex flex-wrap gap-2.5">
          {options.map((option) => {
            const active = selected.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => onToggle(option)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 border ${
                  active
                    ? "bg-periwinkle text-white border-periwinkle shadow-md shadow-periwinkle/20"
                    : "bg-white text-text-light border-periwinkle-100/60 hover:border-periwinkle/40 hover:bg-periwinkle-50/50"
                }`}
              >
                {option}
              </button>
            );
          })}
          {hasOther && (
            <button
              type="button"
              onClick={() => onToggle("Other")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 border ${
                isOtherSelected
                  ? "bg-periwinkle text-white border-periwinkle shadow-md shadow-periwinkle/20"
                  : "bg-white text-text-light border-periwinkle-100/60 hover:border-periwinkle/40 hover:bg-periwinkle-50/50"
              }`}
            >
              Other
            </button>
          )}
        </div>
        {hasOther && isOtherSelected && (
          <input
            type="text"
            value={otherValue}
            onChange={(e) => onOtherChange?.(e.target.value)}
            placeholder="Please specify..."
            className="mt-3 w-full max-w-xs border border-periwinkle-100/60 rounded-xl px-4 py-2.5 text-sm hover:border-periwinkle/40 focus:outline-none focus:ring-2 focus:ring-periwinkle/30 transition-all"
          />
        )}
      </div>
    );
  }

  /* ── Success / completion screen ───────────────────────────────── */

  if (showSuccessAnimation && !profileComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F8FA]">
        <div className="text-center animate-fade-in-up">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-success/10 flex items-center justify-center">
            <CheckIcon className="w-12 h-12 text-success" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text mb-3">Your profile is ready!</h1>
          <p className="text-text-muted text-lg">Preparing your matches...</p>
        </div>
      </div>
    );
  }

  if (profileComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F8FA]">
        <div className="text-center animate-fade-in-up max-w-md mx-auto px-6">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-periwinkle/10 flex items-center justify-center">
            <SparklesIcon className="w-10 h-10 text-periwinkle" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text mb-3">Your profile is ready!</h1>
          <p className="text-text-muted text-base mb-8">
            We have everything we need to start finding your ideal matches.
          </p>
          <Link
            href="/jobs/matched"
            className="inline-flex items-center gap-2 bg-periwinkle hover:bg-periwinkle-dark text-white rounded-full px-8 py-3.5 font-bold text-base transition-all duration-200 shadow-lg shadow-periwinkle/20 hover:shadow-xl hover:shadow-periwinkle/30 hover:-translate-y-0.5"
          >
            Let&apos;s find your matches
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  /* ── Main form ─────────────────────────────────────────────────── */

  return (
    <div className="min-h-screen bg-[#F8F8FA]">
      {/* ── Sticky progress bar ─────────────────────────────────────── */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-periwinkle-100/30">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex items-center justify-center gap-2 py-3">
            {SECTIONS.map((section, i) => (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollToSection(i)}
                className="group flex items-center gap-1.5"
                aria-label={`Go to ${section.title}`}
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    i === activeSection
                      ? "w-8 h-3 bg-periwinkle"
                      : i < activeSection
                        ? "w-3 h-3 bg-periwinkle/40"
                        : "w-3 h-3 bg-periwinkle-100/60 group-hover:bg-periwinkle/30"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-14 sm:py-18">
        {/* ── Page header ───────────────────────────────────────────── */}
        <div className="max-w-2xl mx-auto text-center mb-12 animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text mb-3">
            Build Your Nurse Profile
          </h1>
          <p className="text-text-muted text-base">
            Tell us about yourself so we can match you with jobs that actually fit.
          </p>
        </div>

        {/* ── Pre-fill banner ───────────────────────────────────────── */}
        {hasResumeData && (
          <div className="max-w-3xl mx-auto mb-10 animate-fade-in-up">
            <div className="bg-periwinkle-50 rounded-2xl border border-periwinkle-100/40 p-5 flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-periwinkle/10 flex items-center justify-center mt-0.5">
                <CheckIcon className="w-4 h-4 text-periwinkle" />
              </span>
              <p className="text-sm text-text leading-relaxed">
                We pre-filled what we could from your resume. Review everything below — and set your pay and commute preferences, which only you control.
              </p>
            </div>
          </div>
        )}

        {/* ── Sections ──────────────────────────────────────────────── */}
        <div className="max-w-3xl mx-auto space-y-8">

          {/* Section 1: Specialties */}
          <section
            ref={(el) => { sectionRefs.current[0] = el; }}
            id="specialties"
            className="bg-white rounded-2xl border border-periwinkle-100/40 section-shadow p-6 sm:p-8 animate-fade-in-up scroll-mt-20"
          >
            <SectionHeader index={0} />
            <MultiSelectGrid
              options={SPECIALTIES}
              selected={specialties}
              onToggle={(v) => toggleMultiSelect(v, specialties, setSpecialties)}
              field="specialties"
              hasOther
              otherValue={specialtyOther}
              onOtherChange={setSpecialtyOther}
            />
          </section>

          {/* Section 2: Certifications */}
          <section
            ref={(el) => { sectionRefs.current[1] = el; }}
            id="certifications"
            className="bg-white rounded-2xl border border-periwinkle-100/40 section-shadow p-6 sm:p-8 animate-fade-in-up scroll-mt-20"
          >
            <SectionHeader index={1} />
            <MultiSelectGrid
              options={CERTIFICATIONS}
              selected={certifications}
              onToggle={(v) => toggleMultiSelect(v, certifications, setCertifications)}
              field="certifications"
              hasOther
              otherValue={certOther}
              onOtherChange={setCertOther}
            />
          </section>

          {/* Section 3: Experience */}
          <section
            ref={(el) => { sectionRefs.current[2] = el; }}
            id="experience"
            className="bg-white rounded-2xl border border-periwinkle-100/40 section-shadow p-6 sm:p-8 animate-fade-in-up scroll-mt-20"
          >
            <SectionHeader index={2} />
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">
                  Total Years of Nursing Experience
                  <PrefilledCheck field="yearsExperience" />
                </label>
                <input
                  type="number"
                  min={0}
                  max={60}
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(e.target.value ? Number(e.target.value) : "")}
                  className={`w-full border border-periwinkle-100/60 rounded-xl px-4 py-3 text-sm min-h-[44px] hover:border-periwinkle/40 focus:outline-none focus:ring-2 focus:ring-periwinkle/30 transition-all ${prefilledBg("yearsExperience")}`}
                  placeholder="e.g. 5"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">
                  Years in Primary Specialty
                  <PrefilledCheck field="yearsSpecialty" />
                </label>
                <input
                  type="number"
                  min={0}
                  max={60}
                  value={yearsSpecialty}
                  onChange={(e) => setYearsSpecialty(e.target.value ? Number(e.target.value) : "")}
                  className={`w-full border border-periwinkle-100/60 rounded-xl px-4 py-3 text-sm min-h-[44px] hover:border-periwinkle/40 focus:outline-none focus:ring-2 focus:ring-periwinkle/30 transition-all ${prefilledBg("yearsSpecialty")}`}
                  placeholder="e.g. 3"
                />
              </div>
            </div>
          </section>

          {/* Section 4: Schedule Preferences */}
          <section
            ref={(el) => { sectionRefs.current[3] = el; }}
            id="schedule"
            className="bg-white rounded-2xl border border-periwinkle-100/40 section-shadow p-6 sm:p-8 animate-fade-in-up scroll-mt-20"
          >
            <SectionHeader index={3} />
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-3">
                  Shifts Open To
                </label>
                <MultiSelectGrid
                  options={SHIFT_OPTIONS}
                  selected={shiftPreferences}
                  onToggle={(v) => toggleMultiSelect(v, shiftPreferences, setShiftPreferences)}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-3">
                  Schedule Types
                </label>
                <MultiSelectGrid
                  options={SCHEDULE_TYPES}
                  selected={scheduleTypes}
                  onToggle={(v) => toggleMultiSelect(v, scheduleTypes, setScheduleTypes)}
                />
              </div>
            </div>
          </section>

          {/* Section 5: Care Settings */}
          <section
            ref={(el) => { sectionRefs.current[4] = el; }}
            id="care-settings"
            className="bg-white rounded-2xl border border-periwinkle-100/40 section-shadow p-6 sm:p-8 animate-fade-in-up scroll-mt-20"
          >
            <SectionHeader index={4} />
            <MultiSelectGrid
              options={CARE_SETTINGS}
              selected={careSettings}
              onToggle={(v) => toggleMultiSelect(v, careSettings, setCareSettings)}
              hasOther
              otherValue={careSettingOther}
              onOtherChange={setCareSettingOther}
            />
          </section>

          {/* Section 6: Patient Populations */}
          <section
            ref={(el) => { sectionRefs.current[5] = el; }}
            id="patient-populations"
            className="bg-white rounded-2xl border border-periwinkle-100/40 section-shadow p-6 sm:p-8 animate-fade-in-up scroll-mt-20"
          >
            <SectionHeader index={5} />
            <MultiSelectGrid
              options={PATIENT_POPULATIONS}
              selected={patientPopulations}
              onToggle={(v) => toggleMultiSelect(v, patientPopulations, setPatientPopulations)}
            />
          </section>

          {/* Section 7: Pay Preference */}
          <section
            ref={(el) => { sectionRefs.current[6] = el; }}
            id="pay"
            className="bg-white rounded-2xl border border-periwinkle-100/40 section-shadow p-6 sm:p-8 animate-fade-in-up scroll-mt-20"
          >
            <SectionHeader index={6} />
            <div className="max-w-xs">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">
                Minimum Acceptable Hourly Rate
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-semibold text-sm">$</span>
                <input
                  type="number"
                  min={0}
                  value={desiredPayMin}
                  onChange={(e) => setDesiredPayMin(e.target.value ? Number(e.target.value) : "")}
                  className="w-full border border-periwinkle-100/60 rounded-xl pl-8 pr-4 py-3 text-sm min-h-[44px] hover:border-periwinkle/40 focus:outline-none focus:ring-2 focus:ring-periwinkle/30 transition-all"
                  placeholder="e.g. 35"
                />
              </div>
              <div className="flex items-center gap-2 mt-3">
                <LockIcon className="w-4 h-4 text-text-muted" />
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Private</span>
              </div>
            </div>
          </section>

          {/* Section 8: Location & Commute */}
          <section
            ref={(el) => { sectionRefs.current[7] = el; }}
            id="location"
            className="bg-white rounded-2xl border border-periwinkle-100/40 section-shadow p-6 sm:p-8 animate-fade-in-up scroll-mt-20"
          >
            <SectionHeader index={7} />
            <div className="space-y-6">
              <div className="max-w-xs">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">
                  Zip Code
                  <PrefilledCheck field="zipCode" />
                </label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 5);
                    setZipCode(val);
                  }}
                  className={`w-full border border-periwinkle-100/60 rounded-xl px-4 py-3 text-sm min-h-[44px] hover:border-periwinkle/40 focus:outline-none focus:ring-2 focus:ring-periwinkle/30 transition-all ${prefilledBg("zipCode")}`}
                  placeholder="e.g. 02903"
                  maxLength={5}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-3">
                  Max Commute Distance
                </label>
                <div className="inline-flex rounded-xl border border-periwinkle-100/60 overflow-hidden">
                  {COMMUTE_OPTIONS.map((miles) => (
                    <button
                      key={miles}
                      type="button"
                      onClick={() => setMaxCommuteMiles(miles)}
                      className={`px-4 sm:px-5 py-2.5 text-sm font-semibold transition-all duration-200 border-r border-periwinkle-100/40 last:border-r-0 ${
                        maxCommuteMiles === miles
                          ? "bg-periwinkle text-white"
                          : "bg-white text-text-light hover:bg-periwinkle-50/50"
                      }`}
                    >
                      {miles} mi
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section 9: EHR Systems */}
          <section
            ref={(el) => { sectionRefs.current[8] = el; }}
            id="ehr"
            className="bg-white rounded-2xl border border-periwinkle-100/40 section-shadow p-6 sm:p-8 animate-fade-in-up scroll-mt-20"
          >
            <SectionHeader index={8} />
            <MultiSelectGrid
              options={EHR_SYSTEMS}
              selected={ehrExperience}
              onToggle={(v) => toggleMultiSelect(v, ehrExperience, setEhrExperience)}
              field="ehrExperience"
              hasOther
              otherValue={ehrOther}
              onOtherChange={setEhrOther}
            />
            <p className="text-xs text-text-muted mt-4 ml-1">
              Flor never disqualifies you based on charting systems
            </p>
          </section>

          {/* Section 10: License Verification */}
          <section
            ref={(el) => { sectionRefs.current[9] = el; }}
            id="license"
            className="bg-white rounded-2xl border border-periwinkle-100/40 section-shadow p-6 sm:p-8 animate-fade-in-up scroll-mt-20"
          >
            <SectionHeader index={9} />
            <div className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">
                    State of License
                    <PrefilledCheck field="license" />
                  </label>
                  <select
                    value={licenseState}
                    onChange={(e) => setLicenseState(e.target.value)}
                    className={`w-full border border-periwinkle-100/60 rounded-xl px-4 py-3 text-sm min-h-[44px] hover:border-periwinkle/40 focus:outline-none focus:ring-2 focus:ring-periwinkle/30 transition-all bg-white ${prefilledBg("license")}`}
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
                    <PrefilledCheck field="license" />
                  </label>
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className={`w-full border border-periwinkle-100/60 rounded-xl px-4 py-3 text-sm min-h-[44px] hover:border-periwinkle/40 focus:outline-none focus:ring-2 focus:ring-periwinkle/30 transition-all ${prefilledBg("license")}`}
                    placeholder="e.g. RN-2018-RI-44821"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleVerify}
                disabled={verifying || !licenseState || !licenseNumber}
                className="inline-flex items-center gap-2 bg-periwinkle hover:bg-periwinkle-dark text-white rounded-full px-8 py-3 font-bold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-periwinkle/20 hover:shadow-lg"
              >
                {verifying ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Verifying...
                  </>
                ) : (
                  <>
                    <ShieldCheckIcon className="w-4 h-4" />
                    Verify
                  </>
                )}
              </button>

              {/* Verification result */}
              {verificationResult && (
                <div className="mt-4">
                  {verificationResult.status === "active" && !isExpiringSoon(verificationResult.expirationDate) && (
                    <div className="inline-flex items-center gap-2 bg-success-light text-success px-4 py-2.5 rounded-full text-sm font-bold">
                      <CheckIcon className="w-4 h-4" />
                      Verified — Active
                    </div>
                  )}
                  {verificationResult.status === "active" && isExpiringSoon(verificationResult.expirationDate) && (
                    <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2.5 rounded-full text-sm font-bold border border-amber-200">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                      </svg>
                      Expiring soon — renew before {verificationResult.expirationDate}
                    </div>
                  )}
                  {(verificationResult.status === "not_found" ||
                    verificationResult.status === "expired" ||
                    verificationResult.status === "inactive" ||
                    verificationResult.status === "encumbered") && (
                    <div className="inline-flex items-center gap-2 bg-danger-light text-danger px-4 py-2.5 rounded-full text-sm font-bold border border-danger/20">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                      Could not verify — double check your info
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* ── Complete Profile Button ──────────────────────────────── */}
          <div className="pt-6 pb-12 text-center">
            <button
              type="button"
              onClick={handleComplete}
              className="inline-flex items-center gap-2 bg-periwinkle hover:bg-periwinkle-dark text-white rounded-full px-10 py-4 font-bold text-lg transition-all duration-200 shadow-lg shadow-periwinkle/20 hover:shadow-xl hover:shadow-periwinkle/30 hover:-translate-y-0.5"
            >
              Complete Your Profile
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
