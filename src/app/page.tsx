import Link from "next/link";
import Image from "next/image";
import JobCard from "@/components/JobCard";
import { seedJobs } from "@/data/seed-jobs";

export default function HomePage() {
  return (
    <div>
      {/* ========== HERO — full viewport, edge-to-edge ========== */}
      <section className="relative overflow-hidden min-h-[92vh] flex items-center">
        <Image
          src="/nurse-hero.png"
          alt="Nurse smiling outdoors with coffee"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E1E2E]/90 via-[#1E1E2E]/65 to-[#1E1E2E]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E2E]/50 via-transparent to-[#1E1E2E]/10" />

        <div className="relative w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-28 sm:py-36">
          <div className="max-w-2xl xl:max-w-3xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full mb-8">
              <div className="w-2 h-2 bg-periwinkle-light rounded-full" />
              <span className="text-sm font-semibold text-white/90">Built by nurses, for nurses</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.06] tracking-tight">
              You deserve better than spam and ghost&nbsp;jobs.
            </h1>

            <p className="mt-7 text-lg sm:text-xl xl:text-2xl text-white/80 leading-relaxed max-w-xl">
              Real pay ranges. Honest schedules. Direct applications to real facilities. No recruiters, no guesswork, no games.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href="/jobs"
                className="w-full sm:w-auto bg-white hover:bg-periwinkle-50 text-[#1E1E2E] font-bold px-8 py-4 rounded-full text-base sm:text-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-center"
              >
                Browse Jobs
              </Link>
              <Link
                href="/nurse-profile"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold px-8 py-4 rounded-full text-base sm:text-lg border border-white/25 transition-all duration-200 text-center"
              >
                Create Your Profile
              </Link>
            </div>

            <p className="mt-6 text-sm text-white/40 font-medium">
              Free forever for nurses. No sign-up spam. That&apos;s a promise.
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ========== THE SYSTEM IS BROKEN — wide two-column ========== */}
      <section className="bg-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-24 sm:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 xl:gap-24 items-center">
            {/* Large image — takes more space */}
            <div className="order-2 lg:order-1 lg:col-span-6 animate-fade-in-up">
              <div className="relative rounded-3xl overflow-hidden hero-shadow aspect-[4/3] lg:aspect-[3/4] xl:aspect-[4/5]">
                <Image
                  src="/nurse-burnout.png"
                  alt="Two exhausted nurses sitting on the floor after a long shift"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E2E]/30 to-transparent" />
              </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2 lg:col-span-6 animate-fade-in-up-delay-1">
              <span className="inline-flex items-center gap-2 text-danger text-sm font-bold uppercase tracking-wider mb-6">
                <span className="w-8 h-px bg-danger" />
                We see you
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] xl:text-5xl font-extrabold text-text leading-[1.12] mb-6">
                You didn&apos;t become a nurse to fight through job&nbsp;boards.
              </h2>

              <p className="text-lg xl:text-xl text-text-light leading-relaxed mb-10">
                You became a nurse to help people. But somewhere along the way, finding the right job became a full-time job itself. We get it.
              </p>

              <div className="space-y-5">
                {[
                  { problem: "Recruiter spam", detail: "Your inbox flooded with generic messages from people who don't know your name — or your specialty." },
                  { problem: "Ghost job posts", detail: "You spend time applying, and nothing happens. The job was never real. Your time was wasted." },
                  { problem: "Hidden pay", detail: "\"Competitive salary\" — code for \"we don't want you to know what we're paying until it's too late.\"" },
                  { problem: "Zero feedback", detail: "Applications vanish into a black hole. No updates, no timeline, no respect for your time." },
                ].map((item) => (
                  <div key={item.problem} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-danger-light flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-bold text-text">{item.problem}.</span>{" "}
                      <span className="text-text-light">{item.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FLOR IS THE ANSWER — full-width periwinkle wash ========== */}
      <section className="bg-gradient-to-b from-periwinkle-50 to-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-24 sm:py-32">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
            <span className="inline-flex items-center gap-2 text-periwinkle text-sm font-bold uppercase tracking-wider mb-6">
              <span className="w-8 h-px bg-periwinkle" />
              The Flor difference
              <span className="w-8 h-px bg-periwinkle" />
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] xl:text-5xl font-extrabold text-text leading-[1.12] mb-5">
              A job marketplace that actually works for&nbsp;nurses.
            </h2>
            <p className="text-lg xl:text-xl text-text-light leading-relaxed">
              Named after Florence Nightingale, Flor was built to fix what&apos;s broken. Every feature exists because a nurse asked for&nbsp;it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                step: "01",
                title: "See everything upfront",
                desc: "Every listing shows the full pay range, exact schedule, and plain-English breakdown. No surprises after you've already invested your time.",
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
              },
              {
                step: "02",
                title: "Get matched with Flor Fit",
                desc: "Our algorithm scores jobs based on your skills, certifications, schedule needs, and commute. You see what fits before you apply.",
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                  </svg>
                ),
              },
              {
                step: "03",
                title: "Apply directly to facilities",
                desc: "No recruiters, no middlemen, no one taking a cut. Apply straight to the facility, ask questions, and track your status in real time.",
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <div
                key={item.step}
                className={`bg-white rounded-2xl p-8 lg:p-10 section-shadow hover:-translate-y-1 transition-all duration-300 ${
                  i === 0 ? "animate-fade-in-up" : i === 1 ? "animate-fade-in-up-delay-1" : "animate-fade-in-up-delay-2"
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-periwinkle-50 flex items-center justify-center text-periwinkle mb-6">
                  {item.icon}
                </div>
                <div className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3">Step {item.step}</div>
                <h3 className="font-extrabold text-xl text-text mb-3">{item.title}</h3>
                <p className="text-base text-text-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Ethics pledge — wider */}
          <div className="mt-16 bg-white rounded-2xl section-shadow p-8 sm:p-12 max-w-4xl mx-auto animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-success-light flex items-center justify-center">
                  <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-text mb-3">The Flor Ethics Pledge</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "Every job is real — no ghost posts",
                    "Every pay range is visible upfront",
                    "Direct applications only — no middlemen",
                    "Free forever — we'll never charge nurses",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm font-medium text-text">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FLOR FIT SCORE — product showcase layout ========== */}
      <section className="bg-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-24 sm:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 xl:gap-24 items-center">
            {/* Photo — big, impactful, takes 7 columns */}
            <div className="relative lg:col-span-7 animate-fade-in-up">
              <div className="relative rounded-3xl overflow-hidden hero-shadow aspect-[4/5] lg:aspect-[3/4] max-h-[640px]">
                <Image
                  src="/nurse-confident.png"
                  alt="Confident nurse with arms crossed"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E2E]/30 to-transparent" />
              </div>

              {/* Floating Fit Score — bigger on desktop */}
              <div className="absolute -bottom-6 right-4 sm:bottom-10 sm:right-10 lg:bottom-12 lg:-right-8 xl:-right-12 bg-white rounded-2xl section-shadow p-5 sm:p-6 w-60 sm:w-72 animate-float">
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
                  {[
                    { label: "Schedule", score: 95, color: "bg-success" },
                    { label: "Specialty", score: 90, color: "bg-periwinkle" },
                    { label: "Commute", score: 85, color: "bg-periwinkle" },
                    { label: "Pay", score: 78, color: "bg-amber" },
                    { label: "Culture", score: 92, color: "bg-success" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-text-muted font-medium">{item.label}</span>
                        <span className="font-bold text-text">{item.score}%</span>
                      </div>
                      <div className="h-2 bg-periwinkle-50 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Content — 5 columns */}
            <div className="lg:col-span-5 animate-fade-in-up-delay-1">
              <span className="inline-flex items-center gap-2 text-periwinkle text-sm font-bold uppercase tracking-wider mb-6">
                <span className="w-8 h-px bg-periwinkle" />
                Smart matching
              </span>

              <h2 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold text-text leading-[1.12] mb-6">
                Know your worth before you&nbsp;apply.
              </h2>

              <p className="text-lg xl:text-xl text-text-light leading-relaxed mb-8">
                No more guessing if you&apos;re qualified. Your Flor Fit Score gives you a clear 0–100 match with a plain-English explanation of&nbsp;why.
              </p>

              <div className="space-y-4 mb-10">
                {[
                  { label: "Schedule match", desc: "Does the shift fit the hours you actually want?" },
                  { label: "Specialty alignment", desc: "Does your experience match the role requirements?" },
                  { label: "Commute distance", desc: "How far is it from where you live?" },
                  { label: "Pay alignment", desc: "Does the pay match what you're looking for?" },
                  { label: "Facility culture", desc: "Is it the kind of workplace where you'd thrive?" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-periwinkle flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-bold text-text text-sm">{item.label}</span>
                      <span className="text-text-light text-sm"> — {item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/nurse-profile"
                className="inline-flex items-center gap-2 bg-periwinkle hover:bg-periwinkle-dark text-white font-bold px-7 py-3.5 rounded-full transition-all duration-200 shadow-md shadow-periwinkle/20 hover:shadow-lg hover:shadow-periwinkle/30 hover:-translate-y-0.5"
              >
                Create profile to see your scores
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FULL-WIDTH PHOTO BREAK — mission/hands ========== */}
      <section className="relative h-[300px] sm:h-[400px] lg:h-[480px] overflow-hidden">
        <Image
          src="/nurse-hands.png"
          alt="Close-up of nurse holding a patient's hand"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E1E2E]/70 via-[#1E1E2E]/40 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 w-full">
            <div className="max-w-xl">
              <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                Nursing is about human connection. Flor protects that.
              </p>
              <p className="mt-4 text-base sm:text-lg text-white/70 leading-relaxed">
                Named after Florence Nightingale. Nurses deserve a job search that respects their time, their skills, and the incredible work they do.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS — large images, side by side ========== */}
      <section className="bg-offwhite">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-24 sm:py-32">
          <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in-up">
            <span className="inline-flex items-center gap-2 text-periwinkle text-sm font-bold uppercase tracking-wider mb-6">
              <span className="w-8 h-px bg-periwinkle" />
              Why it matters
              <span className="w-8 h-px bg-periwinkle" />
            </span>
            <h2 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold text-text leading-[1.12] mb-4">
              This is why you became a nurse.
            </h2>
            <p className="text-lg xl:text-xl text-text-light">
              The job search should never get in the way of the work that actually matters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {[
              {
                img: "/nurse-elderly.png",
                alt: "Nurse hugging elderly man, both smiling warmly",
                quote: "I became a nurse to make a difference in people's lives — not to spend my evenings fighting through job boards and recruiter emails.",
                name: "Sarah M.",
                title: "Registered Nurse, 8 years",
              },
              {
                img: "/nurse-child.png",
                alt: "Nurse hugging child with red balloon in hospital corridor",
                quote: "Every hour I spend on bad job boards is an hour I'm not spending with my patients. Flor gave me that time back.",
                name: "Maria L.",
                title: "Pediatric Nurse, 5 years",
              },
            ].map((item, i) => (
              <div
                key={item.name}
                className={`bg-white rounded-2xl overflow-hidden section-shadow hover:-translate-y-1 transition-all duration-300 ${
                  i === 0 ? "animate-fade-in-up-delay-1" : "animate-fade-in-up-delay-2"
                }`}
              >
                <div className="relative h-72 sm:h-80 lg:h-96">
                  <Image src={item.img} alt={item.alt} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E2E]/40 via-transparent to-transparent" />
                </div>
                <div className="p-7 sm:p-9">
                  <svg className="w-9 h-9 text-periwinkle-200 mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                  </svg>
                  <blockquote className="text-lg lg:text-xl font-medium text-text leading-relaxed mb-5">
                    {item.quote}
                  </blockquote>
                  <div>
                    <p className="font-bold text-text">{item.name}</p>
                    <p className="text-sm text-text-muted">{item.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== WORK-LIFE BALANCE — wide two-column ========== */}
      <section className="bg-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-24 sm:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 xl:gap-24 items-center">
            {/* Content — 5 columns */}
            <div className="lg:col-span-5 animate-fade-in-up">
              <span className="inline-flex items-center gap-2 text-periwinkle text-sm font-bold uppercase tracking-wider mb-6">
                <span className="w-8 h-px bg-periwinkle" />
                Work-life balance
              </span>

              <h2 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold text-text leading-[1.12] mb-6">
                Find a schedule that lets you be present for the moments that&nbsp;matter.
              </h2>

              <p className="text-lg xl:text-xl text-text-light leading-relaxed mb-8">
                Whether you&apos;re looking for an off-ramp from travel nursing or need a schedule that works around your family — every listing shows the exact hours upfront.
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {["Days", "Evenings", "Nights", "Rotating", "Weekend", "PRN", "No Weekends", "Flexible"].map((s) => (
                  <span key={s} className="bg-periwinkle-50 text-periwinkle-dark px-4 py-2.5 rounded-full text-sm font-semibold">
                    {s}
                  </span>
                ))}
              </div>

              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 text-periwinkle hover:text-periwinkle-dark font-bold transition-colors"
              >
                Find jobs that fit your schedule
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>

            {/* Photo — 7 columns, big */}
            <div className="lg:col-span-7 animate-fade-in-up-delay-1">
              <div className="relative rounded-3xl overflow-hidden hero-shadow aspect-[4/3]">
                <Image
                  src="/nurse-mom.png"
                  alt="Nurse mom touching noses with her young son"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E2E]/15 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FEATURES GRID — periwinkle wash ========== */}
      <section className="bg-gradient-to-b from-periwinkle-50/50 to-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-24 sm:py-32">
          <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold text-text leading-[1.12] mb-4">
              Everything you wish job boards&nbsp;did.
            </h2>
            <p className="text-lg xl:text-xl text-text-light">
              Built around what nurses told us they actually need.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                title: "Pay Transparency",
                desc: "Every listing shows the full pay range with a plain-English explanation of how your rate is determined.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                title: "Honest Schedules",
                desc: "Visual badges show exactly what shifts and hours — no surprises in the fine print.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                ),
              },
              {
                title: "Direct Applications",
                desc: "Apply straight to facilities. No recruiters, no middlemen, no one taking a cut.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                ),
              },
              {
                title: "Anonymous Q&A",
                desc: "Ask questions and see real answers from the facility, visible to all nurses.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                  </svg>
                ),
              },
              {
                title: "Facility Profiles",
                desc: "Nurse reviews, culture info, and EHR systems — know what you're walking into.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21m-3.75 3H21" />
                  </svg>
                ),
              },
              {
                title: "Application Tracking",
                desc: "See when your app is viewed and get notified of responses. No more wondering.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className={`bg-white rounded-2xl p-7 sm:p-8 section-shadow hover:-translate-y-1 transition-all duration-300 group ${
                  i < 3 ? "animate-fade-in-up-delay-1" : "animate-fade-in-up-delay-2"
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-periwinkle-50 flex items-center justify-center text-periwinkle mb-5 group-hover:bg-periwinkle group-hover:text-white transition-all duration-300">
                  {item.icon}
                </div>
                <h3 className="font-bold text-lg text-text mb-2">{item.title}</h3>
                <p className="text-sm text-text-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FEATURED JOBS ========== */}
      <section className="bg-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-24 sm:py-32">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12 sm:mb-16">
            <div>
              <h2 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold text-text">Featured Jobs</h2>
              <p className="text-text-light mt-2 text-base xl:text-lg leading-relaxed">Real jobs with real pay, ready for you right now.</p>
            </div>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 text-periwinkle hover:text-periwinkle-dark font-bold transition-colors flex-shrink-0"
            >
              View all jobs
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {seedJobs.map((job, i) => (
              <JobCard key={job.id} job={job} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA — full-width dark ========== */}
      <section className="bg-[#1E1E2E] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-periwinkle/8 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-periwinkle/8 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4" />

        <div className="relative max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-24 sm:py-32 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white mb-6 leading-tight">
            Your next chapter<br className="hidden sm:block" /> starts here.
          </h2>
          <p className="text-lg sm:text-xl text-white/60 mb-10 max-w-lg mx-auto leading-relaxed">
            Create your Flor profile and let our Fit Score match you with jobs that fit your skills, schedule, and life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/nurse-profile"
              className="bg-white text-[#1E1E2E] font-bold px-10 py-4 rounded-full text-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Get Started — It&apos;s Free
            </Link>
            <Link
              href="/jobs"
              className="bg-white/10 hover:bg-white/15 text-white font-bold px-10 py-4 rounded-full text-lg border border-white/20 transition-all duration-200"
            >
              Browse Jobs
            </Link>
          </div>
          <p className="mt-8 text-sm text-white/30 font-medium">
            Built by nurses, for nurses. Named after Florence Nightingale.
          </p>
        </div>
      </section>
    </div>
  );
}
