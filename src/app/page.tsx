import Link from "next/link";
import Image from "next/image";
import JobCard from "@/components/JobCard";
import { seedJobs } from "@/data/seed-jobs";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-periwinkle-50 via-cream to-rose-light" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-periwinkle/[0.07] rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber/[0.06] rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-rose/[0.05] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20 sm:pt-24 sm:pb-32">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            {/* Prominent Flor logo */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <Image
                src="/flor-logo.jpg"
                alt="Flor"
                width={52}
                height={64}
                className="object-contain"
                priority
              />
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-text">
                fl<span className="text-periwinkle">o</span>r
              </span>
            </div>

            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm text-periwinkle-dark text-sm font-medium px-4 py-2 rounded-full mb-6 border border-periwinkle-100/50 shadow-sm">
              <svg className="w-4 h-4 text-periwinkle" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Named after Florence Nightingale
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-text leading-[1.1] tracking-tight">
              You deserve to know{" "}
              <span className="gradient-text">what you&apos;re worth</span>
            </h1>

            <p className="mt-6 sm:mt-8 text-lg sm:text-xl text-text-light leading-relaxed max-w-2xl mx-auto">
              Flor is the nursing job marketplace <em>built by nurses, for nurses</em>.
              Real pay. Real schedules. Direct applications. No more guesswork.
            </p>

            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                href="/jobs"
                className="w-full sm:w-auto bg-periwinkle hover:bg-periwinkle-dark text-white font-bold px-8 py-4 rounded-2xl text-base sm:text-lg transition-all duration-200 shadow-lg shadow-periwinkle/20 hover:shadow-xl hover:shadow-periwinkle/30 hover:-translate-y-0.5"
              >
                Browse Jobs
              </Link>
              <Link
                href="/nurse-profile"
                className="w-full sm:w-auto bg-white hover:bg-periwinkle-50 text-text font-semibold px-8 py-4 rounded-2xl text-base sm:text-lg border border-periwinkle-100 transition-all duration-200 hover:border-periwinkle-200"
              >
                Create Your Profile
              </Link>
            </div>

            <p className="mt-5 text-sm text-text-muted">
              Free forever for nurses. No sign-up spam. We promise.
            </p>
          </div>
        </div>
      </section>

      {/* The Broken System */}
      <section className="relative bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16 animate-fade-in-up">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-text mb-4">
              The system is broken. You know it.
            </h2>
            <p className="text-base sm:text-lg text-text-light leading-relaxed">
              Nursing job search shouldn&apos;t feel like navigating a minefield. But right now, it does.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-12 sm:mb-16">
            {[
              {
                problem: "Recruiter spam",
                detail: "Your inbox flooded with generic messages from people who don't know your name",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                ),
              },
              {
                problem: "Ghost job posts",
                detail: "You apply, you wait, nothing happens — because the job was never real",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                ),
              },
              {
                problem: "Hidden pay",
                detail: "\"Competitive salary\" means they don't want you to know what they're paying",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ),
              },
              {
                problem: "Wasted time",
                detail: "Hours lost on applications that go into a black hole with zero feedback",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <div
                key={item.problem}
                className={`relative bg-warm-gray rounded-2xl p-5 sm:p-6 border border-transparent hover:border-periwinkle-100 transition-all duration-300 ${
                  i < 2 ? "animate-fade-in-up-delay-1" : "animate-fade-in-up-delay-2"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-periwinkle-50 flex items-center justify-center text-periwinkle mb-4">
                  {item.icon}
                </div>
                <h3 className="font-bold text-base mb-1.5 text-text">{item.problem}</h3>
                <p className="text-sm text-text-light leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>

          <div className="max-w-2xl mx-auto text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-periwinkle-50 px-4 py-2 rounded-full mb-4">
              <div className="w-2 h-2 bg-periwinkle rounded-full" />
              <span className="text-sm font-semibold text-periwinkle-dark">Flor is the alternative</span>
            </div>
            <p className="text-base sm:text-lg text-text-light leading-relaxed">
              We&apos;re changing the system for the better. Every job on Flor is real, every pay range is visible,
              and you apply directly to facilities — no middlemen taking a cut of what you&apos;ve earned.
            </p>
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

      {/* Flor Fit Score Explainer */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-periwinkle-50 px-3 py-1.5 rounded-full mb-5">
                <svg className="w-4 h-4 text-periwinkle" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xs font-bold text-periwinkle-dark uppercase tracking-wider">Your personal match</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-text mb-5 leading-tight">
                Meet the Flor Fit Score
              </h2>

              <p className="text-base sm:text-lg text-text-light leading-relaxed mb-6">
                No more guessing if you&apos;re qualified. Our matching algorithm analyzes your profile against
                each job and gives you a clear score from 0-100, with a plain-English explanation of why.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { label: "License & certification match", desc: "Do you have what they require?" },
                  { label: "Schedule compatibility", desc: "Does it fit the hours you want?" },
                  { label: "Location & commute", desc: "Is it in your preferred area?" },
                  { label: "Experience alignment", desc: "Does your background match?" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-periwinkle flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-text">{item.label}</span>
                      <span className="text-sm text-text-light"> — {item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/nurse-profile"
                className="inline-flex items-center gap-2 bg-periwinkle hover:bg-periwinkle-dark text-white font-semibold px-6 py-3 rounded-2xl transition-all duration-200 shadow-md shadow-periwinkle/15 hover:shadow-lg hover:shadow-periwinkle/25"
              >
                Create profile to see your scores
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>

            {/* Visual Fit Score Demo */}
            <div className="animate-fade-in-up-delay-1">
              <div className="bg-gradient-to-br from-periwinkle-50 to-cream rounded-3xl p-6 sm:p-8">
                <div className="bg-white rounded-2xl section-shadow p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h4 className="font-bold text-base">RN - Behavioral Health</h4>
                      <p className="text-xs text-text-light mt-0.5">Providence Community Health</p>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-periwinkle-50 to-periwinkle-100 flex flex-col items-center justify-center">
                      <span className="text-xl font-extrabold text-periwinkle leading-none">87</span>
                      <span className="text-[9px] font-bold text-periwinkle-dark uppercase">Fit</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: "License", value: 95, color: "bg-success" },
                      { label: "Schedule", value: 90, color: "bg-periwinkle" },
                      { label: "Location", value: 85, color: "bg-periwinkle" },
                      { label: "Experience", value: 78, color: "bg-amber" },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-text-light font-medium">{item.label}</span>
                          <span className="font-bold text-text">{item.value}%</span>
                        </div>
                        <div className="h-2 bg-periwinkle-50 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${item.color} rounded-full transition-all duration-500`}
                            style={{ width: `${item.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 pt-4 border-t border-periwinkle-50 text-xs text-text-light">
                    <span className="font-semibold text-success">Strong match:</span> Your RN license and BLS cert meet requirements.
                    Consider ACLS certification to boost your score.
                  </div>
                </div>
              </div>
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
