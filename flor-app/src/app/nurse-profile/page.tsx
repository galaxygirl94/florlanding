"use client";

import { useState } from "react";

const SPECIALTIES = [
  "Medical-Surgical", "ICU/Critical Care", "Emergency", "OR/Perioperative",
  "Labor & Delivery", "Pediatrics", "Behavioral Health", "Home Health",
  "Long-Term Care", "Oncology", "Rehabilitation", "CNA",
];

const CERTIFICATIONS = [
  "RN License",
  "LPN License",
  "BLS (Basic Life Support)",
  "ACLS (Advanced Cardiac Life Support)",
  "PALS (Pediatric Advanced Life Support)",
  "TNCC (Trauma Nursing Core Course)",
  "CCRN (Critical Care RN)",
  "CEN (Certified Emergency Nurse)",
  "Other specialty certifications",
];

const SCHEDULE_PREFS = [
  "M-F, no on-call",
  "M-F, no weekends",
  "No weekend/holiday requirement",
  "Rotating weekends",
  "Night shift only",
  "3x12 (days)",
  "3x12 (nights)",
  "Per diem / as needed",
  "Flexible",
];

const LICENSE_TYPES = ["RN", "LPN", "CNA", "APRN", "NP"];
const STATES = ["RI", "MA", "CT", "NY", "CA", "FL", "TX", "PA", "OH", "IL"];

