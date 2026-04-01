"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const C = {
  periwinkle: "#7B8CDE",
  navy: "#1B2A6B",
  rose: "#E8A0B4",
  success: "#10B981",
  amber: "#F59E0B",
  red: "#EF4444",
  muted: "#6B7280",
  border: "#E5E7EB",
  bg: "#F9FAFB",
};

interface NurseProfile {
  first_name?: string;
  last_name?: string;
  specialty?: string;
  license_type?: string;
  license_state?: string;
  years_experience?: string;
  preferred_settings?: string[];
  employment_types?: string[];
  start_availability?: string;
  languages_spoken?: string[];
  onboarding_complete?: boolean;
  is_founding_nurse?: boolean;
  profile_view_count?: number;
  profile_views_this_week?: number;
  job_alerts_enabled?: boolean;
}

interface Notification {
  id: string;
  text: string;
  sub_text?: string;
  icon?: string;
  type?: string;
  unread: boolean;
  created_at: string;
}

interface VerificationStatus {
  verification_status?: string;
  flor_verified?: boolean;
  license_status?: string;
  has_discipline?: boolean;
}

// ── Profile completeness ──────────────────────────────────────────────────────
function computeCompleteness(p: NurseProfile): { score: number; missing: string[] } {
  const checks: [boolean, string][] = [
    [!!(p.first_name && p.last_name), "Add your name"],
    [!!p.specialty, "Add your specialty"],
    [!!p.license_type && !!p.license_state, "Add license details"],
    [!!p.years_experience, "Add years of experience"],
    [!!(p.preferred_settings?.length), "Add preferred settings"],
    [!!(p.employment_types?.length), "Add employment types"],
    [!!p.start_availability, "Add availability"],
  ];
  const done = checks.filter(([v]) => v).length;
  return {
    score: Math.round((done / checks.length) * 100),
    missing: checks.filter(([v]) => !v).map(([, label]) => label),
  };
}

