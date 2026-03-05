"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SPECIALTIES = [
  "Medical-Surgical", "ICU/Critical Care", "Emergency", "OR/Perioperative",
  "Labor & Delivery", "Pediatrics", "Behavioral Health", "Home Health",
  "Long-Term Care", "Oncology", "Rehabilitation", "CNA",
];

const JOB_TYPES = ["Full Time", "Part Time", "Per Diem", "Contract", "PRN"];

const LICENSE_TYPES = ["RN", "LPN", "CNA", "APRN", "NP"];

const SHIFT_OPTIONS = [
  "M-F, no on-call",
  "M-F, no weekends",
  "No weekend/holiday requirement",
  "Rotating weekends",
  "Night shift only",
  "3x12 (days)",
  "3x12 (nights)",
  "Per diem / as needed",
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
];

export default function NewJobPage() {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [status, setStatus] = useState<"draft" | "published">("draft");

  const [title, setTitle] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [jobType, setJobType] = useState("Full Time");
  const [city, setCity] = useState("");
  const [state, setState] = useState("RI");
  const [payMin, setPayMin] = useState("");
  const [payMax, setPayMax] = useState("");
  const [payExplained, setPayExplained] = useState("");
  const [scheduleType, setScheduleType] = useState("");
  const [scheduleDetails, setScheduleDetails] = useState("");
  const [licenseType, setLicenseType] = useState("RN");
  const [selectedCerts, setSelectedCerts] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("");
  const [drivingRequired, setDrivingRequired] = useState(false);
  const [isUnion, setIsUnion] = useState(false);
  const [unionName, setUnionName] = useState("");

  const toggleCert = (cert: string) => {
    setSelectedCerts((prev) => prev.includes(cert) ? prev.filter((c) => c !== cert) : [...prev, cert]);
  };

  const handleSave = (publishStatus: "draft" | "published") => {
    if (!title || !city || !payMin || !payMax || !scheduleType) {
      alert("Please fill in all required fields (title, location, pay range, shift type).");
      return;
    }
    setStatus(publishStatus);
    setSaved(true);
    setTimeout(() => router.push("/employer/jobs"), 1500);
  };

  if (saved) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 py-16 text-center animate-fade-in-up">
        <div className="bg-white rounded-2xl card-shadow p-8">
          <div className="text-4xl mb-4">{status === "published" ? "🎉" : "📝"}</div>
          <h2 className="text-xl font-bold mb-2">
            {status === "published" ? "Job Published!" : "Draft Saved!"}
          </h2>
          <p className="text-text-light text-sm">
            {status === "published"
              ? "Your job listing is now visible to nurses on Flor."
              : "Your draft has been saved. You can publish it when you're ready."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="animate-fade-in-up">
        <div className="mb-6">
          <Link href="/employer/jobs" className="text-sm text-periwinkle hover:underline">&larr; Back to My Jobs</Link>
          <h1 className="text-2xl sm:text-3xl font-bold mt-2">Post a New Job</h1>
          <p className="text-text-light mt-1 text-sm">Fill in the details below. Nurses appreciate transparency — the more info, the better.</p>
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <section className="bg-white rounded-2xl card-shadow p-5 sm:p-8">
            <h2 className="text-lg font-bold mb-4">Job Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-text-light block mb-1.5">Job Title *</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-periwinkle-100 rounded-xl px-3 py-3 text-sm min-h-[44px]"
                  placeholder='e.g., "Registered Nurse - ICU"' />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-text-light block mb-1.5">Specialty</label>
                  <select value={specialty} onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full border border-periwinkle-100 rounded-xl px-3 py-3 text-sm bg-white min-h-[44px]">
                    <option value="">Select specialty</option>
                    {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-light block mb-1.5">Job Type</label>
                  <select value={jobType} onChange={(e) => setJobType(e.target.value)}
                    className="w-full border border-periwinkle-100 rounded-xl px-3 py-3 text-sm bg-white min-h-[44px]">
                    {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-xs font-semibold text-text-light block mb-1.5">City *</label>
                  <input type="text" value={city} onChange={(e) => setCity(e.target.value)}
                    className="w-full border border-periwinkle-100 rounded-xl px-3 py-3 text-sm min-h-[44px]" placeholder="City" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-light block mb-1.5">State</label>
                  <input type="text" value={state} onChange={(e) => setState(e.target.value)}
                    className="w-full border border-periwinkle-100 rounded-xl px-3 py-3 text-sm min-h-[44px]" placeholder="RI" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-light block mb-1.5">Hours/Week</label>
                  <input type="number" value={hoursPerWeek} onChange={(e) => setHoursPerWeek(e.target.value)}
                    className="w-full border border-periwinkle-100 rounded-xl px-3 py-3 text-sm min-h-[44px]" placeholder="40" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-text-light block mb-1.5">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-periwinkle-100 rounded-xl p-3 text-sm resize-none min-h-[100px]" rows={4}
                  placeholder="Describe the role, responsibilities, and what makes this a great opportunity..." />
              </div>
            </div>
          </section>

          {/* Pay */}
          <section className="bg-white rounded-2xl card-shadow p-5 sm:p-8">
            <h2 className="text-lg font-bold mb-4">Pay Information</h2>
            <p className="text-sm text-text-light mb-4">Nurses want to see real numbers. Be transparent about your pay range.</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-semibold text-text-light block mb-1.5">Min Pay ($/hr) *</label>
                <input type="number" value={payMin} onChange={(e) => setPayMin(e.target.value)}
                  className="w-full border border-periwinkle-100 rounded-xl px-3 py-3 text-sm min-h-[44px]" placeholder="30" />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-light block mb-1.5">Max Pay ($/hr) *</label>
                <input type="number" value={payMax} onChange={(e) => setPayMax(e.target.value)}
                  className="w-full border border-periwinkle-100 rounded-xl px-3 py-3 text-sm min-h-[44px]" placeholder="50" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-text-light block mb-1.5">Pay Explained</label>
              <textarea value={payExplained} onChange={(e) => setPayExplained(e.target.value)}
                className="w-full border border-periwinkle-100 rounded-xl p-3 text-sm resize-none" rows={2}
                placeholder="Explain how pay is determined — e.g., 'Based on years of experience and certifications'" />
            </div>
          </section>

          {/* Schedule */}
          <section className="bg-white rounded-2xl card-shadow p-5 sm:p-8">
            <h2 className="text-lg font-bold mb-4">Shift & Schedule</h2>
            <p className="text-sm text-text-light mb-4">Be specific — nurses care deeply about schedule clarity.</p>
            <div className="mb-4">
              <label className="text-xs font-semibold text-text-light block mb-2">Shift Type *</label>
              <div className="flex flex-wrap gap-2">
                {SHIFT_OPTIONS.map((s) => (
                  <button key={s} onClick={() => setScheduleType(s)}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-colors min-h-[44px] ${
                      scheduleType === s ? "bg-periwinkle text-white" : "bg-periwinkle-50 text-text-light hover:bg-periwinkle-100"
                    }`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-text-light block mb-1.5">Additional Schedule Details</label>
              <input type="text" value={scheduleDetails} onChange={(e) => setScheduleDetails(e.target.value)}
                className="w-full border border-periwinkle-100 rounded-xl px-3 py-3 text-sm min-h-[44px]"
                placeholder='e.g., "7AM-7PM, every other weekend"' />
            </div>
          </section>

          {/* Requirements */}
          <section className="bg-white rounded-2xl card-shadow p-5 sm:p-8">
            <h2 className="text-lg font-bold mb-4">Requirements</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-semibold text-text-light block mb-1.5">License Required</label>
                <select value={licenseType} onChange={(e) => setLicenseType(e.target.value)}
                  className="w-full border border-periwinkle-100 rounded-xl px-3 py-3 text-sm bg-white min-h-[44px]">
                  {LICENSE_TYPES.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="text-xs font-semibold text-text-light block mb-2">Required Certifications</label>
              <div className="flex flex-wrap gap-2">
                {CERTIFICATIONS.map((c) => (
                  <button key={c} onClick={() => toggleCert(c)}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-colors min-h-[44px] ${
                      selectedCerts.includes(c) ? "bg-periwinkle text-white" : "bg-periwinkle-50 text-text-light hover:bg-periwinkle-100"
                    }`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
                <input type="checkbox" checked={drivingRequired} onChange={(e) => setDrivingRequired(e.target.checked)}
                  className="w-5 h-5 rounded border-periwinkle-100 text-periwinkle" />
                <span className="text-sm font-medium">Driving / valid license required</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
                <input type="checkbox" checked={isUnion} onChange={(e) => setIsUnion(e.target.checked)}
                  className="w-5 h-5 rounded border-periwinkle-100 text-periwinkle" />
                <span className="text-sm font-medium">This is a union position</span>
              </label>
              {isUnion && (
                <input type="text" value={unionName} onChange={(e) => setUnionName(e.target.value)}
                  className="w-full border border-periwinkle-100 rounded-xl px-3 py-3 text-sm min-h-[44px]"
                  placeholder="Union name" />
              )}
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={() => handleSave("published")}
              className="flex-1 bg-amber hover:bg-amber-dark text-white font-bold py-4 rounded-full text-base transition-colors shadow-lg shadow-amber/25 min-h-[44px]">
              Publish Job
            </button>
            <button onClick={() => handleSave("draft")}
              className="flex-1 bg-white border border-periwinkle-100 text-text-light font-semibold py-4 rounded-full text-base hover:border-periwinkle hover:text-periwinkle transition-colors min-h-[44px]">
              Save as Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
