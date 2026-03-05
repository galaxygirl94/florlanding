import Link from "next/link";

export const metadata = {
  title: "Pay Transparency — Real Pay on Every Job | Flor",
  description:
    "Every job on Flor shows the real pay. No bait-and-switch. No hidden rates. Flor is changing how nursing pay works.",
};

export default function PayTransparencyPage() {
  return (
    <div>
      {/* ========== HERO — manifesto energy ========== */}
      <section className="relative overflow-hidden bg-[#1E1E2E]">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-periwinkle/8 rounded-full blur-[140px] -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-periwinkle/6 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4" />

        <div className="relative max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-24 sm:pt-36 pb-20 sm:pb-28">
          <div className="max-w-3xl animate-fade-in-up">
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full mb-8">
              <div className="w-2 h-2 bg-success rounded-full" />
              <span className="text-sm font-semibold text-white/90">Our commitment to nurses</span>
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.06] tracking-tight mb-8">
              Every job on Flor shows the real&nbsp;pay.
            </h1>

            <p className="text-xl sm:text-2xl text-white/70 leading-relaxed max-w-2xl">
              No bait-and-switch. No hidden rates. No finding out what you&apos;re actually making after you&apos;ve already started.
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ========== THE PROBLEM ========== */}
      <section className="bg-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-24 sm:py-32">
          <div className="max-w-3xl mx-auto">
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center gap-2 text-danger text-sm font-bold uppercase tracking-wider mb-6">
                <span className="w-8 h-px bg-danger" />
                The problem
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-text leading-[1.12] mb-8">
                The current system is designed to keep nurses in the dark.
              </h2>

              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-text-light leading-relaxed mb-6">
                  You&apos;ve seen the listings. &ldquo;Competitive salary.&rdquo; &ldquo;Pay commensurate with experience.&rdquo; &ldquo;Up to $45/hr&rdquo; — where &ldquo;up to&rdquo; means almost nobody actually makes that.
                </p>
                <p className="text-lg text-text-light leading-relaxed mb-10">
                  Nurses spend hours applying, interviewing, completing skills assessments — only to find out the real pay doesn&apos;t match what was advertised. Or worse, they find out after they&apos;ve already accepted the position and started orientation.
                </p>
              </div>
            </div>

            {/* What's wrong cards */}
            <div className="space-y-4 animate-fade-in-up-delay-1">
              {[
                {
                  bad: "\"Competitive salary\"",
                  reality: "Code for \"we don't want you to compare us to anyone else.\"",
                },
                {
                  bad: "\"Up to $52/hr\"",
                  reality: "The top of a range nobody actually reaches. The real rate? You won't know until the offer letter.",
                },
                {
                  bad: "\"Pay commensurate with experience\"",
                  reality: "Meaningless. Every nurse has experience. This tells you nothing about what you'll actually earn.",
                },
                {
                  bad: "No pay listed at all",
                  reality: "A red flag dressed up as normal. You're expected to invest your time before they'll tell you what the job is worth.",
                },
              ].map((item) => (
                <div key={item.bad} className="bg-danger-light/50 rounded-xl p-6 border border-danger/10">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-danger/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-bold text-text">{item.bad}</span>
                      <span className="text-text-light"> — {item.reality}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== THE FLOR STANDARD ========== */}
      <section className="bg-gradient-to-b from-periwinkle-50 to-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-24 sm:py-32">
          <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in-up">
            <span className="inline-flex items-center gap-2 text-periwinkle text-sm font-bold uppercase tracking-wider mb-6">
              <span className="w-8 h-px bg-periwinkle" />
              The Flor standard
              <span className="w-8 h-px bg-periwinkle" />
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text leading-[1.12] mb-5">
              On Flor, you see the real number.
            </h2>
            <p className="text-lg text-text-light leading-relaxed max-w-2xl mx-auto">
              Every facility that posts on Flor is required to show transparent, accurate compensation. Here&apos;s what that means:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "Base Hourly Rate",
                desc: "The actual hourly rate for the position — not a range designed to mislead, but the real number you'll see on your paycheck.",
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                title: "Shift Differentials",
                desc: "Night diff, weekend diff, holiday pay — all listed separately so you know exactly what each shift is worth.",
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                  </svg>
                ),
              },
              {
                title: "Benefits Package",
                desc: "Health insurance, retirement matching, PTO, tuition reimbursement — all spelled out before you ever apply.",
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                ),
              },
              {
                title: "Sign-On Bonuses",
                desc: "If there's a bonus, you'll see the amount and the terms — including any clawback clauses. No surprises in the fine print.",
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                  </svg>
                ),
              },
              {
                title: "Overtime Policy",
                desc: "How overtime is calculated, when it kicks in, and whether it's mandatory or voluntary. You'll know before day one.",
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                title: "Total Compensation",
                desc: "We calculate your estimated annual earnings based on the posted schedule — so you can compare jobs at a glance.",
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className={`bg-white rounded-2xl p-7 sm:p-8 section-shadow hover:-translate-y-1 transition-all duration-300 ${
                  i < 3 ? "animate-fade-in-up" : "animate-fade-in-up-delay-1"
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-periwinkle-50 flex items-center justify-center text-periwinkle mb-5">
                  {item.icon}
                </div>
                <h3 className="font-bold text-lg text-text mb-2">{item.title}</h3>
                <p className="text-sm text-text-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== MANIFESTO BLOCK ========== */}
      <section className="bg-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-24 sm:py-32">
          <div className="max-w-3xl mx-auto animate-fade-in-up">
            <div className="bg-periwinkle-50 rounded-3xl p-8 sm:p-12 lg:p-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-text leading-tight mb-8">
                Here&apos;s what we believe.
              </h2>

              <div className="space-y-6 text-lg text-text-light leading-relaxed">
                <p>
                  <strong className="text-text">You should never have to ask what a job pays.</strong> The fact that &ldquo;What&apos;s the salary?&rdquo; feels like a taboo question in healthcare hiring is absurd. It&apos;s your time, your skills, your license. You deserve to know.
                </p>
                <p>
                  <strong className="text-text">Pay transparency isn&apos;t a perk — it&apos;s a baseline.</strong> When facilities hide pay, they&apos;re not protecting anyone. They&apos;re creating a system where nurses with less negotiating leverage get paid less for the same work.
                </p>
                <p>
                  <strong className="text-text">Transparency creates trust.</strong> Facilities that are upfront about compensation attract better candidates, fill roles faster, and have lower turnover. Everyone wins when the cards are on the table.
                </p>
                <p>
                  <strong className="text-text">This isn&apos;t radical. It&apos;s just right.</strong> Other industries figured this out years ago. Nursing deserves the same respect.
                </p>
              </div>
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
            See what jobs really pay.
          </h2>
          <p className="text-lg sm:text-xl text-white/60 mb-10 max-w-lg mx-auto leading-relaxed">
            Every job on Flor shows the full compensation picture. No more guessing, no more games.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/jobs"
              className="bg-white text-[#1E1E2E] font-bold px-10 py-4 rounded-full text-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Browse Transparent Jobs
            </Link>
            <Link
              href="/nurse-profile"
              className="bg-white/10 hover:bg-white/15 text-white font-bold px-10 py-4 rounded-full text-lg border border-white/20 transition-all duration-200"
            >
              Create Your Profile
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
