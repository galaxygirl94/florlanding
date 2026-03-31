import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#0F1117" }} className="mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-periwinkle flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-xl font-bold text-white">Flor</span>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "#9CA3AF" }}>
              Transparency-first nursing jobs. See the real pay, real schedule, real workplace.
            </p>
            <blockquote className="text-xs italic border-l-2 border-periwinkle pl-3" style={{ color: "#6B7280" }}>
              &ldquo;I attribute my success to this — I never gave or took any excuse.&rdquo;
              <footer className="mt-1 not-italic" style={{ color: "#6B7280" }}>— Florence Nightingale</footer>
            </blockquote>
          </div>

          {/* For Nurses */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-white">For Nurses</h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/jobs" className="text-sm hover:text-periwinkle transition-colors" style={{ color: "#9CA3AF" }}>Browse Jobs</Link>
              <Link href="/nurse-profile" className="text-sm hover:text-periwinkle transition-colors" style={{ color: "#9CA3AF" }}>Create Profile</Link>
              <Link href="/tracker" className="text-sm hover:text-periwinkle transition-colors" style={{ color: "#9CA3AF" }}>Track Applications</Link>
              <Link href="/community" className="text-sm hover:text-periwinkle transition-colors" style={{ color: "#9CA3AF" }}>Community</Link>
              <Link href="/interview-intel" className="text-sm hover:text-periwinkle transition-colors" style={{ color: "#9CA3AF" }}>Interview Intel</Link>
              <Link href="/pay-intel" className="text-sm hover:text-periwinkle transition-colors" style={{ color: "#9CA3AF" }}>Pay Intel</Link>
            </div>
          </div>

          {/* For Facilities */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-white">For Facilities</h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/post-job" className="text-sm hover:text-periwinkle transition-colors" style={{ color: "#9CA3AF" }}>Post a Job</Link>
              <Link href="/employer-signup" className="text-sm hover:text-periwinkle transition-colors" style={{ color: "#9CA3AF" }}>Employer Sign Up</Link>
              <Link href="/employer-dashboard" className="text-sm hover:text-periwinkle transition-colors" style={{ color: "#9CA3AF" }}>Employer Dashboard</Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-white">Company</h4>
            <div className="flex flex-col gap-2.5">
              <span className="text-sm" style={{ color: "#9CA3AF" }}>Our Mission</span>
              <span className="text-sm" style={{ color: "#9CA3AF" }}>Contact Us</span>
              <span className="text-sm" style={{ color: "#9CA3AF" }}>Privacy Policy</span>
              <span className="text-sm" style={{ color: "#9CA3AF" }}>Terms of Service</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: "#2A2D3A" }}>
          <p className="text-sm" style={{ color: "#6B7280" }}>
            &copy; 2026 Flor. Built for nurses, by people who care.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span className="text-xs" style={{ color: "#6B7280" }}>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
