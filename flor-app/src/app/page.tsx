import Link from "next/link";
import JobCard from "@/components/JobCard";
import { seedJobs } from "@/data/seed-jobs";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-periwinkle-50 via-white to-periwinkle-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-16 sm:pt-20 sm:pb-24">
          <div className="max-w-2xl mx-auto text-center animate-fade-in-up">
            <div className="inline-block bg-periwinkle-100 text-periwinkle-dark text-xs font-semibold px-3 py-1 rounded-full mb-4 sm:mb-6">
              Transparency-first nursing jobs
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-text leading-tight">
              See the real pay.{" "}
              <span className="text-periwinkle">Know the real schedule.</span>{" "}
              Apply directly.
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-text-light leading-relaxed">
              Flor is the nursing job marketplace that puts{" "}
              <strong>you</strong> first. Every listing shows clear pay
              breakdowns, honest schedules, and direct applications — no
              recruiters, no guesswork.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                href="/jobs"
                className="w-full sm:w-auto bg-amber hover:bg-amber-dark text-white font-bold px-8 py-4 rounded-full text-base sm:text-lg transition-colors shadow-lg shadow-amber/25"
              >
                Browse Jobs
              </Link>
              <Link
                href="/nurse-signup"
                className="w-full sm:w-auto bg-white hover:bg-periwinkle-50 text-periwinkle-dark font-semibold px-8 py-4 rounded-full text-base sm:text-lg border border-periwinkle-light transition-colors"
              >
                Create Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-periwinkle/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber/10 rounded-full blur-3xl" />
      </section>

      {/* Why Flor */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 animate-fade-in-up">
          Why nurses love Flor
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              icon: "💰",
              title: "Pay Transparency",
              desc: "Every listing shows the full pay range with a plain-English explanation of how your rate is determined.",
            },
            {
              icon: "📅",
              title: "Honest Schedules",
              desc: "Visual schedule badges show exactly what you're signing up for — no surprises buried in fine print.",
            },
            {
              icon: "🤝",
              title: "Direct Applications",
              desc: "Apply directly to facilities. No recruiters, no middlemen, no one taking a cut of your pay.",
            },
            {
              icon: "❓",
              title: "Q&A on Every Listing",
              desc: "Ask anonymous questions and see real answers from the facility — visible to all nurses forever.",
            },
            {
              icon: "🏥",
              title: "Facility Profiles",
              desc: "Real reviews, culture info, and EHR systems so you know what you're walking into.",
            },
            {
              icon: "✨",
              title: "Flor Fit Score",
              desc: "Our matching algorithm shows how well you fit each job — based on skills, not keywords.",
            },
          ].map((item, i) => (
            <div
              key={item.title}
              className={`bg-white rounded-2xl p-5 sm:p-6 card-shadow ${
                i < 3 ? "animate-fade-in-up-delay-1" : "animate-fade-in-up-delay-2"
              }`}
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-bold text-base mb-2">{item.title}</h3>
              <p className="text-sm text-text-light leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold">Featured Jobs</h2>
          <Link href="/jobs" className="text-sm font-semibold text-periwinkle hover:text-periwinkle-dark">
            View all jobs &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {seedJobs.map((job, i) => (
            <JobCard key={job.id} job={job} index={i} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="bg-gradient-to-br from-periwinkle to-periwinkle-dark rounded-3xl p-8 sm:p-12 text-center text-white animate-fade-in-up">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Ready to find your next role?</h2>
          <p className="text-base sm:text-lg opacity-90 mb-6 sm:mb-8 max-w-lg mx-auto">
            Create your Flor profile and let us match you with the jobs that
            fit your skills, schedule, and goals.
          </p>
          <Link
            href="/nurse-signup"
            className="inline-block bg-amber hover:bg-amber-dark text-white font-bold px-8 py-4 rounded-full text-lg transition-colors shadow-lg"
          >
            Get Started — It&apos;s Free
          </Link>
        </div>
      </section>
    </div>
  );
}
