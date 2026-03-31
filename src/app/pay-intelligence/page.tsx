"use client";

import { useState } from "react";
import Link from "next/link";

/* ── Constants ────────────────────────────────────────────────── */

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
] as const;

const STATE_NAMES: Record<string, string> = {
  AL:"Alabama",AK:"Alaska",AZ:"Arizona",AR:"Arkansas",CA:"California",
  CO:"Colorado",CT:"Connecticut",DE:"Delaware",FL:"Florida",GA:"Georgia",
  HI:"Hawaii",ID:"Idaho",IL:"Illinois",IN:"Indiana",IA:"Iowa",
  KS:"Kansas",KY:"Kentucky",LA:"Louisiana",ME:"Maine",MD:"Maryland",
  MA:"Massachusetts",MI:"Michigan",MN:"Minnesota",MS:"Mississippi",MO:"Missouri",
  MT:"Montana",NE:"Nebraska",NV:"Nevada",NH:"New Hampshire",NJ:"New Jersey",
  NM:"New Mexico",NY:"New York",NC:"North Carolina",ND:"North Dakota",OH:"Ohio",
  OK:"Oklahoma",OR:"Oregon",PA:"Pennsylvania",RI:"Rhode Island",SC:"South Carolina",
  SD:"South Dakota",TN:"Tennessee",TX:"Texas",UT:"Utah",VT:"Vermont",
  VA:"Virginia",WA:"Washington",WV:"West Virginia",WI:"Wisconsin",WY:"Wyoming",
};

const NURSE_TYPES = ["RN", "LPN", "CNA"] as const;

const SPECIALTIES = [
  "ICU","Med-Surg","ER","OR","L&D","NICU","Peds","Psych",
  "Home Health","Oncology","Rehab","School Nurse","Telemetry",
  "Outpatient","SNF/LTC",
] as const;

const EXPERIENCE_LEVELS = ["0-2","3-5","6-10","10+"] as const;

const SETTINGS = ["Hospital","Long-term care","Outpatient","School","Home health"] as const;

type EmploymentType = "Staff" | "Per Diem";

/* ── Mock data lookup ─────────────────────────────────────────── */

interface MarketData {
  blsAvg: number;
  florAvg: number | null;
  florListings: number | null;
}

// Keys: nurseType|specialty|state|experience|setting|empType
const MARKET_DATA: Record<string, MarketData> = {
  "RN|ICU|RI|0-2|Hospital|Staff":        { blsAvg: 38.75, florAvg: 42.00, florListings: 5 },
  "RN|ICU|RI|3-5|Hospital|Staff":        { blsAvg: 42.50, florAvg: 47.25, florListings: 8 },
  "RN|ICU|RI|6-10|Hospital|Staff":       { blsAvg: 46.00, florAvg: 51.50, florListings: 6 },
  "RN|ICU|RI|10+|Hospital|Staff":        { blsAvg: 49.25, florAvg: 54.00, florListings: 4 },
  "RN|ICU|RI|3-5|Hospital|Per Diem":     { blsAvg: 42.50, florAvg: 55.00, florListings: 3 },
  "RN|Med-Surg|RI|3-5|Hospital|Staff":   { blsAvg: 39.80, florAvg: 43.50, florListings: 12 },
  "RN|ER|RI|3-5|Hospital|Staff":         { blsAvg: 43.25, florAvg: 48.00, florListings: 7 },
  "RN|ER|MA|3-5|Hospital|Staff":         { blsAvg: 48.50, florAvg: 53.25, florListings: 14 },
  "RN|ICU|MA|3-5|Hospital|Staff":        { blsAvg: 49.00, florAvg: 55.75, florListings: 11 },
  "RN|ICU|NY|3-5|Hospital|Staff":        { blsAvg: 51.25, florAvg: 58.00, florListings: 19 },
  "RN|ICU|CA|6-10|Hospital|Staff":       { blsAvg: 62.50, florAvg: 68.00, florListings: 22 },
  "LPN|SNF/LTC|RI|3-5|Long-term care|Staff": { blsAvg: 28.50, florAvg: 31.25, florListings: 9 },
  "LPN|Med-Surg|RI|0-2|Hospital|Staff":  { blsAvg: 25.75, florAvg: null, florListings: null },
  "CNA|SNF/LTC|RI|0-2|Long-term care|Staff": { blsAvg: 18.50, florAvg: 20.00, florListings: 15 },
  "CNA|Med-Surg|RI|3-5|Hospital|Staff":  { blsAvg: 19.75, florAvg: 21.50, florListings: 6 },
  "RN|Peds|RI|3-5|Hospital|Staff":       { blsAvg: 40.25, florAvg: 44.00, florListings: 4 },
  "RN|Telemetry|RI|6-10|Hospital|Staff": { blsAvg: 44.00, florAvg: 48.75, florListings: 5 },
  "RN|Home Health|RI|3-5|Home health|Staff": { blsAvg: 37.50, florAvg: 40.25, florListings: 7 },
  "RN|Psych|RI|3-5|Hospital|Staff":      { blsAvg: 41.00, florAvg: null, florListings: null },
  "RN|Oncology|RI|6-10|Hospital|Staff":  { blsAvg: 45.50, florAvg: 50.00, florListings: 3 },
};

