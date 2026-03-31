import Link from "next/link";

export default function CommunityPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
      <div className="animate-fade-in-up">
        <div className="w-16 h-16 rounded-full bg-periwinkle-100 flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">🤝</span>
        </div>
        <div className="inline-block bg-periwinkle-100 text-periwinkle-dark text-xs font-semibold px-3 py-1 rounded-full mb-4">
          Coming Soon
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Flor Community</h1>
        <p className="text-text-light text-base max-w-xl mx-auto leading-relaxed mb-8">
          A private space for nurses to share experiences, ask questions, and support each other — without recruiters, employers, or algorithms deciding what you see.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-10">
          {[
            { icon: "💬", title: "Anonymous posts", desc: "Share real experiences without fear of retaliation" },
            { icon: "🔍", title: "Search by specialty", desc: "Find nurses in your specialty or care setting" },
            { icon: "🛡️", title: "No employer eyes", desc: "Employers and recruiters are never allowed in" },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl card-shadow p-5 text-left">
              <div className="text-2xl mb-2">{icon}</div>
              <h3 className="font-bold text-sm mb-1">{title}</h3>
              <p className="text-xs text-text-light">{desc}</p>
            </div>
          ))}
        </div>
        <Link href="/jobs" className="bg-periwinkle text-white font-bold px-8 py-4 rounded-full text-base hover:bg-periwinkle-dark transition-colors">
          Browse Jobs in the Meantime
        </Link>
      </div>
    </div>
  );
}
