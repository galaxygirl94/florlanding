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
        className={`bg-white rounded-2xl p-5 sm:p-6 card-shadow hover:card-shadow-hover transition-all duration-300 cursor-pointer group ${delayClass}`}
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
            <div className="flex-shrink-0 bg-periwinkle-50 rounded-xl px-3 py-2 text-center self-start">
              <div className="text-lg font-bold text-periwinkle">{fitScore.score}/100</div>
              <div className="text-[10px] font-medium text-periwinkle-dark">Flor Fit</div>
            </div>
          )}
        </div>

        {/* Pay — most prominent */}
        <div className="bg-periwinkle-50 rounded-xl p-3 sm:p-4 mb-4">
          <div className="text-xl sm:text-2xl font-bold text-periwinkle">
            ${job.payRange.min.toFixed(2)} - ${job.payRange.max.toFixed(2)}
            <span className="text-sm font-normal text-periwinkle-dark">/{job.payUnit}</span>
          </div>
          <p className="text-xs text-text-light mt-1">{job.payExplained}</p>
        </div>

        {/* Schedule badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          {job.scheduleBadges.map((badge) => (
            <span
              key={badge}
              className="text-xs font-medium bg-periwinkle-100 text-periwinkle-dark px-2.5 py-1 rounded-full"
            >
              {badge}
            </span>
          ))}
          {job.union && (
            <span className="text-xs font-semibold bg-amber/20 text-amber-dark px-2.5 py-1 rounded-full">
              Union
            </span>
          )}
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-light">
          <span>{job.location.city}, {job.location.state}</span>
          <span>{job.type}</span>
          {job.ehrSystem && <span className="bg-gray-100 px-2 py-0.5 rounded-full">{job.ehrSystem}</span>}
        </div>

        {/* Fit score explanation */}
        {fitScore && (
          <div className="mt-3 pt-3 border-t border-periwinkle-100 text-xs text-text-light">
            {fitScore.topMatch}. {fitScore.topGap}.
          </div>
        )}
      </div>
    </Link>
  );
}