// ── What to expect timeline ───────────────────────────────────────────────────
const TIMELINE = [
  { icon: "✅", label: "Profile created", done: true },
  { icon: "🔍", label: "License verified", done: false, key: "verified" },
  { icon: "👀", label: "Employers can view your profile", done: false, key: "visible" },
  { icon: "💬", label: "First interview request", done: false },
  { icon: "🌸", label: "Your first shift on Flor", done: false },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [profile, setProfile] = useState<NurseProfile | null>(null);
  const [verif, setVerif] = useState<VerificationStatus | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertsToggling, setAlertsToggling] = useState(false);

  const nurseId =
    user?.email ??
    (typeof window !== "undefined" ? localStorage.getItem("flor_nurse_email") : "") ??
    "";

  // Auth guard
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("flor_user");
      if (!stored) router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    if (!nurseId) return;
    async function load() {
      setLoading(true);
      try {
        const [pRes, vRes, nRes] = await Promise.all([
          fetch(`/api/nurse/profile?nurse_id=${encodeURIComponent(nurseId)}`),
          fetch(`/api/nurse/verification-status?nurse_id=${encodeURIComponent(nurseId)}`),
          fetch(`/api/nurse/notifications?nurse_id=${encodeURIComponent(nurseId)}`),
        ]);
        const [p, v, n] = await Promise.all([pRes.json(), vRes.json(), nRes.json()]);
        setProfile(p);
        setVerif(v);
        setNotifications(Array.isArray(n) ? n : []);
      } catch {
        // non-blocking
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [nurseId]);

  async function toggleAlerts() {
    if (!nurseId || !profile) return;
    setAlertsToggling(true);
    const next = !profile.job_alerts_enabled;
    try {
      await fetch("/api/nurse/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nurse_id: nurseId, job_alerts_enabled: next }),
      });
      setProfile((p) => p ? { ...p, job_alerts_enabled: next } : p);
    } catch {
      // non-blocking
    } finally {
      setAlertsToggling(false);
    }
  }

  const firstName = profile?.first_name || user?.firstName || "there";
  const completeness = profile ? computeCompleteness(profile) : { score: 0, missing: [] };
  const isVerified = verif?.flor_verified ?? false;
  const unreadCount = notifications.filter((n) => n.unread).length;

  const timelineItems = TIMELINE.map((t) => ({
    ...t,
    done:
      t.done ||
      (t.key === "verified" && isVerified) ||
      (t.key === "visible" && isVerified),
  }));

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #F0F2FC 0%, #FDF6F9 100%)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 40,
              height: 40,
              border: `3px solid ${C.periwinkle}`,
              borderTopColor: "transparent",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 12px",
            }}
          />
          <p style={{ color: C.muted, fontSize: 14 }}>Loading your dashboard…</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #F0F2FC 0%, #FDF6F9 100%)",
        padding: "0 0 80px",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          background: "#fff",
          borderBottom: `1px solid ${C.border}`,
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <span style={{ fontSize: 22, fontWeight: 800, color: C.navy, letterSpacing: "-0.02em" }}>
          flor<span style={{ color: C.periwinkle }}>.</span>
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link
            href="/profile"
            style={{
              fontSize: 13,
              color: C.muted,
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Edit profile
          </Link>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: C.periwinkle,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            {firstName.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 16px" }}>
        {/* Hero greeting */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: C.navy, marginBottom: 4 }}>
            Hey, {firstName} 👋
          </h1>
          <p style={{ fontSize: 14, color: C.muted }}>
            {isVerified
              ? "Your profile is live. Employers can find you now."
              : "Finish setting up your profile to start getting matched."}
          </p>
        </div>

        {/* Badges row */}
        {(isVerified || profile?.is_founding_nurse) && (
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            {isVerified && (
              <span
                style={{
                  background: "#ECFDF5",
                  color: "#065F46",
                  border: "1px solid #6EE7B7",
                  borderRadius: 20,
                  padding: "4px 12px",
                  fontSize: 12,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                ✅ Flor Verified
              </span>
            )}
            {profile?.is_founding_nurse && (
              <span
                style={{
                  background: "linear-gradient(90deg, #FEF3C7, #FDE68A)",
                  color: "#78350F",
                  border: "1px solid #FCD34D",
                  borderRadius: 20,
                  padding: "4px 12px",
                  fontSize: 12,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                🌸 Founding Nurse
              </span>
            )}
          </div>
        )}

        {/* Stats row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12,
            marginBottom: 24,
          }}
        >
          {[
            {
              label: "Profile views",
              value: profile?.profile_view_count ?? 0,
              sub: `${profile?.profile_views_this_week ?? 0} this week`,
              icon: "👀",
            },
            {
              label: "Job matches",
              value: 0,
              sub: "Coming soon",
              icon: "💼",
            },
            {
              label: "Notifications",
              value: unreadCount,
              sub: unreadCount === 0 ? "All caught up" : `${unreadCount} unread`,
              icon: "🔔",
            },
          ].map(({ label, value, sub, icon }) => (
            <div
              key={label}
              style={{
                background: "#fff",
                borderRadius: 14,
                padding: "16px 14px",
                boxShadow: "0 1px 8px rgba(27,42,107,0.05)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 22 }}>{icon}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.navy, lineHeight: 1.2, marginTop: 4 }}>
                {value}
              </div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{label}</div>
              <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2 }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* License status card */}
        <div
          style={{
            background: isVerified ? "#ECFDF5" : "#FFFBEB",
            border: `1px solid ${isVerified ? "#6EE7B7" : "#FDE68A"}`,
            borderRadius: 14,
            padding: "16px 18px",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 22 }}>{isVerified ? "✅" : "⏳"}</span>
            <div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: isVerified ? "#065F46" : "#92400E",
                }}
              >
                {isVerified ? "License verified" : "License not yet verified"}
              </div>
              <div style={{ fontSize: 12, color: isVerified ? "#047857" : "#B45309" }}>
                {isVerified
                  ? `${profile?.license_type ?? "RN"} · ${profile?.license_state ?? ""} · Active`
                  : "Verify your license to unlock the Flor Verified badge"}
              </div>
            </div>
          </div>
          {!isVerified && (
            <Link
              href="/onboarding#verify"
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: C.periwinkle,
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              Verify →
            </Link>
          )}
        </div>

        {/* Profile completeness */}
        {completeness.score < 100 && (
          <div
            style={{
              background: "#fff",
              borderRadius: 14,
              padding: "18px 18px",
              marginBottom: 20,
              boxShadow: "0 1px 8px rgba(27,42,107,0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>
                Profile completeness
              </span>
              <span style={{ fontSize: 13, fontWeight: 800, color: C.periwinkle }}>
                {completeness.score}%
              </span>
            </div>
            <div
              style={{
                height: 6,
                background: "#E5E7EB",
                borderRadius: 3,
                overflow: "hidden",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${completeness.score}%`,
                  background: `linear-gradient(90deg, ${C.periwinkle}, ${C.rose})`,
                  borderRadius: 3,
                  transition: "width 0.6s ease",
                }}
              />
            </div>
            {completeness.missing.slice(0, 3).map((m) => (
              <div
                key={m}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 12,
                  color: C.muted,
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    border: `1.5px solid ${C.border}`,
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                {m}
              </div>
            ))}
            <Link
              href="/profile"
              style={{
                display: "block",
                marginTop: 10,
                textAlign: "center",
                fontSize: 13,
                fontWeight: 700,
                color: C.periwinkle,
                textDecoration: "none",
              }}
            >
              Complete your profile →
            </Link>
          </div>
        )}

        {/* What to expect timeline */}
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            padding: "18px 18px",
            marginBottom: 20,
            boxShadow: "0 1px 8px rgba(27,42,107,0.05)",
          }}
        >
          <h3 style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 14 }}>
            What to expect
          </h3>
          {timelineItems.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                marginBottom: i < timelineItems.length - 1 ? 14 : 0,
                position: "relative",
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: item.done ? "#ECFDF5" : "#F3F4F6",
                  border: `1.5px solid ${item.done ? "#6EE7B7" : "#E5E7EB"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  flexShrink: 0,
                }}
              >
                {item.done ? "✓" : item.icon}
              </div>
              <div style={{ paddingTop: 4 }}>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: item.done ? 600 : 400,
                    color: item.done ? C.navy : C.muted,
                  }}
                >
                  {item.label}
                </span>
              </div>
              {i < timelineItems.length - 1 && (
                <div
                  style={{
                    position: "absolute",
                    left: 14,
                    top: 32,
                    width: 1.5,
                    height: 14,
                    background: item.done ? "#6EE7B7" : "#E5E7EB",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Job matches */}
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            padding: "18px 18px",
            marginBottom: 20,
            boxShadow: "0 1px 8px rgba(27,42,107,0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 14,
            }}
          >
            <h3 style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Job matches</h3>
          </div>
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>💼</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 4 }}>
              No matches yet
            </div>
            <p style={{ fontSize: 13, color: C.muted, maxWidth: 320, margin: "0 auto" }}>
              We&apos;re building Flor&apos;s employer network right now. You&apos;ll be notified the
              moment a job matches your profile.
            </p>
          </div>
          {/* Job alerts toggle */}
          <div
            style={{
              borderTop: `1px solid ${C.border}`,
              paddingTop: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>Job alerts</div>
              <div style={{ fontSize: 12, color: C.muted }}>
                Get emailed when new matches come in
              </div>
            </div>
            <button
              onClick={toggleAlerts}
              disabled={alertsToggling}
              style={{
                width: 44,
                height: 24,
                borderRadius: 12,
                background: profile?.job_alerts_enabled ? C.periwinkle : "#D1D5DB",
                border: "none",
                cursor: alertsToggling ? "not-allowed" : "pointer",
                position: "relative",
                transition: "background 0.2s",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "#fff",
                  position: "absolute",
                  top: 3,
                  left: profile?.job_alerts_enabled ? 23 : 3,
                  transition: "left 0.2s",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                }}
              />
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            padding: "18px 18px",
            marginBottom: 20,
            boxShadow: "0 1px 8px rgba(27,42,107,0.05)",
          }}
        >
          <h3 style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 14 }}>
            Notifications
            {unreadCount > 0 && (
              <span
                style={{
                  marginLeft: 8,
                  background: C.rose,
                  color: "#fff",
                  borderRadius: 10,
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "1px 7px",
                }}
              >
                {unreadCount}
              </span>
            )}
          </h3>
          {notifications.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>🌸</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 4 }}>
                You&apos;re all caught up
              </div>
              <div style={{ fontSize: 12, color: "#9CA3AF" }}>
                Notifications will show up here.
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {notifications.slice(0, 5).map((notif) => (
                <div
                  key={notif.id}
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                    padding: "10px 12px",
                    borderRadius: 10,
                    background: notif.unread ? "#F0F2FC" : "#FAFAFA",
                    border: `1px solid ${notif.unread ? "#C7CEFA" : "#F3F4F6"}`,
                  }}
                >
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{notif.icon ?? "🔔"}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: notif.unread ? 600 : 400, color: C.navy }}>
                      {notif.text}
                    </div>
                    {notif.sub_text && (
                      <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                        {notif.sub_text}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RI nurse count micro-moment */}
        <div
          style={{
            background: "linear-gradient(135deg, #EEF0FB, #FDF6F9)",
            borderRadius: 14,
            padding: "18px 20px",
            border: `1px solid #E0E4F7`,
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 13, color: C.navy, fontWeight: 500 }}>
            🌸 You&apos;re one of the first nurses on Flor in Rhode Island.
            <br />
            <span style={{ color: C.muted, fontWeight: 400 }}>
              Early members get first access to jobs and founding perks.
            </span>
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
