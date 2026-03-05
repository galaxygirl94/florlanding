"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const SPECIALTIES = [
  "Medical-Surgical", "ICU/Critical Care", "Emergency", "OR/Perioperative",
  "Labor & Delivery", "Pediatrics", "Behavioral Health", "Home Health",
  "Long-Term Care", "Oncology", "Rehabilitation", "CNA",
];

const CERTIFICATIONS = [
  "BLS/CPR", "ACLS", "PALS", "TNCC", "CCRN", "CEN", "CNOR",
  "CPR Certification", "Driver's License",
];

const EHR_SYSTEMS = ["Epic", "Cerner", "Meditech", "LifeChart", "Allscripts", "PointClickCare", "Other"];
const SCHEDULE_PREFS = ["Days", "Evenings", "Nights", "Rotating", "Flexible"];
const COMMUTE_OPTIONS = ["10", "20", "30", "45", "60"];
const CULTURE_PREFS = [
  "Team-oriented",
  "Work-life balance",
  "Professional development",
  "Collaborative",
  "Supportive management",
  "Flexible scheduling",
  "Low staff turnover",
  "Mission-driven",
];
const LICENSE_TYPES = ["RN", "LPN", "CNA", "APRN", "NP"];
const STATES = ["RI", "MA", "CT", "NY", "CA", "FL", "TX", "PA", "OH", "IL"];

