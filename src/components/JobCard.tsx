import Link from "next/link";
import { JobListing } from "@/data/types";

interface JobCardProps {
  job: JobListing;
  fitScore?: { score: number; topMatch: string; topGap: string } | null;
  index?: number;
}

export default function JobCard({ job, fitScore, index = 0 }: JobCardProps) {
  const delayClass =
    index === 0
      ? "animate-fade-in-up"
      : index === 1
      ? "animate-fade-in-up-delay-1"
      : index === 2
      ? "animate-fade-in-up-delay-2"
      : "animate-fade-in-up-delay-3";

  return (
    <Link href={`/jobs/${job.id}`}>
      <div
        className={`bg-white rounded-2xl border border-periwinkle-100/40 p-5 sm:p-6 hover:border-periwinkle/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group h-full flex flex-col ${delayClass}`}
      >
        {/* Top row: title + fit score */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-text group-hover:text-periwinkle transition-colors leading-snug">
              {job.title}
            </h3>
            <p className="text-sm text-text-muted mt-1">{job.facilityName}</p>
          </div>
          {fitScore && (
            <div className="flex-shrink-0 bg-periwinkle-50 rounded-xl px-3 py-2 text-center">
              <div className="text-lg font-extrabold text-periwinkle leading-none">{fitScore.score}</div>
              <div className="text-[9px] font-bold text-periwinkle-dark uppercase tracking-wider mt-0.5">Fit</div>
            </div>
          )}
        </div>

        {/* Pay — hero element */}
        <div className="bg-periwinkle-50/60 rounded-xl p-4 mb-4">
          <div className="text-2xl font-extrabold text-periwinkle-dark leading-none">
            ${job.payRange.min.toFixed(2)}–${job.payRange.max.toFixed(2)}
            <span className="text-sm font-semibold text-periwinkle ml-1">/{job.payUnit}</span>
          </div>
          <p className="text-xs text-text-muted mt-1.5 leading-relaxed">{job.payExplained}</p>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {job.scheduleBadges.map((badge) => (
            <span
              key={badge}
              className="text-xs font-medium bg-white text-text-light px-2.5 py-1 rounded-full border border-periwinkle-100/60"
            >
              {badge}
            </span>
          ))}
          {job.union && (
            <span className="text-xs font-bold bg-amber/10 text-amber-dark px-2.5 py-1 rounded-full border border-amber/20">
              Union
            </span>
          )}
        </div>

        {/* Meta — pushed to bottom */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-muted mt-auto pt-3 border-t border-periwinkle-100/30">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            {job.location.city}, {job.location.state}
          </span>
          <span className="font-medium">{job.type}</span>
          {job.ehrSystem && (
            <span className="bg-warm-gray px-2 py-0.5 rounded-md font-medium">{job.ehrSystem}</span>
          )}
        </div>

        {/* Fit score explanation */}
        {fitScore && (
          <div className="mt-3 pt-3 border-t border-periwinkle-100/30 text-xs text-text-light leading-relaxed">
            {fitScore.topMatch}. {fitScore.topGap}.
          </div>
        )}
      </div>
    </Link>
  );
}
