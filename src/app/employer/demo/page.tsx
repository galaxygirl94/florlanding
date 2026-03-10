"use client";

import Link from "next/link";

/* ── Colors ────────────────────────────────────────────────────── */
const P = "#8B8FD4";
const NAVY = "#1E1E2E";
const GREEN = "#059669";
const AMBER = "#D97706";

/* ── Demo candidate data (anonymized) ──────────────────────────── */
const DEMO_CANDIDATES = [
  { id: 1, specialty: "ICU / Critical Care", yoe: 6, fit: 94, certs: ["CCRN", "BLS", "ACLS"], appliedDays: 3, teaser: "Former travel nurse, 6 yrs ICU, seeking permanent role in Providence." },
  { id: 2, specialty: "ICU / Critical Care", yoe: 9, fit: 91, certs: ["CCRN", "BLS", "ACLS", "TNCC"], appliedDays: 5, teaser: "Magnet hospital background, night shift preferred, 9 yrs critical care." },
  { id: 3, specialty: "ICU / Critical Care", yoe: 4, fit: 83, certs: ["BLS", "ACLS"], appliedDays: 1, teaser: "Relocating to RI, 4 yrs ICU, Boston Medical background." },
  { id: 4, specialty: "Critical Care/Step-Down", yoe: 7, fit: 79, certs: ["BLS", "ACLS", "PCCN"], appliedDays: 2, teaser: "7 yrs float pool experience, ICU and step-down certified." },
];

/* ── Shared ─────────────────────────────────────────────────────── */
function FitBadge({ score }: { score: number }) {
  const color = score >= 88 ? GREEN : score >= 75 ? P : AMBER;
  const bg = score >= 88 ? "#ECFDF5" : score >= 75 ? "#F0F0FA" : "#FFFBEB";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: bg, borderRadius: 8, padding: "6px 10px", minWidth: 50 }}>
      <span style={{ fontSize: 13, fontWeight: 800, color, lineHeight: 1 }}>{score}%</span>
      <span style={{ fontSize: 9, fontWeight: 700, color, letterSpacing: "0.08em", marginTop: 2 }}>FLOR FIT</span>
    </div>
  );
}

/* ── Demo Candidate Card (blurred) ─────────────────────────────── */
function DemoCandidateCard({ c }: { c: typeof DEMO_CANDIDATES[number] }) {
  return (
    <div style={{ background: "white", borderRadius: 14, border: "1px solid #ECEEF8", boxShadow: "0 1px 4px rgba(139,143,212,.06)", marginBottom: 12, overflow: "hidden", position: "relative" }}>
      <div style={{ padding: "18px 22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            {/* Blurred avatar */}
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#CBD5E1", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, filter: "blur(5px)" }}>
              <span style={{ color: "white", fontWeight: 700, fontSize: 14 }}>?</span>
            </div>
            <div>
              {/* Blurred name */}
              <div style={{ fontSize: 16, fontWeight: 700, color: NAVY, filter: "blur(5px)", userSelect: "none", marginBottom: 2 }}>████████ ████████</div>
              <div style={{ fontSize: 13, color: "#6B7280" }}>{c.specialty} · {c.yoe} yrs experience</div>
              <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, background: "#F0F0FA", color: P, borderRadius: 5, padding: "2px 8px", fontWeight: 600 }}>RI License ✓</span>
                {c.certs.map((cert) => (
                  <span key={cert} style={{ fontSize: 11, background: "#F9FAFB", color: "#6B7280", borderRadius: 5, padding: "2px 8px" }}>{cert}</span>
                ))}
              </div>
            </div>
          </div>
          <FitBadge score={c.fit} />
        </div>
        {/* Teaser note */}
        <div style={{ marginTop: 12, fontSize: 13, color: "#6B7280", fontStyle: "italic", lineHeight: 1.5 }}>{c.teaser}</div>
        {/* Locked overlay CTA */}
        <div style={{ marginTop: 14, background: "#F0F0FA", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ fontSize: 13, color: "#6B7280" }}>
            <span style={{ fontSize: 15, marginRight: 6 }}>🔒</span>
            <strong style={{ color: NAVY }}>Create an account</strong> to see full profiles and contact candidates
          </div>
          <Link href="/employer/onboarding" style={{ background: P, color: "white", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, textDecoration: "none" }}>
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────── */
export default function EmployerDemoPage() {
  return (
    <div style={{ fontFamily: "'DM Sans','Outfit',system-ui,sans-serif", background: "#F7F8FC", minHeight: "100vh" }}>
      {/* Demo banner */}
      <div style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #2D2D4E 100%)`, padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "white", marginBottom: 4 }}>You&apos;re previewing the Flor employer experience</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)" }}>Candidate names and contact info are hidden. Create an account and sign the Ethics Pledge to access full profiles.</div>
        </div>
        <Link href="/employer/onboarding" style={{ background: "white", color: NAVY, border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, marginLeft: 24, textDecoration: "none" }}>
          Get Full Access →
        </Link>
      </div>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "32px 24px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: NAVY, margin: 0 }}>
              Applicant Pipeline <span style={{ fontSize: 14, color: "#9CA3AF", fontWeight: 400 }}>— Preview</span>
            </h2>
            <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4, marginBottom: 0 }}>
              ICU RN — Intensive Care Unit · {DEMO_CANDIDATES.length} qualified candidates in your area
            </p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 24 }}>
          {[
            { label: "Avg Flor Fit Score", count: "87%", color: P },
            { label: "RI Licensed", count: "100%", color: GREEN },
            { label: "Median Experience", count: "6.5 yrs", color: NAVY },
            { label: "Available Now", count: `${DEMO_CANDIDATES.length}`, color: AMBER },
          ].map((s) => (
            <div key={s.label} style={{ background: "white", borderRadius: 10, padding: "14px 16px", border: "1px solid #ECEEF8" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.count}</div>
              <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Value prop */}
        <div style={{ background: "white", border: `1.5px solid ${P}20`, borderRadius: 12, padding: "16px 20px", marginBottom: 24, display: "flex", gap: 16, alignItems: "flex-start" }}>
          <span style={{ fontSize: 24, flexShrink: 0 }}>✿</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 4 }}>Why hire through Flor?</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 24px" }}>
              {["Direct hire — no agency fees", "Flor Fit scores by specialty & certs", "Nurses who want permanent roles", "Ethics Pledge protects your reputation"].map((t) => (
                <div key={t} style={{ fontSize: 13, color: "#6B7280", display: "flex", gap: 6 }}><span style={{ color: GREEN }}>✓</span>{t}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Demo candidates */}
        {DEMO_CANDIDATES.map((c) => <DemoCandidateCard key={c.id} c={c} />)}

        {/* Bottom CTA */}
        <div style={{ background: NAVY, borderRadius: 16, padding: "28px 32px", textAlign: "center", marginTop: 8 }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: "white", marginBottom: 8 }}>Ready to hire without the middleman?</div>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,.6)", marginBottom: 20 }}>
            Create your account, verify your facility, and sign the Ethics Pledge to access full candidate profiles and post jobs.
          </p>
          <Link href="/employer/onboarding" style={{ display: "inline-block", background: P, color: "white", border: "none", borderRadius: 12, padding: "14px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer", textDecoration: "none" }}>
            Create Employer Account →
          </Link>
        </div>
      </div>
    </div>
  );
}
