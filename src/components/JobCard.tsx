import Link from "next/link";
import Image from "next/image";
import { JobListing } from "@/data/types";

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

  const fitScore = job.fitScore ?? Math.floor(Math.random() * 20 + 75); // placeholder if none

  // Derive benefit tags from job properties if not explicitly set
  const benefits = job.benefitTags ?? [
    ...(job.tuitionReimbursement ? ["tuition"] : []),
    ...(job.loanForgiveness ? ["tuition"] : []),
    ...(job.signOnBonus ? ["401k"] : []),
  ];

  // Format pay display
  const payDisplay =
    job.payRange.min === job.payRange.max
      ? `$${job.payRange.min.toFixed(2)}`
      : `$${job.payRange.min % 1 === 0 ? job.payRange.min : job.payRange.min.toFixed(2)}–$${job.payRange.max % 1 === 0 ? job.payRange.max : job.payRange.max.toFixed(2)}`;

  return (
    <div className={`bg-white rounded-2xl border border-periwinkle-100/40 overflow-hidden hover:border-periwinkle/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group h-full flex flex-col ${delayClass}`}>
      {/* 1. Employer photo header */}
      <Link href={`/jobs/${job.id}`} className="block">
        <div className="relative h-36 sm:h-40 overflow-hidden bg-gradient-to-br from-periwinkle-50 via-periwinkle-100 to-periwinkle-200">
          {job.facilityImage ? (
            <Image
              src={job.facilityImage}
              alt={job.facilityName}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />
          ) : (
            /* Gradient fallback with facility initial */
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-5xl font-extrabold text-periwinkle/20">
                {job.facilityName.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Facility name overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-xs font-semibold text-white/80 truncate">{job.facilityName}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <svg className="w-3 h-3 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <span className="text-[11px] text-white/60">{job.location.city}, {job.location.state}</span>
            </div>
          </div>
        </div>
      </Link>

      <div className="p-5 sm:p-6 flex flex-col flex-1">
        {/* 2. Job title — prominent */}
        <Link href={`/jobs/${job.id}`}>
          <h3 className="text-lg font-bold text-text group-hover:text-periwinkle transition-colors leading-snug mb-3">
            {job.title}
          </h3>
        </Link>

        {/* 3. Pay — hero element, bold periwinkle badge */}
        <Link href={`/jobs/${job.id}`} className="block">
          <div className="bg-periwinkle/10 rounded-xl p-4 mb-3">
            <div className="text-2xl font-extrabold text-periwinkle leading-none">
              {payDisplay}
              <span className="text-sm font-semibold text-periwinkle/70 ml-1">/{job.payUnit}</span>
            </div>
            {(job.signOnBonus ?? 0) > 0 && (
              <p className="text-xs font-bold text-success mt-1.5">+ ${job.signOnBonus!.toLocaleString()} sign-on bonus</p>
            )}
            {job.payHiddenElsewhere && (
              <p className="text-[10px] font-medium text-periwinkle/70 mt-1.5 flex items-center gap-1">
                <span>💡</span> Pay shown here — hidden on other job boards
              </p>
            )}
          </div>
        </Link>

        {/* 4. Shift tag + 5. Specialty tag */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${shiftPillClass(job.scheduleType)}`}>
            {job.scheduleType}
          </span>
          {job.specialty && (
            <span className="text-xs font-semibold bg-periwinkle-50/60 text-periwinkle-dark px-2.5 py-1 rounded-full border border-periwinkle-100/60">
              {job.specialty}
            </span>
          )}
          {job.type !== "Full-time" && (
            <span className="text-xs font-semibold bg-warm-gray text-text-light px-2.5 py-1 rounded-full border border-periwinkle-100/40">
              {job.type}
            </span>
          )}
          {job.newGradsWelcome && (
            <span className="text-xs font-bold bg-success-light text-success px-2.5 py-1 rounded-full border border-success/20">
              New Grads Welcome
            </span>
          )}
          {job.bilingualPayDifferential && (
            <span className="text-xs font-bold bg-info/10 text-info px-2.5 py-1 rounded-full border border-info/20">
              Bilingual +6-8%
            </span>
          )}
        </div>

        {/* Special feature badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {job.union && (
            <span className="text-xs font-bold bg-amber/10 text-amber-dark px-2.5 py-1 rounded-full border border-amber/20">
              Union
            </span>
          )}
          {job.magnetDesignated && (
            <span className="text-xs font-bold bg-periwinkle-50 text-periwinkle-dark px-2.5 py-1 rounded-full border border-periwinkle-100">
              Magnet
            </span>
          )}
          {job.loanForgiveness && (
            <span className="text-xs font-bold bg-success-light text-success px-2.5 py-1 rounded-full border border-success/20">
              Loan Forgiveness
            </span>
          )}
        </div>

        {/* 6. Flor Fit Score + 7. Benefits icon row */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-periwinkle-100/30">
          <FitScoreRing score={fitScore} />

          {/* 7. Benefits icons */}
          {benefits.length > 0 && (
            <div className="flex items-center gap-1">
              {[...new Set(benefits)].map((tag) => {
                const b = BENEFIT_ICONS[tag];
                if (!b) return null;
                return (
                  <span key={tag} className="w-7 h-7 flex items-center justify-center rounded-lg bg-warm-gray text-sm" title={b.label}>
                    {b.icon}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* 8. "Apply Directly" button */}
        <Link href={`/jobs/${job.id}`} className="block mt-4">
          <button className="w-full bg-periwinkle hover:bg-periwinkle-dark text-white font-bold py-3 rounded-full text-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
            Apply Directly
          </button>
        </Link>
      </div>
    </div>
  );
}
