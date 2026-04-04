"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured, ApplicationRow } from "@/lib/supabase";
import { seedJobs } from "@/data/seed-jobs";
import { JobListing } from "@/data/types";

/* ── Colors ────────────────────────────────────────────────────── */
const P = "#8B8FD4";
const NAVY = "#1E1E2E";
const GREEN = "#059669";
const TEAL = "#0D9488";

/* ── Pipeline config ───────────────────────────────────────────── */
const PIPELINE = ["Applied", "Under Review", "Viewed", "Interview", "Offer"];

const STATUS_CONFIG: Record<string, { color: string; bg: string; index: number }> = {
  Applied:        { color: P,         bg: "#F0F0FA", index: 0 },
  "Under Review": { color: "#F59E0B", bg: "#FFFBEB", index: 1 },
  Viewed:         { color: "#3B82F6", bg: "#EFF6FF", index: 2 },
  Interview:      { color: "#10B981", bg: "#ECFDF5", index: 3 },
  Offer:          { color: GREEN,     bg: "#D1FAE5", index: 4 },
};

type EnrichedApplication = ApplicationRow & { job: JobListing | null };

function getNudge(app: ApplicationRow): { text: string; type: "action" | "info" | "neutral" } {
  const daysSince = Math.floor(
    (Date.now() - new Date(app.applied_at).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (app.status === "Interview") return { text: "Interview request received — check your messages", type: "action" };
  if (app.status === "Offer") return { text: "You have an offer — review it now", type: "action" };
  if (app.status === "Viewed") return { text: `Employer viewed your profile ${daysSince} day${daysSince !== 1 ? "s" : ""} ago`, type: "info" };
  if (app.status === "Under Review") return { text: "Application is under review", type: "info" };
  return { text: "Most employers respond within 5–7 days", type: "neutral" };
}

/* ── Skeleton loader ────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div style={{ background: "white", borderRadius: 14, padding: "20px 24px", border: "1px solid #ECEEF8", marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ flex: 1 }}>
          <div style={{ height: 18, width: "55%", background: "#F0F1F8", borderRadius: 6, marginBottom: 8, animation: "pulse 1.5s ease-in-out infinite" }} />
          <div style={{ height: 14, width: "40%", background: "#F0F1F8", borderRadius: 6, marginBottom: 6, animation: "pulse 1.5s ease-in-out infinite" }} />
          <div style={{ height: 12, width: "30%", background: "#F0F1F8", borderRadius: 6, animation: "pulse 1.5s ease-in-out infinite" }} />
        </div>
        <div style={{ width: 56, height: 56, background: "#F0F1F8", borderRadius: 8, animation: "pulse 1.5s ease-in-out infinite" }} />
      </div>
    </div>
  );
}

/* ── Empty state ────────────────────────────────────────────────── */
function EmptyState() {
  return (
    <div>
      <div style={{ textAlign: "center", padding: "40px 0 32px" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🌱</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: NAVY, margin: "0 0 8px" }}>No applications yet</h2>
        <p style={{ fontSize: 15, color: "#6B7280", maxWidth: 400, margin: "0 auto 32px" }}>
          Browse open roles and hit Apply — your tracker will show every step from there.
        </p>
        <Link href="/jobs" style={{ display: "inline-block", background: P, color: "white", borderRadius: 24, padding: "12px 28px", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
          Browse Jobs →
        </Link>
      </div>

      <div style={{ height: 1, background: "#F0F1F8", margin: "8px 0 32px" }} />

      <h3 style={{ fontSize: 16, fontWeight: 700, color: NAVY, margin: "0 0 16px" }}>While you wait</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
        {/* Card 1 — Complete profile */}
        <Link href="/nurse-profile" style={{ textDecoration: "none" }}>
          <div style={{ background: "white", borderRadius: 14, padding: "20px", border: "1px solid #ECEEF8", cursor: "pointer", transition: "box-shadow 0.2s", height: "100%" }}>
            <div style={{ fontSize: 24, marginBottom: 10 }}>✅</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 6 }}>Complete your profile</div>
            <p style={{ fontSize: 13, color: "#6B7280", margin: 0, lineHeight: 1.5 }}>
              A complete profile gets your application seen first. Add your license, specialty, and experience.
            </p>
          </div>
        </Link>

        {/* Card 2 — Interview Intel */}
        <Link href="/interview-intel" style={{ textDecoration: "none" }}>
          <div style={{ background: "white", borderRadius: 14, padding: "20px", border: "1px solid #ECEEF8", cursor: "pointer", transition: "box-shadow 0.2s", height: "100%" }}>
            <div style={{ fontSize: 24, marginBottom: 10 }}>🎯</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 6 }}>Prep for your interview</div>
            <p style={{ fontSize: 13, color: "#6B7280", margin: 0, lineHeight: 1.5 }}>
              Real questions from RI facilities, with nurse-tested answers. Know what&apos;s coming before you walk in.
            </p>
          </div>
        </Link>

        {/* Card 3 — Pay Intel */}
        <Link href="/pay-intelligence" style={{ textDecoration: "none" }}>
          <div style={{ background: "white", borderRadius: 14, padding: "20px", border: "1px solid #ECEEF8", cursor: "pointer", transition: "box-shadow 0.2s", height: "100%" }}>
            <div style={{ fontSize: 24, marginBottom: 10 }}>💰</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 6 }}>Know your worth</div>
            <p style={{ fontSize: 13, color: "#6B7280", margin: 0, lineHeight: 1.5 }}>
              See what RNs and CNAs are actually making in Rhode Island — by specialty and setting.
            </p>
          </div>
        </Link>

        {/* Card 4 — Travel Off-Ramp */}
        <Link href="/travel-off-ramp" style={{ textDecoration: "none" }}>
          <div style={{ background: "linear-gradient(135deg, #F0FDFA 0%, #CCFBF1 100%)", borderRadius: 14, padding: "20px", border: "1px solid #99F6E4", cursor: "pointer", transition: "box-shadow 0.2s", height: "100%" }}>
            <div style={{ fontSize: 24, marginBottom: 10 }}>🧳 → 🏠</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#134E4A", marginBottom: 6 }}>Thinking about going staff?</div>
            <p style={{ fontSize: 13, color: "#0F766E", margin: 0, lineHeight: 1.5 }}>
              See how a staff position with PSLF stacks up against your current travel package. The math might surprise you.
            </p>
            <div style={{ marginTop: 12, fontSize: 12, fontWeight: 700, color: TEAL }}>Try the Calculator →</div>
          </div>
        </Link>
      </div>
    </div>
  );
}

