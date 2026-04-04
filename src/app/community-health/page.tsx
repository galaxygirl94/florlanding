import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Community Health Nursing Careers | Flor",
  description:
    "Find community health nursing jobs that let you build real relationships, work mission-driven, and qualify for Public Service Loan Forgiveness. Browse on Flor.",
};

export default function CommunityHealthPage() {
  return (
    <div className="bg-white">
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="bg-[#1E1E2E] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-periwinkle/10 rounded-full blur-[140px]" />
        <div className="relative max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 py-24 sm:py-32 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 text-periwinkle text-sm font-bold uppercase tracking-wider mb-6">
              <span className="w-8 h-px bg-periwinkle" />
              Community Health Nursing
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.06] tracking-tight">
              The jobs that change communities.
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-white/70 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Community health nurses work where care is needed most — in homes, schools, clinics, and neighborhoods. If you want your work to mean something beyond the shift, this is where you start.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                href="/jobs"
                className="bg-periwinkle hover:bg-periwinkle-dark text-white font-bold px-8 py-4 rounded-full text-base transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-center"
              >
                Browse Community Health Jobs &rarr;
              </Link>
            </div>
          </div>
          <div className="flex-shrink-0 w-full lg:w-[420px]">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
              <Image
                src="/images/nurse-community.jpg"
                alt="Community health nurse with patient"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E2E]/40 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ── What is Community Health Nursing ──────────────────── */}
      <section className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 py-20 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-xl order-2 lg:order-1">
            <Image
              src="/images/nurse-hands.jpg"
              alt="Nurse providing community care"
              fill
              className="object-cover"
            />
          </div>
          <div className="order-1 lg:order-2">
            <span className="text-periwinkle text-sm font-bold uppercase tracking-wider">What is it?</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-text leading-tight">
              Nursing that goes beyond the hospital walls
            </h2>
            <p className="mt-5 text-base sm:text-lg text-text-light leading-relaxed">
              Community health nursing focuses on the health of entire populations, not just individual patients in a clinical setting. It spans public health departments, community health centers, home health agencies, school systems, correctional facilities, and nonprofit clinics.
            </p>
            <p className="mt-4 text-base sm:text-lg text-text-light leading-relaxed">
              You might be running immunization clinics one week, conducting home visits for high-risk patients the next, or training community members on chronic disease management. The work is diverse, independent, and deeply connected to the people you serve.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Public Health", "Home Health", "School Nursing", "FQHC / CHC", "Correctional Health", "Outpatient Clinic"].map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-semibold text-periwinkle bg-periwinkle/8 border border-periwinkle/20 px-3 py-1.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Nurses Choose Community Health ───────────────── */}
      <section className="bg-[#F4F4FB] py-20 sm:py-24">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="text-center mb-12">
            <span className="text-periwinkle text-sm font-bold uppercase tracking-wider">Why nurses choose it</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-text leading-tight">
              Four reasons this path sticks
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: (
                  <svg className="w-6 h-6 text-periwinkle" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                title: "Consistent relationships",
                body: "You follow the same patients over months and years — not just one admission. You see your interventions actually work.",
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-periwinkle" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                ),
                title: "Mission-driven work",
                body: "You're working on health equity, access, and prevention — not throughput metrics. The mission is built into the job.",
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-periwinkle" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
                title: "Schedule stability",
                body: "Most community health roles are Monday–Friday, daytime hours. No rotating nights. No mandatory holiday call. Real weekends.",
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-periwinkle" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "PSLF eligible",
                body: "Many community health employers qualify for Public Service Loan Forgiveness. That can mean tens of thousands in forgiven federal student loans.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-7 shadow-sm border border-periwinkle-100/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-periwinkle/8 flex items-center justify-center mb-5">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-text mb-2">{item.title}</h3>
                <p className="text-sm text-text-light leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Flor + Community Health ───────────────────────────── */}
      <section className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 py-20 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <span className="text-periwinkle text-sm font-bold uppercase tracking-wider">Flor + community health</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-text leading-tight">
              Finally, a job board that respects this work
            </h2>
            <p className="mt-5 text-base sm:text-lg text-text-light leading-relaxed">
              Community health roles are historically underrepresented on major job boards — buried under hospital postings, listed without pay ranges, or hidden behind recruiter walls. That's not right.
            </p>
            <p className="mt-4 text-base sm:text-lg text-text-light leading-relaxed">
              On Flor, every listing includes verified pay ranges, nurse-reported staffing data, and real reviews from nurses already doing the work. Community health jobs are posted directly by employers — no middlemen, no mystery.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Transparent pay ranges on every posting",
                "Nurse-reported unit reviews",
                "Direct contact with hiring managers",
                "Ethics Pledge — no misleading listings",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm sm:text-base text-text">
                  <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-success-light flex items-center justify-center">
                    <svg className="w-3 h-3 text-success-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-xl">
            <Image
              src="/images/nurse-confident.jpg"
              alt="Confident community health nurse"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── PSLF Callout ─────────────────────────────────────── */}
      <section className="bg-[#F4F4FB] py-16 sm:py-20">
        <div className="max-w-[900px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="bg-gradient-to-br from-periwinkle/8 via-white to-success-light/30 rounded-3xl border border-periwinkle/15 p-8 sm:p-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-periwinkle/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-periwinkle" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <span className="text-xs font-bold text-periwinkle uppercase tracking-wider">Student Loans</span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-text mt-1">Public Service Loan Forgiveness (PSLF)</h3>
              </div>
            </div>
            <p className="text-base sm:text-lg text-text-light leading-relaxed mb-4">
              Nurses employed full-time at qualifying nonprofit or government employers — including most community health centers, public health departments, and FQHCs — may be eligible for PSLF after 10 years of qualifying payments on federal student loans.
            </p>
            <p className="text-base text-text-light leading-relaxed mb-6">
              For nurses with significant federal student loan balances, PSLF can represent tens of thousands of dollars in forgiven debt. Eligibility depends on your loan type, repayment plan, and employer status. Verify your employer at <strong className="text-text">studentaid.gov</strong>.
            </p>
            <div className="bg-amber/8 border border-amber/20 rounded-xl px-5 py-4 text-sm text-text-light">
              <strong className="text-amber-dark">Note:</strong> Flor does not provide tax or financial advice. PSLF eligibility is determined by the U.S. Department of Education. Always verify your employer and loan details at studentaid.gov before making employment decisions based on PSLF.
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonial ──────────────────────────────────────── */}
      <section className="max-w-[900px] mx-auto px-6 sm:px-10 lg:px-16 py-20 sm:py-24 text-center">
        <svg className="w-10 h-10 text-periwinkle/30 mx-auto mb-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
        <blockquote className="text-xl sm:text-2xl lg:text-3xl font-bold text-text leading-snug mb-8 max-w-2xl mx-auto">
          &ldquo;I spent five years in a med/surg unit that was burning me out. Community health gave me my patients back — and my weekends. I didn&apos;t know this kind of nursing existed the way it does.&rdquo;
        </blockquote>
        <div className="flex items-center justify-center gap-4">
          <div className="w-12 h-12 rounded-full bg-periwinkle/10 flex items-center justify-center text-lg font-bold text-periwinkle">
            D
          </div>
          <div className="text-left">
            <div className="font-bold text-text text-sm">Denise R.</div>
            <div className="text-xs text-text-muted">Community Health RN, 7 years</div>
          </div>
        </div>
      </section>

      {/* ── CTA Footer ───────────────────────────────────────── */}
      <section className="bg-[#1E1E2E] py-20 sm:py-24">
        <div className="max-w-[900px] mx-auto px-6 sm:px-10 lg:px-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to find your role?
          </h2>
          <p className="text-white/70 text-base sm:text-lg max-w-lg mx-auto mb-10">
            Browse community health nursing jobs with transparent pay, real reviews, and direct access to hiring managers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/jobs"
              className="bg-periwinkle hover:bg-periwinkle-dark text-white font-bold px-10 py-4 rounded-full text-base transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-center"
            >
              Browse Jobs &rarr;
            </Link>
            <Link
              href="/nurse-profile"
              className="bg-white/10 hover:bg-white/15 text-white font-bold px-10 py-4 rounded-full text-base border border-white/20 transition-all duration-200 text-center"
            >
              Create Your Profile
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
