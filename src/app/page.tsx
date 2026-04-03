import Link from "next/link";
import Image from "next/image";
import JobCard from "@/components/JobCard";
import { seedJobs } from "@/data/seed-jobs";

export default function HomePage() {
  const riJobCount = seedJobs.filter(
    (j) => j.location.state === "RI" && (!j.status || j.status === "active") && !j.isScraped
  ).length;

  return (
    <div>
      {/* ========== HERO — full viewport, edge-to-edge ========== */}
      <section className="relative overflow-hidden min-h-[92vh] flex items-center">
        <Image
          src="/nurse-hero.jpg"
          alt="Nurse tying her surgical cap, getting ready for her shift"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E1E2E]/90 via-[#1E1E2E]/65 to-[#1E1E2E]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E2E]/50 via-transparent to-[#1E1E2E]/10" />

        <div className="relative w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-28 sm:py-36">
          <div className="max-w-2xl xl:max-w-3xl animate-fade-in-up">
            <p className="italic font-normal text-periwinkle-light text-4xl sm:text-5xl lg:text-6xl xl:text-7xl mb-4 tracking-wide" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Meet Flor.</p>

            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full mb-6">
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
              <Link
                href="/survey"
                className="w-full sm:w-auto bg-transparent hover:bg-periwinkle hover:text-white text-periwinkle-light font-bold px-8 py-4 rounded-full text-base sm:text-lg border-2 border-periwinkle/60 transition-all duration-200 text-center"
              >
                Shape What Flor Builds →
              </Link>
            </div>

            <p className="mt-6 text-sm text-white/40 font-medium">
              Free forever for nurses. No sign-up spam. That&apos;s a promise.
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F4F4FB] to-transparent" />
      </section>

      {/* ========== STATS BAR — social proof strip ========== */}
      <section className="bg-[#F4F4FB] relative -mt-8 z-10">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="bg-white rounded-2xl section-shadow border border-periwinkle-100/30 grid grid-cols-2 lg:grid-cols-4 divide-x divide-periwinkle-100/30">
            {[
              { stat: "4.2M", label: "registered nurses in the U.S.", sub: "Bureau of Labor Statistics" },
              { stat: "73%", label: "say job searching is broken", sub: "2025 Nurse Survey" },
              { stat: "$24K", label: "avg. agency markup per hire", sub: "Industry average" },
              { stat: "$0", label: "cost for nurses on Flor", sub: "Free forever" },
            ].map((item) => (
              <div key={item.stat} className="px-6 py-6 sm:py-8 text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-periwinkle leading-none">{item.stat}</div>
                <p className="text-sm text-text font-medium mt-2 leading-snug">{item.label}</p>
                <p className="text-[11px] text-text-muted mt-1">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== THE SYSTEM IS BROKEN — wide two-column ========== */}
      <section className="bg-[#F4F4FB]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-12 sm:pt-16 pb-14 sm:pb-18">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-20 items-center">
            {/* Large image */}
            <div className="order-2 lg:order-1 lg:col-span-6 animate-fade-in-up">
              <div className="relative rounded-3xl overflow-hidden hero-shadow aspect-[4/3] lg:aspect-[3/4] xl:aspect-[4/5]">
                <Image
                  src="/nurse-commute.jpg"
                  alt="Nurse in teal scrubs on subway commute looking thoughtful"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E2E]/30 to-transparent" />
              </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2 lg:col-span-6 animate-fade-in-up-delay-1">
              <span className="inline-flex items-center gap-2 text-danger text-sm font-bold uppercase tracking-wider mb-5">
                <span className="w-8 h-px bg-danger" />
                We see you
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] xl:text-5xl font-extrabold text-text leading-[1.12] mb-5">
                You didn&apos;t become a nurse to fight through job&nbsp;boards.
              </h2>

              <p className="text-lg xl:text-xl text-text-light leading-relaxed mb-8">
                You became a nurse to help people. But somewhere along the way, finding the right job became a full-time job itself.
              </p>

              <div className="space-y-4">
                {[
                  { problem: "Recruiter spam", detail: "Your inbox flooded with generic messages from people who don't know your name — or your specialty." },
                  { problem: "Ghost job posts", detail: "You spend time applying, and nothing happens. The job was never real." },
                  { problem: "Hidden pay", detail: "\"Competitive salary\" — code for \"we don't want you to know what we're paying.\"" },
                  { problem: "Zero feedback", detail: "Applications vanish into a black hole. No updates, no timeline, no respect." },
                ].map((item) => (
                  <div key={item.problem} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-danger-light flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3.5 h-3.5 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
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

      {/* ========== CALLOUT QUOTE — full-width divider ========== */}
      <section className="bg-[#F0F0F8]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-10 sm:py-14">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <svg className="w-12 h-12 text-periwinkle/40 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
            </svg>
            <blockquote className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-text leading-snug italic text-center md:text-left">
              &ldquo;I spent 3 hours applying to a job that turned out to be a staffing agency posting. I was done.&rdquo;
            </blockquote>
            <div className="flex-shrink-0 text-center md:text-right">
              <p className="font-bold text-text">Sarah M.</p>
              <p className="text-sm text-text-muted">ICU Nurse, Providence</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FLOR IS THE ANSWER — periwinkle wash ========== */}
      <section className="bg-gradient-to-b from-[#F0F0F8] to-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-14 sm:py-18">
          <div className="text-center max-w-3xl mx-auto mb-10 animate-fade-in-up">
            <span className="inline-flex items-center gap-2 text-periwinkle text-sm font-bold uppercase tracking-wider mb-5">
              <span className="w-8 h-px bg-periwinkle" />
              The Flor difference
              <span className="w-8 h-px bg-periwinkle" />
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] xl:text-5xl font-extrabold text-text leading-[1.12] mb-4">
              A job marketplace that actually works for&nbsp;nurses.
            </h2>
            <p className="text-lg xl:text-xl text-text-light leading-relaxed">
              Named after Florence Nightingale, Flor was built to fix what&apos;s broken. Every feature exists because a nurse asked for&nbsp;it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
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
                desc: "No recruiters, no middlemen, no one taking a cut. Apply straight to the facility and track your status in real time.",
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <div
                key={item.step}
                className={`bg-white rounded-2xl p-7 lg:p-8 section-shadow hover:-translate-y-1 transition-all duration-300 ${
                  i === 0 ? "animate-fade-in-up" : i === 1 ? "animate-fade-in-up-delay-1" : "animate-fade-in-up-delay-2"
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-periwinkle-50 flex items-center justify-center text-periwinkle mb-5">
                  {item.icon}
                </div>
                <div className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Step {item.step}</div>
                <h3 className="font-extrabold text-xl text-text mb-2">{item.title}</h3>
                <p className="text-base text-text-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Ethics pledge — compact inline */}
          <div className="mt-10 bg-white rounded-2xl section-shadow p-6 sm:p-8 max-w-4xl mx-auto animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-success-light flex items-center justify-center">
                  <svg className="w-7 h-7 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-text mb-2">The Flor Ethics Pledge</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    "Every job is real — no ghost posts",
                    "Every pay range is visible upfront",
                    "Direct applications only — no middlemen",
                    "Free forever — we'll never charge nurses",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
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

      {/* ========== FULL-BLEED PHOTO STRIP — nurse-hands ========== */}
      <section className="relative h-[320px] sm:h-[400px] lg:h-[460px] overflow-hidden">
        <Image
          src="/nurse-hands.jpg"
          alt="Close-up of hands being held on blue fabric"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E1E2E]/80 via-[#1E1E2E]/50 to-[#1E1E2E]/20" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                  Nursing is about human connection.
                </p>
                <p className="mt-2 text-base sm:text-lg text-white/70 leading-relaxed">
                  Named after Florence Nightingale — because nurses deserve better.
                </p>
              </div>
              <div className="hidden md:flex items-center justify-end gap-8">
                <div className="text-center">
                  <div className="text-3xl lg:text-4xl font-extrabold text-white">100%</div>
                  <p className="text-sm text-white/60 mt-1">nurse-owned</p>
                </div>
                <div className="w-px h-12 bg-white/20" />
                <div className="text-center">
                  <div className="text-3xl lg:text-4xl font-extrabold text-white">{riJobCount}</div>
                  <p className="text-sm text-white/60 mt-1">RI jobs live now</p>
                </div>
                <div className="w-px h-12 bg-white/20" />
                <div className="text-center">
                  <div className="text-3xl lg:text-4xl font-extrabold text-periwinkle-light">$0</div>
                  <p className="text-sm text-white/60 mt-1">cost for nurses</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FLOR FIT SCORE — product showcase ========== */}
      <section className="bg-[#F8F8FA]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-14 sm:py-18">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-20 items-center">
            {/* Photo — big, takes 7 columns */}
            <div className="relative lg:col-span-7 animate-fade-in-up">
              <div className="relative rounded-3xl overflow-hidden hero-shadow aspect-[4/5] lg:aspect-[3/4]">
                <Image
                  src="/nurse-confident.jpg"
                  alt="Nurse in green scrubs writing on clipboard"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E2E]/30 to-transparent" />
              </div>

              {/* Floating Fit Score */}
              <div className="absolute -bottom-6 right-4 sm:bottom-8 sm:right-8 lg:bottom-10 lg:-right-6 xl:-right-10 bg-white rounded-2xl section-shadow p-5 sm:p-6 w-56 sm:w-64 animate-float">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative w-16 h-16 sm:w-18 sm:h-18 flex-shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="34" fill="none" stroke="#E4E5F4" strokeWidth="5" />
                      <circle cx="40" cy="40" r="34" fill="none" stroke="#8B8FD4" strokeWidth="5" strokeDasharray="186 28" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-extrabold text-periwinkle">87</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-periwinkle uppercase tracking-wider">Flor Fit</div>
                    <div className="text-xs text-text-muted mt-0.5">Match Score</div>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { label: "Schedule", score: 95, color: "bg-success" },
                    { label: "Specialty", score: 90, color: "bg-periwinkle" },
                    { label: "Commute", score: 85, color: "bg-periwinkle" },
                    { label: "Pay", score: 78, color: "bg-amber" },
                    { label: "Culture", score: 92, color: "bg-success" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-[11px] mb-0.5">
                        <span className="text-text-muted font-medium">{item.label}</span>
                        <span className="font-bold text-text">{item.score}%</span>
                      </div>
                      <div className="h-1.5 bg-periwinkle-50 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Content — 5 columns */}
            <div className="lg:col-span-5 animate-fade-in-up-delay-1">
              <span className="inline-flex items-center gap-2 text-periwinkle text-sm font-bold uppercase tracking-wider mb-5">
                <span className="w-8 h-px bg-periwinkle" />
                Smart matching
              </span>

              <h2 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold text-text leading-[1.12] mb-5">
                Know your worth before you&nbsp;apply.
              </h2>

              <p className="text-lg xl:text-xl text-text-light leading-relaxed mb-6">
                No more guessing if you&apos;re qualified. Your Flor Fit Score gives you a clear 0–100 match with a plain-English explanation.
              </p>

              <div className="space-y-3 mb-8">
                {[
                  { label: "Schedule match", desc: "Does the shift fit the hours you actually want?" },
                  { label: "Specialty alignment", desc: "Does your experience match the role?" },
                  { label: "Commute distance", desc: "How far from where you live?" },
                  { label: "Pay alignment", desc: "Does the pay match your expectations?" },
                  { label: "Facility culture", desc: "Is it a workplace where you'd thrive?" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-periwinkle flex items-center justify-center flex-shrink-0 mt-0.5">
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

      {/* ========== TESTIMONIALS — tighter, wider ========== */}
      <section className="bg-[#F4F4FB]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-14 sm:py-18">
          <div className="text-center max-w-2xl mx-auto mb-10 animate-fade-in-up">
            <span className="inline-flex items-center gap-2 text-periwinkle text-sm font-bold uppercase tracking-wider mb-4">
              <span className="w-8 h-px bg-periwinkle" />
              Why it matters
              <span className="w-8 h-px bg-periwinkle" />
            </span>
            <h2 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold text-text leading-[1.12] mb-3">
              This is why you became a nurse.
            </h2>
            <p className="text-lg xl:text-xl text-text-light">
              The job search should never get in the way of the work that matters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {[
              {
                img: "/nurse-community.jpg",
                alt: "Three nurses outside making heart shapes with their hands",
                quote: "I became a nurse to make a difference — not to spend my evenings fighting through job boards and recruiter emails.",
                name: "Sarah M.",
                title: "Registered Nurse, 8 years",
              },
              {
                img: "/nurse-group.jpg",
                alt: "Group of four nurses smiling together in front of an ambulance",
                quote: "Every hour on bad job boards is an hour away from my patients. Flor gave me that time back.",
                name: "Maria L.",
                title: "Pediatric Nurse, 5 years",
              },
            ].map((item, i) => (
              <div
                key={item.name}
                className={`bg-[#F8F8FA] rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 ${
                  i === 0 ? "animate-fade-in-up-delay-1" : "animate-fade-in-up-delay-2"
                }`}
              >
                <div className="relative h-56 sm:h-64 lg:h-72">
                  <Image src={item.img} alt={item.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E2E]/40 via-transparent to-transparent" />
                </div>
                <div className="p-6 sm:p-8">
                  <svg className="w-8 h-8 text-periwinkle-200 mb-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                  </svg>
                  <blockquote className="text-lg font-medium text-text leading-relaxed mb-4">
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

      {/* ========== FULL-BLEED PHOTO STRIP — nurse-tablet ========== */}
      <section className="relative h-[160px] sm:h-[200px] overflow-hidden">
        <Image
          src="/nurse-tablet.jpg"
          alt="Nurse using tablet in clinical setting"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#1E1E2E]/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-6 sm:gap-10 lg:gap-16 text-center">
            <div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">38–52</div>
              <p className="text-xs sm:text-sm text-white/60 mt-1">$/hr pay range</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-periwinkle-light">94%</div>
              <p className="text-xs sm:text-sm text-white/60 mt-1">top Fit Score</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">2:1</div>
              <p className="text-xs sm:text-sm text-white/60 mt-1">best patient ratio</p>
            </div>
            <div className="hidden sm:block w-px h-10 bg-white/20" />
            <div className="hidden sm:block">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">$8K</div>
              <p className="text-xs sm:text-sm text-white/60 mt-1">sign-on bonus</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== WORK-LIFE BALANCE — wide two-column ========== */}
      <section className="bg-[#F4F4FB]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-14 sm:py-18">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-20 items-center">
            {/* Content — 5 columns */}
            <div className="lg:col-span-5 animate-fade-in-up">
              <span className="inline-flex items-center gap-2 text-periwinkle text-sm font-bold uppercase tracking-wider mb-5">
                <span className="w-8 h-px bg-periwinkle" />
                Work-life balance
              </span>

              <h2 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold text-text leading-[1.12] mb-5">
                Find a schedule that lets you be present for the moments that&nbsp;matter.
              </h2>

              <p className="text-lg xl:text-xl text-text-light leading-relaxed mb-6">
                Whether you&apos;re looking for an off-ramp from travel nursing or need a schedule that works around your family — every listing shows the exact hours upfront.
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {["Days", "Evenings", "Nights", "Rotating", "Weekend", "PRN", "No Weekends", "Flexible"].map((s) => (
                  <span key={s} className="bg-periwinkle-50 text-periwinkle-dark px-3.5 py-2 rounded-full text-sm font-semibold">
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

            {/* Photo — 7 columns */}
            <div className="lg:col-span-7 animate-fade-in-up-delay-1">
              <div className="relative rounded-3xl overflow-hidden hero-shadow aspect-[4/3]">
                <Image
                  src="/nurse-mom.jpg"
                  alt="Nurse mom in blue scrubs touching noses with her son"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E2E]/15 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FEATURES GRID — alternating bg ========== */}
      <section className="bg-[#F0F0F8]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-14 sm:py-18">
          <div className="text-center max-w-2xl mx-auto mb-10 animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold text-text leading-[1.12] mb-3">
              Everything you wish job boards&nbsp;did.
            </h2>
            <p className="text-lg xl:text-xl text-text-light">
              Built around what nurses told us they actually need.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {[
              {
                title: "Pay Transparency",
                desc: "Every listing shows the full pay range with a plain-English explanation.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                title: "Honest Schedules",
                desc: "Visual badges show exactly what shifts — no surprises in the fine print.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                ),
              },
              {
                title: "Direct Applications",
                desc: "Apply straight to facilities. No recruiters, no middlemen.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                ),
              },
              {
                title: "Anonymous Q&A",
                desc: "Ask questions and see real answers from the facility, visible to all.",
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
                desc: "See when your app is viewed and get notified of responses.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className={`bg-white rounded-2xl p-6 sm:p-7 section-shadow hover:-translate-y-1 transition-all duration-300 group ${
                  i < 3 ? "animate-fade-in-up-delay-1" : "animate-fade-in-up-delay-2"
                }`}
              >
                <div className="w-11 h-11 rounded-xl bg-periwinkle-50 flex items-center justify-center text-periwinkle mb-4 group-hover:bg-periwinkle group-hover:text-white transition-all duration-300">
                  {item.icon}
                </div>
                <h3 className="font-bold text-lg text-text mb-1.5">{item.title}</h3>
                <p className="text-sm text-text-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FEATURED JOBS ========== */}
      <section className="relative bg-gradient-to-b from-[#1E1E2E] to-[#2A2A40] overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-periwinkle/10 rounded-full blur-[120px]" />
        <div className="relative max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-16 sm:py-22">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 mb-12">
            <div>
              <span className="inline-flex items-center gap-2 text-periwinkle-light text-sm font-bold uppercase tracking-wider mb-4">
                <span className="w-8 h-px bg-periwinkle-light" />
                Now hiring
              </span>
              <h2 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold text-white">Featured Jobs</h2>
              <p className="text-white/50 mt-2 text-base xl:text-lg leading-relaxed">Real jobs with real pay, ready for you right now.</p>
            </div>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 text-periwinkle-light hover:text-white font-bold transition-colors flex-shrink-0 bg-white/10 hover:bg-white/15 px-5 py-2.5 rounded-full border border-white/10"
            >
              View all jobs
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
            {seedJobs.map((job, i) => (
              <JobCard key={job.id} job={job} index={i} showExampleBadge={true} />
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA — full-width dark ========== */}
      <section className="bg-[#1E1E2E] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-periwinkle/8 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-periwinkle/8 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4" />

        <div className="relative max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-16 sm:py-20 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white mb-5 leading-tight">
            Your next chapter<br className="hidden sm:block" /> starts here.
          </h2>
          <p className="text-lg sm:text-xl text-white/60 mb-8 max-w-lg mx-auto leading-relaxed">
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
          <p className="mt-6 text-sm text-white/30 font-medium">
            Built by nurses, for nurses. Named after Florence Nightingale.
          </p>
        </div>
      </section>
    </div>
  );
}
