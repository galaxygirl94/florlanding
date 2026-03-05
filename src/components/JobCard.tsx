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
        className={`bg-white rounded-2xl p-5 sm:p-6 section-shadow hover:card-shadow-hover hover:-translate-y-1 transition-all duration-300 cursor-pointer group ${delayClass}`}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-text group-hover:text-periwinkle transition-colors truncate">
              {job.title}
            </h3>
            <p className="text-sm text-text-light mt-0.5 truncate">{job.facilityName}</p>
          </div>
          {fitScore && (
            <div className="flex-shrink-0 bg-gradient-to-br from-periwinkle-50 to-periwinkle-100 rounded-2xl px-3 py-2 text-center self-start">
              <div className="text-lg font-extrabold text-periwinkle">{fitScore.score}/100</div>
              <div className="text-[9px] font-bold text-periwinkle-dark uppercase tracking-wider">Flor Fit</div>
            </div>
          )}
        </div>

        {/* Pay — most prominent */}
        <div className="bg-gradient-to-r from-periwinkle-50 to-cream rounded-xl p-3.5 sm:p-4 mb-4">
          <div className="text-xl sm:text-2xl font-extrabold text-periwinkle">
            ${job.payRange.min.toFixed(2)} - ${job.payRange.max.toFixed(2)}
            <span className="text-sm font-medium text-periwinkle-dark">/{job.payUnit}</span>
          </div>
          <p className="text-xs text-text-light mt-1 leading-relaxed">{job.payExplained}</p>
        </div>

        {/* Schedule badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {job.scheduleBadges.map((badge) => (
            <span
              key={badge}
              className="text-xs font-medium bg-periwinkle-50 text-periwinkle-dark px-2.5 py-1 rounded-lg"
            >
              {badge}
            </span>
          ))}
          {job.union && (
            <span className="text-xs font-semibold bg-amber/15 text-amber-dark px-2.5 py-1 rounded-lg">
              Union
            </span>
          )}
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-muted">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            {job.location.city}, {job.location.state}
          </span>
          <span>{job.type}</span>
          {job.ehrSystem && (
            <span className="bg-warm-gray px-2 py-0.5 rounded-md text-text-light">{job.ehrSystem}</span>
          )}
        </div>

        {/* Fit score explanation */}
        {fitScore && (
          <div className="mt-3 pt-3 border-t border-periwinkle-50 text-xs text-text-light leading-relaxed">
            {fitScore.topMatch}. {fitScore.topGap}.
          </div>
        )}
      </div>
    </Link>
  );
}
