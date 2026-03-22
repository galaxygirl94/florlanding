"use client";

import { useState, useEffect } from "react";
import { seedFacilities } from "@/data/seed-facilities";

/* ── Constants ────────────────────────────────────────────────────── */

const FACILITY_TYPES = [
  "Acute Care Hospital",
  "SNF/Long-term care",
  "Outpatient clinic",
  "Rehab",
  "Behavioral Health",
  "Psychiatric Hospital",
  "Community Health",
  "Home Health",
];

const EHR_SYSTEMS = [
  "Epic",
  "Cerner/Oracle Health",
  "Meditech",
  "PointClickCare",
  "Athenahealth",
  "LifeChart",
  "CPSI",
  "Other",
];

const BENEFITS = [
  "Health Insurance",
  "Dental Insurance",
  "Vision Insurance",
  "401(k) Match",
  "Tuition Reimbursement",
  "Student Loan Forgiveness",
  "Paid Time Off",
  "Sick Leave",
  "Parental Leave",
  "Sign-On Bonus",
  "Relocation Assistance",
  "CEU Reimbursement",
  "Free Parking",
  "Employee Wellness Program",
  "Shift Differentials",
  "Overtime Opportunities",
  "Flexible Scheduling",
  "Employee Assistance Program",
];

const STORAGE_KEY = "flor-employer-facility-profile";

/* ── Component ────────────────────────────────────────────────────── */