// Fallback generator for combos not in lookup
function generateFallback(nurseType: string, experience: string, state: string, empType: string): MarketData {
  const baseRates: Record<string, number> = { RN: 38, LPN: 26, CNA: 17 };
  const expMultiplier: Record<string, number> = { "0-2": 1.0, "3-5": 1.12, "6-10": 1.25, "10+": 1.35 };
  const stateMultiplier: Record<string, number> = { CA: 1.55, NY: 1.40, MA: 1.35, WA: 1.30, CT: 1.28, NJ: 1.25, HI: 1.22, OR: 1.18, MN: 1.15, CO: 1.12, RI: 1.08 };
  const base = (baseRates[nurseType] || 38) * (expMultiplier[experience] || 1.0) * (stateMultiplier[state] || 1.05);
  const blsAvg = Math.round(base * 100) / 100;
  const perDiemBonus = empType === "Per Diem" ? 1.15 : 1.0;
  return { blsAvg: Math.round(blsAvg * perDiemBonus * 100) / 100, florAvg: null, florListings: null };
}

function getMarketData(
  nurseType: string, specialty: string, state: string,
  experience: string, setting: string, empType: string
): MarketData {
  const key = `${nurseType}|${specialty}|${state}|${experience}|${setting}|${empType}`;
  return MARKET_DATA[key] || generateFallback(nurseType, experience, state, empType);
}

/* ── Select component ─────────────────────────────────────────── */

