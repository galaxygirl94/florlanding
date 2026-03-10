"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/* ── Colors ────────────────────────────────────────────────────── */
const P = "#8B8FD4";
const NAVY = "#1E1E2E";
const GREEN = "#059669";

/* ── Data ──────────────────────────────────────────────────────── */
const PLEDGE_ITEMS = [
  { id: "pay", title: "Transparent Pay", body: "I will post accurate, complete pay ranges — base, differentials, and bonuses — before nurses apply. No surprises at offer." },
  { id: "ratio", title: "Honest Staffing Ratios", body: "I will disclose verified patient-to-nurse ratios and commit to maintaining posted staffing levels." },
  { id: "real", title: "Real Job Postings Only", body: "Every role posted is a genuine, currently open position. I will remove postings within 24 hours of filling or closing." },
  { id: "direct", title: "Direct Hiring", body: "I will not use Flor listings to collect nurse data for third-party agencies. All hires are direct-to-facility." },
  { id: "respond", title: "Timely Communication", body: "I commit to responding to all applicants — including rejections — within 10 business days of application." },
];

const ONBOARDING_STEPS = ["Facility Info", "Verification", "Ethics Pledge", "Done"];

/* ── Step Indicator ────────────────────────────────────────────── */
function StepIndicator({ current }: { current: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 36 }}>
      {ONBOARDING_STEPS.map((s, i) => {
        const done = i < current;
        const active = i === current;
        const last = i === ONBOARDING_STEPS.length - 1;
        return (
          <div key={s} style={{ display: "flex", alignItems: "center", flex: last ? 0 : 1 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: done ? P : active ? NAVY : "#E2E4F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: done || active ? "white" : "#9CA3AF" }}>
                {done ? "✓" : i + 1}
              </div>
              <span style={{ fontSize: 11, fontWeight: active ? 700 : 400, color: active ? NAVY : done ? P : "#9CA3AF", whiteSpace: "nowrap" }}>{s}</span>
            </div>
            {!last && <div style={{ height: 2, flex: 1, background: done ? P : "#E2E4F0", margin: "0 4px 14px" }} />}
          </div>
        );
      })}
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────── */
export default function EmployerOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [verified, setVerified] = useState(false);
  const [agreed, setAgreed] = useState<Record<string, boolean>>({});
  const [signed, setSigned] = useState("");
  const allChecked = PLEDGE_ITEMS.every((p) => agreed[p.id]);
  const canSign = allChecked && signed.trim().length > 2;

  return (
    <div style={{ fontFamily: "'DM Sans','Outfit',system-ui,sans-serif", minHeight: "100vh", background: "#F7F8FC", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "white", borderRadius: 20, padding: 40, width: "100%", maxWidth: 560, boxShadow: "0 8px 32px rgba(30,30,46,.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: NAVY }}>✿ FLOR</div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#9CA3AF" }}>EMPLOYER SETUP</div>
        </div>

        <StepIndicator current={step} />

        {/* Step 0: Facility Info */}
        {step === 0 && (
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: NAVY, marginBottom: 4 }}>Tell us about your facility</div>
            <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 24 }}>This will appear on your job listings.</p>
            {([["FACILITY NAME", "Brown University Health"], ["NPI NUMBER", "1234567890"], ["FACILITY TYPE", "Hospital"], ["PRIMARY CONTACT EMAIL", "hr@brownhealth.org"]] as const).map(([label, val]) => (
              <div key={label} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", letterSpacing: "0.08em" }}>{label}</label>
                <input defaultValue={val} style={{ display: "block", width: "100%", borderRadius: 8, border: "1px solid #E0E1F4", padding: "10px 12px", fontSize: 14, marginTop: 5, boxSizing: "border-box", outline: "none" }} />
              </div>
            ))}
            <button onClick={() => setStep(1)} style={{ width: "100%", background: P, color: "white", border: "none", borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 700, cursor: "pointer", marginTop: 8 }}>Continue →</button>
          </div>
        )}

        {/* Step 1: Verification */}
        {step === 1 && (
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: NAVY, marginBottom: 4 }}>Verify your facility</div>
            <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 24 }}>Flor verifies all employers before they can post — this protects nurses from fake listings.</p>
            <div style={{ background: "#F9FAFB", borderRadius: 12, padding: "18px 20px", marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 10 }}>NPI Lookup</div>
              <div style={{ display: "flex", gap: 10 }}>
                <input defaultValue="1234567890" style={{ flex: 1, borderRadius: 8, border: "1px solid #E0E1F4", padding: "9px 12px", fontSize: 14, outline: "none" }} />
                <button onClick={() => setVerified(true)} style={{ background: verified ? GREEN : P, color: "white", border: "none", borderRadius: 8, padding: "9px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                  {verified ? "✓ Verified" : "Verify NPI"}
                </button>
              </div>
              {verified && <div style={{ marginTop: 10, fontSize: 13, color: GREEN, fontWeight: 600 }}>✓ Brown University Health — Providence, RI — Hospital confirmed</div>}
            </div>
            <div style={{ background: "#F0F0FA", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#6B7280", marginBottom: 24 }}>
              <strong style={{ color: NAVY }}>Why we verify:</strong> Nurses on Flor have been burned by ghost employers. Verification protects them — and your reputation.
            </div>
            <button onClick={() => setStep(2)} disabled={!verified} style={{ width: "100%", background: verified ? P : "#E2E4F0", color: verified ? "white" : "#9CA3AF", border: "none", borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 700, cursor: verified ? "pointer" : "not-allowed" }}>Continue →</button>
          </div>
        )}

        {/* Step 2: Ethics Pledge */}
        {step === 2 && (
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: NAVY, marginBottom: 4 }}>The Flor Ethics Pledge</div>
            <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.6, marginBottom: 6 }}>Nurses choose Flor because they&apos;ve been lied to everywhere else. Read each commitment carefully.</p>
            <div style={{ fontSize: 13, color: P, fontWeight: 600, marginBottom: 20 }}>This is not a checkbox. This is a commitment.</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {PLEDGE_ITEMS.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setAgreed((a) => ({ ...a, [item.id]: !a[item.id] }))}
                  style={{ background: agreed[item.id] ? "#F0FDF4" : "white", border: `1.5px solid ${agreed[item.id] ? "#86EFAC" : "#E0E1F4"}`, borderRadius: 12, padding: "14px 16px", cursor: "pointer", transition: "all .2s", display: "flex", gap: 12, alignItems: "flex-start" }}
                >
                  <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${agreed[item.id] ? GREEN : "#C0C4D6"}`, background: agreed[item.id] ? GREEN : "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    {agreed[item.id] && <span style={{ color: "white", fontSize: 13, fontWeight: 800 }}>✓</span>}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 2 }}>{item.title}</div>
                    <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>{item.body}</div>
                  </div>
                </div>
              ))}
            </div>
            {allChecked && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#6B7280", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>SIGN YOUR NAME TO COMPLETE THE PLEDGE</label>
                <input
                  value={signed}
                  onChange={(e) => setSigned(e.target.value)}
                  placeholder="Type your full name"
                  style={{ width: "100%", borderRadius: 8, border: `1.5px solid ${signed.trim().length > 2 ? "#86EFAC" : "#E0E1F4"}`, padding: "11px 14px", fontSize: 16, fontFamily: "Georgia,serif", outline: "none", boxSizing: "border-box", color: NAVY, fontStyle: "italic" }}
                />
                {signed.trim().length > 2 && <div style={{ fontSize: 12, color: GREEN, marginTop: 5 }}>✓ &quot;{signed}&quot; — recorded with timestamp</div>}
              </div>
            )}
            <button onClick={() => setStep(3)} disabled={!canSign} style={{ width: "100%", background: canSign ? NAVY : "#E2E4F0", color: canSign ? "white" : "#9CA3AF", border: "none", borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 700, cursor: canSign ? "pointer" : "not-allowed" }}>
              {canSign ? "I Commit to the Flor Ethics Pledge →" : "Agree to all commitments to continue"}
            </button>
          </div>
        )}

        {/* Step 3: Done */}
        {step === 3 && (
          <div style={{ textAlign: "center", paddingTop: 16 }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>✿</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: NAVY, marginBottom: 8 }}>Welcome to Flor</div>
            <p style={{ fontSize: 15, color: "#6B7280", lineHeight: 1.6, maxWidth: 380, margin: "0 auto 28px" }}>Your Ethics Pledge is on record. Nurses will see your facility as verified and committed to transparency.</p>
            <div style={{ background: "#F0FDF4", border: "1px solid #A7F3D0", borderRadius: 12, padding: "16px 20px", marginBottom: 28, textAlign: "left" }}>
              {["Post listings with verified pay and ratios", "Access full candidate profiles and Flor Fit scores", "Request interviews directly", "Ethics Pledge badge on all your listings"].map((t) => (
                <div key={t} style={{ fontSize: 13, color: "#374151", display: "flex", gap: 8, marginBottom: 5 }}><span style={{ color: GREEN }}>✓</span>{t}</div>
              ))}
            </div>
            <button onClick={() => router.push("/employer")} style={{ background: P, color: "white", border: "none", borderRadius: 12, padding: "14px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
              Enter Employer Portal →
            </button>
          </div>
        )}

        {step < 3 && (
          <button
            onClick={step === 0 ? () => router.back() : () => setStep((s) => s - 1)}
            style={{ display: "block", margin: "12px auto 0", background: "none", border: "none", color: "#9CA3AF", fontSize: 13, cursor: "pointer" }}
          >
            ← {step === 0 ? "Back" : "Previous step"}
          </button>
        )}
      </div>
    </div>
  );
}
