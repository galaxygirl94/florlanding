import Link from "next/link";
import Image from "next/image";
import JobCard from "@/components/JobCard";
import { seedJobs } from "@/data/seed-jobs";

export default function HomePage() {
  return (
    <div>
      {/* HERO — Photo 1: Nurse with coffee outdoors */}
      <section className="relative overflow-hidden min-h-[580px] sm:min-h-[680px] flex items-center">
        <Image
          src="/nurse-hero.png"
          alt="Nurse smiling outdoors with coffee — the freedom Flor promises"
          fill
          className="object-cover"
          priority
        />
        {/* Periwinkle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#2A2A3C]/80 via-[#8B8FD4]/50 to-[#8B8FD4]/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2A2A3C]/50 via-transparent to-transparent" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 w-full">
          <div className="max-w-2xl animate-fade-in-up">
            {/* Flor logo */}
            <div className="flex items-center gap-3 mb-8">
              <Image src="/flor-logo.jpg" alt="Flor" width={44} height={54} className="object-contain brightness-0 invert" priority />
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                fl<span className="text-periwinkle-light">o</span>r
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-[1.1] tracking-tight">
              You deserve better than spam and ghost&nbsp;jobs
            </h1>

            <p className="mt-6 sm:mt-8 text-lg sm:text-xl text-white/90 leading-relaxed max-w-xl">
              Flor is the nursing job marketplace <em>built by nurses, for nurses</em>.
              Real pay. Real schedules. Direct applications. No more guesswork.
            </p>

            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href="/jobs"
                className="w-full sm:w-auto bg-white hover:bg-periwinkle-50 text-periwinkle-dark font-bold px-8 py-4 rounded-2xl text-base sm:text-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-center"
              >
                Browse Jobs
              </Link>
              <Link
                href="/nurse-profile"
                className="w-full sm:w-auto bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-2xl text-base sm:text-lg border border-white/30 transition-all duration-200 text-center"
              >
                Create Your Profile
              </Link>
            </div>

            <p className="mt-5 text-sm text-white/50">
              Free forever for nurses. No sign-up spam. We promise.
            </p>
          </div>
        </div>
      </section>

      {/* BROKEN SYSTEM — Photo 2: Exhausted nurses */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
            <div className="animate-fade-in-up order-2 lg:order-1">
              <div className="relative rounded-3xl overflow-hidden shadow-lg">
                <Image src="/nurse-burnout.png" alt="Two exhausted nurses sitting on the floor" width={600} height={400} className="w-full h-auto object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2A2A3C]/20 to-transparent" />
              </div>
            </div>
            <div className="animate-fade-in-up order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 bg-red-50 px-3 py-1.5 rounded-full mb-5">
                <div className="w-2 h-2 bg-red-400 rounded-full" />
                <span className="text-xs font-bold text-red-600 uppercase tracking-wider">The problem</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-text mb-5 leading-tight">
                The system is broken.<br />You know it.
              </h2>
              <p className="text-base sm:text-lg text-text-light leading-relaxed mb-8">
                Nursing job search shouldn&apos;t feel like navigating a minefield. But right now, it does.
              </p>
              <div className="space-y-4">
                {[
                  { problem: "Recruiter spam", detail: "Your inbox flooded with generic messages from people who don't know your name" },
                  { problem: "Ghost job posts", detail: "You apply, you wait, nothing happens — because the job was never real" },
                  { problem: "Hidden pay", detail: "\"Competitive salary\" means they don't want you to know what they're paying" },
                  { problem: "Wasted time", detail: "Hours lost on applications that go into a black hole with zero feedback" },
                ].map((item) => (
                  <div key={item.problem} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-sm font-bold text-text">{item.problem}</span>
                      <span className="text-sm text-text-light"> — {item.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-periwinkle-50">
                <div className="inline-flex items-center gap-2 bg-periwinkle-50 px-4 py-2 rounded-full">
                  <div className="w-2 h-2 bg-periwinkle rounded-full" />
                  <span className="text-sm font-semibold text-periwinkle-dark">Flor is the alternative</span>
                </div>
                <p className="text-sm text-text-light leading-relaxed mt-3">
                  Every job on Flor is real, every pay range is visible, and you apply
                  directly — no middlemen taking a cut of what you&apos;ve earned.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Flor Works */}
      <section className="bg-offwhite">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-text mb-4">
              How Flor works for you
            </h2>
            <p className="text-base sm:text-lg text-text-light max-w-2xl mx-auto">
              Built around what nurses actually need — not what recruiters want to sell.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                step: "01",
                title: "See everything upfront",
                desc: "Every listing shows the full pay range, schedule details, and a plain-English breakdown of how your rate is determined. No surprises.",
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
                desc: "Our matching algorithm looks at your skills, certifications, schedule preferences, and location to show you jobs that actually fit your life.",
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                  </svg>
                ),
              },
              {
                step: "03",
                title: "Apply directly",
                desc: "No recruiters, no middlemen. Apply straight to the facility. Ask anonymous questions. Track your application status in real time.",
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <div
                key={item.step}
                className={`bg-white rounded-2xl p-6 sm:p-8 section-shadow hover:-translate-y-1 transition-all duration-300 ${
                  i === 0 ? "animate-fade-in-up" : i === 1 ? "animate-fade-in-up-delay-1" : "animate-fade-in-up-delay-2"
                }`}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-periwinkle-50 to-periwinkle-100 flex items-center justify-center text-periwinkle">
                    {item.icon}
                  </div>
                  <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Step {item.step}</span>
                </div>
                <h3 className="font-bold text-lg mb-2 text-text">{item.title}</h3>
                <p className="text-sm text-text-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FLOR FIT SCORE — Photo 3: Confident nurse */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
            {/* Photo 3 with floating Fit Score */}
            <div className="animate-fade-in-up relative">
              <div className="relative rounded-3xl overflow-hidden shadow-lg">
                <Image src="/nurse-confident.png" alt="Confident nurse with arms crossed — she knows her worth" width={600} height={700} className="w-full h-auto object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2A2A3C]/25 to-transparent" />
              </div>
              {/* Floating Fit Score badge with match ring */}
              <div className="absolute -bottom-4 -right-4 sm:bottom-6 sm:right-6 bg-white rounded-2xl section-shadow p-4 sm:p-5 w-52 sm:w-56">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative w-14 h-14 flex-shrink-0">
                    <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                      <circle cx="28" cy="28" r="24" fill="none" stroke="#E4E5F4" strokeWidth="4" />
                      <circle cx="28" cy="28" r="24" fill="none" stroke="#8B8FD4" strokeWidth="4" strokeDasharray="131.2 19.6" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-base font-extrabold text-periwinkle">87</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-periwinkle uppercase tracking-wider">Flor Fit</div>
                    <div className="text-xs text-text-muted">Score</div>
                  </div>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between"><span className="text-text-muted">Schedule</span><span className="font-bold text-success">95%</span></div>
                  <div className="flex justify-between"><span className="text-text-muted">Specialty</span><span className="font-bold text-periwinkle">90%</span></div>
                  <div className="flex justify-between"><span className="text-text-muted">Commute</span><span className="font-bold text-periwinkle">85%</span></div>
                  <div className="flex justify-between"><span className="text-text-muted">Pay</span><span className="font-bold text-amber">78%</span></div>
                  <div className="flex justify-between"><span className="text-text-muted">Culture</span><span className="font-bold text-success">92%</span></div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="animate-fade-in-up-delay-1">
              <div className="inline-flex items-center gap-2 bg-periwinkle-50 px-3 py-1.5 rounded-full mb-5">
                <svg className="w-4 h-4 text-periwinkle" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xs font-bold text-periwinkle-dark uppercase tracking-wider">Your personal match</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-text mb-5 leading-tight">
                She knows her worth.<br />Flor Fit proves it.
              </h2>
              <p className="text-base sm:text-lg text-text-light leading-relaxed mb-6">
                No more guessing if you&apos;re qualified. Our matching algorithm gives you a clear 0-100 score with a plain-English explanation.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  { label: "Schedule preferences", desc: "Does the shift fit the hours you want?" },
                  { label: "Specialty match", desc: "Does your experience align with the role?" },
                  { label: "Commute distance", desc: "How far is it from your home?" },
                  { label: "Pay alignment", desc: "Does the pay match what you're looking for?" },
                  { label: "Facility culture", desc: "Is it the kind of workplace you thrive in?" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-periwinkle flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-text">{item.label}</span>
                      <span className="text-sm text-text-light"> — {item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/nurse-profile" className="inline-flex items-center gap-2 bg-periwinkle hover:bg-periwinkle-dark text-white font-semibold px-6 py-3 rounded-2xl transition-all duration-200 shadow-md shadow-periwinkle/15">
                Create profile to see your scores
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Nurses Love Flor */}
      <section className="bg-offwhite">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-text mb-4">
              Everything you wish job boards did
            </h2>
            <p className="text-base sm:text-lg text-text-light max-w-2xl mx-auto">
              We built Flor around the features nurses told us they actually need.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
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
                desc: "Visual badges show exactly what shifts and hours you're signing up for — no surprises in the fine print.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                ),
              },
              {
                title: "Direct Applications",
                desc: "Apply directly to facilities. No recruiters, no middlemen, no one taking a cut of your pay.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                ),
              },
              {
                title: "Q&A on Every Listing",
                desc: "Ask anonymous questions and see real answers from the facility — visible to all nurses.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                  </svg>
                ),
              },
              {
                title: "Facility Profiles",
                desc: "Real nurse reviews, workplace culture info, and EHR systems — know what you're walking into.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21m-3.75 3H21" />
                  </svg>
                ),
              },
              {
                title: "Application Tracking",
                desc: "See when your application is viewed and get notified of responses. No more wondering.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className={`bg-white rounded-2xl p-6 section-shadow hover:-translate-y-1 transition-all duration-300 group ${
                  i < 3 ? "animate-fade-in-up-delay-1" : "animate-fade-in-up-delay-2"
                }`}
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-periwinkle-50 to-periwinkle-100 flex items-center justify-center text-periwinkle mb-4 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="font-bold text-base mb-2 text-text">{item.title}</h3>
                <p className="text-sm text-text-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SCHEDULE — Photo 8: Nurse mom with son */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-periwinkle-50 px-3 py-1.5 rounded-full mb-5">
                <svg className="w-4 h-4 text-periwinkle" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs font-bold text-periwinkle-dark uppercase tracking-wider">Work-life balance</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-text mb-5 leading-tight">
                Find a schedule that lets you be there for the moments that matter
              </h2>
              <p className="text-base sm:text-lg text-text-light leading-relaxed mb-6">
                Every listing shows the exact schedule upfront — days, evenings, nights, rotating. No surprises buried in fine print.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Days", "Evenings", "Nights", "Rotating", "Weekend", "PRN"].map((s) => (
                  <span key={s} className="bg-periwinkle-50 text-periwinkle-dark px-3.5 py-2 rounded-xl text-sm font-medium">{s}</span>
                ))}
              </div>
            </div>
            <div className="animate-fade-in-up-delay-1">
              <div className="relative rounded-3xl overflow-hidden shadow-lg">
                <Image src="/nurse-mom.png" alt="Nurse mom touching noses with her young son" width={600} height={450} className="w-full h-auto object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2A2A3C]/15 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMMUTE — Photo 10: Nurse getting out of car */}
      <section className="bg-offwhite">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
            <div className="animate-fade-in-up order-2 lg:order-1">
              <div className="relative rounded-3xl overflow-hidden shadow-lg">
                <Image src="/nurse-commute.png" alt="Nurse arriving at work happy — matched close to home" width={600} height={420} className="w-full h-auto object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2A2A3C]/15 to-transparent" />
              </div>
            </div>
            <div className="animate-fade-in-up-delay-1 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 bg-periwinkle-50 px-3 py-1.5 rounded-full mb-5">
                <svg className="w-4 h-4 text-periwinkle" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span className="text-xs font-bold text-periwinkle-dark uppercase tracking-wider">Commute match</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-text mb-5 leading-tight">
                Arrive at work happy — because it&apos;s close to home
              </h2>
              <p className="text-base sm:text-lg text-text-light leading-relaxed mb-6">
                Your Flor Fit Score factors in commute distance so you&apos;re not wasting hours on the road.
              </p>
              <div className="bg-periwinkle-50 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                    <svg className="w-5 h-5 text-periwinkle" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-text">Commute Score: 92%</div>
                    <div className="text-xs text-text-light">12 min drive from your zip code</div>
                  </div>
                </div>
                <div className="h-2 bg-white rounded-full overflow-hidden">
                  <div className="h-full bg-success rounded-full" style={{ width: "92%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS — Photos 6 & 7 */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-text mb-4">
              This is why you became a nurse
            </h2>
            <p className="text-base sm:text-lg text-text-light max-w-2xl mx-auto">
              The job search should never get in the way of the work that matters.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="animate-fade-in-up-delay-1">
              <div className="relative rounded-3xl overflow-hidden shadow-lg mb-5">
                <Image src="/nurse-elderly.png" alt="Nurse hugging elderly man, both smiling" width={600} height={450} className="w-full h-[300px] sm:h-[360px] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2A2A3C]/25 to-transparent" />
              </div>
              <blockquote className="text-base sm:text-lg font-medium text-text leading-relaxed italic">
                &ldquo;I became a nurse to make a difference, not to fight through job boards.&rdquo;
              </blockquote>
              <p className="text-sm text-text-muted mt-2">— Registered Nurse, 8 years experience</p>
            </div>
            <div className="animate-fade-in-up-delay-2">
              <div className="relative rounded-3xl overflow-hidden shadow-lg mb-5">
                <Image src="/nurse-child.png" alt="Nurse hugging child with red balloon in hospital corridor" width={600} height={450} className="w-full h-[300px] sm:h-[360px] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2A2A3C]/25 to-transparent" />
              </div>
              <blockquote className="text-base sm:text-lg font-medium text-text leading-relaxed italic">
                &ldquo;Every hour I spend on bad job boards is an hour I&apos;m not spending with my patients.&rdquo;
              </blockquote>
              <p className="text-sm text-text-muted mt-2">— Pediatric Nurse, 5 years experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION — Photo 5: Hands being held */}
      <section className="bg-offwhite">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-rose-light px-3 py-1.5 rounded-full mb-5">
                <svg className="w-4 h-4 text-rose" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-bold text-[#C47A9A] uppercase tracking-wider">Our mission</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-text mb-5 leading-tight">
                Nursing is about human connection. Flor protects that.
              </h2>
              <p className="text-base sm:text-lg text-text-light leading-relaxed mb-6">
                Named after Florence Nightingale, Flor exists to change the system for the better.
                Nurses deserve a job search that respects their time, their skills, and the incredible work they do.
              </p>
              <div className="bg-white rounded-2xl p-5 sm:p-6 section-shadow">
                <p className="text-sm font-semibold text-periwinkle-dark mb-3">Our promise to nurses:</p>
                <ul className="space-y-2">
                  {["Every job is real — no ghost posts", "Every pay range is visible — no hidden compensation", "Direct applications only — no recruiter middlemen", "Free forever — we'll never charge nurses"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-text">
                      <div className="w-1.5 h-1.5 bg-periwinkle rounded-full flex-shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="animate-fade-in-up-delay-1">
              <div className="relative rounded-3xl overflow-hidden shadow-lg">
                <Image src="/nurse-hands.png" alt="Close-up of nurse holding a patient's hand" width={600} height={400} className="w-full h-auto object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2A2A3C]/15 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 mb-8 sm:mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-text">Featured Jobs</h2>
              <p className="text-text-light mt-1 text-sm sm:text-base">Real jobs with real pay, ready for you to apply.</p>
            </div>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-periwinkle hover:text-periwinkle-dark transition-colors"
            >
              View all jobs
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {seedJobs.map((job, i) => (
              <JobCard key={job.id} job={job} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-offwhite">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="relative bg-gradient-to-br from-periwinkle via-periwinkle-dark to-[#5B5F9E] rounded-3xl p-8 sm:p-14 text-center text-white overflow-hidden animate-fade-in-up">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.05] rounded-full blur-2xl -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/[0.05] rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />

            <div className="relative">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
                Ready to find a job that<br className="hidden sm:block" /> actually respects your time?
              </h2>
              <p className="text-base sm:text-lg opacity-90 mb-8 max-w-lg mx-auto leading-relaxed">
                Create your Flor profile and let our Fit Score match you with
                jobs that fit your skills, schedule, and goals.
              </p>
              <Link
                href="/nurse-profile"
                className="inline-block bg-white text-periwinkle-dark font-bold px-8 py-4 rounded-2xl text-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Get Started — It&apos;s Free
              </Link>
              <p className="mt-4 text-sm opacity-70">
                Built by nurses, for nurses.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
