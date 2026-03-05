import Link from "next/link";
import Image from "next/image";
import { seedFacilities } from "@/data/seed-facilities";
import { seedJobs } from "@/data/seed-jobs";

export function generateStaticParams() {
  return seedFacilities.map((f) => ({ id: f.id }));
}

export default async function FacilityProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const facility = seedFacilities.find((f) => f.id === id);
  const facilityJobs = seedJobs.filter((j) => j.facilityId === id);

  if (!facility) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Facility not found</h1>
        <Link href="/jobs" className="text-periwinkle hover:text-periwinkle-dark transition-colors font-semibold">Back to jobs</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="animate-fade-in-up">
        {/* Photo banner */}
        <div className="relative rounded-2xl overflow-hidden hero-shadow mb-6 sm:mb-8 h-[200px] sm:h-[260px]">
          <Image
            src="/nurse-fistbump.png"
            alt="Nurse fist-bumping young patient — collaborative care at its best"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1E1E2E]/65 via-[#1E1E2E]/30 to-transparent" />
          <div className="absolute inset-0 flex items-end px-6 sm:px-8 pb-6">
            <p className="text-white/80 text-sm font-medium">The kind of workplace nurses want to find through Flor</p>
          </div>
        </div>

        {/* Header card */}
        <div className="bg-white rounded-2xl border border-periwinkle-100/40 p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-text">{facility.name}</h1>
              <p className="text-text-light mt-1.5 text-sm sm:text-base flex items-center gap-1.5">
                <svg className="w-4 h-4 text-text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                {facility.location.city}, {facility.location.state}
                {facility.location.address && ` · ${facility.location.address}`}
              </p>
              <span className="inline-block mt-3 bg-periwinkle-50 text-periwinkle-dark text-xs font-bold px-3 py-1.5 rounded-full">
                {facility.type}
              </span>
            </div>
            <div className="flex-shrink-0 bg-amber/5 border border-amber/10 rounded-2xl px-5 py-3.5 text-center self-start">
              <div className="text-2xl font-extrabold text-amber-dark">{facility.starRating}</div>
              <div className="flex gap-0.5 justify-center mt-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-3.5 h-3.5 ${star <= Math.round(facility.starRating) ? "text-amber" : "text-periwinkle-100"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <div className="text-[10px] text-text-muted mt-1 font-medium">
                {facility.reviewCount} review{facility.reviewCount !== 1 ? "s" : ""}
              </div>
            </div>
          </div>

          <p className="text-sm leading-relaxed mb-6 text-text-light">{facility.description}</p>

          {/* Culture */}
          <div className="bg-periwinkle-50/60 rounded-xl p-5 mb-6">
            <h3 className="text-xs font-bold text-periwinkle-dark uppercase tracking-wider mb-2">Workplace Culture</h3>
            <p className="text-sm text-text leading-relaxed">{facility.culture}</p>
          </div>

          {/* Details */}
          <div className="flex flex-wrap gap-3 text-sm">
            {facility.ehrSystem && (
              <span className="bg-warm-gray px-4 py-2 rounded-full font-semibold text-text-light">
                EHR: {facility.ehrSystem}
              </span>
            )}
            <button className="bg-periwinkle text-white px-6 py-2.5 rounded-full font-bold hover:bg-periwinkle-dark transition-all duration-200 min-h-[44px] shadow-sm shadow-periwinkle/15">
              Contact Facility
            </button>
          </div>
        </div>

        {/* Reviews */}
        {facility.reviews.length > 0 && (
          <div className="bg-white rounded-2xl border border-periwinkle-100/40 p-6 sm:p-8 mb-6 animate-fade-in-up-delay-1">
            <h2 className="text-lg sm:text-xl font-extrabold mb-6">Nurse Reviews</h2>
            <div className="space-y-4">
              {facility.reviews.map((review) => (
                <div key={review.id} className="border border-periwinkle-100/40 rounded-xl p-5 hover:border-periwinkle/30 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-periwinkle-50 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-periwinkle">{review.authorInitials}</span>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-text">{review.role}</div>
                        <div className="text-xs text-text-muted">{review.date}</div>
                      </div>
                    </div>
                    <div className="flex gap-0.5 self-start sm:self-auto">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-4 h-4 ${star <= review.rating ? "text-amber" : "text-periwinkle-100"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-text-light">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Open Positions */}
        {facilityJobs.length > 0 && (
          <div className="bg-white rounded-2xl border border-periwinkle-100/40 p-6 sm:p-8 animate-fade-in-up-delay-2">
            <h2 className="text-lg sm:text-xl font-extrabold mb-6">Open Positions</h2>
            <div className="space-y-3">
              {facilityJobs.map((job) => (
                <Link key={job.id} href={`/jobs/${job.id}`}>
                  <div className="border border-periwinkle-100/40 rounded-xl p-5 hover:border-periwinkle/40 hover:bg-periwinkle-50/30 transition-all duration-200 cursor-pointer group">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-sm group-hover:text-periwinkle transition-colors">{job.title}</h3>
                        <p className="text-xs text-text-muted mt-0.5">{job.type} · {job.location.city}, {job.location.state}</p>
                      </div>
                      <div className="text-lg font-extrabold text-periwinkle self-start sm:self-auto">
                        ${job.payRange.min}–${job.payRange.max}/{job.payUnit}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
