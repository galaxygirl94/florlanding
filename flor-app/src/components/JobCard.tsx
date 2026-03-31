import Link from "next/link";
import { JobListing } from "@/data/types";

interface JobCardProps {
  job: JobListing;
  fitScore?: number | null;
  index?: number;
}

const SPECIALTY_COLORS: Record<string, string> = {
  "Med-Surg": "bg-blue-100 text-blue-700",
  "ICU/Critical Care": "bg-red-100 text-red-700",
  "Emergency": "bg-orange-100 text-orange-700",
  "Pediatrics": "bg-pink-100 text-pink-700",
  "Psychiatry": "bg-purple-100 text-purple-700",
  "Home Health": "bg-green-100 text-green-700",
  "Rehab": "bg-teal-100 text-teal-700",
  "SNF/LTC": "bg-yellow-100 text-yellow-700",
  "OR/Perioperative": "bg-indigo-100 text-indigo-700",
  "Community Health": "bg-emerald-100 text-emerald-700",
  "School Nursing": "bg-lime-100 text-lime-700",
  "Outpatient/Clinic": "bg-cyan-100 text-cyan-700",
};

function fmtPay(n: number): string {
  return Number.isInteger(n) ? `${n}` : n.toFixed(2);
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

  const specialtyColor = SPECIALTY_COLORS[job.specialty] ?? "bg-periwinkle-100 text-periwinkle-dark";

  const payMin = job.payMin ?? job.payRange?.min;
  const payMax = job.payMax ?? job.payRange?.max;

  return (
    <Link href={`/jobs/${job.id}`}>
      <div
        className={`bg-white rounded-2xl p-5 sm:p-6 card-shadow hover:card-shadow-hover transition-all duration-300 cursor-pointer group ${delayClass}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${specialtyColor}`}>
                {job.specialty}
              </span>
              {job.verified && (
                <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Flor Verified
                </span>
              )}
              {job.loanForgivenessEligible && (
                <span className="text-xs font-semibold bg-amber/20 text-amber-dark px-2 py-0.5 rounded-full">
                  PSLF Eligible
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-text group-hover:text-periwinkle transition-colors">
              {job.title}
            </h3>
            <p className="text-sm text-text-light mt-0.5">{job.facilityName} · {job.location.city}, {job.location.state}</p>
          </div>
          {fitScore != null && (
            <div className="flex-shrink-0 bg-periwinkle-50 rounded-xl px-3 py-2 text-center self-start">
              <div className="text-lg font-bold text-periwinkle">{fitScore}%</div>
              <div className="text-[10px] font-medium text-periwinkle-dark">Flor Fit</div>
            </div>
          )}
        </div>

        {/* Pay */}
        <div className="bg-periwinkle-50 rounded-xl p-3 mb-3">
          <div className="text-xl font-bold text-periwinkle">
            {payMin != null && payMax != null
              ? `$${fmtPay(payMin)} – $${fmtPay(payMax)}`
              : "Pay on request"}
            <span className="text-sm font-normal text-periwinkle-dark">/{job.payUnit}</span>
          </div>
          {job.nightDifferential && (
            <p className="text-xs text-text-light mt-0.5">+${job.nightDifferential}/hr night differential</p>
          )}
          {job.signOnBonus && (
            <p className="text-xs font-semibold text-amber-dark mt-0.5">${job.signOnBonus.toLocaleString()} sign-on bonus</p>
          )}
        </div>

        {/* Schedule badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {job.scheduleBadges.slice(0, 4).map((badge) => (
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

        {/* Footer row */}
        <div className="flex items-center justify-between text-xs text-text-light">
          <div className="flex items-center gap-3">
            <span>{job.employmentType}</span>
            {job.ehrSystem && <span className="bg-gray-100 px-2 py-0.5 rounded-full">{job.ehrSystem}</span>}
          </div>
          <span className="text-periwinkle font-medium group-hover:underline">View Position →</span>
        </div>
      </div>
    </Link>
  );
}
