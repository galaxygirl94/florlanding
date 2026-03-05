import Link from "next/link";

export const metadata = {
  title: "Ethics Pledge — Our Promise to Nurses | Flor",
  description:
    "Every facility on Flor has signed our Ethics Pledge: transparent pay, no ghost jobs, honest descriptions, respectful timelines, and fair treatment.",
};

const pledgeItems = [
  {
    title: "Transparent pay on every listing",
    desc: "No more \"competitive salary\" or \"pay commensurate with experience.\" Every job posted on Flor must show the actual hourly rate, shift differentials, and benefits. Nurses deserve to know what a job pays before they invest their time.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "No ghost job posts",
    desc: "Every position listed on Flor is a real, open role that the facility is actively hiring for right now. If a role is filled, it comes down. We don't allow facilities to collect resumes for positions that don't exist.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Honest job descriptions that match reality",
    desc: "What's in the listing is what you'll find when you show up. The unit, the patient population, the nurse-to-patient ratio, the actual day-to-day — no surprises, no bait-and-switch, no \"other duties as assigned\" catch-alls.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    title: "Respectful hiring timelines",
    desc: "Facilities commit to reviewing applications within a reasonable timeframe and keeping candidates informed throughout the process. No more applications that vanish into a black hole. Your time matters.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Fair treatment of candidates",
    desc: "No lowball offers after advertising a higher range. No mandatory overtime sprung on you after you've started. No bait-and-switch on unit assignments. Facilities that violate these standards are removed from Flor.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
];

export default function EthicsPage() {
  return (
    <div>
      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-periwinkle-50 to-white">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-periwinkle/5 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/4" />
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-20 sm:pt-28 pb-16 sm:pb-20">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            {/* Shield badge */}
            <div className="w-20 h-20 rounded-2xl bg-success-light flex items-center justify-center mx-auto mb-8">
              <svg className="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text leading-[1.06] tracking-tight mb-6">
              The Flor Ethics Pledge
            </h1>
            <p className="text-lg sm:text-xl text-text-light leading-relaxed max-w-2xl mx-auto">
              Our promise to nurses — every facility on Flor has signed this pledge. It&apos;s not marketing. It&apos;s the price of admission.
            </p>
          </div>
        </div>
      </section>

      {/* ========== THE PLEDGE ========== */}
      <section className="bg-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-24 sm:py-32">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {pledgeItems.map((item, i) => (
                <div
                  key={item.title}
                  className={`bg-white rounded-2xl p-6 sm:p-8 section-shadow ${
                    i < 2 ? "animate-fade-in-up" : i < 4 ? "animate-fade-in-up-delay-1" : "animate-fade-in-up-delay-2"
                  }`}
                >
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-success-light flex items-center justify-center text-success flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-extrabold text-lg text-text">{item.title}</h3>
                        <svg className="w-5 h-5 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-text-light leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== ENFORCEMENT ========== */}
      <section className="bg-offwhite">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-24 sm:py-32">
          <div className="max-w-3xl mx-auto animate-fade-in-up">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-text mb-4">
                This isn&apos;t just a page on our website.
              </h2>
              <p className="text-lg text-text-light leading-relaxed max-w-2xl mx-auto">
                The Ethics Pledge has teeth. Here&apos;s how we enforce&nbsp;it.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  title: "Nurse feedback",
                  desc: "After every application and hire, nurses can report whether the facility honored the pledge. Every report is reviewed.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>
                  ),
                },
                {
                  title: "Active monitoring",
                  desc: "We audit listings for accuracy and consistency. If a job description doesn't match reality, we investigate.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ),
                },
                {
                  title: "Real consequences",
                  desc: "Facilities that violate the pledge are warned, suspended, or permanently removed. We protect nurses first.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                  ),
                },
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-2xl p-6 section-shadow text-center">
                  <div className="w-12 h-12 rounded-xl bg-periwinkle-50 flex items-center justify-center text-periwinkle mx-auto mb-4">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-text mb-2">{item.title}</h3>
                  <p className="text-sm text-text-light leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== BADGE / COMMITMENT BLOCK ========== */}
      <section className="bg-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-24 sm:py-32">
          <div className="max-w-2xl mx-auto text-center animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-periwinkle to-periwinkle-dark mb-8">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-text mb-4">
              Look for the Flor Ethics badge.
            </h2>
            <p className="text-lg text-text-light leading-relaxed mb-8">
              Every verified facility on Flor displays our Ethics Pledge badge on their listings. It means they&apos;ve committed to transparency, honesty, and respect — and that we&apos;re holding them to&nbsp;it.
            </p>

            <div className="inline-flex items-center gap-3 bg-success-light px-6 py-3 rounded-full">
              <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <span className="font-bold text-success">Flor Ethics Pledge Verified</span>
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
            You deserve better. We&apos;re making sure you get&nbsp;it.
          </h2>
          <p className="text-lg sm:text-xl text-white/60 mb-10 max-w-lg mx-auto leading-relaxed">
            Every job on Flor is held to the Ethics Pledge standard. Start your search knowing the rules are on your&nbsp;side.
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
        </div>
      </section>
    </div>
  );
}