function Select({
  label, value, onChange, options, renderOption,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  renderOption?: (v: string) => string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-text-light tracking-wide">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-text font-medium text-sm focus:outline-none focus:ring-2 focus:ring-periwinkle/40 focus:border-periwinkle transition-all appearance-none cursor-pointer"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%236B7280' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center" }}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {renderOption ? renderOption(o) : o}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ── Main page ────────────────────────────────────────────────── */

export default function PayIntelligencePage() {
  const [nurseType, setNurseType] = useState<string>("RN");
  const [specialty, setSpecialty] = useState<string>("ICU");
  const [state, setState] = useState<string>("RI");
  const [experience, setExperience] = useState<string>("3-5");
  const [setting, setSetting] = useState<string>("Hospital");
  const [empType, setEmpType] = useState<EmploymentType>("Staff");
  const [results, setResults] = useState<MarketData | null>(null);
  const [showPayInput, setShowPayInput] = useState(false);
  const [currentPay, setCurrentPay] = useState("");
  const [payComparison, setPayComparison] = useState<{ below: boolean; diff: number } | null>(null);

  function handleSubmit() {
    const data = getMarketData(nurseType, specialty, state, experience, setting, empType);
    setResults(data);
    setShowPayInput(false);
    setPayComparison(null);
    setCurrentPay("");
  }

  function handlePayCompare() {
    const pay = parseFloat(currentPay);
    if (isNaN(pay) || pay <= 0) return;
    const compareTarget = results?.florAvg ?? results?.blsAvg ?? 0;
    const diff = compareTarget - pay;
    setPayComparison({ below: diff > 0, diff: Math.abs(diff) });
  }

  const florPctMore = results?.florAvg && results.blsAvg
    ? Math.round(((results.florAvg - results.blsAvg) / results.blsAvg) * 100)
    : null;

  const blsPct = results?.florAvg
    ? Math.round((results.blsAvg / (results.blsAvg + results.florAvg)) * 100)
    : 100;
  const florPct = results?.florAvg ? 100 - blsPct : 0;

  return (
    <div>
      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden bg-[#1E1E2E]">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-periwinkle/8 rounded-full blur-[140px] -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-periwinkle/6 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4" />

        <div className="relative max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-24 sm:pt-36 pb-20 sm:pb-28">
          <div className="max-w-3xl animate-fade-in-up">
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full mb-8">
              <div className="w-2 h-2 bg-periwinkle rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-white/90">Pay Intelligence Tool</span>
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.06] tracking-tight mb-8">
              Is your facility paying what the market&nbsp;pays?
            </h1>

            <p className="text-xl sm:text-2xl text-white/70 leading-relaxed max-w-2xl">
              Compare your pay against BLS data and active Flor listings.
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ========== FORM ========== */}
      <section className="bg-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-12 sm:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl section-shadow p-6 sm:p-10 animate-fade-in-up">
              {/* Employment type toggle */}
              <div className="flex justify-center mb-8">
                <div className="inline-flex bg-gray-100 rounded-xl p-1">
                  {(["Staff", "Per Diem"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setEmpType(t)}
                      className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                        empType === t
                          ? "bg-periwinkle text-white shadow-md"
                          : "text-text-light hover:text-text"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dropdowns grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                <Select
                  label="Nurse Type"
                  value={nurseType}
                  onChange={setNurseType}
                  options={NURSE_TYPES}
                />
                <Select
                  label="Specialty"
                  value={specialty}
                  onChange={setSpecialty}
                  options={SPECIALTIES}
                />
                <Select
                  label="State"
                  value={state}
                  onChange={setState}
                  options={US_STATES}
                  renderOption={(s) => `${s} - ${STATE_NAMES[s]}`}
                />
                <Select
                  label="Years of Experience"
                  value={experience}
                  onChange={setExperience}
                  options={EXPERIENCE_LEVELS}
                  renderOption={(e) => `${e} years`}
                />
                <Select
                  label="Setting"
                  value={setting}
                  onChange={setSetting}
                  options={SETTINGS}
                />
              </div>

              {/* Submit */}
              <div className="flex justify-center">
                <button
                  onClick={handleSubmit}
                  className="bg-periwinkle hover:bg-periwinkle-dark text-white font-bold px-10 py-4 rounded-full text-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  See My Market Rate
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== RESULTS ========== */}
      {results && (
        <section className="bg-gradient-to-b from-periwinkle-50 to-white">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-12 sm:py-16">
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">

              {/* Section header */}
              <div className="text-center mb-4">
                <span className="inline-flex items-center gap-2 text-periwinkle text-sm font-bold uppercase tracking-wider mb-4">
                  <span className="w-8 h-px bg-periwinkle" />
                  Market Rate Results
                  <span className="w-8 h-px bg-periwinkle" />
                </span>
                <p className="text-text-light text-base">
                  {nurseType} &middot; {specialty} &middot; {STATE_NAMES[state]} &middot; {experience} yrs &middot; {setting} &middot; {empType}
                </p>
              </div>

              {/* Rate cards */}
              <div className={`grid gap-6 ${results.florAvg ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 max-w-xl mx-auto"}`}>
                {/* BLS card */}
                <div className="bg-white rounded-2xl section-shadow p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-3 h-3 rounded-full bg-periwinkle" />
                    <span className="text-sm font-bold text-periwinkle uppercase tracking-wider">BLS Average</span>
                  </div>
                  <div className="mb-4">
                    <span className="text-5xl sm:text-6xl font-extrabold text-text">
                      ${results.blsAvg.toFixed(2)}
                    </span>
                    <span className="text-xl text-text-muted font-medium ml-1">/hr</span>
                  </div>
                  <p className="text-sm text-text-light leading-relaxed">
                    Bureau of Labor Statistics data for {nurseType}s in {STATE_NAMES[state]}, adjusted for {experience} years of experience.
                  </p>
                  {/* Visual bar */}
                  <div className="mt-6 h-3 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-periwinkle transition-all duration-700"
                      style={{ width: results.florAvg ? `${Math.round((results.blsAvg / results.florAvg) * 100)}%` : "100%" }}
                    />
                  </div>
                </div>

                {/* Flor card */}
                {results.florAvg && results.florListings && (
                  <div className="bg-white rounded-2xl section-shadow p-8 border-2 border-success/20">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-3 h-3 rounded-full bg-success" />
                      <span className="text-sm font-bold text-success uppercase tracking-wider">Flor Average</span>
                    </div>
                    <div className="mb-4">
                      <span className="text-5xl sm:text-6xl font-extrabold text-text">
                        ${results.florAvg.toFixed(2)}
                      </span>
                      <span className="text-xl text-text-muted font-medium ml-1">/hr</span>
                    </div>
                    <p className="text-sm text-text-light leading-relaxed">
                      Based on {results.florListings} active Flor listings for {nurseType} &middot; {specialty} in {STATE_NAMES[state]}.
                    </p>
                    {/* Visual bar */}
                    <div className="mt-6 h-3 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-success transition-all duration-700"
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>
                )}

                {/* No Flor data message */}
                {!results.florAvg && (
                  <div className="bg-white rounded-2xl section-shadow p-8 max-w-xl mx-auto col-span-full">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-text mb-1">Limited Flor data for this combination</p>
                        <p className="text-sm text-text-light">
                          We don&apos;t have enough active listings to show a reliable Flor average for this role and location yet. BLS data is still shown above.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Gap visualization */}
              {florPctMore !== null && florPctMore > 0 && (
                <div className="bg-success/5 border border-success/15 rounded-2xl p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-7 h-7 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                      </svg>
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-2xl sm:text-3xl font-extrabold text-success mb-1">
                        Flor nurses earn {florPctMore}% more
                      </p>
                      <p className="text-sm text-text-light">
                        Active Flor listings pay ${(results.florAvg! - results.blsAvg).toFixed(2)}/hr above the BLS average for this role.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Confidence indicator */}
              <div className="bg-white rounded-2xl section-shadow p-6 sm:p-8">
                <p className="text-sm font-bold text-text-light uppercase tracking-wider mb-4">Data Confidence</p>
                <div className="h-4 rounded-full bg-gray-100 overflow-hidden flex">
                  <div
                    className="h-full bg-periwinkle transition-all duration-700"
                    style={{ width: `${blsPct}%` }}
                  />
                  {florPct > 0 && (
                    <div
                      className="h-full bg-success transition-all duration-700"
                      style={{ width: `${florPct}%` }}
                    />
                  )}
                </div>
                <div className="flex justify-between mt-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-periwinkle" />
                    <span className="text-text-light font-medium">{blsPct}% BLS</span>
                  </div>
                  {florPct > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-success" />
                      <span className="text-text-light font-medium">{florPct}% Flor listings</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Current pay comparison */}
              <div className="bg-white rounded-2xl section-shadow p-6 sm:p-8">
                {!showPayInput ? (
                  <div className="text-center">
                    <p className="text-text font-bold mb-2">Want to see how your current pay compares?</p>
                    <p className="text-sm text-text-light mb-5">Enter your hourly rate to get a personalized comparison.</p>
                    <button
                      onClick={() => setShowPayInput(true)}
                      className="text-periwinkle font-bold text-sm hover:text-periwinkle-dark transition-colors"
                    >
                      Enter my current pay &rarr;
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-text font-bold mb-4">Enter your current hourly rate</p>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="relative flex-1 max-w-[200px]">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-bold">$</span>
                        <input
                          type="number"
                          step="0.25"
                          min="0"
                          placeholder="0.00"
                          value={currentPay}
                          onChange={(e) => setCurrentPay(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-16 py-3 text-text font-bold text-lg focus:outline-none focus:ring-2 focus:ring-periwinkle/40 focus:border-periwinkle transition-all"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted text-sm">/hr</span>
                      </div>
                      <button
                        onClick={handlePayCompare}
                        className="bg-periwinkle hover:bg-periwinkle-dark text-white font-bold px-6 py-3 rounded-xl text-sm transition-all duration-200"
                      >
                        Compare
                      </button>
                    </div>

                    {payComparison && (
                      <div className={`mt-6 rounded-xl p-5 ${payComparison.below ? "bg-success/5 border border-success/15" : "bg-periwinkle-50 border border-periwinkle/15"}`}>
                        {payComparison.below ? (
                          <>
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                                <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" />
                                </svg>
                              </div>
                              <p className="font-extrabold text-text text-lg">
                                Nurses like you are being offered ${payComparison.diff.toFixed(2)}/hr more.
                              </p>
                            </div>
                            <p className="text-sm text-text-light mb-4 ml-11">
                              Based on current market data, you could be earning more. See open roles paying above your current rate.
                            </p>
                            <Link
                              href="/jobs/matched"
                              className="ml-11 inline-flex items-center gap-2 bg-success text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                            >
                              See open roles
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                              </svg>
                            </Link>
                          </>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-periwinkle/10 flex items-center justify-center">
                              <svg className="w-4 h-4 text-periwinkle" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-bold text-text">Your pay is competitive.</p>
                              <p className="text-sm text-text-light">You&apos;re earning at or above the current market rate. Nice.</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========== BOTTOM CTA ========== */}
      <section className="bg-[#1E1E2E] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-periwinkle/8 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-periwinkle/8 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4" />

        <div className="relative max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-12 sm:py-16 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
            Know your worth. Find what pays.
          </h2>
          <p className="text-lg sm:text-xl text-white/60 mb-10 max-w-lg mx-auto leading-relaxed">
            Every job on Flor shows the real pay. Browse roles that pay above market rate.
          </p>
          <Link
            href="/jobs/matched"
            className="inline-flex items-center gap-3 bg-white text-[#1E1E2E] font-bold px-10 py-4 rounded-full text-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Browse jobs paying above market rate
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
