import Link from "next/link";

export default function PayIntelPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
      <div className="animate-fade-in-up">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">💰</span>
        </div>
        <div className="inline-block bg-periwinkle-100 text-periwinkle-dark text-xs font-semibold px-3 py-1 rounded-full mb-4">
          Coming Soon
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Pay Intel</h1>
        <p className="text-text-light text-base max-w-xl mx-auto leading-relaxed mb-8">
          Crowdsourced salary data from real nurses — by specialty, setting, years of experience, and location. Know your worth before you negotiate.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-10">
          {[
            { icon: "📊", title: "Salary by specialty", desc: "See median and range for your specific role" },
            { icon: "📍", title: "Location-adjusted", desc: "RI, MA, CT pay comparisons side by side" },
            { icon: "📈", title: "Years-of-experience curve", desc: "How pay grows from new grad to 10+ years" },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl card-shadow p-5 text-left">
              <div className="text-2xl mb-2">{icon}</div>
              <h3 className="font-bold text-sm mb-1">{title}</h3>
              <p className="text-xs text-text-light">{desc}</p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl card-shadow p-6 max-w-lg mx-auto mb-8">
          <h3 className="font-bold text-sm mb-4">Preview: Rhode Island RN Pay by Specialty</h3>
          <div className="space-y-3">
            {[
              { specialty: "ICU/Critical Care", pay: "$38–$56/hr" },
              { specialty: "Emergency", pay: "$36–$52/hr" },
              { specialty: "Med-Surg", pay: "$32–$46/hr" },
              { specialty: "Pediatrics", pay: "$34–$50/hr" },
              { specialty: "Psychiatry", pay: "$30–$44/hr" },
            ].map(({ specialty, pay }) => (
              <div key={specialty} className="flex items-center justify-between text-sm">
                <span className="text-text-light">{specialty}</span>
                <span className="font-semibold text-periwinkle">{pay}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-text-light mt-4 italic">Based on publicly listed positions. Full data coming soon.</p>
        </div>
        <Link href="/jobs" className="bg-periwinkle text-white font-bold px-8 py-4 rounded-full text-base hover:bg-periwinkle-dark transition-colors">
          Browse Jobs with Transparent Pay
        </Link>
      </div>
    </div>
  );
}
