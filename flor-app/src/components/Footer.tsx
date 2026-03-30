import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-periwinkle-100 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full bg-periwinkle flex items-center justify-center">
                <span className="text-white font-bold text-xs">F</span>
              </div>
              <span className="text-lg font-bold text-periwinkle-dark">Flor</span>
            </div>
            <p className="text-sm text-text-light">
              Direct-hire nursing jobs for community health. Real pay. Real schedules. No recruiters.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">For Nurses</h4>
            <div className="flex flex-col gap-2">
              <Link href="/jobs" className="text-sm text-text-light hover:text-periwinkle transition-colors">Browse Jobs</Link>
              <Link href="/nurse-signup" className="text-sm text-text-light hover:text-periwinkle transition-colors">Create Profile</Link>
              <Link href="/tracker" className="text-sm text-text-light hover:text-periwinkle transition-colors">Track Applications</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">For Employers</h4>
            <div className="flex flex-col gap-2">
              <Link href="/post-job" className="text-sm text-text-light hover:text-periwinkle transition-colors">Post a Job</Link>
              <Link href="/employer-signup" className="text-sm text-text-light hover:text-periwinkle transition-colors">Create Account</Link>
              <Link href="/employer-dashboard" className="text-sm text-text-light hover:text-periwinkle transition-colors">Dashboard</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">About</h4>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-text-light">Built for community health nurses</span>
              <span className="text-sm text-text-light">PACE · FQHC · School · Home Health</span>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-periwinkle-100 text-center text-sm text-text-light">
          &copy; 2026 Flor. Built for nurses, by people who care.
        </div>
      </div>
    </footer>
  );
}