export default function FacilityProfileEditor() {
  const bayside = seedFacilities.find((f) => f.id === "facility-bayside")!;

  const [name, setName] = useState(bayside.name);
  const [address, setAddress] = useState(
    bayside.location.address || "500 Bayside Avenue, Providence, RI 02905"
  );
  const [facilityType, setFacilityType] = useState(bayside.type);
  const [bedCount, setBedCount] = useState("220");
  const [ehr, setEhr] = useState(bayside.ehrSystem || "Epic");
  const [magnet, setMagnet] = useState(true);
  const [selectedBenefits, setSelectedBenefits] = useState<Set<string>>(
    new Set([
      "Health Insurance",
      "Dental Insurance",
      "Vision Insurance",
      "401(k) Match",
      "Tuition Reimbursement",
      "Paid Time Off",
      "Free Parking",
      "Employee Wellness Program",
      "Shift Differentials",
    ])
  );
  const [about, setAbout] = useState(bayside.description);
  const [showPreview, setShowPreview] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        if (data.name) setName(data.name);
        if (data.address) setAddress(data.address);
        if (data.facilityType) setFacilityType(data.facilityType);
        if (data.bedCount) setBedCount(data.bedCount);
        if (data.ehr) setEhr(data.ehr);
        if (data.magnet !== undefined) setMagnet(data.magnet);
        if (data.benefits) setSelectedBenefits(new Set(data.benefits));
        if (data.about) setAbout(data.about);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const save = () => {
    const data = {
      name,
      address,
      facilityType,
      bedCount,
      ehr,
      magnet,
      benefits: Array.from(selectedBenefits),
      about,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleBenefit = (b: string) => {
    setSelectedBenefits((prev) => {
      const next = new Set(prev);
      if (next.has(b)) next.delete(b);
      else next.add(b);
      return next;
    });
  };

  if (showPreview) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1
            className="text-2xl sm:text-3xl font-extrabold"
            style={{ color: "#1E1E2E" }}
          >
            Facility Preview
          </h1>
          <button
            onClick={() => setShowPreview(false)}
            className="px-5 py-2.5 rounded-full text-sm font-bold border transition-colors hover:bg-[#FAFAFE]"
            style={{ borderColor: "#E4E4EC", color: "#6B7280" }}
          >
            Back to Edit
          </button>
        </div>

        <div
          className="rounded-2xl border p-6 sm:p-8"
          style={{ background: "white", borderColor: "#E4E4EC" }}
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold"
              style={{ background: "#8B8FD4" }}
            >
              {name
                .split(" ")
                .slice(0, 2)
                .map((w) => w[0])
                .join("")}
            </div>
            <div>
              <h2
                className="text-xl font-extrabold"
                style={{ color: "#1E1E2E" }}
              >
                {name}
              </h2>
              <p className="text-sm" style={{ color: "#6B7280" }}>
                {address}
              </p>
            </div>
          </div>

          {/* Quick facts */}
          <div
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 p-4 rounded-xl"
            style={{ background: "#FAFAFE" }}
          >
            <div>
              <div
                className="text-xs font-bold mb-0.5"
                style={{ color: "#9CA3AF" }}
              >
                Type
              </div>
              <div
                className="text-sm font-bold"
                style={{ color: "#1E1E2E" }}
              >
                {facilityType}
              </div>
            </div>
            <div>
              <div
                className="text-xs font-bold mb-0.5"
                style={{ color: "#9CA3AF" }}
              >
                Beds
              </div>
              <div
                className="text-sm font-bold"
                style={{ color: "#1E1E2E" }}
              >
                {bedCount}
              </div>
            </div>
            <div>
              <div
                className="text-xs font-bold mb-0.5"
                style={{ color: "#9CA3AF" }}
              >
                EHR
              </div>
              <div
                className="text-sm font-bold"
                style={{ color: "#1E1E2E" }}
              >
                {ehr}
              </div>
            </div>
            <div>
              <div
                className="text-xs font-bold mb-0.5"
                style={{ color: "#9CA3AF" }}
              >
                Magnet
              </div>
              <div
                className="text-sm font-bold"
                style={{ color: magnet ? "#059669" : "#9CA3AF" }}
              >
                {magnet ? "Yes" : "No"}
              </div>
            </div>
          </div>

          {/* About */}
          <div className="mb-6">
            <h3
              className="text-sm font-bold mb-2"
              style={{ color: "#1E1E2E" }}
            >
              About
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "#374151" }}
            >
              {about}
            </p>
          </div>

          {/* Benefits */}
          <div>
            <h3
              className="text-sm font-bold mb-3"
              style={{ color: "#1E1E2E" }}
            >
              Benefits
            </h3>
            <div className="flex flex-wrap gap-2">
              {Array.from(selectedBenefits).map((b) => (
                <span
                  key={b}
                  className="text-xs font-bold px-3 py-1.5 rounded-full"
                  style={{ background: "#EEEEF9", color: "#6C70B8" }}
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-extrabold mb-1"
            style={{ color: "#1E1E2E" }}
          >
            Facility Profile
          </h1>
          <p className="text-sm" style={{ color: "#6B7280" }}>
            This information is shown to nurses browsing your listings.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowPreview(true)}
            className="px-5 py-2.5 rounded-full text-sm font-bold border transition-colors hover:bg-[#FAFAFE]"
            style={{ borderColor: "#E4E4EC", color: "#6B7280" }}
          >
            Preview
          </button>
          <button
            onClick={save}
            className="px-5 py-2.5 rounded-full text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: saved ? "#059669" : "#8B8FD4" }}
          >
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      <div
        className="rounded-2xl border p-6 sm:p-8"
        style={{ background: "white", borderColor: "#E4E4EC" }}
      >
        <div className="space-y-6">
          {/* Name */}
          <div>
            <label
              className="block text-xs font-bold mb-2"
              style={{ color: "#6B7280", letterSpacing: "0.05em" }}
            >
              FACILITY NAME
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-[#8B8FD4]"
              style={{
                borderColor: "#E4E4EC",
                color: "#1E1E2E",
                fontFamily: "'Manrope', system-ui, sans-serif",
              }}
            />
          </div>

          {/* Address */}
          <div>
            <label
              className="block text-xs font-bold mb-2"
              style={{ color: "#6B7280", letterSpacing: "0.05em" }}
            >
              ADDRESS
            </label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-[#8B8FD4]"
              style={{
                borderColor: "#E4E4EC",
                color: "#1E1E2E",
                fontFamily: "'Manrope', system-ui, sans-serif",
              }}
            />
          </div>

          {/* Type + Bed Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-xs font-bold mb-2"
                style={{ color: "#6B7280", letterSpacing: "0.05em" }}
              >
                FACILITY TYPE
              </label>
              <select
                value={facilityType}
                onChange={(e) => setFacilityType(e.target.value)}
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-[#8B8FD4]"
                style={{
                  borderColor: "#E4E4EC",
                  color: "#1E1E2E",
                  fontFamily: "'Manrope', system-ui, sans-serif",
                }}
              >
                {FACILITY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                className="block text-xs font-bold mb-2"
                style={{ color: "#6B7280", letterSpacing: "0.05em" }}
              >
                BED COUNT
              </label>
              <input
                type="number"
                value={bedCount}
                onChange={(e) => setBedCount(e.target.value)}
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-[#8B8FD4]"
                style={{
                  borderColor: "#E4E4EC",
                  color: "#1E1E2E",
                  fontFamily: "'Manrope', system-ui, sans-serif",
                }}
              />
            </div>
          </div>

          {/* EHR + Magnet */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-xs font-bold mb-2"
                style={{ color: "#6B7280", letterSpacing: "0.05em" }}
              >
                EHR SYSTEM
              </label>
              <select
                value={ehr}
                onChange={(e) => setEhr(e.target.value)}
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-[#8B8FD4]"
                style={{
                  borderColor: "#E4E4EC",
                  color: "#1E1E2E",
                  fontFamily: "'Manrope', system-ui, sans-serif",
                }}
              >
                {EHR_SYSTEMS.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                className="block text-xs font-bold mb-2"
                style={{ color: "#6B7280", letterSpacing: "0.05em" }}
              >
                MAGNET DESIGNATION
              </label>
              <button
                onClick={() => setMagnet(!magnet)}
                className="w-full rounded-xl border px-4 py-3 text-sm text-left flex items-center justify-between transition-colors"
                style={{
                  borderColor: magnet ? "#8B8FD4" : "#E4E4EC",
                  background: magnet ? "#EEEEF9" : "white",
                  color: "#1E1E2E",
                  fontFamily: "'Manrope', system-ui, sans-serif",
                }}
              >
                <span className="font-semibold">
                  {magnet ? "Magnet Designated" : "Not Magnet Designated"}
                </span>
                <div
                  className="w-10 h-5 rounded-full flex items-center transition-colors px-0.5"
                  style={{
                    background: magnet ? "#8B8FD4" : "#D1D5DB",
                  }}
                >
                  <div
                    className="w-4 h-4 rounded-full bg-white transition-transform"
                    style={{
                      transform: magnet
                        ? "translateX(20px)"
                        : "translateX(0)",
                    }}
                  />
                </div>
              </button>
            </div>
          </div>

          {/* Benefits */}
          <div>
            <label
              className="block text-xs font-bold mb-3"
              style={{ color: "#6B7280", letterSpacing: "0.05em" }}
            >
              BENEFITS
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {BENEFITS.map((b) => (
                <label
                  key={b}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer transition-colors hover:bg-[#FAFAFE]"
                >
                  <input
                    type="checkbox"
                    checked={selectedBenefits.has(b)}
                    onChange={() => toggleBenefit(b)}
                    className="rounded"
                    style={{ accentColor: "#8B8FD4", width: 16, height: 16 }}
                  />
                  <span
                    className="text-xs font-semibold"
                    style={{
                      color: selectedBenefits.has(b) ? "#1E1E2E" : "#6B7280",
                    }}
                  >
                    {b}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* About */}
          <div>
            <label
              className="block text-xs font-bold mb-2"
              style={{ color: "#6B7280", letterSpacing: "0.05em" }}
            >
              ABOUT YOUR FACILITY
            </label>
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              rows={5}
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-[#8B8FD4] resize-none"
              style={{
                borderColor: "#E4E4EC",
                color: "#1E1E2E",
                fontFamily: "'Manrope', system-ui, sans-serif",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
