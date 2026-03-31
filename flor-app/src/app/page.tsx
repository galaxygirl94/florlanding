import Link from "next/link";
import JobCard from "@/components/JobCard";
import { seedJobs } from "@/data/seed-jobs";

export default function HomePage() {
  const featuredJobs = seedJobs.filter((j) => j.verified).slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-periwinkle-50 via-white to-periwinkle-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-20 sm:pt-24 sm:pb-28">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <div className="inline-block bg-periwinkle-100 text-periwinkle-dark text-xs font-semibold px-3 py-1 rounded-full mb-5">
              Transparency-first nursing jobs
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-text leading-tight">
              See the real pay.{" "}
              <span className="text-periwinkle">Know the real schedule.</span>{" "}
              Apply directly.
            </h1>
            <p className="mt-5 text-base sm:text-lg text-text-light leading-relaxed max-w-2xl mx-auto">
              Flor is the nursing job marketplace that puts <strong>you</strong> first. Every listing shows clear pay breakdowns, honest schedules, and direct applications — no recruiters, no guesswork.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/jobs" className="w-full sm:w-auto bg-amber hover:bg-amber-dark text-white font-bold px-8 py-4 rounded-full text-base sm:text-lg transition-colors shadow-lg shadow-amber/25">
                Browse 27 Jobs
              </Link>
              <Link href="/nurse-profile" className="w-full sm:w-auto bg-white hover:bg-periwinkle-50 text-periwinkle-dark font-semibold px-8 py-4 rounded-full text-base sm:text-lg border border-periwinkle-light transition-colors">
                Create Profile
              </Link>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto animate-fade-in-up-delay-1">
            {[
              { value: "27", label: "Open Positions" },
              { value: "100%", label: "Pay Transparent" },
              { value: "0", label: "Recruiter Fees" },
              { value: "Direct", label: "Every Application" },
            ].map(({ value, label }) => (
              <div key={label} className="bg-white rounded-2xl p-4 text-center card-shadow">
                <div className="text-2xl font-extrabold text-periwinkle">{value}</div>
                <div className="text-xs text-text-light mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute -top-20 -right-20 w-72 h-72 bg-periwinkle/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-amber/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Problem section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Nursing job boards are broken</h2>
          <p className="text-text-light max-w-xl mx-auto">Every nurse knows it. Here&apos;s what Flor fixes.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            { problem: "\"$XX–$XX/hr DOE\" means nothing", fix: "We show exact pay ranges with a plain-English explanation of how your rate is determined." },
            { problem: "Schedule buried in fine print", fix: "Visual schedule badges show shift, hours, weekends, and on-call — right on the listing." },
            { problem: "Recruiter takes 15–30% of your pay", fix: "Apply directly to facilities. No middlemen. No one taking a cut of your salary." },
            { problem: "No way to vet workplace culture", fix: "Real nurse reviews and facility profiles so you know exactly what you're walking into." },
          ].map(({ problem, fix }) => (
            <div key={problem} className="bg-white rounded-2xl card-shadow p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-red-500 text-sm font-bold">✕</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-text mb-2">{problem}</p>
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 text-xs">✓</span>
                    </div>
                    <p className="text-sm text-text-light">{fix}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div className="mt-10 bg-periwinkle-50 rounded-2xl p-6 sm:p-8 text-center max-w-2xl mx-auto">
          <p className="text-base sm:text-lg text-text italic leading-relaxed">
            &ldquo;I applied to 12 jobs last year through traditional boards. Three had lower pay than listed once I actually got to the offer. Flor would have saved me months of wasted time.&rdquo;
          </p>
          <p className="text-sm text-text-light mt-4 font-medium">— Maria R., RN, Providence · Med-Surg · 4 years experience</p>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-periwinkle-50 py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold">How Flor works</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Create your profile", desc: "Tell us your specialty, license, certifications, and schedule preferences. Takes 5 minutes." },
              { step: "2", title: "Browse real listings", desc: "See pay, schedule, culture, and EHR system upfront — no surprises, no calls with recruiters." },
              { step: "3", title: "Apply directly", desc: "One-click apply goes straight to the facility. No middlemen, no resume black holes." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="bg-white rounded-2xl p-6 sm:p-8 text-center card-shadow">
                <div className="w-12 h-12 rounded-full bg-periwinkle text-white text-xl font-bold flex items-center justify-center mx-auto mb-4">
                  {step}
                </div>
                <h3 className="font-bold text-base mb-2">{title}</h3>
                <p className="text-sm text-text-light leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flor Fit demo */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-block bg-periwinkle-100 text-periwinkle-dark text-xs font-semibold px-3 py-1 rounded-full mb-4">
              Flor Fit Score
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              See how well each job actually fits you
            </h2>
            <p className="text-text-light leading-relaxed mb-6">
              Our matching algorithm scores each job based on your specialty, schedule preferences, location, EHR experience, and more. No keyword matching — real compatibility scoring.
            </p>
            <div className="space-y-3">
              {[
                { label: "Specialty match", score: 35, max: 35, color: "bg-periwinkle" },
                { label: "Care setting", score: 22, max: 25, color: "bg-periwinkle" },
                { label: "Schedule fit", score: 18, max: 20, color: "bg-periwinkle" },
                { label: "Location", score: 8, max: 15, color: "bg-periwinkle" },
                { label: "EHR experience", score: 1, max: 1, color: "bg-amber" },
                { label: "PSLF alignment", score: 3, max: 4, color: "bg-amber" },
              ].map(({ label, score, max, color }) => (
                <div key={label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-text-light">{label}</span>
                    <span className="font-medium">{score}/{max}</span>
                  </div>
                  <div className="h-1.5 bg-periwinkle-100 rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full`} style={{ width: `${(score / max) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <div className="bg-white rounded-2xl card-shadow p-8 max-w-xs w-full text-center">
              <div className="w-28 h-28 rounded-full bg-periwinkle-50 border-4 border-periwinkle flex items-center justify-center mx-auto mb-4">
                <div>
                  <div className="text-4xl font-extrabold text-periwinkle">87</div>
                  <div className="text-xs text-periwinkle-dark font-medium">/ 100</div>
                </div>
              </div>
              <h3 className="font-bold text-base mb-1">Strong Match</h3>
              <p className="text-xs text-text-light mb-4">RN – Medical-Surgical · Bayside Medical</p>
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-green-500">✓</span>
                  <span className="text-text-light">Specialty matches perfectly</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-green-500">✓</span>
                  <span className="text-text-light">Days shift available</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-amber">~</span>
                  <span className="text-text-light">30 min commute from your location</span>
                </div>
              </div>
              <Link href="/jobs" className="block mt-5 bg-amber hover:bg-amber-dark text-white font-semibold px-5 py-3 rounded-full text-sm transition-colors">
                See your matches
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="bg-periwinkle-50 py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">Featured positions</h2>
              <p className="text-text-light mt-1 text-sm">Flor Verified — pay and schedule confirmed accurate</p>
            </div>
            <Link href="/jobs" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-periwinkle hover:underline">
              View all 27 jobs →
            </Link>
          </div>
          <div className="space-y-4">
            {featuredJobs.map((job, i) => (
              <JobCard key={job.id} job={job} index={i} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/jobs" className="bg-periwinkle hover:bg-periwinkle-dark text-white font-bold px-8 py-4 rounded-full text-base transition-colors">
              Browse all 27 positions
            </Link>
          </div>
        </div>
      </section>

      {/* Ethics Pledge */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="bg-white rounded-3xl card-shadow p-8 sm:p-12">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">The Flor Ethics Pledge</h2>
            <p className="text-text-light">We built Flor because we were tired of job boards that lie. Here&apos;s what we commit to.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { title: "We never hide pay", desc: "Every listing shows the full pay range. We reject listings that refuse to disclose pay." },
              { title: "We never sell your data", desc: "Your profile is yours. We will never sell nurse data to third-party recruiters or data brokers." },
              { title: "We charge facilities, not nurses", desc: "Flor is always free for nurses. Facilities pay to list jobs — never a cut of your salary." },
              { title: "We verify what we say is verified", desc: "\"Flor Verified\" means we actually checked pay and schedule accuracy against published data." },
            ].map(({ title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-periwinkle-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-periwinkle text-sm font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-1">{title}</h3>
                  <p className="text-sm text-text-light leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature highlights */}
      <section className="bg-periwinkle-50 py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">Everything nurses need, nothing they don&apos;t</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[
              { icon: "💰", title: "Pay Transparency", desc: "Full pay range with a plain-English breakdown of how your rate is determined." },
              { icon: "📅", title: "Honest Schedules", desc: "Visual badges show shift, hours, weekends, and on-call. No surprises." },
              { icon: "🤝", title: "Direct Apply", desc: "Apply straight to facilities. No recruiters, no middlemen, no one taking a cut." },
              { icon: "❓", title: "Anonymous Q&A", desc: "Ask questions on any listing. Facility answers are visible to all nurses forever." },
              { icon: "🏥", title: "Facility Profiles", desc: "Real reviews, culture, and EHR info so you know what you&apos;re walking into." },
              { icon: "✨", title: "Flor Fit Score", desc: "Match score based on your specialty, schedule, location, and EHR — not keywords." },
            ].map((item, i) => (
              <div
                key={item.title}
                className={`bg-white rounded-2xl p-5 sm:p-6 card-shadow ${i < 3 ? "animate-fade-in-up-delay-1" : "animate-fade-in-up-delay-2"}`}
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-base mb-2">{item.title}</h3>
                <p className="text-sm text-text-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">What nurses are saying</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            {
              quote: "For the first time in my career I actually knew what I was agreeing to before I signed. The pay was exactly as listed. I didn't have to negotiate anything.",
              author: "James O.", role: "RN, ICU · 7 years experience"
            },
            {
              quote: "The facility culture info is what got me. I turned down an offer from a place that had terrible reviews and took one at a smaller hospital I never would have found otherwise.",
              author: "Destiny C.", role: "Pediatric RN · 3 years experience"
            },
          ].map(({ quote, author, role }) => (
            <div key={author} className="bg-white rounded-2xl card-shadow p-6 sm:p-8">
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map((s) => <span key={s} className="text-amber text-sm">★</span>)}
              </div>
              <p className="text-base text-text italic leading-relaxed mb-5">&ldquo;{quote}&rdquo;</p>
              <div>
                <p className="text-sm font-semibold">{author}</p>
                <p className="text-xs text-text-light">{role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-periwinkle py-14 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to find a job that&apos;s honest about what it offers?
          </h2>
          <p className="text-periwinkle-light text-base mb-8">
            Join nurses across Rhode Island who are done with the guessing game.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/jobs" className="bg-white text-periwinkle-dark font-bold px-8 py-4 rounded-full text-base hover:bg-periwinkle-50 transition-colors">
              Browse Jobs
            </Link>
            <Link href="/nurse-profile" className="bg-amber hover:bg-amber-dark text-white font-bold px-8 py-4 rounded-full text-base transition-colors">
              Create Your Profile
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
