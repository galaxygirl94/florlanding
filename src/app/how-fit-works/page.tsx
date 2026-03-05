import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "How Flor Fit Works — Smart Job Matching for Nurses | Flor",
  description:
    "See how our Fit Score algorithm matches you with the right nursing jobs based on schedule, specialty, commute, pay, and culture.",
};

const factors = [
  {
    label: "Schedule Match",
    desc: "We compare every listing's shift pattern — days, nights, rotating, weekends, PRN — against the hours you actually want to work.",
    score: 95,
    color: "bg-success",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: "Specialty Match",
    desc: "Your certifications, skills, and clinical experience are scored against what the facility is actually looking for.",
    score: 90,
    color: "bg-periwinkle",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
  },
  {
    label: "Commute Distance",
    desc: "We calculate the real drive time from your home to the facility — not just zip code proximity, but actual commute.",
    score: 85,
    color: "bg-periwinkle",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
  },
  {
    label: "Pay Alignment",
    desc: "We match the listed pay range against what you've told us you're looking for — no guessing, no bait-and-switch.",
    score: 78,
    color: "bg-amber",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: "Facility Culture",
    desc: "Nurse reviews, management style, staff ratios, and workplace vibe — scored so you know what you're walking into.",
    score: 92,
    color: "bg-success",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
];

export default function HowFitWorksPage() {
  return (
    <div>
      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-periwinkle-50 to-white">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-periwinkle/5 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/4" />
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-20 sm:pt-28 pb-16 sm:pb-20">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <span className="inline-flex items-center gap-2 text-periwinkle text-sm font-bold uppercase tracking-wider mb-6">
              <span className="w-8 h-px bg-periwinkle" />
              Smart matching
              <span className="w-8 h-px bg-periwinkle" />
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text leading-[1.06] tracking-tight mb-6">
              Your Flor Fit Score, explained.
            </h1>
            <p className="text-lg sm:text-xl text-text-light leading-relaxed max-w-2xl mx-auto">
              Stop guessing if a job is right for you. Our algorithm scores every listing against what actually matters to you — and tells you exactly why.
            </p>
          </div>
        </div>
      </section>

      {/* ========== THREE STEPS ========== */}
      <section className="bg-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-24 sm:py-32">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text mb-4">How it works</h2>
            <p className="text-lg text-text-light max-w-xl mx-auto">Three steps. No complexity. No games.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-20">
            {[
              {
                step: "01",
                title: "Tell us what matters to you",
                desc: "When you create your Flor profile, you tell us what you care about: your ideal schedule, preferred location and max commute, pay expectations, specialty and certifications, and the kind of workplace culture where you thrive.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                ),
              },
              {
                step: "02",
                title: "We score every job against your preferences",
                desc: "Our algorithm evaluates each listing across five factors — schedule, specialty, commute, pay, and culture — and weights them based on what you told us matters most. No black box. No mystery.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                  </svg>
                ),
              },
              {
                step: "03",
                title: "You see your top matches ranked by Fit Score",
                desc: "Every job shows a 0–100 Fit Score with a plain-English breakdown of why. You'll know at a glance whether it's worth your time — before you spend a single minute applying.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <div
                key={item.step}
                className={`text-center ${
                  i === 0 ? "animate-fade-in-up" : i === 1 ? "animate-fade-in-up-delay-1" : "animate-fade-in-up-delay-2"
                }`}
              >
                <div className="w-16 h-16 rounded-2xl bg-periwinkle-50 flex items-center justify-center text-periwinkle mx-auto mb-6">
                  {item.icon}
                </div>
                <div className="text-xs font-bold text-periwinkle uppercase tracking-widest mb-3">Step {item.step}</div>
                <h3 className="font-extrabold text-xl text-text mb-3">{item.title}</h3>
                <p className="text-base text-text-light leading-relaxed max-w-sm mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Connecting line (visual) */}
          <div className="hidden md:block relative -mt-[16.5rem] mb-32">
            <div className="absolute top-8 left-[16.67%] right-[16.67%] h-px bg-periwinkle-100" />
          </div>
        </div>
      </section>

      {/* ========== FIVE FACTORS — product showcase with photo ========== */}
      <section className="bg-gradient-to-b from-periwinkle-50 to-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-24 sm:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 xl:gap-24 items-center">
            {/* Photo with floating score card */}
            <div className="relative lg:col-span-6 animate-fade-in-up">
              <div className="relative rounded-3xl overflow-hidden hero-shadow aspect-[4/5]">
                <Image
                  src="/nurse-confident.jpg"
                  alt="Nurse in green scrubs writing on clipboard"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E2E]/30 to-transparent" />
              </div>

              {/* Floating score card */}
              <div className="absolute -bottom-6 right-4 sm:bottom-8 sm:-right-4 lg:-right-8 bg-white rounded-2xl section-shadow p-5 sm:p-6 w-60 sm:w-72 animate-float">
                <div className="flex items-center gap-4 mb-5">
                  <div className="relative w-18 h-18 sm:w-20 sm:h-20 flex-shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="34" fill="none" stroke="#E4E5F4" strokeWidth="5" />
                      <circle cx="40" cy="40" r="34" fill="none" stroke="#8B8FD4" strokeWidth="5" strokeDasharray="186 28" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl sm:text-3xl font-extrabold text-periwinkle">87</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-periwinkle uppercase tracking-wider">Flor Fit</div>
                    <div className="text-xs text-text-muted mt-0.5">Match Score</div>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {factors.map((f) => (
                    <div key={f.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-text-muted font-medium">{f.label}</span>
                        <span className="font-bold text-text">{f.score}%</span>
                      </div>
                      <div className="h-2 bg-periwinkle-50 rounded-full overflow-hidden">
                        <div className={`h-full ${f.color} rounded-full`} style={{ width: `${f.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Five factors detail */}
            <div className="lg:col-span-6 animate-fade-in-up-delay-1">
              <span className="inline-flex items-center gap-2 text-periwinkle text-sm font-bold uppercase tracking-wider mb-6">
                <span className="w-8 h-px bg-periwinkle" />
                The five factors
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-text leading-[1.12] mb-4">
                Five dimensions. One clear score.
              </h2>
              <p className="text-lg text-text-light leading-relaxed mb-10">
                Every Fit Score is built from five factors, each weighted by what you told us matters most.
              </p>

              <div className="space-y-6">
                {factors.map((f) => (
                  <div key={f.label} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-periwinkle-50 flex items-center justify-center text-periwinkle flex-shrink-0">
                      {f.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-text">{f.label}</h4>
                        <span className="text-sm font-bold text-periwinkle">{f.score}%</span>
                      </div>
                      <p className="text-sm text-text-light leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== WHY IT MATTERS ========== */}
      <section className="bg-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-24 sm:py-32">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text mb-6">
              No black boxes. No mystery algorithms.
            </h2>
            <p className="text-lg text-text-light leading-relaxed mb-8">
              Most job platforms use opaque algorithms that optimize for the platform, not for you. Flor Fit is different — every score comes with a plain-English explanation. You&apos;ll always know exactly why a job scored the way it did, and what you can do about it.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center mt-12">
              {[
                { stat: "0–100", label: "Clear score on every job" },
                { stat: "5", label: "Factors you control" },
                { stat: "100%", label: "Transparent — always" },
              ].map((item) => (
                <div key={item.label} className="bg-periwinkle-50 rounded-2xl p-6">
                  <div className="text-3xl sm:text-4xl font-extrabold text-periwinkle mb-2">{item.stat}</div>
                  <div className="text-sm font-medium text-text-light">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="bg-[#1E1E2E] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-periwinkle/8 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-periwinkle/8 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4" />

        <div className="relative max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-24 sm:py-32 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
            Ready to see your Fit Scores?
          </h2>
          <p className="text-lg sm:text-xl text-white/60 mb-10 max-w-lg mx-auto leading-relaxed">
            Create your free profile and let our algorithm do the work. You&apos;ll see personalized Fit Scores on every job in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/nurse-profile"
              className="bg-white text-[#1E1E2E] font-bold px-10 py-4 rounded-full text-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Create Your Profile — Free
            </Link>
            <Link
              href="/jobs"
              className="bg-white/10 hover:bg-white/15 text-white font-bold px-10 py-4 rounded-full text-lg border border-white/20 transition-all duration-200"
            >
              Browse Jobs First
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
