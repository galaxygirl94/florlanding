"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { FacilityProfile, FacilityReview, JobListing } from "@/data/types";

/* ─── Constants ─── */
const TABS = [
  "Summary",
  "FloorCheck",
  "Reviews",
  "Ask the Floor",
  "Interview Intel",
  "Open Positions",
] as const;
type Tab = (typeof TABS)[number];

const FLOR_EXCLUSIVE: Tab[] = ["FloorCheck", "Ask the Floor", "Interview Intel"];

const RATIO_OPTIONS = [
  "1:1",
  "1:2",
  "1:3",
  "1:4",
  "1:5",
  "1:6",
  "Varies by unit",
];

const INTERVIEW_FORMATS = [
  "Phone screen",
  "Video call",
  "In-person panel",
  "In-person 1-on-1",
  "Shadow shift",
  "Group interview",
  "Other",
];

const QUESTION_TYPES = [
  "Behavioral",
  "Clinical / Scenario",
  "Culture fit",
  "Experience-based",
  "Skills assessment",
];

const RATING_LABELS: Record<number, string> = {
  5: "Smooth and respectful",
  4: "Positive overall",
  3: "Neutral",
  2: "Some concerns",
  1: "Do not recommend",
};

/* ─── Seed questions for Ask the Floor ─── */
const SEED_QUESTIONS = [
  {
    id: "aq-1",
    question: "What's the call ratio on nights?",
    answer: "We typically do 1 call shift per 6 weeks on nights. It's fairly predictable and you can swap with colleagues.",
    answeredBy: "verified nurse",
    date: "2026-01-15",
    anonymous: false,
  },
  {
    id: "aq-2",
    question: "Is parking covered?",
    answer: "Parking is subsidized — $40/month for the garage, but the shuttle lot is free.",
    answeredBy: "facility",
    date: "2026-02-01",
    anonymous: false,
  },
  {
    id: "aq-3",
    question: "How is management on weekends?",
    answer: null,
    answeredBy: null,
    date: "2026-02-10",
    anonymous: true,
  },
  {
    id: "aq-4",
    question: "What's the float pool policy?",
    answer: "Float pool nurses rotate through Med/Surg, Tele, and Ortho. You get a differential and first pick on overtime shifts.",
    answeredBy: "verified nurse",
    date: "2025-12-20",
    anonymous: false,
  },
];

/* ─── Helper: star rendering ─── */
function Stars({ rating, size = "text-base" }: { rating: number; size?: string }) {
  return (
    <span className={`inline-flex gap-0.5 ${size}`} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= Math.round(rating) ? "text-amber" : "text-gray-300"}>
          ★
        </span>
      ))}
    </span>
  );
}

/* ─── Helper: clickable star selector ─── */
function StarSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);
  return (
    <span className="inline-flex gap-1 text-2xl cursor-pointer select-none">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          className={`transition-colors ${
            i <= (hover || value) ? "text-amber" : "text-gray-300"
          }`}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i)}
          aria-label={`${i} star${i > 1 ? "s" : ""}`}
        >
          ★
        </button>
      ))}
      {value > 0 && (
        <span className="text-sm text-text-muted ml-2 self-center">
          {RATING_LABELS[value]}
        </span>
      )}
    </span>
  );
}

/* ─── Helper: Flor petal marker ─── */
function FloralBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-bold text-periwinkle bg-periwinkle-50 px-2.5 py-1 rounded-full">
      <span className="text-sm">✿</span> {label}
    </span>
  );
}