export default function NurseProfilePage() {
  const [saved, setSaved] = useState(false);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedCerts, setSelectedCerts] = useState<string[]>([]);
  const [resumeFile, setResumeFile] = useState<string>("");

  const toggleItem = (
    item: string,
    list: string[],
    setList: (v: string[]) => void
  ) => {
    setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="animate-fade-in-up">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Nurse Profile</h1>
        <p className="text-text-light mb-6 sm:mb-8 text-sm sm:text-base">
          Create your profile to get matched with the right jobs. All fields use
          structured inputs — no keyword games.
        </p>

        {saved && (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 mb-6 text-sm font-medium">
            Profile saved successfully! View your job matches on the listings page.
          </div>
        )}

        <div className="space-y-6 sm:space-y-8">
          {/* Personal Info */}
          <section className="bg-white rounded-2xl card-shadow p-5 sm:p-8">
            <h2 className="text-lg font-bold mb-4 sm:mb-6">Personal Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-text-light block mb-1.5">First Name</label>
                <input type="text" className="w-full border border-periwinkle-100 rounded-xl px-3 py-3 text-sm min-h-[44px]" placeholder="First name" />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-light block mb-1.5">Last Name</label>
                <input type="text" className="w-full border border-periwinkle-100 rounded-xl px-3 py-3 text-sm min-h-[44px]" placeholder="Last name" />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-light block mb-1.5">Email</label>
                <input type="email" className="w-full border border-periwinkle-100 rounded-xl px-3 py-3 text-sm min-h-[44px]" placeholder="you@email.com" />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-light block mb-1.5">Phone</label>
                <input type="tel" className="w-full border border-periwinkle-100 rounded-xl px-3 py-3 text-sm min-h-[44px]" placeholder="(555) 123-4567" />
              </div>
            </div>

            {/* Profile photo */}
            <div className="mt-6 pt-4 border-t border-periwinkle-100">
              <label className="text-xs font-semibold text-text-light block mb-1.5">Profile Photo (Optional)</label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-periwinkle-50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-periwinkle-light" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <div>
                  <button className="text-sm font-medium text-periwinkle hover:text-periwinkle-dark min-h-[44px]">
                    Upload Photo
                  </button>
                  <p className="text-xs text-text-light mt-1 italic">
                    We show your skills first, not your photo.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* License Info */}
          <section className="bg-white rounded-2xl card-shadow p-5 sm:p-8">
            <h2 className="text-lg font-bold mb-4 sm:mb-6">License Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-text-light block mb-1.5">License Type</label>
                <select className="w-full border border-periwinkle-100 rounded-xl px-3 py-3 text-sm bg-white min-h-[44px]">
                  <option value="">Select license type</option>
                  {LICENSE_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-text-light block mb-1.5">License State</label>
                <select className="w-full border border-periwinkle-100 rounded-xl px-3 py-3 text-sm bg-white min-h-[44px]">
                  <option value="">Select state</option>
                  {STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-text-light block mb-1.5">License Number</label>
                <input type="text" className="w-full border border-periwinkle-100 rounded-xl px-3 py-3 text-sm min-h-[44px]" placeholder="License number" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 bg-periwinkle-50 rounded-xl p-3">
              <div className="w-6 h-6 rounded-full bg-periwinkle flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-xs text-periwinkle-dark font-medium">
                License verification badge will appear after we confirm your credentials
              </span>
            </div>
          </section>

          {/* Experience */}
          <section className="bg-white rounded-2xl card-shadow p-5 sm:p-8">
            <h2 className="text-lg font-bold mb-4 sm:mb-6">Experience</h2>
            <div className="mb-4">
              <label className="text-xs font-semibold text-text-light block mb-1.5">Years of Experience</label>
              <select className="w-full border border-periwinkle-100 rounded-xl px-3 py-3 text-sm bg-white min-h-[44px]">
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

            {/* Specialties */}
            <div className="mb-6">
              <label className="text-xs font-semibold text-text-light block mb-2">Specialties</label>
              <div className="flex flex-wrap gap-2">
                {SPECIALTIES.map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleItem(s, selectedSpecialties, setSelectedSpecialties)}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-colors min-h-[44px] ${
                      selectedSpecialties.includes(s)
                        ? "bg-periwinkle text-white"
                        : "bg-periwinkle-50 text-text-light hover:bg-periwinkle-100"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <label className="text-xs font-semibold text-text-light block mb-2">Certifications</label>
              <div className="flex flex-wrap gap-2">
                {CERTIFICATIONS.map((c) => (
                  <button
                    key={c}
                    onClick={() => toggleItem(c, selectedCerts, setSelectedCerts)}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-colors min-h-[44px] ${
                      selectedCerts.includes(c)
                        ? "bg-periwinkle text-white"
                        : "bg-periwinkle-50 text-text-light hover:bg-periwinkle-100"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Preferences */}
          <section className="bg-white rounded-2xl card-shadow p-5 sm:p-8">
            <h2 className="text-lg font-bold mb-4 sm:mb-6">Preferences</h2>
            <div className="mb-4">
              <label className="text-xs font-semibold text-text-light block mb-2">Schedule Preference</label>
              <div className="flex flex-wrap gap-2">
                {SCHEDULE_PREFS.map((s) => (
                  <button
                    key={s}
                    className="px-3 py-2 rounded-full text-sm font-medium bg-periwinkle-50 text-text-light hover:bg-periwinkle-100 transition-colors min-h-[44px]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-text-light block mb-1.5">Location (State)</label>
                <select className="w-full border border-periwinkle-100 rounded-xl px-3 py-3 text-sm bg-white min-h-[44px]">
                  <option value="">Select</option>
                  {STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-text-light block mb-1.5">Availability</label>
                <select className="w-full border border-periwinkle-100 rounded-xl px-3 py-3 text-sm bg-white min-h-[44px]">
                  <option value="">Select</option>
                  <option>Immediately</option>
                  <option>Within 2 weeks</option>
                  <option>Within 1 month</option>
                  <option>Within 2 months</option>
                  <option>Just exploring</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
                <input type="checkbox" className="w-5 h-5 rounded border-periwinkle-100 text-periwinkle" />
                <span className="text-sm font-medium">I prefer union positions</span>
              </label>
            </div>
          </section>

          {/* Resume */}
          <section className="bg-white rounded-2xl card-shadow p-5 sm:p-8">
            <h2 className="text-lg font-bold mb-4 sm:mb-6">Resume</h2>
            <div className="border-2 border-dashed border-periwinkle-100 rounded-xl p-6 sm:p-8 text-center">
              {resumeFile ? (
                <div>
                  <div className="text-2xl mb-2">📄</div>
                  <p className="text-sm font-medium">{resumeFile}</p>
                  <button
                    onClick={() => setResumeFile("")}
                    className="text-xs text-periwinkle hover:underline mt-2 min-h-[44px]"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <div className="text-3xl mb-3">📎</div>
                  <p className="text-sm font-medium mb-1">
                    Drop your resume here or{" "}
                    <button
                      onClick={() => setResumeFile("Resume_2026.pdf")}
                      className="text-periwinkle hover:underline"
                    >
                      browse
                    </button>
                  </p>
                  <p className="text-xs text-text-light">PDF or DOC, up to 5MB. We&apos;ll parse it into your profile fields.</p>
                </div>
              )}
            </div>
          </section>

          {/* Bio */}
          <section className="bg-white rounded-2xl card-shadow p-5 sm:p-8">
            <h2 className="text-lg font-bold mb-4 sm:mb-6">About You</h2>
            <textarea
              className="w-full border border-periwinkle-100 rounded-xl p-3 sm:p-4 text-sm resize-none min-h-[100px]"
              rows={4}
              placeholder="Tell facilities a bit about yourself and what you're looking for..."
            />
          </section>

          {/* Save */}
          <button
            onClick={() => setSaved(true)}
            className="w-full bg-amber hover:bg-amber-dark text-white font-bold py-4 rounded-full text-lg transition-colors shadow-lg shadow-amber/25 min-h-[44px]"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}
