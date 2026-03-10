"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { JobListing } from "@/data/types";
import SpecialtyIllustration from "@/components/SpecialtyIllustration";

interface JobCardProps {
  job: JobListing;
  index?: number;
}

/* ── Circular progress ring for Fit Score ── */
function FitScoreRing({ score }: { score: number }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-11 h-11">
        <svg className="w-11 h-11 -rotate-90" viewBox="0 0 44 44">
          <circle cx="22" cy="22" r={radius} fill="none" stroke="#E4E5F4" strokeWidth="3" />
          <circle
            cx="22" cy="22" r={radius} fill="none"
            stroke="#8B8FD4" strokeWidth="3" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            className="transition-all duration-700"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-extrabold text-periwinkle">
          {score}
        </span>
      </div>
      <span className="text-[10px] font-bold text-periwinkle leading-tight">
        Flor<br />Fit
      </span>
    </div>
  );
}

/* ── Shift-type color coding ── */
function shiftPillClass(type: string) {
  switch (type) {
    case "Days": return "bg-amber/15 text-amber-dark border-amber/25";
    case "Nights": return "bg-[#2D2B55]/10 text-[#2D2B55] border-[#2D2B55]/20";
    case "Rotating": return "bg-periwinkle-50 text-periwinkle-dark border-periwinkle-100";
    case "Evenings": return "bg-rose-light text-rose border-rose/20";
    default: return "bg-warm-gray text-text-light border-periwinkle-100/40";
  }
}

/* ── Tuition Popover ── */
function TuitionPopover({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(!open); }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="w-7 h-7 flex items-center justify-center rounded-lg bg-periwinkle-50 text-sm hover:bg-periwinkle-100 transition-colors cursor-pointer"
        title="Tuition reimbursement details"
      >
        🎓
      </button>
      {open && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-white border-[1.5px] border-periwinkle rounded-2xl p-4 z-50 animate-scale-in"
          style={{ boxShadow: "0 8px 32px rgba(139,143,212,0.2)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b-[1.5px] border-r-[1.5px] border-periwinkle rotate-45" />
          <p className="text-xs text-text leading-relaxed font-medium">{text}</p>
        </div>
      )}
    </div>
  );
}

/* ── Smart facility image with illustrated fallback ── */
function FacilityImage({ src, specialty }: { src?: string; specialty?: string }) {
  const [failed, setFailed] = useState(!src);

  if (failed || !src) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <SpecialtyIllustration specialty={specialty} className="w-full h-full" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={specialty || "Facility"}
      fill
      className="object-cover group-hover:scale-105 transition-transform duration-500"
      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
      onError={() => setFailed(true)}
    />
  );
}

/* ── Benefit icons ── */
const BENEFIT_ICONS: Record<string, { icon: string; label: string }> = {
  health: { icon: "🏥", label: "Health insurance" },
  "401k": { icon: "💰", label: "401k" },
  tuition: { icon: "🎓", label: "Tuition" },
  pto: { icon: "🌴", label: "PTO" },
  mileage: { icon: "🚗", label: "Mileage" },
};

