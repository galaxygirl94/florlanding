"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function NurseRegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    login(email, password, "nurse");
    router.push("/nurse-profile");
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <div className="animate-fade-in-up">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Create your nurse account</h1>
          <p className="text-text-light mt-2 text-sm">Join Flor and find jobs that actually fit your life</p>
        </div>

        <div className="bg-white rounded-2xl card-shadow p-5 sm:p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 mb-4 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <label className="text-xs font-semibold text-text-light block mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-periwinkle-100 rounded-xl px-3 py-3 text-sm min-h-[44px]" placeholder="you@email.com" />
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
              Create Account
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
