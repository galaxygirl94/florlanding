"use client";

import { useState } from "react";
import Link from "next/link";

/* ── Color tokens ───────────────────────────────────────────────── */
const C = {
  navy: "#1E1E2E",
  periwinkle: "#8B8FD4",
  teal: "#0D9488",
  tealLight: "#F0FDFA",
  tealBorder: "#99F6E4",
  lavender: "#F4F4FD",
  white: "#FFFFFF",
  muted: "#6B7280",
  mutedLight: "#9CA3AF",
};

/* ── Helpers ────────────────────────────────────────────────────── */
function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

/* ── Real math calculator ──────────────────────────────────────── */
function Calculator() {
  // Travel inputs
  const [weeklyGross, setWeeklyGross] = useState(2400);
  const [contractWeeks, setContractWeeks] = useState(13);
  const [housingIncluded, setHousingIncluded] = useState(true);
  const [housingCostWeek, setHousingCostWeek] = useState(350);
  const [travelCostContract, setTravelCostContract] = useState(500);
  const [weeksOff, setWeeksOff] = useState(2);

  // Staff inputs
  const [hourlyRate, setHourlyRate] = useState(42);
  const [hoursPerWeek, setHoursPerWeek] = useState(36);
  const [differential, setDifferential] = useState(4);
  const [diffHours, setDiffHours] = useState(12);
  const [signOn, setSignOn] = useState(5000);
  const [signOnYears, setSignOnYears] = useState(2);
  const [loanBalance, setLoanBalance] = useState(60000);
  const [pslfYears, setPslfYears] = useState(0);

  // Derived: travel
  const contractsPerYear = contractWeeks > 0
    ? +((52 - weeksOff) / (contractWeeks + weeksOff / Math.max(1, Math.round((52 - weeksOff) / contractWeeks)))).toFixed(1)
    : 0;
  const actualContractsPerYear = Math.floor((52 - weeksOff) / contractWeeks) || 0;
  const workingWeeks = actualContractsPerYear * contractWeeks;
  const travelGross = weeklyGross * workingWeeks;
  const housingOffset = housingIncluded ? housingCostWeek * workingWeeks : 0;
  const travelCostTotal = travelCostContract * actualContractsPerYear;
  const travelTakeHome = travelGross - housingOffset - travelCostTotal;

  // Derived: staff
  const baseWeekly = hourlyRate * hoursPerWeek + differential * diffHours;
  const staffGross = baseWeekly * 52 + signOn / Math.max(1, signOnYears);

  // PSLF
  const remainingPslfYears = Math.max(0, 10 - pslfYears);
  const pslfValue = loanBalance > 0 && remainingPslfYears > 0
    ? Math.round(loanBalance / remainingPslfYears)
    : 0;
  const staffPlusLoan = staffGross + pslfValue;
  const staffWins = staffPlusLoan >= travelTakeHome;

  return (
    <section style={{ padding: "80px 0", background: C.white }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
        <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(28px,4vw,40px)", fontWeight: 700, color: C.navy, marginBottom: 8 }}>
          Run the real numbers
        </h2>
        <p style={{ fontSize: 16, color: C.muted, marginBottom: 40, maxWidth: 560 }}>
          Edit any field — results update live. Housing stipends and PSLF are baked in.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* Travel column */}
          <div style={{ background: "#FAFAFA", borderRadius: 16, padding: 28, border: "1px solid #ECEEF8" }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", color: C.mutedLight, marginBottom: 20, textTransform: "uppercase" as const }}>
              Travel Nursing
            </div>
            <CalcField label="Weekly gross package" prefix="$" value={weeklyGross} onChange={setWeeklyGross} />
            <CalcField label="Contract length (weeks)" value={contractWeeks} onChange={setContractWeeks} />
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: C.muted, marginBottom: 6 }}>Housing stipend included in package?</div>
              <div style={{ display: "flex", gap: 8 }}>
                {["Yes", "No"].map((opt) => (
                  <button key={opt} onClick={() => setHousingIncluded(opt === "Yes")}
                    style={{ flex: 1, padding: "8px 0", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", border: "none",
                      background: (opt === "Yes") === housingIncluded ? C.periwinkle : "#ECEEF8",
                      color: (opt === "Yes") === housingIncluded ? "white" : C.muted }}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            {housingIncluded && (
              <CalcField label="Est. housing cost/week" prefix="$" value={housingCostWeek} onChange={setHousingCostWeek} />
            )}
            <CalcField label="Travel cost per contract" prefix="$" value={travelCostContract} onChange={setTravelCostContract} />
            <CalcField label="Weeks off between contracts" value={weeksOff} onChange={setWeeksOff} />
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #ECEEF8" }}>
              <div style={{ fontSize: 13, color: C.muted }}>Contracts per year (est.)</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.navy }}>{actualContractsPerYear}</div>
            </div>
          </div>

          {/* Staff column */}
          <div style={{ background: "#FAFAFA", borderRadius: 16, padding: 28, border: "1px solid #ECEEF8" }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", color: C.mutedLight, marginBottom: 20, textTransform: "uppercase" as const }}>
              Staff Position
            </div>
            <CalcField label="Hourly rate" prefix="$" value={hourlyRate} onChange={setHourlyRate} />
            <CalcField label="Hours per week" value={hoursPerWeek} onChange={setHoursPerWeek} />
            <CalcField label="Shift differential ($/hr)" prefix="$" value={differential} onChange={setDifferential} />
            <CalcField label="Differential hours/week" value={diffHours} onChange={setDiffHours} />
            <CalcField label="Sign-on bonus" prefix="$" value={signOn} onChange={setSignOn} />
            <CalcField label="Spread over (years)" value={signOnYears} onChange={setSignOnYears} />
            <div style={{ marginTop: 4, paddingTop: 16, borderTop: "1px solid #ECEEF8" }}>
              <CalcField label="Student loan balance" prefix="$" value={loanBalance} onChange={setLoanBalance} note="Federal loans only" />
              <CalcField label="Years in PSLF-qualifying employment" value={pslfYears} onChange={setPslfYears} note="PACE and FQHC positions on Flor qualify" min={0} max={10} />
            </div>
          </div>
        </div>

        {/* PSLF callout */}
        {loanBalance > 0 && pslfYears < 10 && (
          <div style={{ marginTop: 28, background: C.tealLight, borderRadius: 16, padding: "24px 28px", border: `1px solid ${C.tealBorder}` }}>
            <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 22, fontWeight: 700, color: "#134E4A", marginBottom: 8 }}>
              At a qualifying employer, your {fmt(loanBalance)} in student loans could be forgiven in {remainingPslfYears} year{remainingPslfYears !== 1 ? "s" : ""}.
            </div>
            <p style={{ fontSize: 14, color: "#0F766E", margin: 0 }}>
              That&apos;s worth <strong>~{fmt(pslfValue)}/year</strong> in real terms — money you&apos;d otherwise have to earn and pay taxes on.
            </p>
          </div>
        )}

        {/* Results */}
        <div style={{ marginTop: 24, background: "white", borderRadius: 16, padding: "28px 28px", border: "1px solid #ECEEF8", boxShadow: "0 2px 12px rgba(139,143,212,0.08)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 13, color: C.muted, marginBottom: 4 }}>Travel take-home (est.)</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: C.navy }}>{fmt(travelTakeHome)}<span style={{ fontSize: 14, fontWeight: 400, color: C.muted }}>/yr</span></div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: C.muted, marginBottom: 4 }}>Staff + PSLF value (est.)</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: C.navy }}>{fmt(staffPlusLoan)}<span style={{ fontSize: 14, fontWeight: 400, color: C.muted }}>/yr</span></div>
            </div>
          </div>
          <div style={{ height: 1, background: "#F0F1F8", margin: "0 0 20px" }} />
          {staffWins ? (
            <div style={{ color: C.teal, fontWeight: 700, fontSize: 15 }}>
              🌱 Staff may be worth more than you think
            </div>
          ) : (
            <div>
              <div style={{ color: C.muted, fontWeight: 600, fontSize: 15 }}>
                Travel still pays more — but here&apos;s what money can&apos;t calculate:
              </div>
            </div>
          )}
        </div>

        <p style={{ fontSize: 12, color: C.mutedLight, marginTop: 16, lineHeight: 1.6 }}>
          This is an estimate for illustration only. Talk to a financial advisor for personalized guidance. PSLF forgiveness requires meeting all program requirements.
        </p>
      </div>
    </section>
  );
}

function CalcField({ label, prefix, value, onChange, note, min, max }: {
  label: string; prefix?: string; value: number; onChange: (v: number) => void;
  note?: string; min?: number; max?: number;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 4 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", background: "white", border: "1px solid #ECEEF8", borderRadius: 8, overflow: "hidden" }}>
        {prefix && (
          <span style={{ padding: "0 10px", fontSize: 14, color: "#9CA3AF", borderRight: "1px solid #ECEEF8", height: 38, display: "flex", alignItems: "center" }}>
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ flex: 1, border: "none", outline: "none", padding: "0 12px", height: 38, fontSize: 14, fontWeight: 600, color: "#1E1E2E", background: "transparent" }}
        />
      </div>
      {note && <p style={{ fontSize: 11, color: "#9CA3AF", margin: "3px 0 0", lineHeight: 1.4 }}>{note}</p>}
    </div>
  );
}

/* ── PSLF timeline ─────────────────────────────────────────────── */
function PSLFTimeline() {
  const [balance, setBalance] = useState(60000);
  const [monthly, setMonthly] = useState(300);
  const [completed, setCompleted] = useState(0);

  const remaining = Math.max(0, 10 - completed);
  const paidOff = monthly * completed * 12;
  const estimatedForgiveness = Math.max(0, balance - paidOff);
  const pct = Math.min(100, (completed / 10) * 100);

  return (
    <div style={{ background: "#F8F8FE", borderRadius: 16, padding: 28, border: "1px solid #ECEEF8" }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 20 }}>Interactive PSLF Timeline</div>
      <CalcField label="Loan balance" prefix="$" value={balance} onChange={setBalance} />
      <CalcField label="Monthly payment (est.)" prefix="$" value={monthly} onChange={setMonthly} />
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 8 }}>
          Years already in qualifying employment: <strong style={{ color: C.navy }}>{completed}</strong>
        </div>
        <input
          type="range" min={0} max={10} value={completed}
          onChange={(e) => setCompleted(Number(e.target.value))}
          style={{ width: "100%", accentColor: C.teal }}
        />
      </div>

      {/* Progress bar */}
      <div style={{ height: 12, background: "#E2E4F0", borderRadius: 99, overflow: "hidden", marginBottom: 8 }}>
        <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${C.teal}, #14B8A6)`, borderRadius: 99, transition: "width 0.4s" }} />
      </div>
      <p style={{ fontSize: 13, color: C.muted, margin: "0 0 16px" }}>
        {completed} year{completed !== 1 ? "s" : ""} complete · {remaining} year{remaining !== 1 ? "s" : ""} to forgiveness
      </p>

      <div style={{ background: C.tealLight, borderRadius: 12, padding: "16px 20px", border: `1px solid ${C.tealBorder}` }}>
        <div style={{ fontSize: 13, color: "#0F766E", marginBottom: 4 }}>Estimated forgiveness</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: "#134E4A" }}>{fmt(estimatedForgiveness)}</div>
        <p style={{ fontSize: 11, color: "#0F766E", margin: "4px 0 0", lineHeight: 1.5 }}>
          Based on your current payment. Actual forgiveness depends on your repayment plan.
        </p>
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────── */
export default function TravelOffRampPage() {
  return (
    <main style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: "#FAFBFF", minHeight: "100vh" }}>

      {/* Section 1 — Hero */}
      <section style={{ padding: "80px 0 60px", background: C.white }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: C.lavender, borderRadius: 99, padding: "6px 14px", fontSize: 12, fontWeight: 700, color: C.periwinkle, marginBottom: 24, letterSpacing: "0.02em" }}>
            ✦ For travel nurses considering the next chapter
          </div>
          <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(36px,6vw,60px)", fontWeight: 700, color: C.navy, margin: "0 0 20px", lineHeight: 1.1 }}>
            Is it time to<br />come home?
          </h1>
          <p style={{ fontSize: 18, color: C.muted, maxWidth: 560, margin: 0, lineHeight: 1.65 }}>
            Travel nursing pays well. It also means 13-week contracts, hotel rooms, missing things. If you&apos;ve been thinking about putting down roots, we built this for you — no judgment, just the real math.
          </p>
        </div>
      </section>

      {/* Section 2 — Calculator */}
      <Calculator />

      {/* Section 3 — What money can't calculate */}
      <section style={{ padding: "80px 0", background: C.lavender }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(26px,4vw,38px)", fontWeight: 700, color: C.navy, marginBottom: 12, textAlign: "center" as const }}>
            What the spreadsheet doesn&apos;t capture
          </h2>
          <p style={{ fontSize: 16, color: C.muted, textAlign: "center" as const, marginBottom: 48, maxWidth: 520, marginLeft: "auto", marginRight: "auto" }}>
            Some things don&apos;t show up in an annual gross calculation.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {[
              { icon: "🏠", title: "A home base", body: "Your own space. Your own routines. Not wondering where you'll be in 14 weeks." },
              { icon: "🤝", title: "Knowing your patients", body: "Community health nursing means continuity — you actually see people get better. Travel nursing rarely offers that." },
              { icon: "📈", title: "Building something", body: "Staff positions come with mentorship, advancement, and the chance to actually shape a unit over time." },
              { icon: "🌱", title: "Work that means something", body: "FQHCs and PACE programs serve people who need care most. That's not available on a 13-week contract." },
            ].map((card) => (
              <div key={card.title} style={{ background: C.white, borderRadius: 16, padding: "24px", boxShadow: "0 2px 12px rgba(139,143,212,0.06)" }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{card.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 8 }}>{card.title}</div>
                <p style={{ fontSize: 14, color: C.muted, margin: 0, lineHeight: 1.6 }}>{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4 — PSLF deep dive */}
      <section style={{ padding: "80px 0", background: C.white }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(26px,4vw,38px)", fontWeight: 700, color: C.navy, marginBottom: 40 }}>
            PSLF: the benefit most nurses<br />don&apos;t know they qualify for
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
            {/* Left — explainer */}
            <div>
              {[
                {
                  q: "What is PSLF?",
                  a: "Public Service Loan Forgiveness cancels your remaining federal student loan balance after 10 years of payments while working full-time at a qualifying nonprofit or government employer.",
                },
                {
                  q: "Does my employer qualify?",
                  a: "Every FQHC, PACE program, and public school district on Flor is a qualifying employer. Private hospitals may or may not qualify — check the PSLF employer search tool.",
                },
                {
                  q: "What counts as a payment?",
                  a: "Any month you make a qualifying payment under an income-driven repayment plan while working full-time at a qualifying employer. Part-time at two qualifying employers can also count.",
                },
              ].map((item) => (
                <div key={item.q} style={{ marginBottom: 28 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 6 }}>{item.q}</div>
                  <p style={{ fontSize: 14, color: C.muted, margin: 0, lineHeight: 1.65 }}>{item.a}</p>
                </div>
              ))}
              <a
                href="https://studentaid.gov/pslf/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 700, color: C.teal, textDecoration: "none" }}
              >
                Check your employer →
              </a>
            </div>

            {/* Right — timeline */}
            <PSLFTimeline />
          </div>
        </div>
      </section>

      {/* Section 5 — RI Pay Intelligence */}
      <section style={{ padding: "80px 0", background: "#FAFBFF" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(26px,4vw,38px)", fontWeight: 700, color: C.navy, marginBottom: 10 }}>
            What staff RNs actually make<br />in Rhode Island
          </h2>
          <p style={{ fontSize: 16, color: C.muted, marginBottom: 36, maxWidth: 560 }}>
            These are real ranges from verified employers who post directly on Flor — not BLS averages.
          </p>

          <div style={{ overflowX: "auto" as const }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: C.lavender }}>
                  {["Employer", "Role", "Pay Range", "PSLF Eligible", "Schedule"].map((h) => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left" as const, fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase" as const, borderBottom: "2px solid #E4E4EC" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { employer: "PACE Organization of RI", role: "CNA Day Center", pay: "$20–$24/hr", pslf: "confirmed", schedule: "M–F days" },
                  { employer: "Brown University Health", role: "RN Behavioral Health", pay: "$38–$47/hr", pslf: "check", schedule: "M–F days" },
                  { employer: "Rhode Island Hospital", role: "RN OR", pay: "$43–$55/hr", pslf: "check", schedule: "3×12hr" },
                ].map((row, i) => (
                  <tr key={row.employer} style={{ background: i % 2 === 0 ? C.white : "#FAFBFF" }}>
                    <td style={{ padding: "14px 16px", fontWeight: 600, color: C.navy, borderBottom: "1px solid #F0F1F8" }}>{row.employer}</td>
                    <td style={{ padding: "14px 16px", color: C.muted, borderBottom: "1px solid #F0F1F8" }}>{row.role}</td>
                    <td style={{ padding: "14px 16px", fontWeight: 700, color: C.navy, borderBottom: "1px solid #F0F1F8" }}>{row.pay}</td>
                    <td style={{ padding: "14px 16px", borderBottom: "1px solid #F0F1F8" }}>
                      {row.pslf === "confirmed" ? (
                        <span style={{ color: C.teal, fontWeight: 700 }}>✓ Yes</span>
                      ) : (
                        <a href="https://studentaid.gov/pslf/" target="_blank" rel="noopener noreferrer" style={{ color: C.muted, fontSize: 13, textDecoration: "underline" }}>Check →</a>
                      )}
                    </td>
                    <td style={{ padding: "14px 16px", color: C.muted, borderBottom: "1px solid #F0F1F8" }}>{row.schedule}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p style={{ fontSize: 13, color: C.mutedLight, fontStyle: "italic", marginTop: 16 }}>
            More employers and roles coming soon. Pay is always posted upfront — no surprises at offer stage.
          </p>
          <Link href="/jobs" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 16, fontSize: 14, fontWeight: 700, color: C.periwinkle, textDecoration: "none" }}>
            Browse open positions →
          </Link>
        </div>
      </section>

      {/* Section 6 — Bottom CTA */}
      <section style={{ padding: "80px 0", background: C.periwinkle }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px", textAlign: "center" as const }}>
          <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(28px,4vw,44px)", fontWeight: 700, color: C.white, margin: "0 0 16px", lineHeight: 1.1 }}>
            Ready to see what&apos;s out there?
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.82)", margin: "0 0 40px", lineHeight: 1.65 }}>
            Browse real jobs from verified Rhode Island employers. No recruiter calls, no fake listings, no surprises.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" as const }}>
            <Link href="/jobs" style={{ background: C.white, color: C.periwinkle, padding: "14px 32px", borderRadius: 99, fontSize: 15, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}>
              Browse Jobs →
            </Link>
            <Link href="/nurse-profile" style={{ border: "2px solid rgba(255,255,255,0.7)", color: C.white, padding: "14px 32px", borderRadius: 99, fontSize: 15, fontWeight: 700, textDecoration: "none", background: "transparent" }}>
              Create Your Profile
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