/* ─── Helper: localStorage get/set with SSR guard ─── */
function lsGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function lsSet(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

/* ═══════════════════════════════════════════════════════════
   MAIN CLIENT COMPONENT
   ═══════════════════════════════════════════════════════════ */
interface Props {
  facility: FacilityProfile;
  jobs: JobListing[];
}

export default function FacilityClient({ facility, jobs }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("Summary");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Back link */}
      <Link
        href="/jobs"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-periwinkle hover:text-periwinkle-dark transition-colors mb-8"
      >
        <span aria-hidden>←</span> Back to jobs
      </Link>

      {/* ── Facility header ── */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text leading-tight">
          {facility.name}
        </h1>
        <div className="flex flex-wrap items-center gap-3 mt-3">
          <span className="inline-block bg-periwinkle-50 text-periwinkle-dark text-xs font-bold px-3 py-1 rounded-full">
            {facility.type}
          </span>
          <span className="text-text-muted text-sm">
            {facility.location.address || `${facility.location.city}, ${facility.location.state}`}
          </span>
          <span className="flex items-center gap-1 text-sm font-semibold text-text">
            <Stars rating={facility.starRating} size="text-sm" />
            <span className="ml-0.5">{facility.starRating.toFixed(1)}</span>
          </span>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div className="flex flex-wrap gap-1 border-b border-periwinkle-100/40 mb-8">
        {TABS.map((tab) => {
          const isExclusive = FLOR_EXCLUSIVE.includes(tab);
          const isActive = tab === activeTab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-4 py-2.5 text-sm font-semibold transition-colors rounded-t-lg whitespace-nowrap ${
                isActive
                  ? "text-periwinkle-dark bg-periwinkle-50 border border-periwinkle-100/40 border-b-transparent -mb-px"
                  : "text-text-muted hover:text-text hover:bg-gray-50"
              }`}
            >
              {isExclusive && <span className="mr-1 text-xs">✿</span>}
              {tab}
            </button>
          );
        })}
      </div>

      {/* ── Tab content ── */}
      {activeTab === "Summary" && <SummaryTab facility={facility} />}
      {activeTab === "FloorCheck" && <FloorCheckTab facility={facility} jobs={jobs} />}
      {activeTab === "Reviews" && <ReviewsTab facility={facility} />}
      {activeTab === "Ask the Floor" && <AskTheFloorTab facility={facility} />}
      {activeTab === "Interview Intel" && <InterviewIntelTab facility={facility} />}
      {activeTab === "Open Positions" && <OpenPositionsTab facility={facility} jobs={jobs} />}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TAB 1 — Summary
   ═══════════════════════════════════════════════════════════ */
function SummaryTab({ facility }: { facility: FacilityProfile }) {
  const isMagnet = facility.culture?.toLowerCase().includes("magnet");
  const bedCount = 220; // demo placeholder

  return (
    <div className="space-y-6">
      {/* Description */}
      <section className="bg-white rounded-2xl border border-periwinkle-100/40 p-6 sm:p-8">
        <h2 className="text-lg font-extrabold text-text mb-3">About</h2>
        <p className="text-text-light leading-relaxed">{facility.description}</p>
      </section>

      {/* Culture */}
      <section className="bg-periwinkle-50 rounded-2xl p-6 sm:p-8">
        <h2 className="text-lg font-extrabold text-periwinkle-dark mb-3">
          Workplace Culture
        </h2>
        <p className="text-text-light leading-relaxed">{facility.culture}</p>
      </section>

      {/* Quick facts */}
      <section className="bg-white rounded-2xl border border-periwinkle-100/40 p-6 sm:p-8">
        <h2 className="text-lg font-extrabold text-text mb-4">Quick Facts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Location */}
          <div className="flex items-start gap-3">
            <span className="text-periwinkle text-xl mt-0.5">📍</span>
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                Location
              </p>
              <p className="text-sm text-text font-medium">
                {facility.location.city}, {facility.location.state}
                {facility.location.zip && ` ${facility.location.zip}`}
              </p>
            </div>
          </div>

          {/* EHR */}
          {facility.ehrSystem && (
            <div className="flex items-start gap-3">
              <span className="text-periwinkle text-xl mt-0.5">💻</span>
              <div>
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                  EHR System
                </p>
                <p className="text-sm text-text font-medium">{facility.ehrSystem}</p>
              </div>
            </div>
          )}

          {/* Bed count */}
          <div className="flex items-start gap-3">
            <span className="text-periwinkle text-xl mt-0.5">🏥</span>
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                Bed Count
              </p>
              <p className="text-sm text-text font-medium">~{bedCount} beds</p>
            </div>
          </div>

          {/* Magnet */}
          {isMagnet && (
            <div className="flex items-start gap-3">
              <span className="text-periwinkle text-xl mt-0.5">🧲</span>
              <div>
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                  Magnet Status
                </p>
                <p className="text-sm text-success font-bold">Magnet Designated</p>
              </div>
            </div>
          )}

          {/* Rating */}
          <div className="flex items-start gap-3">
            <span className="text-periwinkle text-xl mt-0.5">⭐</span>
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                Overall Rating
              </p>
              <p className="text-sm text-text font-medium">
                {facility.starRating.toFixed(1)} / 5.0
                {facility.reviewCount > 0 && (
                  <span className="text-text-muted ml-1">
                    ({facility.reviewCount} review
                    {facility.reviewCount !== 1 ? "s" : ""})
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Type */}
          <div className="flex items-start gap-3">
            <span className="text-periwinkle text-xl mt-0.5">🏷️</span>
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                Facility Type
              </p>
              <p className="text-sm text-text font-medium">{facility.type}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TAB 2 — FloorCheck
   ═══════════════════════════════════════════════════════════ */
interface RatioVerification {
  ratio: string;
  comment: string;
  date: string;
}

function FloorCheckTab({
  facility,
  jobs,
}: {
  facility: FacilityProfile;
  jobs: JobListing[];
}) {
  const storageKey = `flor-floorcheck-${facility.id}`;

  // Find a reported ratio from jobs
  const jobWithRatio = jobs.find((j) => j.patientRatio);
  const facilityRatio = jobWithRatio?.patientRatio ?? null;
  const ratioVerifiedByFacility = jobWithRatio?.patientRatioVerified ?? false;

  const [verifications, setVerifications] = useState<RatioVerification[]>([]);
  const [selectedRatio, setSelectedRatio] = useState("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setVerifications(lsGet<RatioVerification[]>(storageKey, []));
  }, [storageKey]);

  const handleSubmit = () => {
    if (!selectedRatio) return;
    const entry: RatioVerification = {
      ratio: selectedRatio,
      comment: comment.trim(),
      date: new Date().toISOString().slice(0, 10),
    };
    const updated = [...verifications, entry];
    setVerifications(updated);
    lsSet(storageKey, updated);
    setSelectedRatio("");
    setComment("");
    setSubmitted(true);
  };

  // Determine verification status
  const matchingCount = verifications.filter(
    (v) => v.ratio === facilityRatio
  ).length;
  const differingCount = verifications.filter(
    (v) => v.ratio !== facilityRatio && v.ratio !== "Varies by unit"
  ).length;
  const mostReportedDiffering =
    differingCount >= 3
      ? verifications
          .filter((v) => v.ratio !== facilityRatio)
          .reduce(
            (acc, v) => {
              acc[v.ratio] = (acc[v.ratio] || 0) + 1;
              return acc;
            },
            {} as Record<string, number>
          )
      : null;
  const topDiffering = mostReportedDiffering
    ? Object.entries(mostReportedDiffering).sort((a, b) => b[1] - a[1])[0]?.[0]
    : null;

  return (
    <div className="space-y-6">
      <FloralBadge label="Flor Exclusive" />

      <section className="bg-white rounded-2xl border border-periwinkle-100/40 p-6 sm:p-8">
        <h2 className="text-lg font-extrabold text-text mb-4">
          Patient-to-Nurse Ratio
        </h2>

        {/* Facility-reported ratio */}
        {facilityRatio ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-text-light text-sm">
                Reported by facility:{" "}
                <span className="font-bold text-text">{facilityRatio}</span>
              </span>
              {ratioVerifiedByFacility && (
                <span className="text-xs font-semibold text-periwinkle bg-periwinkle-50 px-2 py-0.5 rounded-full">
                  Facility verified
                </span>
              )}
            </div>

            {/* Verification status badges */}
            {verifications.length === 0 && (
              <div className="bg-periwinkle-50 rounded-xl p-4 text-sm text-periwinkle-dark">
                <span className="font-semibold">Have you worked here?</span>{" "}
                Verify this ratio below to help other nurses.
              </div>
            )}

            {matchingCount >= 3 && (
              <div className="bg-success-light rounded-xl p-4 flex items-center gap-2">
                <span className="text-success font-bold text-sm">✓</span>
                <span className="text-sm font-semibold text-success">
                  Verified by nurses
                </span>
                <span className="text-xs text-text-muted ml-1">
                  ({matchingCount} nurse{matchingCount !== 1 ? "s" : ""} confirmed)
                </span>
              </div>
            )}

            {differingCount >= 3 && topDiffering && (
              <div className="bg-amber/10 rounded-xl p-4 border border-amber/30">
                <p className="text-sm font-semibold text-amber-dark">
                  ⚠ Nurses report differently — see details
                </p>
                <p className="text-xs text-text-muted mt-1">
                  Facility says <strong>{facilityRatio}</strong>, but nurses
                  most commonly report <strong>{topDiffering}</strong>
                </p>
              </div>
            )}

            {matchingCount > 0 &&
              matchingCount < 3 &&
              differingCount < 3 && (
                <p className="text-xs text-text-muted">
                  {matchingCount} nurse verification
                  {matchingCount !== 1 ? "s" : ""} so far — need{" "}
                  {3 - matchingCount} more for verified badge.
                </p>
              )}
          </div>
        ) : (
          <div className="bg-amber/10 rounded-xl p-4 border border-amber/30">
            <p className="text-sm font-semibold text-amber-dark">
              Ratio not disclosed
            </p>
            <p className="text-xs text-text-muted mt-1">
              This facility has not disclosed a patient-to-nurse ratio. Help
              other nurses by reporting yours below.
            </p>
          </div>
        )}
      </section>

      {/* Verification form */}
      <section className="bg-white rounded-2xl border border-periwinkle-100/40 p-6 sm:p-8">
        <h3 className="text-base font-extrabold text-text mb-4">
          Verify the Ratio
        </h3>
        {submitted ? (
          <div className="bg-success-light rounded-xl p-4 text-sm text-success font-semibold">
            ✓ Thank you! Your verification has been recorded.
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-text mb-1.5">
                What ratio did you experience?
              </label>
              <select
                value={selectedRatio}
                onChange={(e) => setSelectedRatio(e.target.value)}
                className="w-full sm:w-64 border border-periwinkle-100/40 rounded-xl px-4 py-2.5 text-sm text-text bg-white focus:outline-none focus:ring-2 focus:ring-periwinkle/40"
              >
                <option value="">Select a ratio</option>
                {RATIO_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-text mb-1.5">
                Additional context{" "}
                <span className="text-text-muted font-normal">(optional)</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={2}
                placeholder="e.g., Night shift on the med/surg floor..."
                className="w-full border border-periwinkle-100/40 rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-periwinkle/40 resize-none"
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={!selectedRatio}
              className="bg-periwinkle hover:bg-periwinkle-dark disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-6 py-2.5 rounded-full text-sm transition-colors"
            >
              Submit Verification
            </button>
          </div>
        )}
      </section>

      {/* Previous verifications */}
      {verifications.length > 0 && (
        <section className="bg-white rounded-2xl border border-periwinkle-100/40 p-6 sm:p-8">
          <h3 className="text-base font-extrabold text-text mb-4">
            Nurse Verifications ({verifications.length})
          </h3>
          <div className="space-y-3">
            {verifications.map((v, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-gray-50 rounded-xl p-3"
              >
                <span className="text-sm font-bold text-periwinkle bg-periwinkle-50 px-2 py-0.5 rounded-full">
                  {v.ratio}
                </span>
                <div className="flex-1 min-w-0">
                  {v.comment && (
                    <p className="text-sm text-text-light">{v.comment}</p>
                  )}
                  <p className="text-xs text-text-muted mt-0.5">{v.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TAB 3 — Reviews
   ═══════════════════════════════════════════════════════════ */
function ReviewsTab({ facility }: { facility: FacilityProfile }) {
  const storageKey = `flor-reviews-${facility.id}`;
  const [localReviews, setLocalReviews] = useState<FacilityReview[]>([]);
  const [newRating, setNewRating] = useState(0);
  const [newText, setNewText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setLocalReviews(lsGet<FacilityReview[]>(storageKey, []));
  }, [storageKey]);

  const allReviews = [...facility.reviews, ...localReviews];
  const avgRating =
    allReviews.length > 0
      ? allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length
      : 0;
  const recommendCount = allReviews.filter((r) => r.rating >= 4).length;

  const handleSubmit = () => {
    if (newRating === 0 || !newText.trim()) return;
    const review: FacilityReview = {
      id: `r-local-${Date.now()}`,
      authorInitials: "ME",
      role: "RN",
      rating: newRating,
      date: new Date().toISOString().slice(0, 10),
      text: newText.trim(),
    };
    const updated = [...localReviews, review];
    setLocalReviews(updated);
    lsSet(storageKey, updated);
    setNewRating(0);
    setNewText("");
    setSubmitted(true);
  };

  return (
    <div className="space-y-6">
      {/* Summary bar */}
      <section className="bg-white rounded-2xl border border-periwinkle-100/40 p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-6">
          <div className="text-center">
            <div className="text-4xl font-extrabold text-text">
              {avgRating > 0 ? avgRating.toFixed(1) : "—"}
            </div>
            <Stars rating={avgRating} size="text-lg" />
            <p className="text-xs text-text-muted mt-1">
              {allReviews.length} review{allReviews.length !== 1 ? "s" : ""}
            </p>
          </div>
          {recommendCount > 0 && (
            <div className="bg-success-light rounded-xl px-4 py-3">
              <p className="text-sm font-bold text-success">
                {recommendCount} nurse{recommendCount !== 1 ? "s" : ""}{" "}
                recommend working here
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Review list */}
      {allReviews.length > 0 && (
        <section className="space-y-4">
          {allReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl border border-periwinkle-100/40 p-5 sm:p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="w-9 h-9 rounded-full bg-periwinkle-50 flex items-center justify-center text-xs font-bold text-periwinkle-dark">
                  {review.authorInitials}
                </span>
                <div>
                  <p className="text-sm font-semibold text-text">
                    {review.role}
                  </p>
                  <div className="flex items-center gap-2">
                    <Stars rating={review.rating} size="text-xs" />
                    <span className="text-xs text-text-muted">
                      {review.date}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-text-light leading-relaxed">
                {review.text}
              </p>
            </div>
          ))}
        </section>
      )}

      {/* Leave a review */}
      <section className="bg-white rounded-2xl border border-periwinkle-100/40 p-6 sm:p-8">
        <h3 className="text-base font-extrabold text-text mb-4">
          Leave a Review
        </h3>
        {submitted ? (
          <div className="bg-success-light rounded-xl p-4 text-sm text-success font-semibold">
            ✓ Thank you for your review!
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-text mb-1.5">
                Your Rating
              </label>
              <StarSelector value={newRating} onChange={setNewRating} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text mb-1.5">
                Your Experience
              </label>
              <textarea
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                rows={4}
                placeholder="Share your experience working here..."
                className="w-full border border-periwinkle-100/40 rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-periwinkle/40 resize-none"
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={newRating === 0 || !newText.trim()}
              className="bg-periwinkle hover:bg-periwinkle-dark disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-6 py-2.5 rounded-full text-sm transition-colors"
            >
              Submit Review
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TAB 4 — Ask the Floor
   ═══════════════════════════════════════════════════════════ */
interface FloorQuestion {
  id: string;
  question: string;
  answer: string | null;
  answeredBy: string | null;
  date: string;
  anonymous: boolean;
}

function AskTheFloorTab({ facility }: { facility: FacilityProfile }) {
  const storageKey = `flor-askfloor-${facility.id}`;
  const [localQuestions, setLocalQuestions] = useState<FloorQuestion[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setLocalQuestions(lsGet<FloorQuestion[]>(storageKey, []));
  }, [storageKey]);

  const allQuestions = [...SEED_QUESTIONS, ...localQuestions];

  const handleSubmit = () => {
    if (!newQuestion.trim()) return;
    const q: FloorQuestion = {
      id: `aq-local-${Date.now()}`,
      question: newQuestion.trim(),
      answer: null,
      answeredBy: null,
      date: new Date().toISOString().slice(0, 10),
      anonymous: isAnonymous,
    };
    const updated = [...localQuestions, q];
    setLocalQuestions(updated);
    lsSet(storageKey, updated);
    setNewQuestion("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="space-y-6">
      <FloralBadge label="Flor Exclusive" />

      {/* Questions list */}
      <section className="space-y-4">
        {allQuestions.map((q) => (
          <div
            key={q.id}
            className="bg-white rounded-2xl border border-periwinkle-100/40 p-5 sm:p-6"
          >
            <p className="text-sm font-bold text-text mb-2">{q.question}</p>
            {q.answer ? (
              <div className="bg-gray-50 rounded-xl p-3 mt-2">
                <p className="text-sm text-text-light leading-relaxed">
                  {q.answer}
                </p>
                <p className="text-xs font-semibold mt-2">
                  {q.answeredBy === "verified nurse" ? (
                    <span className="text-success">
                      ✓ Answered by verified nurse
                    </span>
                  ) : q.answeredBy === "facility" ? (
                    <span className="text-periwinkle">
                      Answered by facility
                    </span>
                  ) : null}
                </p>
              </div>
            ) : (
              <p className="text-xs text-text-muted italic mt-1">
                Awaiting answer...
              </p>
            )}
            <p className="text-xs text-text-muted mt-2">
              Asked {q.date}
              {q.anonymous && " · Anonymous"}
            </p>
          </div>
        ))}
      </section>

      {/* Submit a question */}
      <section className="bg-white rounded-2xl border border-periwinkle-100/40 p-6 sm:p-8">
        <h3 className="text-base font-extrabold text-text mb-4">
          Ask a Question
        </h3>
        {submitted ? (
          <div className="bg-success-light rounded-xl p-4 text-sm text-success font-semibold">
            ✓ Your question has been submitted!
          </div>
        ) : (
          <div className="space-y-4">
            <textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              rows={3}
              placeholder="What would you like to know about working here?"
              className="w-full border border-periwinkle-100/40 rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-periwinkle/40 resize-none"
            />
            <div className="flex items-center justify-between flex-wrap gap-3">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-periwinkle focus:ring-periwinkle"
                />
                <span className="text-sm text-text-light">
                  Post anonymously
                </span>
              </label>
              <button
                onClick={handleSubmit}
                disabled={!newQuestion.trim()}
                className="bg-periwinkle hover:bg-periwinkle-dark disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-6 py-2.5 rounded-full text-sm transition-colors"
              >
                Submit Question
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TAB 5 — Interview Intel
   ═══════════════════════════════════════════════════════════ */
interface InterviewEntry {
  id: string;
  unit: string;
  date: string; // month/year
  format: string;
  interviewerType: string;
  questionTypes: string[];
  payDiscussed: boolean;
  ratioDiscussed: boolean;
  rating: number;
  text: string;
  submittedDate: string;
}

function InterviewIntelTab({ facility }: { facility: FacilityProfile }) {
  const storageKey = `flor-interview-${facility.id}`;
  const [entries, setEntries] = useState<InterviewEntry[]>([]);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [unit, setUnit] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [format, setFormat] = useState("");
  const [interviewerType, setInterviewerType] = useState("");
  const [questionTypes, setQuestionTypes] = useState<string[]>([]);
  const [payDiscussed, setPayDiscussed] = useState(false);
  const [ratioDiscussed, setRatioDiscussed] = useState(false);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setEntries(lsGet<InterviewEntry[]>(storageKey, []));
  }, [storageKey]);

  const toggleQuestionType = useCallback((qt: string) => {
    setQuestionTypes((prev) =>
      prev.includes(qt) ? prev.filter((t) => t !== qt) : [...prev, qt]
    );
  }, []);

  const resetForm = () => {
    setUnit("");
    setInterviewDate("");
    setFormat("");
    setInterviewerType("");
    setQuestionTypes([]);
    setPayDiscussed(false);
    setRatioDiscussed(false);
    setRating(0);
    setText("");
  };

  const handleSubmit = () => {
    if (!rating || !format) return;
    const entry: InterviewEntry = {
      id: `ii-${Date.now()}`,
      unit: unit.trim(),
      date: interviewDate,
      format,
      interviewerType: interviewerType.trim(),
      questionTypes,
      payDiscussed,
      ratioDiscussed,
      rating,
      text: text.trim(),
      submittedDate: new Date().toISOString().slice(0, 10),
    };
    const updated = [...entries, entry];
    setEntries(updated);
    lsSet(storageKey, updated);
    resetForm();
    setSubmitted(true);
    setShowForm(false);
  };

  // Aggregate stats
  const avgRating =
    entries.length > 0
      ? entries.reduce((s, e) => s + e.rating, 0) / entries.length
      : 0;
  const formatCounts = entries.reduce(
    (acc, e) => {
      acc[e.format] = (acc[e.format] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const mostCommonFormat = Object.entries(formatCounts).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0];
  const payDiscussedCount = entries.filter((e) => e.payDiscussed).length;
  const ratioDiscussedCount = entries.filter((e) => e.ratioDiscussed).length;

  return (
    <div className="space-y-6">
      <FloralBadge label="Flor Exclusive" />

      {/* Aggregate display */}
      {entries.length > 0 && (
        <section className="bg-white rounded-2xl border border-periwinkle-100/40 p-6 sm:p-8">
          <h2 className="text-lg font-extrabold text-text mb-4">
            Interview Overview
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-periwinkle-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-extrabold text-periwinkle-dark">
                {avgRating.toFixed(1)}
              </div>
              <p className="text-xs text-text-muted mt-1">Avg Rating</p>
            </div>
            {mostCommonFormat && (
              <div className="bg-periwinkle-50 rounded-xl p-4 text-center">
                <div className="text-sm font-bold text-periwinkle-dark">
                  {mostCommonFormat}
                </div>
                <p className="text-xs text-text-muted mt-1">
                  Most Common Format
                </p>
              </div>
            )}
            <div className="bg-periwinkle-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-extrabold text-periwinkle-dark">
                {entries.length > 0
                  ? `${Math.round((payDiscussedCount / entries.length) * 100)}%`
                  : "—"}
              </div>
              <p className="text-xs text-text-muted mt-1">
                Discussed Pay
              </p>
            </div>
            <div className="bg-periwinkle-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-extrabold text-periwinkle-dark">
                {entries.length > 0
                  ? `${Math.round((ratioDiscussedCount / entries.length) * 100)}%`
                  : "—"}
              </div>
              <p className="text-xs text-text-muted mt-1">
                Discussed Ratio
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Existing entries */}
      {entries.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-base font-extrabold text-text">
            Interview Reports ({entries.length})
          </h3>
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white rounded-2xl border border-periwinkle-100/40 p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Stars rating={entry.rating} size="text-sm" />
                <span className="text-xs text-text-muted">
                  {RATING_LABELS[entry.rating]}
                </span>
                {entry.unit && (
                  <span className="text-xs font-semibold text-periwinkle bg-periwinkle-50 px-2 py-0.5 rounded-full">
                    {entry.unit}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mb-2 text-xs">
                <span className="bg-gray-100 text-text-light px-2 py-0.5 rounded-full">
                  {entry.format}
                </span>
                {entry.interviewerType && (
                  <span className="bg-gray-100 text-text-light px-2 py-0.5 rounded-full">
                    {entry.interviewerType}
                  </span>
                )}
                {entry.payDiscussed && (
                  <span className="bg-success-light text-success px-2 py-0.5 rounded-full font-semibold">
                    Pay discussed
                  </span>
                )}
                {entry.ratioDiscussed && (
                  <span className="bg-success-light text-success px-2 py-0.5 rounded-full font-semibold">
                    Ratio discussed
                  </span>
                )}
              </div>
              {entry.questionTypes.length > 0 && (
                <p className="text-xs text-text-muted mb-2">
                  Questions: {entry.questionTypes.join(", ")}
                </p>
              )}
              {entry.text && (
                <p className="text-sm text-text-light leading-relaxed">
                  {entry.text}
                </p>
              )}
              <p className="text-xs text-text-muted mt-2">
                {entry.date && `Interview: ${entry.date} · `}Submitted{" "}
                {entry.submittedDate}
              </p>
            </div>
          ))}
        </section>
      )}

      {/* No entries yet */}
      {entries.length === 0 && !showForm && (
        <section className="bg-white rounded-2xl border border-periwinkle-100/40 p-6 sm:p-8 text-center">
          <p className="text-text-muted text-sm mb-4">
            No interview intel yet for {facility.name}. Be the first to share!
          </p>
        </section>
      )}

      {/* Add button / form */}
      {!showForm && !submitted && (
        <button
          onClick={() => setShowForm(true)}
          className="bg-periwinkle hover:bg-periwinkle-dark text-white font-bold px-6 py-2.5 rounded-full text-sm transition-colors"
        >
          Share Interview Experience
        </button>
      )}

      {submitted && !showForm && (
        <div className="bg-success-light rounded-xl p-4 text-sm text-success font-semibold">
          ✓ Thank you for sharing your interview experience!
        </div>
      )}

      {showForm && (
        <section className="bg-white rounded-2xl border border-periwinkle-100/40 p-6 sm:p-8">
          <h3 className="text-base font-extrabold text-text mb-5">
            Share Your Interview Experience
          </h3>
          <div className="space-y-5">
            {/* Unit */}
            <div>
              <label className="block text-sm font-semibold text-text mb-1.5">
                Unit / Department{" "}
                <span className="text-text-muted font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g., ICU, Med/Surg, ER"
                className="w-full sm:w-80 border border-periwinkle-100/40 rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-periwinkle/40"
              />
            </div>

            {/* Approximate date */}
            <div>
              <label className="block text-sm font-semibold text-text mb-1.5">
                Approximate Date (Month/Year)
              </label>
              <input
                type="text"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                placeholder="e.g., January 2026"
                className="w-full sm:w-80 border border-periwinkle-100/40 rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-periwinkle/40"
              />
            </div>

            {/* Format */}
            <div>
              <label className="block text-sm font-semibold text-text mb-1.5">
                Interview Format *
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full sm:w-80 border border-periwinkle-100/40 rounded-xl px-4 py-2.5 text-sm text-text bg-white focus:outline-none focus:ring-2 focus:ring-periwinkle/40"
              >
                <option value="">Select format</option>
                {INTERVIEW_FORMATS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            {/* Interviewer type */}
            <div>
              <label className="block text-sm font-semibold text-text mb-1.5">
                Who interviewed you?{" "}
                <span className="text-text-muted font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={interviewerType}
                onChange={(e) => setInterviewerType(e.target.value)}
                placeholder="e.g., Nurse Manager, HR, Panel"
                className="w-full sm:w-80 border border-periwinkle-100/40 rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-periwinkle/40"
              />
            </div>

            {/* Question types */}
            <div>
              <label className="block text-sm font-semibold text-text mb-2">
                Types of Questions Asked
              </label>
              <div className="flex flex-wrap gap-2">
                {QUESTION_TYPES.map((qt) => (
                  <button
                    key={qt}
                    type="button"
                    onClick={() => toggleQuestionType(qt)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                      questionTypes.includes(qt)
                        ? "bg-periwinkle text-white border-periwinkle"
                        : "bg-white text-text-light border-periwinkle-100/40 hover:border-periwinkle/60"
                    }`}
                  >
                    {qt}
                  </button>
                ))}
              </div>
            </div>

            {/* Transparency signals */}
            <div className="flex flex-wrap gap-6">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={payDiscussed}
                  onChange={(e) => setPayDiscussed(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-periwinkle focus:ring-periwinkle"
                />
                <span className="text-sm text-text-light">
                  Pay was discussed
                </span>
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={ratioDiscussed}
                  onChange={(e) => setRatioDiscussed(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-periwinkle focus:ring-periwinkle"
                />
                <span className="text-sm text-text-light">
                  Ratio was discussed
                </span>
              </label>
            </div>

            {/* Overall rating */}
            <div>
              <label className="block text-sm font-semibold text-text mb-1.5">
                Overall Rating *
              </label>
              <StarSelector value={rating} onChange={setRating} />
            </div>

            {/* Free text */}
            <div>
              <label className="block text-sm font-semibold text-text mb-1.5">
                Tell us more{" "}
                <span className="text-text-muted font-normal">(optional)</span>
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
                placeholder="How did the interview go? Any advice for future candidates?"
                className="w-full border border-periwinkle-100/40 rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-periwinkle/40 resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleSubmit}
                disabled={!rating || !format}
                className="bg-periwinkle hover:bg-periwinkle-dark disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-6 py-2.5 rounded-full text-sm transition-colors"
              >
                Submit Intel
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="text-text-muted hover:text-text text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TAB 6 — Open Positions
   ═══════════════════════════════════════════════════════════ */
function OpenPositionsTab({
  facility,
  jobs,
}: {
  facility: FacilityProfile;
  jobs: JobListing[];
}) {
  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-periwinkle-100/40 p-8 text-center">
        <p className="text-text-muted text-sm">
          No open positions at {facility.name} right now.
        </p>
        <Link
          href="/jobs"
          className="inline-block mt-4 text-periwinkle hover:text-periwinkle-dark font-semibold text-sm transition-colors"
        >
          Browse all jobs →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-text-muted">
        {jobs.length} open position{jobs.length !== 1 ? "s" : ""} at{" "}
        {facility.name}
      </p>
      {jobs.map((job) => {
        const isPayHidden =
          job.payHidden || (job.payRange.min === 0 && job.payRange.max === 0);

        return (
          <Link
            key={job.id}
            href={`/jobs/${job.id}`}
            className="block bg-white rounded-2xl border border-periwinkle-100/40 p-5 sm:p-6 hover:border-periwinkle/40 hover:shadow-md transition-all group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-text group-hover:text-periwinkle-dark transition-colors">
                  {job.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <span className="text-xs font-semibold text-periwinkle bg-periwinkle-50 px-2 py-0.5 rounded-full">
                    {job.type}
                  </span>
                  <span className="text-xs text-text-muted">
                    {job.location.city}, {job.location.state}
                  </span>
                  {job.patientRatio && (
                    <span className="text-xs text-text-muted">
                      Ratio: {job.patientRatio}
                      {job.patientRatioVerified && (
                        <span className="text-success ml-1">✓</span>
                      )}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right shrink-0">
                {isPayHidden ? (
                  <span className="text-sm font-semibold text-text-muted">
                    Pay not listed
                  </span>
                ) : (
                  <span className="text-lg font-extrabold text-text">
                    ${job.payRange.min}–${job.payRange.max}
                    <span className="text-sm font-medium text-text-muted">
                      /{job.payUnit}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
