import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1E1E2E] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-8">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="text-xl font-extrabold tracking-tight text-white">
                fl<span className="text-periwinkle-light">o</span>r
              </span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs mb-6">
              Changing the system for the better. Named after Florence Nightingale. Built by nurses, for nurses.
            </p>
            <div className="flex items-center gap-2 text-xs text-white/30">
              <div className="w-2 h-2 bg-success rounded-full" />
              All systems operational
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm text-white/80 uppercase tracking-wider mb-5">For Nurses</h4>
            <div className="flex flex-col gap-3">
              <Link href="/jobs" className="text-sm text-white/50 hover:text-periwinkle-light transition-colors">Browse Jobs</Link>
              <Link href="/nurse-profile" className="text-sm text-white/50 hover:text-periwinkle-light transition-colors">Create Profile</Link>
              <Link href="/tracker" className="text-sm text-white/50 hover:text-periwinkle-light transition-colors">Track Applications</Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm text-white/80 uppercase tracking-wider mb-5">For Facilities</h4>
            <div className="flex flex-col gap-3">
              <span className="text-sm text-white/30">Post a Job (Coming Soon)</span>
              <Link href="/facility/facility-1" className="text-sm text-white/50 hover:text-periwinkle-light transition-colors">Facility Profiles</Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm text-white/80 uppercase tracking-wider mb-5">Company</h4>
            <div className="flex flex-col gap-3">
              <span className="text-sm text-white/50">Our Mission</span>
              <span className="text-sm text-white/50">Ethics Pledge</span>
              <span className="text-sm text-white/50">Contact</span>
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