export default function JobCard({ job, index = 0 }: JobCardProps) {
  const delayClass =
    index === 0
      ? "animate-fade-in-up"
      : index === 1
      ? "animate-fade-in-up-delay-1"
      : index === 2
      ? "animate-fade-in-up-delay-2"
      : "animate-fade-in-up-delay-3";

  const fitScore = job.fitScore ?? Math.floor(Math.random() * 20 + 75);

  const benefits = job.benefitTags ?? [
    ...(job.tuitionReimbursement ? ["tuition"] : []),
    ...(job.loanForgiveness ? ["tuition"] : []),
    ...(job.signOnBonus ? ["401k"] : []),
  ];

  // Pay display logic
  const isPayHidden = job.payHidden || (job.payRange.min === 0 && job.payRange.max === 0);
  const payDisplay = isPayHidden
    ? null
    : job.payRange.min === job.payRange.max
    ? `$${job.payRange.min % 1 === 0 ? job.payRange.min : job.payRange.min.toFixed(2)}`
    : `$${job.payRange.min % 1 === 0 ? job.payRange.min : job.payRange.min.toFixed(2)}–$${job.payRange.max % 1 === 0 ? job.payRange.max : job.payRange.max.toFixed(2)}`;

  return (
    <div className={`bg-white rounded-3xl border border-periwinkle-100/40 overflow-hidden hover:border-periwinkle/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer group h-full flex flex-col ${delayClass}`}
      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
    >
      {/* Photo header with pay ribbon + left accent bar */}
      <Link href={`/jobs/${job.id}`} className="block">
        <div className="relative h-[160px] overflow-hidden bg-gradient-to-br from-periwinkle-50 via-periwinkle-100/50 to-periwinkle-50 border-l-4 border-periwinkle">
          <FacilityImage src={job.facilityImage} specialty={job.specialty} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Shift badge — top-right glass pill */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-[10px] font-bold text-text tracking-wide shadow-sm">
            {job.scheduleType}
          </div>

          {/* Sign-on bonus badge — top right below shift */}
          {(job.signOnBonus ?? 0) > 0 && (
            <div className="absolute top-10 right-3 bg-[#2ECC71] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md z-10">
              +${job.signOnBonus!.toLocaleString()} Bonus
            </div>
          )}

          {/* Pay ribbon — bottom of photo */}
          <div className="absolute bottom-0 left-0 right-0">
            {isPayHidden ? (
              <div className="mx-3 mb-3 bg-white border-2 border-periwinkle rounded-2xl px-4 py-2.5" style={{ boxShadow: "var(--shadow-ribbon)" }}>
                <div className="text-base font-extrabold text-periwinkle leading-none">
                  Pay Available
                </div>
                <p className="text-[10px] font-medium text-periwinkle/70 mt-0.5 flex items-center gap-1">
                  <span>💡</span> Hidden elsewhere. Shown here.
                </p>
              </div>
            ) : (
              <div className="mx-3 mb-3 rounded-2xl px-4 py-2.5" style={{ background: "linear-gradient(135deg, #8B8FD4, #6B6FB4)", boxShadow: "var(--shadow-ribbon)" }}>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-extrabold text-white leading-none font-serif">
                    {payDisplay}
                  </span>
                  <span className="text-xs font-semibold text-white/70">/{job.payUnit} base</span>
                </div>
                {/* Shift differential pills */}
                {(job.nightDifferential || job.weekendDifferential) && (
                  <div className="flex gap-1.5 mt-1.5">
                    {job.nightDifferential ? (
                      <span className="text-[10px] font-semibold text-white bg-white/20 rounded-full px-2 py-0.5">
                        +${job.nightDifferential}/hr nights
                      </span>
                    ) : null}
                    {job.weekendDifferential ? (
                      <span className="text-[10px] font-semibold text-white bg-white/20 rounded-full px-2 py-0.5">
                        +${job.weekendDifferential}/hr weekends
                      </span>
                    ) : null}
                  </div>
                )}
                {!job.nightDifferential && !job.weekendDifferential && job.annualPayRange && (
                  <p className="text-[11px] text-white/70 mt-0.5 font-medium">
                    ${job.annualPayRange.min.toLocaleString()}–${job.annualPayRange.max.toLocaleString()}/yr
                  </p>
                )}
                {job.payHiddenElsewhere && !job.nightDifferential && !job.weekendDifferential && (
                  <p className="text-[10px] font-medium text-white/60 mt-0.5 flex items-center gap-1">
                    <span>💡</span> Pay shown here — hidden on other job boards
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-1">
        {/* Title + Verified badge */}
        <Link href={`/jobs/${job.id}`} className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-[15px] font-bold text-text group-hover:text-periwinkle transition-colors leading-snug font-serif flex-1">
            {job.title}
          </h3>
          {job.patientRatioVerified && (
            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#7BA68E] bg-[#7BA68E]/10 px-2 py-1 rounded-full uppercase tracking-wider whitespace-nowrap flex-shrink-0">
              <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                <path d="M10 3L5 9L2 6" stroke="#7BA68E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Verified
            </span>
          )}
        </Link>

        {/* Employer · Location */}
        <p className="text-xs text-text-muted mb-3 flex items-center gap-1">
          <svg className="w-3 h-3 text-text-muted/60 flex-shrink-0" viewBox="0 0 16 16" fill="none">
            <path d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6C3.5 9.5 8 14.5 8 14.5C8 14.5 12.5 9.5 12.5 6C12.5 3.5 10.5 1.5 8 1.5Z" stroke="currentColor" strokeWidth="1.3" />
            <circle cx="8" cy="6" r="1.5" fill="currentColor" />
          </svg>
          {job.facilityName} · {job.location.city}, {job.location.state}
        </p>

        {/* Tag row: specialty, shift, type */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {job.specialty && (
            <span className="text-[10px] font-bold bg-periwinkle/10 text-periwinkle px-2.5 py-1 rounded-full">
              {job.specialty}
            </span>
          )}
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${shiftPillClass(job.scheduleType)}`}>
            {job.scheduleType}
          </span>
          {job.type !== "Full-time" && (
            <span className="text-[10px] font-semibold bg-warm-gray text-text-light px-2.5 py-1 rounded-full border border-periwinkle-100/40">
              {job.type}
            </span>
          )}
          {job.ehrSystem && (
            <span className="text-[10px] font-medium text-text-muted bg-gray-50 px-2.5 py-1 rounded-full">
              {job.ehrSystem}
            </span>
          )}
          {job.newGradsWelcome && (
            <span className="text-[10px] font-bold bg-success-light text-success px-2.5 py-1 rounded-full border border-success/20">
              New Grads
            </span>
          )}
          {job.bilingualPayDifferential && (
            <span className="text-[10px] font-bold bg-info/10 text-info px-2.5 py-1 rounded-full border border-info/20">
              Bilingual +6-8%
            </span>
          )}
        </div>

        {/* Special badges */}
        {(job.union || job.magnetDesignated || job.loanForgiveness) && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {job.union && (
              <span className="text-[10px] font-bold bg-amber/10 text-amber-dark px-2.5 py-1 rounded-full border border-amber/20">
                Union
              </span>
            )}
            {job.magnetDesignated && (
              <span className="text-[10px] font-bold bg-periwinkle-50 text-periwinkle-dark px-2.5 py-1 rounded-full border border-periwinkle-100">
                Magnet
              </span>
            )}
            {job.loanForgiveness && (
              <span className="text-[10px] font-bold bg-success-light text-success px-2.5 py-1 rounded-full border border-success/20">
                Loan Forgiveness
              </span>
            )}
          </div>
        )}

        {/* Benefits with interactive tuition popover */}
        {benefits.length > 0 && (
          <div className="flex items-center gap-1 mb-3">
            {[...new Set(benefits)].map((tag) => {
              const b = BENEFIT_ICONS[tag];
              if (!b) return null;
              if (tag === "tuition" && job.tuitionPopover) {
                return <TuitionPopover key={tag} text={job.tuitionPopover} />;
              }
              return (
                <span key={tag} className="w-7 h-7 flex items-center justify-center rounded-lg bg-warm-gray text-sm" title={b.label}>
                  {b.icon}
                </span>
              );
            })}
          </div>
        )}

        {/* Flor Fit Score */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-periwinkle/10">
          <FitScoreRing score={fitScore} />
        </div>

        {/* CTA Button — outline by default, fills on card hover */}
        <Link href={`/jobs/${job.id}`} className="block mt-3">
          <button className="w-full border-[1.5px] border-periwinkle text-periwinkle font-bold py-2.5 rounded-xl text-sm transition-all duration-200 group-hover:bg-periwinkle group-hover:text-white group-hover:shadow-md active:scale-[0.97]">
            View Position →
          </button>
        </Link>
      </div>
    </div>
  );
}