/* ── Florence Nightingale Demo Profile ─────────────────────────────── */
function NightingaleProfile() {
  return (
    <div className="bg-white rounded-2xl border border-periwinkle-100/40 overflow-hidden section-shadow animate-fade-in-up">
      {/* Accent bar */}
      <div className="h-1.5 bg-gradient-to-r from-periwinkle via-periwinkle-light to-periwinkle-200" />

      <div className="p-6 sm:p-8 lg:p-10">
        {/* Profile header */}
        <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-6 mb-8">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-periwinkle-50 to-periwinkle-100 overflow-hidden relative">
              <Image
                src="/florence-pfp.jpg"
                alt="Florence Nightingale"
                fill
                className="object-cover"
              />
            </div>
            {/* Verified badge */}
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-success flex items-center justify-center border-2 border-white">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <h3 className="text-xl sm:text-2xl font-extrabold text-text">Florence Nightingale</h3>
              <span className="bg-periwinkle/10 text-periwinkle-dark px-2.5 py-0.5 rounded-full text-xs font-bold">RN</span>
            </div>
            <p className="text-sm text-text-muted mb-3">London, UK · Open to relocation</p>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-success bg-success-light px-3 py-1.5 rounded-full">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                License verified via Nursys
              </span>
              <span className="text-xs text-text-muted font-medium">165+ years experience</span>
            </div>
          </div>

          {/* Fit Score */}
          <div className="flex-shrink-0 self-start">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="#E4E5F4" strokeWidth="5" />
                <circle cx="40" cy="40" r="34" fill="none" stroke="#8B8FD4" strokeWidth="5" strokeDasharray="201 13" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl sm:text-3xl font-extrabold text-periwinkle leading-none">94</span>
                <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider mt-0.5">Flor Fit</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="bg-periwinkle-50/50 rounded-xl p-5 mb-6">
          <p className="text-sm text-text leading-relaxed italic">
            &ldquo;Pioneer in evidence-based care. Passionate about sanitation, data, and making sure every nurse has a seat at the table. Invented the polar area chart before it was cool. Still believe that fresh air and clean hands save lives.&rdquo;
          </p>
        </div>

        {/* Skills & details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Specialty</h4>
            <div className="flex flex-wrap gap-1.5">
              <span className="bg-periwinkle text-white px-3 py-1.5 rounded-full text-xs font-semibold">Medical-Surgical</span>
              <span className="bg-periwinkle text-white px-3 py-1.5 rounded-full text-xs font-semibold">Public Health</span>
              <span className="bg-periwinkle text-white px-3 py-1.5 rounded-full text-xs font-semibold">Hospital Administration</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Certifications</h4>
            <div className="flex flex-wrap gap-1.5">
              <span className="bg-white text-text-light px-3 py-1.5 rounded-full text-xs font-medium border border-periwinkle-100/60">BLS/CPR</span>
              <span className="bg-white text-text-light px-3 py-1.5 rounded-full text-xs font-medium border border-periwinkle-100/60">Lamp Carrying</span>
              <span className="bg-white text-text-light px-3 py-1.5 rounded-full text-xs font-medium border border-periwinkle-100/60">Statistical Analysis</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Schedule</h4>
            <div className="flex flex-wrap gap-1.5">
              <span className="bg-white text-text-light px-3 py-1.5 rounded-full text-xs font-medium border border-periwinkle-100/60">Nights (obviously)</span>
              <span className="bg-white text-text-light px-3 py-1.5 rounded-full text-xs font-medium border border-periwinkle-100/60">Flexible</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">EHR Systems</h4>
            <div className="flex flex-wrap gap-1.5">
              <span className="bg-white text-text-light px-3 py-1.5 rounded-full text-xs font-medium border border-periwinkle-100/60">Pen & Ink</span>
              <span className="bg-white text-text-light px-3 py-1.5 rounded-full text-xs font-medium border border-periwinkle-100/60">Statistical Diagrams</span>
            </div>
          </div>
        </div>

        {/* Match strengths */}
        <div className="mt-6 pt-6 border-t border-periwinkle-100/30">
          <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Match Strengths</h4>
          <div className="space-y-2.5">
            {[
              { label: "Specialty", score: 98 },
              { label: "Schedule", score: 95 },
              { label: "Culture Fit", score: 97 },
              { label: "Pay Alignment", score: 88 },
              { label: "Commute", score: 82 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-muted font-medium">{item.label}</span>
                  <span className="font-bold text-text">{item.score}%</span>
                </div>
                <div className="h-2 bg-periwinkle-50 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.score >= 90 ? "bg-success" : item.score >= 80 ? "bg-periwinkle" : "bg-amber"}`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ──────────────────────────────────────────────────────── */
export default function NurseProfilePage() {
  const { isLoggedIn, signup } = useAuth();
  const [saved, setSaved] = useState(false);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedCerts, setSelectedCerts] = useState<string[]>([]);
  const [selectedEhr, setSelectedEhr] = useState<string[]>([]);
  const [resumeFile, setResumeFile] = useState<string>("");
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [photoFileName, setPhotoFileName] = useState<string>("");
  const photoInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  // Account creation fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signupError, setSignupError] = useState("");

  // Fit Score fields
  const [desiredPayMin, setDesiredPayMin] = useState("");
  const [desiredPayMax, setDesiredPayMax] = useState("");
  const [maxCommute, setMaxCommute] = useState("");
  const [selectedCulture, setSelectedCulture] = useState<string[]>([]);

  const toggleItem = (
    item: string,
    list: string[],
    setList: (v: string[]) => void
  ) => {
    setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) return; // 5MB limit
    setPhotoFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return; // 5MB limit
    setResumeFile(file.name);
  };

  const handleSave = () => {
    setSignupError("");
    // If not logged in, require account credentials
    if (!isLoggedIn) {
      if (!email || !password) {
        setSignupError("Please enter an email and password to create your account.");
        return;
      }
      if (password.length < 6) {
        setSignupError("Password must be at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setSignupError("Passwords do not match.");
        return;
      }
      if (!firstName || !lastName) {
        setSignupError("Please enter your first and last name.");
        return;
      }
      const success = signup(email, password, firstName, lastName);
      if (!success) {
        setSignupError("An account with this email already exists. Please log in instead.");
        return;
      }
    }
    setSaved(true);
  };

  const handleUpdate = () => {
    setSaved(true);
    // Briefly show the saved message
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      {/* Header with photo banner */}
      <div className="relative overflow-hidden h-[180px] sm:h-[260px]">
        <Image
          src="/nurse-commute.jpg"
          alt="Nurse on subway holding coffee in teal scrubs"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E1E2E]/85 via-[#1E1E2E]/55 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 w-full">
            <div className="animate-fade-in-up">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">Your Profile</h1>
              <p className="text-white/70 mt-3 text-base sm:text-lg max-w-lg leading-relaxed">
                Your skills speak for themselves. No keyword games, no resume parsing tricks.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-10 sm:py-16">

        {/* ── Florence Nightingale Demo Profile Section ── */}
        <div className="mb-16 sm:mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-start">
            {/* Demo profile card — takes 7 columns */}
            <div className="lg:col-span-7">
              <NightingaleProfile />
            </div>

            {/* CTA side — takes 5 columns */}
            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <div className="animate-fade-in-up-delay-1">
                <span className="inline-flex items-center gap-2 text-periwinkle text-sm font-bold uppercase tracking-wider mb-5">
                  <span className="w-8 h-px bg-periwinkle" />
                  Sample profile
                </span>

                <h2 className="text-2xl sm:text-3xl xl:text-4xl font-extrabold text-text leading-[1.12] mb-4">
                  This is what your profile could look&nbsp;like.
                </h2>

                <p className="text-base xl:text-lg text-text-light leading-relaxed mb-6">
                  Florence set the standard 165 years ago. We named our platform after her because she believed every nurse deserves better. Your turn.
                </p>

                <div className="space-y-3 mb-8">
                  {[
                    "Verified credentials displayed front and center",
                    "Your Flor Fit Score matches you to the right jobs",
                    "Skills and specialties in your own words",
                    "Facilities apply to you — not the other way around",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-periwinkle flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm text-text-light font-medium">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-periwinkle-50/60 rounded-xl p-5 border border-periwinkle-100/30">
                  <p className="text-sm text-text leading-relaxed">
                    <span className="font-bold text-periwinkle-dark">Fun fact:</span> Florence Nightingale was also a pioneering statistician — she invented the coxcomb chart to visualize mortality data and convince the British government to improve hospital sanitation. Data-driven care since&nbsp;1858.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="flex items-center gap-4 mb-12 sm:mb-16">
          <div className="flex-1 h-px bg-periwinkle-100/40" />
          <span className="text-sm font-bold text-text-muted uppercase tracking-wider">Create your profile</span>
          <div className="flex-1 h-px bg-periwinkle-100/40" />
        </div>

        {/* ── Step indicator ── */}
        <div className="hidden sm:flex items-center justify-center gap-3 mb-12">
          {[
            { num: "1", label: "Account" },
            { num: "2", label: "Personal Info" },
            { num: "3", label: "License" },
            { num: "4", label: "Experience" },
            { num: "5", label: "Fit Preferences" },
          ].map((step, i) => (
            <div key={step.num} className="flex items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-periwinkle flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{step.num}</span>
                </div>
                <span className="text-sm font-semibold text-text">{step.label}</span>
              </div>
              {i < 4 && <div className="w-12 lg:w-20 h-px bg-periwinkle-100 mx-4" />}
            </div>
          ))}
        </div>

        {saved && (
          <div className="bg-success-light border border-success/20 rounded-xl p-4 mb-8 flex items-center gap-3 animate-fade-in-up max-w-4xl mx-auto">
            <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-success">
              Profile saved! View your job matches on the{" "}
              <Link href="/jobs" className="underline hover:no-underline">listings page</Link>.
            </p>
          </div>
        )}

        {signupError && (
          <div className="bg-danger-light border border-danger/20 rounded-xl p-4 mb-8 flex items-center gap-3 animate-fade-in-up max-w-4xl mx-auto">
            <div className="w-8 h-8 rounded-full bg-danger flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-danger">{signupError}</p>
          </div>
        )}

        {/* ── Form sections — centered, clean ── */}
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Account Credentials — only show if not logged in */}
          {!isLoggedIn && (
            <section className="bg-white rounded-2xl border border-periwinkle-100/40 p-6 sm:p-8 lg:p-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-periwinkle-50 flex items-center justify-center text-periwinkle flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-text">Create Your Account</h2>
                  <p className="text-xs text-text-muted">Set up your login credentials to save and access your profile.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-periwinkle-100/60 rounded-xl px-4 py-3 text-sm min-h-[44px] hover:border-periwinkle/40 transition-colors"
                    placeholder="you@email.com"
                  />
                </div>
                <div />
                <div>
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-periwinkle-100/60 rounded-xl px-4 py-3 text-sm min-h-[44px] hover:border-periwinkle/40 transition-colors"
                    placeholder="At least 6 characters"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border border-periwinkle-100/60 rounded-xl px-4 py-3 text-sm min-h-[44px] hover:border-periwinkle/40 transition-colors"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>
              <div className="mt-5 flex items-center gap-2.5 bg-periwinkle-50/60 rounded-xl p-4">
                <svg className="w-4 h-4 text-periwinkle flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <span className="text-xs text-periwinkle-dark font-semibold">
                  Already have an account?{" "}
                  <Link href="/login" className="underline hover:no-underline">Log in here</Link>
                </span>
              </div>
            </section>
          )}

          {/* Personal Info */}
          <section className="bg-white rounded-2xl border border-periwinkle-100/40 p-6 sm:p-8 lg:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-periwinkle-50 flex items-center justify-center text-periwinkle flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-text">Personal Information</h2>
                <p className="text-xs text-text-muted">The basics — we keep this private.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full border border-periwinkle-100/60 rounded-xl px-4 py-3 text-sm min-h-[44px] hover:border-periwinkle/40 transition-colors"
                  placeholder="First name"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full border border-periwinkle-100/60 rounded-xl px-4 py-3 text-sm min-h-[44px] hover:border-periwinkle/40 transition-colors"
                  placeholder="Last name"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-periwinkle-100/60 rounded-xl px-4 py-3 text-sm min-h-[44px] hover:border-periwinkle/40 transition-colors"
                  placeholder="you@email.com"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-periwinkle-100/60 rounded-xl px-4 py-3 text-sm min-h-[44px] hover:border-periwinkle/40 transition-colors"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <div className="mt-7 pt-6 border-t border-periwinkle-100/30">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-3">Profile Photo (Optional)</label>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-periwinkle-50 flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                  {photoPreview ? (
                    <Image src={photoPreview} alt="Profile preview" fill className="object-cover" />
                  ) : (
                    <svg className="w-7 h-7 text-periwinkle-light" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  )}
                </div>
                <div>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => photoInputRef.current?.click()}
                    className="text-sm font-bold text-periwinkle hover:text-periwinkle-dark transition-colors"
                  >
                    {photoPreview ? "Change Photo" : "Upload Photo"}
                  </button>
                  {photoFileName ? (
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-text-muted">{photoFileName}</p>
                      <button
                        onClick={() => { setPhotoPreview(""); setPhotoFileName(""); }}
                        className="text-xs text-danger hover:text-danger font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-text-muted mt-0.5">JPG, PNG, up to 5MB. We show your skills first, not your photo.</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* License */}
          <section className="bg-white rounded-2xl border border-periwinkle-100/40 p-6 sm:p-8 lg:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-periwinkle-50 flex items-center justify-center text-periwinkle flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-text">License Information</h2>
                <p className="text-xs text-text-muted">We verify through Nursys — no manual uploads needed.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">License Type</label>
                <select className="w-full border border-periwinkle-100/60 rounded-xl px-4 py-3 text-sm bg-white min-h-[44px] hover:border-periwinkle/40 transition-colors">
                  <option value="">Select license type</option>
                  {LICENSE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">License State</label>
                <select className="w-full border border-periwinkle-100/60 rounded-xl px-4 py-3 text-sm bg-white min-h-[44px] hover:border-periwinkle/40 transition-colors">
                  <option value="">Select state</option>
                  {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">License Number</label>
                <input type="text" className="w-full border border-periwinkle-100/60 rounded-xl px-4 py-3 text-sm min-h-[44px] hover:border-periwinkle/40 transition-colors" placeholder="License number" />
              </div>
            </div>
            <div className="mt-5 flex items-center gap-2.5 bg-periwinkle-50/60 rounded-xl p-4">
              <div className="w-5 h-5 rounded-full bg-periwinkle flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-xs text-periwinkle-dark font-semibold">
                Verification badge appears after we confirm your credentials
              </span>
            </div>
          </section>

          {/* Experience */}
          <section className="bg-white rounded-2xl border border-periwinkle-100/40 p-6 sm:p-8 lg:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-periwinkle-50 flex items-center justify-center text-periwinkle flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-text">Experience</h2>
                <p className="text-xs text-text-muted">Structured inputs — your skills speak for themselves.</p>
              </div>
            </div>

            <div className="mb-7">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Years of Experience</label>
              <select className="w-full sm:w-72 border border-periwinkle-100/60 rounded-xl px-4 py-3 text-sm bg-white min-h-[44px] hover:border-periwinkle/40 transition-colors">
                <option value="">Select</option>
                <option value="0">New Graduate / Less than 1 year</option>
                <option value="1">1-2 years</option>
                <option value="3">3-5 years</option>
                <option value="6">6-10 years</option>
                <option value="11">11-15 years</option>
                <option value="16">16-20 years</option>
                <option value="21">20+ years</option>
              </select>
            </div>

            <div className="mb-7">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-3">Specialties</label>
              <div className="flex flex-wrap gap-2">
                {SPECIALTIES.map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleItem(s, selectedSpecialties, setSelectedSpecialties)}
                    className={`px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 min-h-[40px] ${
                      selectedSpecialties.includes(s)
                        ? "bg-periwinkle text-white shadow-sm"
                        : "bg-periwinkle-50/40 text-text-light border border-periwinkle-100/60 hover:border-periwinkle/40"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-7">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-3">Certifications</label>
              <div className="flex flex-wrap gap-2">
                {CERTIFICATIONS.map((c) => (
                  <button
                    key={c}
                    onClick={() => toggleItem(c, selectedCerts, setSelectedCerts)}
                    className={`px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 min-h-[40px] ${
                      selectedCerts.includes(c)
                        ? "bg-periwinkle text-white shadow-sm"
                        : "bg-periwinkle-50/40 text-text-light border border-periwinkle-100/60 hover:border-periwinkle/40"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-3">EHR Systems Experience</label>
              <div className="flex flex-wrap gap-2">
                {EHR_SYSTEMS.map((e) => (
                  <button
                    key={e}
                    onClick={() => toggleItem(e, selectedEhr, setSelectedEhr)}
                    className={`px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 min-h-[40px] ${
                      selectedEhr.includes(e)
                        ? "bg-periwinkle text-white shadow-sm"
                        : "bg-periwinkle-50/40 text-text-light border border-periwinkle-100/60 hover:border-periwinkle/40"
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
              <p className="text-xs text-text-muted mt-3 bg-periwinkle-50/30 rounded-xl p-3">
                EHR experience is noted but won&apos;t affect your Flor Fit Score — great nurses adapt quickly.
              </p>
            </div>
          </section>

          {/* Preferences — powers your Flor Fit Score */}
          <section className="bg-white rounded-2xl border border-periwinkle-100/40 p-6 sm:p-8 lg:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-periwinkle-50 flex items-center justify-center text-periwinkle flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-text">Preferences</h2>
                <p className="text-xs text-text-muted">These five preferences power your Flor Fit Score.</p>
              </div>
            </div>

            {/* Schedule */}
            <div className="mb-7">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Schedule Preference</label>
              <select className="w-full sm:w-72 border border-periwinkle-100/60 rounded-xl px-4 py-3 text-sm bg-white min-h-[44px] hover:border-periwinkle/40 transition-colors">
                <option value="">Select</option>
                {SCHEDULE_PREFS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Location & Commute */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-7">
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Location (State)</label>
                <select className="w-full border border-periwinkle-100/60 rounded-xl px-4 py-3 text-sm bg-white min-h-[44px] hover:border-periwinkle/40 transition-colors">
                  <option value="">Select</option>
                  {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Max Commute (miles)</label>
                <select
                  className="w-full border border-periwinkle-100/60 rounded-xl px-4 py-3 text-sm bg-white min-h-[44px] hover:border-periwinkle/40 transition-colors"
                  value={maxCommute}
                  onChange={(e) => setMaxCommute(e.target.value)}
                >
                  <option value="">No preference</option>
                  {COMMUTE_OPTIONS.map((m) => <option key={m} value={m}>{m} miles</option>)}
                </select>
              </div>
            </div>

            {/* Pay Expectations */}
            <div className="mb-7">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Pay Expectations ($/hr)</label>
              <div className="grid grid-cols-2 gap-4 max-w-sm">
                <div>
                  <input
                    type="number"
                    value={desiredPayMin}
                    onChange={(e) => setDesiredPayMin(e.target.value)}
                    className="w-full border border-periwinkle-100/60 rounded-xl px-4 py-3 text-sm min-h-[44px] hover:border-periwinkle/40 transition-colors"
                    placeholder="Min"
                    min="0"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    value={desiredPayMax}
                    onChange={(e) => setDesiredPayMax(e.target.value)}
                    className="w-full border border-periwinkle-100/60 rounded-xl px-4 py-3 text-sm min-h-[44px] hover:border-periwinkle/40 transition-colors"
                    placeholder="Max"
                    min="0"
                  />
                </div>
              </div>
              <p className="text-xs text-text-muted mt-2">We&apos;ll match you to jobs that meet your pay expectations — no bait-and-switch.</p>
            </div>

            {/* Culture Preferences */}
            <div className="mb-7">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-3">Workplace Culture (select all that matter)</label>
              <div className="flex flex-wrap gap-2">
                {CULTURE_PREFS.map((c) => (
                  <button
                    key={c}
                    onClick={() => toggleItem(c, selectedCulture, setSelectedCulture)}
                    className={`px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 min-h-[40px] ${
                      selectedCulture.includes(c)
                        ? "bg-periwinkle text-white shadow-sm"
                        : "bg-periwinkle-50/40 text-text-light border border-periwinkle-100/60 hover:border-periwinkle/40"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <p className="text-xs text-text-muted mt-2">We&apos;ll match your preferences against facility reviews and culture descriptions.</p>
            </div>

            {/* Union */}
            <div>
              <label className="flex items-center gap-2.5 cursor-pointer min-h-[44px]">
                <input type="checkbox" className="w-5 h-5 rounded border-periwinkle-100 text-periwinkle accent-periwinkle" />
                <span className="text-sm font-semibold text-text">I prefer union positions</span>
              </label>
            </div>
          </section>

          {/* Resume */}
          <section className="bg-white rounded-2xl border border-periwinkle-100/40 p-6 sm:p-8 lg:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-periwinkle-50 flex items-center justify-center text-periwinkle flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-text">Resume</h2>
                <p className="text-xs text-text-muted">Optional — your structured profile does the heavy lifting.</p>
              </div>
            </div>
            <input
              ref={resumeInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeUpload}
              className="hidden"
            />
            <div
              className="border-2 border-dashed border-periwinkle-100 rounded-xl p-8 text-center hover:border-periwinkle/30 transition-colors cursor-pointer"
              onClick={() => !resumeFile && resumeInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const file = e.dataTransfer.files?.[0];
                if (file && file.size <= 5 * 1024 * 1024) {
                  setResumeFile(file.name);
                }
              }}
            >
              {resumeFile ? (
                <div>
                  <div className="w-12 h-12 rounded-xl bg-periwinkle-50 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-periwinkle" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-text">{resumeFile}</p>
                  <button onClick={(e) => { e.stopPropagation(); setResumeFile(""); }} className="text-xs text-periwinkle hover:text-periwinkle-dark font-bold mt-2 transition-colors">
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <div className="w-12 h-12 rounded-xl bg-periwinkle-50 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-periwinkle" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-text mb-1">
                    Drop your resume here or{" "}
                    <span className="text-periwinkle">browse</span>
                  </p>
                  <p className="text-xs text-text-muted">PDF or DOC, up to 5MB</p>
                </div>
              )}
            </div>
          </section>

          {/* Bio */}
          <section className="bg-white rounded-2xl border border-periwinkle-100/40 p-6 sm:p-8 lg:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-periwinkle-50 flex items-center justify-center text-periwinkle flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-text">About You</h2>
                <p className="text-xs text-text-muted">A few sentences about what makes you, you.</p>
              </div>
            </div>
            <textarea
              className="w-full border border-periwinkle-100/60 rounded-xl p-4 text-sm resize-none min-h-[120px] hover:border-periwinkle/40 transition-colors"
              rows={4}
              placeholder="What do you love most about nursing? What kind of workplace are you looking for?"
            />
          </section>

          {/* Save / Update buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {!saved ? (
              <button
                onClick={handleSave}
                className="flex-1 bg-periwinkle hover:bg-periwinkle-dark text-white font-bold py-4 rounded-full text-lg transition-all duration-200 shadow-lg shadow-periwinkle/20 hover:shadow-xl hover:shadow-periwinkle/30 hover:-translate-y-0.5 min-h-[56px]"
              >
                {isLoggedIn ? "Save Profile" : "Create Account & Save Profile"}
              </button>
            ) : (
              <>
                <button
                  onClick={handleUpdate}
                  className="flex-1 bg-periwinkle hover:bg-periwinkle-dark text-white font-bold py-4 rounded-full text-lg transition-all duration-200 shadow-lg shadow-periwinkle/20 hover:shadow-xl hover:shadow-periwinkle/30 hover:-translate-y-0.5 min-h-[56px]"
                >
                  Update Profile
                </button>
                <Link
                  href="/jobs"
                  className="flex-1 bg-white border-2 border-periwinkle text-periwinkle hover:bg-periwinkle-50 font-bold py-4 rounded-full text-lg transition-all duration-200 min-h-[56px] text-center"
                >
                  Browse Jobs
                </Link>
              </>
            )}
          </div>

          <p className="text-center text-xs text-text-muted mt-2">
            Free forever. We&apos;ll never charge nurses. That&apos;s a promise.
          </p>
        </div>
      </div>
    </div>
  );
}