/* ── Pipeline bar ──────────────────────────────────────────────── */
function PipelineBar({ status }: { status: string }) {
  const activeIndex = STATUS_CONFIG[status]?.index ?? 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginTop: 12 }}>
      {PIPELINE.map((stage, i) => {
        const isActive = i === activeIndex;
        const isPast = i < activeIndex;
        const isLast = i === PIPELINE.length - 1;
        return (
          <div key={stage} style={{ display: "flex", alignItems: "center", flex: isLast ? 0 : 1 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{
                width: isActive ? 10 : 8, height: isActive ? 10 : 8,
                borderRadius: "50%",
                background: isActive ? STATUS_CONFIG[status].color : isPast ? P : "#E2E4F0",
                border: isActive ? `2px solid ${STATUS_CONFIG[status].color}` : "none",
                boxShadow: isActive ? `0 0 0 3px ${STATUS_CONFIG[status].bg}` : "none",
                transition: "all 0.2s",
              }} />
              <span style={{
                fontSize: 10, fontWeight: isActive ? 700 : 400,
                color: isActive ? STATUS_CONFIG[status].color : isPast ? "#6B7280" : "#C0C4D6",
                whiteSpace: "nowrap", letterSpacing: "0.02em",
              }}>
                {stage}
              </span>
            </div>
            {!isLast && (
              <div style={{
                height: 2, flex: 1,
                background: isPast ? P : "#E2E4F0",
                marginBottom: 14, marginLeft: 2, marginRight: 2, borderRadius: 1,
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Nudge pill ────────────────────────────────────────────────── */
function NudgePill({ text, type }: { text: string; type: string }) {
  const styles: Record<string, { bg: string; color: string; icon: string }> = {
    action:  { bg: "#ECFDF5", color: GREEN,     icon: "→" },
    info:    { bg: "#EFF6FF", color: "#3B82F6", icon: "●" },
    neutral: { bg: "#F9FAFB", color: "#9CA3AF", icon: "○" },
  };
  const s = styles[type] || styles.neutral;
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: s.bg, color: s.color, borderRadius: 20,
      padding: "3px 10px", fontSize: 12,
      fontWeight: type === "action" ? 600 : 400, marginTop: 8,
    }}>
      <span style={{ fontSize: 10 }}>{s.icon}</span>
      {text}
    </div>
  );
}

/* ── Application card ──────────────────────────────────────────── */
function ApplicationCard({ app }: { app: EnrichedApplication }) {
  const cfg = STATUS_CONFIG[app.status];
  const nudge = getNudge(app);
  const daysSince = Math.floor(
    (Date.now() - new Date(app.applied_at).getTime()) / (1000 * 60 * 60 * 24)
  );
  const payLabel = app.job
    ? `$${app.job.payRange.min}–$${app.job.payRange.max}/${app.job.payUnit}`
    : "";

  return (
    <div style={{ background: "white", borderRadius: 14, padding: "20px 24px", border: "1px solid #ECEEF8", boxShadow: "0 1px 4px rgba(139,143,212,0.06)", marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: NAVY }}>
            {app.job ? app.job.title : app.job_id}
          </div>
          <div style={{ fontSize: 14, color: "#6B7280", marginTop: 2 }}>
            {app.job?.facilityName ?? "—"} · {app.job ? `${app.job.location.city}, ${app.job.location.state}` : ""}
          </div>
          <div style={{ fontSize: 13, color: "#9CA3AF", marginTop: 2 }}>
            {payLabel}{payLabel ? " · " : ""}Applied {daysSince} day{daysSince !== 1 ? "s" : ""} ago
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            background: cfg?.bg ?? "#F0F0FA",
            color: cfg?.color ?? P,
            borderRadius: 20, padding: "4px 12px",
            fontSize: 12, fontWeight: 600, whiteSpace: "nowrap",
          }}>
            {app.status}
          </div>
        </div>
      </div>
      <PipelineBar status={app.status} />
      <NudgePill text={nudge.text} type={nudge.type} />
    </div>
  );
}

/* ── Tracker view ──────────────────────────────────────────────── */
function TrackerView({ apps }: { apps: EnrichedApplication[] }) {
  const actionable = apps.filter((a) => getNudge(a).type === "action").length;
  const sorted = [...apps].sort((a, b) => {
    const order = { action: 0, info: 1, neutral: 2 };
    return (order[getNudge(a).type] ?? 2) - (order[getNudge(b).type] ?? 2);
  });

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: NAVY, margin: 0 }}>Application Tracker</h2>
        <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4, marginBottom: 0 }}>
          {apps.length} active application{apps.length !== 1 ? "s" : ""}
          {actionable > 0 && (
            <span style={{ color: GREEN, fontWeight: 600 }}>
              {" "}· {actionable} need{actionable === 1 ? "s" : ""} your attention
            </span>
          )}
        </p>
      </div>
      {sorted.map((app) => <ApplicationCard key={app.id} app={app} />)}
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────── */
export default function TrackerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [apps, setApps] = useState<EnrichedApplication[]>([]);

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured()) {
        setLoading(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login?redirect=/tracker");
        return;
      }

      const { data: rows } = await supabase
        .from("applications")
        .select("*")
        .eq("nurse_id", user.id)
        .order("applied_at", { ascending: false });

      const enriched: EnrichedApplication[] = (rows ?? []).map((row: ApplicationRow) => ({
        ...row,
        job: seedJobs.find((j) => j.id === row.job_id) ?? null,
      }));

      setApps(enriched);
      setLoading(false);
    }
    load();
  }, [router]);

  return (
    <div style={{ fontFamily: "'DM Sans','Outfit',system-ui,sans-serif", background: "#F7F8FC", minHeight: "100vh" }}>
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "32px 24px" }}>
        {loading ? (
          <div>
            <div style={{ height: 28, width: 200, background: "#F0F1F8", borderRadius: 6, marginBottom: 8, animation: "pulse 1.5s ease-in-out infinite" }} />
            <div style={{ height: 14, width: 140, background: "#F0F1F8", borderRadius: 4, marginBottom: 28 }} />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : apps.length === 0 ? (
          <EmptyState />
        ) : (
          <TrackerView apps={apps} />
        )}
      </div>
    </div>
  );
}
