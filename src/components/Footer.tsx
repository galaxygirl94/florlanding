import Link from "next/link";
import FlorLogo from "@/components/FlorLogo";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-periwinkle-100/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <FlorLogo size="sm" showTagline />
            <p className="text-sm text-text-light mt-4 leading-relaxed max-w-xs">
              Changing the system for the better. Real pay, real schedules, direct applications — the way nursing job search should be.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-sm text-text mb-4">For Nurses</h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/jobs" className="text-sm text-text-light hover:text-periwinkle transition-colors">Browse Jobs</Link>
              <Link href="/nurse-profile" className="text-sm text-text-light hover:text-periwinkle transition-colors">Create Profile</Link>
              <Link href="/tracker" className="text-sm text-text-light hover:text-periwinkle transition-colors">Track Applications</Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm text-text mb-4">For Facilities</h4>
            <div className="flex flex-col gap-2.5">
              <span className="text-sm text-text-muted">Post a Job (Coming Soon)</span>
              <Link href="/facility/facility-1" className="text-sm text-text-light hover:text-periwinkle transition-colors">Facility Profiles</Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm text-text mb-4">Flor</h4>
            <div className="flex flex-col gap-2.5">
              <span className="text-sm text-text-light">Our Mission</span>
              <span className="text-sm text-text-light">Contact Us</span>
              <span className="text-sm text-text-muted italic">Named after Florence Nightingale</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-periwinkle-100/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-text-muted">
            &copy; 2026 Flor. All rights reserved.
          </p>
          <p className="text-sm text-text-muted">
            Built by nurses, for nurses.
          </p>
        </div>
      </div>
    </footer>
  );
}
