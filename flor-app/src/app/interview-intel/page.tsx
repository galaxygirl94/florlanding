import Link from "next/link";

export default function InterviewIntelPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
      <div className="animate-fade-in-up">
        <div className="w-16 h-16 rounded-full bg-amber/10 flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">🎯</span>
        </div>
        <div className="inline-block bg-periwinkle-100 text-periwinkle-dark text-xs font-semibold px-3 py-1 rounded-full mb-4">
          Coming Soon
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Interview Intel</h1>
        <p className="text-text-light text-base max-w-xl mx-auto leading-relaxed mb-8">
          Real interview questions, honest hiring process timelines, and salary negotiation data — contributed anonymously by nurses who&apos;ve been through it.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-10">
          {[
            { icon: "❓", title: "Real questions asked", desc: "Know what to expect before you walk in" },
            { icon: "⏱️", title: "Hiring timelines", desc: "How long does it actually take to hear back?" },
            { icon: "💰", title: "Offer data", desc: "Was the offer higher or lower than listed?" },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl card-shadow p-5 text-left">
              <div className="text-2xl mb-2">{icon}</div>
              <h3 className="font-bold text-sm mb-1">{title}</h3>
              <p className="text-xs text-text-light">{desc}</p>
            </div>
          ))}
        </div>
        <Link href="/jobs" className="bg-periwinkle text-white font-bold px-8 py-4 rounded-full text-base hover:bg-periwinkle-dark transition-colors">
          Browse Jobs
        </Link>
      </div>
    </div>
  );
}
