"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function EmployerRegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [facilityName, setFacilityName] = useState("");
  const [facilityType, setFacilityType] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password || !facilityName || !facilityType || !city) {
      setError("Please fill in all required fields.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitted(true);
    login(email, password, "employer");
    setTimeout(() => router.push("/employer"), 1500);
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 py-16 text-center animate-fade-in-up">
        <div className="bg-white rounded-2xl card-shadow p-8">
          <div className="text-4xl mb-4">✓</div>
          <h2 className="text-xl font-bold mb-2">Account created</h2>
          <p className="text-text-light text-sm">Your employer account is being set up. Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <div className="animate-fade-in-up">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Create employer account</h1>
          <p className="text-text-light mt-2 text-sm">Post jobs and hire nurses directly — no middlemen</p>
        </div>

        <div className="bg-white rounded-2xl card-shadow p-5 sm:p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 mb-4 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-sm font-bold text-text-light uppercase tracking-wider">Contact Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-text-light block mb-1.5">First Name</label>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                  className="w-full border border-periwinkle-100 rounded-xl px-3 py-3 text-sm min-h-[44px]" placeholder="First name" />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-light block mb-1.5">Last Name</label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
                  className="w-full border border-periwinkle-100 rounded-xl px-3 py-3 text-sm min-h-[44px]" placeholder="Last name" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-text-light block mb-1.5">Work Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-periwinkle-100 rounded-xl px-3 py-3 text-sm min-h-[44px]" placeholder="you@facility.com" />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-light block mb-1.5">Phone (optional)</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-periwinkle-100 rounded-xl px-3 py-3 text-sm min-h-[44px]" placeholder="(555) 123-4567" />
            </div>

            <div className="pt-2">
              <h3 className="text-sm font-bold text-text-light uppercase tracking-wider">Facility Information</h3>
            </div>
            <div>
              <label className="text-xs font-semibold text-text-light block mb-1.5">Facility Name</label>
              <input type="text" value={facilityName} onChange={(e) => setFacilityName(e.target.value)}
                className="w-full border border-periwinkle-100 rounded-xl px-3 py-3 text-sm min-h-[44px]" placeholder="Facility name" />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-light block mb-1.5">Facility Type</label>
              <select value={facilityType} onChange={(e) => setFacilityType(e.target.value)}
                className="w-full border border-periwinkle-100 rounded-xl px-3 py-3 text-sm bg-white min-h-[44px]">
                <option value="">Select type</option>
                <option>Acute Care Hospital</option>
                <option>Community Hospital</option>
                <option>Home Health Agency</option>
                <option>Long-Term Care / SNF</option>
                <option>Behavioral Health</option>
                <option>Outpatient Clinic</option>
                <option>Rehabilitation Center</option>
                <option>Elder Care / Community Services</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-text-light block mb-1.5">City, State</label>
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)}
                className="w-full border border-periwinkle-100 rounded-xl px-3 py-3 text-sm min-h-[44px]" placeholder="e.g., Providence, RI" />
            </div>

            <div className="pt-2">
              <h3 className="text-sm font-bold text-text-light uppercase tracking-wider">Account</h3>
            </div>
            <div>
              <label className="text-xs font-semibold text-text-light block mb-1.5">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-periwinkle-100 rounded-xl px-3 py-3 text-sm min-h-[44px]" placeholder="At least 6 characters" />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-light block mb-1.5">Confirm Password</label>
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
                className="w-full border border-periwinkle-100 rounded-xl px-3 py-3 text-sm min-h-[44px]" placeholder="Confirm password" />
            </div>

            <button type="submit"
              className="w-full bg-amber hover:bg-amber-dark text-white font-bold py-3 rounded-full text-base transition-colors shadow-lg shadow-amber/25 min-h-[44px]">
              Create Employer Account
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-periwinkle-100 text-center">
            <p className="text-sm text-text-light">
              Already have an account?{" "}
              <Link href="/login" className="text-periwinkle font-semibold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
