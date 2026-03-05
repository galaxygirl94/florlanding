"use client";

import { useState } from "react";
import Image from "next/image";

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
const LICENSE_TYPES = ["RN", "LPN", "CNA", "APRN", "NP"];
const STATES = ["RI", "MA", "CT", "NY", "CA", "FL", "TX", "PA", "OH", "IL"];

export default function NurseProfilePage() {
  const [saved, setSaved] = useState(false);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedCerts, setSelectedCerts] = useState<string[]>([]);
  const [selectedEhr, setSelectedEhr] = useState<string[]>([]);
  const [resumeFile, setResumeFile] = useState<string>("");

  const toggleItem = (
    item: string,
    list: string[],
    setList: (v: string[]) => void
  ) => {
    setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  };

  return (
    <div>
      {/* Header with commute photo */}
      <div className="relative overflow-hidden h-[160px] sm:h-[220px]">
        <Image
          src="/nurse-commute.png"
          alt="Nurse arriving at work"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E1E2E]/80 via-[#1E1E2E]/50 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Your Profile</h1>
            <p className="text-white/70 mt-2 text-sm sm:text-base">Create your profile to get matched with the right jobs.</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <p className="text-text-light mb-8 text-sm leading-relaxed max-w-xl">
          All fields use structured inputs — no keyword games, no resume parsing tricks. Your skills speak for themselves.
        </p>

        {saved && (
          <div className="bg-success-light border border-success/20 rounded-xl p-4 mb-6 flex items-center gap-3 animate-fade-in-up">
            <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-success">
              Profile saved! View your job matches on the listings page.
            </p>
          </div>
        )}

        <div className="space-y-6 sm:space-y-8">
          {/* Personal Info */}
          <section className="bg-white rounded-2xl border border-periwinkle-100/40 p-6 sm:p-8">
            <h2 className="text-lg font-extrabold mb-6">Personal Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">First Name</label>
                <input type="text" className="w-full border border-periwinkle-100/60 rounded-xl px-4 py-3 text-sm min-h-[44px]" placeholder="First name" />
              </div>
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Last Name</label>
                <input type="text" className="w-full border border-periwinkle-100/60 rounded-xl px-4 py-3 text-sm min-h-[44px]" placeholder="Last name" />
              </div>
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Email</label>
                <input type="email" className="w-full border border-periwinkle-100/60 rounded-xl px-4 py-3 text-sm min-h-[44px]" placeholder="you@email.com" />
              </div>
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Phone</label>
                <input type="tel" className="w-full border border-periwinkle-100/60 rounded-xl px-4 py-3 text-sm min-h-[44px]" placeholder="(555) 123-4567" />
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-periwinkle-100/30">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Profile Photo (Optional)</label>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-periwinkle-50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-periwinkle-light" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <div>
                  <button className="text-sm font-bold text-periwinkle hover:text-periwinkle-dark transition-colors">
                    Upload Photo
                  </button>
                  <p className="text-xs text-text-muted mt-0.5">We show your skills first, not your photo.</p>
                </div>
              </div>
            </div>
          </section>

          {/* License */}
          <section className="bg-white rounded-2xl border border-periwinkle-100/40 p-6 sm:p-8">
            <h2 className="text-lg font-extrabold mb-6">License Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">License Type</label>
                <select className="w-full border border-periwinkle-100/60 rounded-xl px-4 py-3 text-sm bg-white min-h-[44px]">
                  <option value="">Select license type</option>
                  {LICENSE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">License State</label>
                <select className="w-full border border-periwinkle-100/60 rounded-xl px-4 py-3 text-sm bg-white min-h-[44px]">
                  <option value="">Select state</option>
                  {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">License Number</label>
                <input type="text" className="w-full border border-periwinkle-100/60 rounded-xl px-4 py-3 text-sm min-h-[44px]" placeholder="License number" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2.5 bg-periwinkle-50/60 rounded-xl p-3.5">
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
          <section className="bg-white rounded-2xl border border-periwinkle-100/40 p-6 sm:p-8">
            <h2 className="text-lg font-extrabold mb-6">Experience</h2>
            <div className="mb-6">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Years of Experience</label>
              <select className="w-full border border-periwinkle-100/60 rounded-xl px-4 py-3 text-sm bg-white min-h-[44px]">
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

            <div className="mb-6">
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

            <div className="mb-6">
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

          {/* Preferences */}
          <section className="bg-white rounded-2xl border border-periwinkle-100/40 p-6 sm:p-8">
            <h2 className="text-lg font-extrabold mb-6">Preferences</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Schedule Preference</label>
                <select className="w-full border border-periwinkle-100/60 rounded-xl px-4 py-3 text-sm bg-white min-h-[44px]">
                  <option value="">Select</option>
                  {SCHEDULE_PREFS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Location (State)</label>
                <select className="w-full border border-periwinkle-100/60 rounded-xl px-4 py-3 text-sm bg-white min-h-[44px]">
                  <option value="">Select</option>
                  {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="flex items-center gap-2.5 cursor-pointer min-h-[44px]">
                <input type="checkbox" className="w-5 h-5 rounded border-periwinkle-100 text-periwinkle accent-periwinkle" />
                <span className="text-sm font-semibold text-text">I prefer union positions</span>
              </label>
            </div>
          </section>

          {/* Resume */}
          <section className="bg-white rounded-2xl border border-periwinkle-100/40 p-6 sm:p-8">
            <h2 className="text-lg font-extrabold mb-6">Resume</h2>
            <div className="border-2 border-dashed border-periwinkle-100 rounded-xl p-8 text-center hover:border-periwinkle/30 transition-colors">
              {resumeFile ? (
                <div>
                  <div className="w-12 h-12 rounded-xl bg-periwinkle-50 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-periwinkle" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-text">{resumeFile}</p>
                  <button onClick={() => setResumeFile("")} className="text-xs text-periwinkle hover:text-periwinkle-dark font-bold mt-2 transition-colors">
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
                    <button onClick={() => setResumeFile("Resume_2026.pdf")} className="text-periwinkle hover:text-periwinkle-dark transition-colors">
                      browse
                    </button>
                  </p>
                  <p className="text-xs text-text-muted">PDF or DOC, up to 5MB</p>
                </div>
              )}
            </div>
          </section>

          {/* Bio */}
          <section className="bg-white rounded-2xl border border-periwinkle-100/40 p-6 sm:p-8">
            <h2 className="text-lg font-extrabold mb-6">About You</h2>
            <textarea
              className="w-full border border-periwinkle-100/60 rounded-xl p-4 text-sm resize-none min-h-[100px]"
              rows={4}
              placeholder="Tell facilities a bit about yourself and what you're looking for..."
            />
          </section>

          {/* Save */}
          <button
            onClick={() => setSaved(true)}
            className="w-full bg-periwinkle hover:bg-periwinkle-dark text-white font-bold py-4 rounded-full text-lg transition-all duration-200 shadow-lg shadow-periwinkle/20 hover:shadow-xl hover:shadow-periwinkle/30 hover:-translate-y-0.5 min-h-[56px]"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}
