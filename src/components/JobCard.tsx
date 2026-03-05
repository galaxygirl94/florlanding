import Link from "next/link";
import { JobListing } from "@/data/types";

interface JobCardProps {
  job: JobListing;
  index?: number;
}

export default function JobCard({ job, index = 0 }: JobCardProps) {
  const delayClass =
    index === 0
      ? "animate-fade-in-up"
      : index === 1
      ? "animate-fade-in-up-delay-1"
      : index === 2
      ? "animate-fade-in-up-delay-2"
      : "animate-fade-in-up-delay-3";

  const fitColor =
    (job.fitScore ?? 0) >= 90
      ? "bg-success text-white"
      : (job.fitScore ?? 0) >= 80
      ? "bg-periwinkle text-white"
      : "bg-amber text-white";

  return (
    <Link href={`/jobs/${job.id}`}>
      <div
        className={`bg-white rounded-2xl border border-periwinkle-100/40 overflow-hidden hover:border-periwinkle/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group h-full flex flex-col ${delayClass}`}
      >
        <div className="h-1.5 bg-gradient-to-r from-periwinkle via-periwinkle-light to-periwinkle-200" />

        <div className="p-5 sm:p-6 flex flex-col flex-1">
          {/* Top row: title + fit score */}
          <div className="flex items-start justify-between gap-3 mb-1">
            <h3 className="text-lg font-bold text-text group-hover:text-periwinkle transition-colors leading-snug">
              {job.title}
            </h3>
            {job.fitScore != null && (
              <div className={`w-11 h-11 rounded-full ${fitColor} flex items-center justify-center flex-shrink-0`}>
                <span className="text-sm font-extrabold">{job.fitScore}</span>
              </div>
            )}
          </div>

          {/* Facility + location */}
          <div className="flex items-center gap-2 mb-4">
            <p className="text-sm text-text-muted truncate">{job.facilityName}</p>
            <span className="text-periwinkle-100 flex-shrink-0">&middot;</span>
            <span className="flex items-center gap-1 text-xs text-text-muted flex-shrink-0">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              {job.location.city}, {job.location.state}
            </span>
          </div>

          {/* Pay — hero element */}
          <div className="bg-periwinkle-50/60 rounded-xl p-4 mb-4">
            <div className="text-2xl font-extrabold text-periwinkle-dark leading-none">
              ${job.payRange.min}–${job.payRange.max}
              <span className="text-sm font-semibold text-periwinkle ml-1">/{job.payUnit}</span>
            </div>
            {(job.signOnBonus ?? 0) > 0 ? (
              <p className="text-xs font-bold text-success mt-1.5">+ ${job.signOnBonus!.toLocaleString()} sign-on bonus</p>
            ) : (
              <p className="text-xs text-text-muted mt-1.5 leading-relaxed line-clamp-1">{job.payExplained}</p>
            )}
          </div>

          {/* Patient ratio */}
          {job.patientRatio && job.patientRatio !== "N/A" && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-bold text-text">{job.patientRatio}</span>
              <span className="text-xs text-text-light">patient ratio</span>
              {job.patientRatioVerified && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-success bg-success-light px-2 py-0.5 rounded-full">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  Verified
                </span>
              )}
            </div>
          )}

          {/* Schedule badges */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {job.scheduleBadges.slice(0, 4).map((badge) => (
              <span
                key={badge}
                className="text-xs font-medium bg-white text-text-light px-2.5 py-1 rounded-full border border-periwinkle-100/60"
              >
                {badge}
              </span>
            ))}
          </div>

          {/* Special badges */}
          <div className="flex flex-wrap gap-1.5 mb-4">
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
            {job.tuitionReimbursement && (
              <span className="text-xs font-bold bg-info/10 text-info px-2.5 py-1 rounded-full border border-info/20">
                Tuition Reimbursement
              </span>
            )}
            {job.relocationAssistance && (
              <span className="text-xs font-bold bg-rose-light text-rose px-2.5 py-1 rounded-full border border-rose/20">
                Relocation
              </span>
            )}
          </div>

          {/* Footer meta */}
          <div className="flex items-center gap-x-3 text-xs text-text-muted mt-auto pt-3 border-t border-periwinkle-100/30">
            <span className="font-semibold text-text-light">{job.type}</span>
            {job.ehrSystem && (
              <>
                <span className="text-periwinkle-100">&middot;</span>
                <span className="bg-warm-gray px-2 py-0.5 rounded-md font-medium">{job.ehrSystem}</span>
              </>
            )}
            {job.fitScore != null && (
              <>
                <span className="text-periwinkle-100">&middot;</span>
                <span className="font-bold text-periwinkle">Fit {job.fitScore}%</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
