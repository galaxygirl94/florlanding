import Link from "next/link";
import JobCard from "@/components/JobCard";
import { seedJobs } from "@/data/seed-jobs";

const CERTS = [
  { name: "BLS (Basic Life Support)", what: "CPR certification from AHA", who: "Required by almost every employer", where: "American Heart Association" },
  { name: "ACLS (Advanced Cardiac Life Support)", what: "Advanced emergency response", who: "ICU, ER, Step-Down, OR", where: "AHA — get after BLS" },
  { name: "PALS (Pediatric Advanced Life Support)", what: "Pediatric emergency care", who: "Pediatrics, PICU, ER", where: "AHA" },
  { name: "NIH Stroke Scale", what: "Stroke assessment certification", who: "Neuro, ER, Med/Surg", where: "Free online cert" },
];

export default function StudentsPage() {
  const newGradJobs = seedJobs.filter((j) => j.newGradsWelcome);

  return (
    <div className="bg-[#F4F4FB]">
      {/* Hero */}
      <section className="bg-[#1E1E2E] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-periwinkle/8 rounded-full blur-[120px]" />
        <div className="relative max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 py-20 sm:py-28">
          <div className="max-w-2xl animate-fade-in-up">
            <span className="inline-flex items-center gap-2 text-periwinkle text-sm font-bold uppercase tracking-wider mb-5">
              <span className="w-8 h-px bg-periwinkle" />
              For nursing students
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.08] tracking-tight">
              Your nursing career starts before graduation.
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-white/75 leading-relaxed max-w-xl">
              Flor helps nursing students understand the job market, prepare for their first role, and connect directly with employers — no recruiters, no spam, ever.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/nurse-profile"
                className="bg-periwinkle hover:bg-periwinkle-dark text-white font-bold px-8 py-4 rounded-full text-base transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-center"
              >
                Save Jobs for Later
              </Link>
              <Link
                href="/jobs"
                className="bg-white/10 hover:bg-white/15 text-white font-bold px-8 py-4 rounded-full text-base border border-white/20 transition-all duration-200 text-center"
              >
                Browse All Jobs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: How to Read a Job Listing */}
      <section className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 py-16 sm:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text leading-tight mb-3">
            What job listings actually mean — and what they&apos;re hiding
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            {
              icon: "💰", title: "What a pay range really means",
              body: "When an employer posts $34-$49/hr, that range usually reflects experience level, shift type, or unit. Ask which end you'd start at and what it takes to move up. On Flor, employers are required to explain their range — you'll always know why.",
            },
            {
              icon: "🌙", title: "Night and weekend pay",
              body: "Most hospitals pay extra for nights, weekends, and holidays — typically 10-20% above base. This is called a shift differential. It's rarely in the headline pay — look for it in the benefits section or ask directly. Flor surfaces it on every card when employers provide it.",
            },
            {
              icon: "✦", title: "Sign-on bonuses have strings",
              body: "A $5,000 sign-on bonus sounds great — but most come with a 12-24 month commitment. If you leave early, you may owe it back (prorated). Read the conditions before you factor it into your decision.",
            },
            {
              icon: "🎓", title: "What tuition reimbursement is actually worth",
              body: "Employers who offer tuition reimbursement typically cover $2,500-$5,250/year toward continuing education. That's $10,000-$21,000 over four years toward going ADN to BSN. It's one of the most valuable benefits a new grad can look for.",
            },
          ].map((card) => (
            <div key={card.title} className="bg-white rounded-2xl p-7 section-shadow hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-periwinkle-50 flex items-center justify-center text-2xl mb-5">
                {card.icon}
              </div>
              <h3 className="text-lg font-bold text-text mb-2">{card.title}</h3>
              <p className="text-sm text-text-light leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Certifications */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 py-16 sm:py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text leading-tight mb-3">
              Certifications that open doors
            </h2>
            <p className="text-lg text-text-light leading-relaxed">
              Most hospitals require these before your first day. Get them before you graduate and you&apos;ll be ahead of 80% of applicants.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CERTS.map((cert) => (
              <div key={cert.name} className="bg-[#F4F4FB] rounded-2xl p-6 border border-periwinkle-100/40">
                <h3 className="text-base font-bold text-text mb-3">{cert.name}</h3>
                <div className="space-y-2 text-sm text-text-light">
                  <div><span className="font-semibold text-text">What:</span> {cert.what}</div>
                  <div><span className="font-semibold text-text">Who needs it:</span> {cert.who}</div>
                  <div><span className="font-semibold text-text">Where:</span> {cert.where}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-periwinkle-50 rounded-2xl p-5 max-w-3xl mx-auto">
            <p className="text-sm text-text-light leading-relaxed text-center">
              <span className="font-bold text-text">Note:</span> BLS is the only one required at hiring for most positions. ACLS and PALS are often provided by the employer after hire — don&apos;t let their absence hold you back from applying.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: New Grad-Friendly Jobs */}
      {newGradJobs.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 py-16 sm:py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text leading-tight mb-3">
              Jobs open to new graduates right now
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
            {newGradJobs.map((job, i) => (
              <JobCard key={job.id} job={job} index={i} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/nurse-profile"
              className="inline-flex items-center gap-2 bg-periwinkle hover:bg-periwinkle-dark text-white font-bold px-8 py-3.5 rounded-full transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Save jobs to apply when you&apos;re licensed
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </section>
      )}

      {/* Section 4: Nurse Residency Programs */}
      <section className="bg-[#1E1E2E]">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 py-16 sm:py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-3">
              Start your career with support
            </h2>
            <p className="text-lg text-white/60 leading-relaxed">
              Nurse residency programs give new grads structured training, mentorship, and a cohort of peers during your first year. They&apos;re competitive — apply early.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-7">
              <div className="text-xs font-bold text-periwinkle uppercase tracking-wider mb-3">Brown University Health</div>
              <h3 className="text-xl font-bold text-white mb-2">Rhode Island Hospital Nurse Residency Program</h3>
              <p className="text-sm text-white/60 mb-4">Providence, RI</p>
              <ul className="space-y-2 text-sm text-white/75">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-periwinkle mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Year-long structured program, cohort-based
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-periwinkle mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Mentored by experienced RNs
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-periwinkle mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Multiple specialties available
                </li>
              </ul>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-7">
              <div className="text-xs font-bold text-periwinkle uppercase tracking-wider mb-3">Community Hospital</div>
              <h3 className="text-xl font-bold text-white mb-2">South County Health</h3>
              <p className="text-sm text-white/60 mb-4">Wakefield, RI</p>
              <ul className="space-y-2 text-sm text-white/75">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-periwinkle mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Community hospital environment
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-periwinkle mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Smaller cohort, direct mentorship
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-periwinkle mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Contact HR directly for availability
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Build Your Profile Now */}
      <section className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 py-16 sm:py-20 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-text leading-tight mb-3">
          You don&apos;t need a license to get started
        </h2>
        <p className="text-lg text-text-light leading-relaxed max-w-xl mx-auto mb-8">
          Create your Flor profile as a student. Save jobs you&apos;re interested in, track what certifications employers are asking for, and be ready to apply the day you pass your NCLEX.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/nurse-profile"
            className="bg-periwinkle hover:bg-periwinkle-dark text-white font-bold px-10 py-4 rounded-full text-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Create Student Profile
          </Link>
          <Link
            href="/jobs"
            className="bg-white hover:bg-periwinkle-50 text-text font-bold px-10 py-4 rounded-full text-lg border border-periwinkle-100/60 transition-all duration-200"
          >
            Browse All Jobs
          </Link>
        </div>
      </section>
    </div>
  );
}
