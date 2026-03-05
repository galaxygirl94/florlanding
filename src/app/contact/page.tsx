"use client";

import Link from "next/link";

export default function ContactPage() {
  return (
    <div>
      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-periwinkle-50 to-white">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-periwinkle/5 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/4" />
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-20 sm:pt-28 pb-16 sm:pb-20">
          <div className="max-w-2xl mx-auto text-center animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text leading-[1.06] tracking-tight mb-6">
              Talk to us.
            </h1>
            <p className="text-lg sm:text-xl text-text-light leading-relaxed">
              We&apos;re real people and we actually read these. Whether you have a question, a suggestion, or just want to say hi — we&apos;d love to hear from&nbsp;you.
            </p>
          </div>
        </div>
      </section>

      {/* ========== CONTACT FORM + INFO ========== */}
      <section className="bg-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-24 sm:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 max-w-5xl mx-auto">
            {/* Form */}
            <div className="lg:col-span-7 animate-fade-in-up">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-text mb-2">Send us a message</h2>
              <p className="text-text-light mb-8">We typically respond within one business day.</p>

              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-bold text-text mb-2">
                      First name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      placeholder="Your first name"
                      className="w-full px-4 py-3 rounded-xl border border-periwinkle-100 bg-white text-text placeholder:text-text-muted text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-bold text-text mb-2">
                      Last name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      placeholder="Your last name"
                      className="w-full px-4 py-3 rounded-xl border border-periwinkle-100 bg-white text-text placeholder:text-text-muted text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-text mb-2">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-periwinkle-100 bg-white text-text placeholder:text-text-muted text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-bold text-text mb-2">
                    What&apos;s this about?
                  </label>
                  <select
                    id="subject"
                    className="w-full px-4 py-3 rounded-xl border border-periwinkle-100 bg-white text-text text-sm"
                    defaultValue=""
                  >
                    <option value="" disabled>Select a topic</option>
                    <option value="general">General question</option>
                    <option value="account">My account</option>
                    <option value="job-listing">A job listing</option>
                    <option value="facility">Facility inquiry</option>
                    <option value="feedback">Feedback or suggestion</option>
                    <option value="bug">Report a bug</option>
                    <option value="other">Something else</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-bold text-text mb-2">
                    Your message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Tell us what's on your mind..."
                    className="w-full px-4 py-3 rounded-xl border border-periwinkle-100 bg-white text-text placeholder:text-text-muted text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto bg-periwinkle hover:bg-periwinkle-dark text-white font-bold px-8 py-3.5 rounded-full transition-all duration-200 shadow-md shadow-periwinkle/20 hover:shadow-lg hover:shadow-periwinkle/30 hover:-translate-y-0.5"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact info sidebar */}
            <div className="lg:col-span-5 animate-fade-in-up-delay-1">
              <div className="bg-periwinkle-50 rounded-2xl p-8 mb-6">
                <h3 className="font-extrabold text-lg text-text mb-5">Other ways to reach us</h3>

                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-periwinkle flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-text text-sm mb-1">Email us directly</p>
                      <a href="mailto:hello@florfornurses.com" className="text-periwinkle hover:text-periwinkle-dark font-medium text-sm transition-colors">
                        hello@florfornurses.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-periwinkle flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-text text-sm mb-1">Response time</p>
                      <p className="text-text-light text-sm">We typically reply within one business day. Usually faster.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-success-light/50 rounded-2xl p-8 border border-success/10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center text-success flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-text text-sm mb-1">Built by nurses, for nurses</p>
                    <p className="text-text-light text-sm leading-relaxed">
                      When you reach out to Flor, you&apos;re talking to people who understand nursing. Our co-founder Jessica is an RN. Your message isn&apos;t going into a void — it&apos;s going to people who care.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FAQ QUICK HITS ========== */}
      <section className="bg-offwhite">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-24 sm:py-32">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12 animate-fade-in-up">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-text mb-3">Quick answers</h2>
              <p className="text-text-light">Before you write, these might help.</p>
            </div>

            <div className="space-y-4 animate-fade-in-up-delay-1">
              {[
                { q: "Is Flor really free for nurses?", a: "Yes. Free to create a profile, free to browse, free to apply. We will never charge nurses. Facilities pay to post — not you." },
                { q: "How do I delete my account?", a: "Email us at hello@florfornurses.com and we'll take care of it within 24 hours. No hoops, no retention tricks." },
                { q: "I found a job listing that seems wrong. What do I do?", a: "Report it through the listing page or send us a message here. We investigate every report and take action quickly." },
                { q: "I'm a facility. How do I post jobs on Flor?", a: "We'd love to talk. Send us a message using the form above or email hello@florfornurses.com. We'll walk you through the Ethics Pledge and get you set up." },
              ].map((item) => (
                <div key={item.q} className="bg-white rounded-xl p-6 section-shadow">
                  <h3 className="font-bold text-text mb-2">{item.q}</h3>
                  <p className="text-text-light text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="bg-[#1E1E2E] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-periwinkle/8 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/4" />

        <div className="relative max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-24 sm:py-32 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
            Ready to find your next role?
          </h2>
          <p className="text-lg sm:text-xl text-white/60 mb-10 max-w-lg mx-auto leading-relaxed">
            Create your free profile and start seeing jobs that actually fit your life.
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
