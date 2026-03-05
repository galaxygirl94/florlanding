import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1E1E2E] text-white">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-16 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-8">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="text-xl font-extrabold tracking-tight text-white">
                fl<span className="text-periwinkle-light">o</span>r
              </span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs mb-6">
              The job marketplace built by nurses, for nurses. Named after Florence Nightingale. Changing the system for the better.
            </p>
            <div className="flex items-center gap-2 text-xs text-white/30">
              <div className="w-2 h-2 bg-success rounded-full" />
              All systems operational
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm text-white/80 uppercase tracking-wider mb-5">Your Career</h4>
            <div className="flex flex-col gap-3">
              <Link href="/jobs" className="text-sm text-white/50 hover:text-periwinkle-light transition-colors">Browse Jobs</Link>
              <Link href="/nurse-profile" className="text-sm text-white/50 hover:text-periwinkle-light transition-colors">Create Your Profile</Link>
              <Link href="/tracker" className="text-sm text-white/50 hover:text-periwinkle-light transition-colors">Track Applications</Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm text-white/80 uppercase tracking-wider mb-5">Explore</h4>
            <div className="flex flex-col gap-3">
              <Link href="/facility/facility-1" className="text-sm text-white/50 hover:text-periwinkle-light transition-colors">Facility Reviews</Link>
              <span className="text-sm text-white/50">How Flor Fit Works</span>
              <span className="text-sm text-white/50">Pay Transparency</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm text-white/80 uppercase tracking-wider mb-5">Flor</h4>
            <div className="flex flex-col gap-3">
              <span className="text-sm text-white/50">Our Mission</span>
              <span className="text-sm text-white/50">Ethics Pledge</span>
              <span className="text-sm text-white/50">Contact Us</span>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-white/30">
            &copy; 2026 Flor. All rights reserved.
          </p>
          <p className="text-sm text-white/30 italic">
            &ldquo;I attribute my success to this — I never gave or took any excuse.&rdquo; — Florence Nightingale
          </p>
        </div>
      </div>
    </footer>
  );
}
