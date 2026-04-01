import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Our Mission — Built by Nurses, for Nurses | Flor",
  description:
    "Named after Florence Nightingale. Founded because the system is broken. Meet the team building a better way for nurses to find jobs.",
};

const founders = [
  {
    name: "Grace Mathews",
    role: "CEO",
    bio: "8+ years in sales and operations. Grace saw firsthand how broken healthcare hiring was from the business side — and knew there had to be a better way. She leads Flor's strategy and growth with a relentless focus on building something nurses actually trust.",
  },
  {
    name: "Jessica Hebert",
    role: "CCO",
    bio: "Med Surg and outpatient RN. Jessica is the authentic nursing voice behind everything Flor builds. She's lived the recruiter spam, the ghost jobs, the hidden pay — and she makes sure Flor never forgets what it's like to be a nurse looking for work.",
  },
];

export default function MissionPage() {
  return (
    <div>
      {/* ========== HERO — photo with overlay ========== */}
      <section className="relative overflow-hidden min-h-[60vh] flex items-center">
        <Image
          src="/nurse-hands.jpg"
          alt="Close-up of hands being held on blue fabric"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E1E2E]/90 via-[#1E1E2E]/70 to-[#1E1E2E]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E2E]/60 via-transparent to-[#1E1E2E]/20" />

        <div className="relative w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-20 sm:py-28">
          <div className="max-w-2xl animate-fade-in-up">
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full mb-8">
              <div className="w-2 h-2 bg-periwinkle-light rounded-full" />
              <span className="text-sm font-semibold text-white/90">Named after Florence Nightingale</span>
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.06] tracking-tight mb-6">
              Built by nurses who were tired of the&nbsp;system.
            </h1>

            <p className="text-lg sm:text-xl text-white/80 leading-relaxed max-w-xl">
              Flor exists because the way nurses find jobs is broken. We&apos;re here to fix&nbsp;it.
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ========== THE STORY ========== */}
      <section className="bg-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-12 sm:py-16">
          <div className="max-w-3xl mx-auto animate-fade-in-up">
            <span className="inline-flex items-center gap-2 text-periwinkle text-sm font-bold uppercase tracking-wider mb-6">
              <span className="w-8 h-px bg-periwinkle" />
              Our story
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-text leading-[1.12] mb-8">
              The system wasn&apos;t built for nurses. So we&apos;re building one that is.
            </h2>

            <div className="space-y-6 text-lg text-text-light leading-relaxed">
              <p>
                Nurses are the backbone of healthcare. They show up for 12-hour shifts, hold patients&apos; hands through the hardest moments of their lives, and carry the weight of a system that too often takes them for granted.
              </p>
              <p>
                And when they go looking for a new job? They&apos;re met with recruiter spam, ghost job posts, hidden pay, and a hiring process that treats their time like it doesn&apos;t matter.
              </p>
              <p>
                That&apos;s why we built Flor.
              </p>
              <p>
                Named after Florence Nightingale — the founder of modern nursing — Flor is a job marketplace that puts nurses first. Not recruiters. Not staffing agencies. Not algorithms optimized for ad revenue. Nurses.
              </p>
              <p>
                Every feature we build starts with one question: <strong className="text-text">&ldquo;Does this make a nurse&apos;s life easier?&rdquo;</strong> If the answer isn&apos;t yes, we don&apos;t build it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== WHAT WE BELIEVE ========== */}
      <section className="bg-gradient-to-b from-periwinkle-50 to-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-12 sm:py-16">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text mb-4">What we believe</h2>
            <p className="text-lg text-text-light max-w-xl mx-auto">The principles that guide everything we build.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
            {[
              {
                title: "Nurses deserve transparency",
                desc: "Every job should show real pay, real schedules, and honest descriptions. If a facility won't be upfront, they don't belong on Flor.",
              },
              {
                title: "Your time has value",
                desc: "No ghost jobs. No applications that vanish into a black hole. Every listing is real, and every facility commits to respectful timelines.",
              },
              {
                title: "Direct is better",
                desc: "No recruiters taking a cut. No middlemen adding confusion. Apply directly to facilities and talk to the people who actually make hiring decisions.",
              },
              {
                title: "Free for nurses, forever",
                desc: "We will never charge nurses to use Flor. Not now, not when we grow, not ever. That's not a marketing line — it's a founding principle.",
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className={`bg-white rounded-2xl p-8 section-shadow ${
                  i < 2 ? "animate-fade-in-up" : "animate-fade-in-up-delay-1"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-periwinkle-50 flex items-center justify-center text-periwinkle mb-5">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-extrabold text-lg text-text mb-3">{item.title}</h3>
                <p className="text-text-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FOUNDING TEAM ========== */}
      <section className="bg-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-12 sm:py-16">
          <div className="text-center mb-16 animate-fade-in-up">
            <span className="inline-flex items-center gap-2 text-periwinkle text-sm font-bold uppercase tracking-wider mb-6">
              <span className="w-8 h-px bg-periwinkle" />
              Meet the team
              <span className="w-8 h-px bg-periwinkle" />
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text mb-4">
              Real people who understand your frustration.
            </h2>
            <p className="text-lg text-text-light max-w-2xl mx-auto">
              Flor wasn&apos;t built in a boardroom. It was built by people who&apos;ve seen what&apos;s broken in nursing hiring — and decided to fix&nbsp;it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 max-w-5xl mx-auto">
            {founders.map((person, i) => (
              <div
                key={person.name}
                className={`bg-periwinkle-50 rounded-2xl p-8 ${
                  i === 0 ? "animate-fade-in-up" : i === 1 ? "animate-fade-in-up-delay-1" : "animate-fade-in-up-delay-2"
                }`}
              >
                {/* Avatar placeholder */}
                <div className="w-16 h-16 rounded-full bg-periwinkle/20 flex items-center justify-center mb-6">
                  <span className="text-2xl font-extrabold text-periwinkle">
                    {person.name.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>
                <h3 className="font-extrabold text-xl text-text mb-1">{person.name}</h3>
                <p className="text-sm font-bold text-periwinkle mb-4">{person.role}</p>
                <p className="text-text-light leading-relaxed">{person.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FLORENCE NIGHTINGALE — statue + quote ========== */}
      <section className="bg-offwhite">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-12 sm:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-center">
              <div className="md:col-span-5 animate-fade-in-up">
                <div className="relative rounded-2xl overflow-hidden hero-shadow aspect-[3/4] max-h-[480px]">
                  <Image
                    src="/florence-statue.jpg"
                    alt="Bronze statue of Florence Nightingale"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>
              </div>
              <div className="md:col-span-7 animate-fade-in-up-delay-1">
                <svg className="w-12 h-12 text-periwinkle-200 mb-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                </svg>
                <blockquote className="text-2xl sm:text-3xl font-extrabold text-text leading-tight mb-6">
                  &ldquo;I attribute my success to this — I never gave or took any excuse.&rdquo;
                </blockquote>
                <p className="text-text-muted font-medium mb-4">Florence Nightingale</p>
                <p className="text-text-light leading-relaxed">
                  The founder of modern nursing — and the namesake of Flor. Her legacy of courage, compassion, and refusal to accept the status quo is what drives us every day.
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

        <div className="relative max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-12 sm:py-16 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
            Join us in changing the&nbsp;system.
          </h2>
          <p className="text-lg sm:text-xl text-white/60 mb-10 max-w-lg mx-auto leading-relaxed">
            Create your free Flor profile and experience a job search that actually respects your time, your skills, and&nbsp;you.
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
