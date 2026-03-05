"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/data/types";

export default function LoginPage() {
  const [role, setRole] = useState<UserRole>("nurse");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    const success = login(email, password, role);
    if (success) {
      if (role === "employer") router.push("/employer");
      else if (role === "admin") router.push("/admin");
      else router.push("/jobs");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <div className="animate-fade-in-up">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Welcome back</h1>
          <p className="text-text-light mt-2 text-sm">Sign in to your Flor account</p>
        </div>

        {/* Role selector */}
        <div className="bg-white rounded-2xl card-shadow p-5 sm:p-8">
          <div className="mb-6">
            <label className="text-xs font-semibold text-text-light block mb-2">I am a...</label>
            <div className="grid grid-cols-2 gap-3">
              {(["nurse", "employer"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`py-3 rounded-xl text-sm font-semibold transition-colors min-h-[44px] ${
                    role === r
                      ? "bg-periwinkle text-white"
                      : "bg-periwinkle-50 text-text-light hover:bg-periwinkle-100"
                  }`}
                >
                  {r === "nurse" ? "Nurse" : "Employer"}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-text-light block mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-periwinkle-100 rounded-xl px-3 py-3 text-sm min-h-[44px]"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-light block mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-periwinkle-100 rounded-xl px-3 py-3 text-sm min-h-[44px]"
                placeholder="Your password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-amber hover:bg-amber-dark text-white font-bold py-3 rounded-full text-base transition-colors shadow-lg shadow-amber/25 min-h-[44px]"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-periwinkle-100 text-center">
            <p className="text-sm text-text-light">
              Don&apos;t have an account?{" "}
              <Link href={role === "employer" ? "/register/employer" : "/register/nurse"} className="text-periwinkle font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-4 bg-periwinkle-50 rounded-xl p-3">
            <p className="text-xs text-periwinkle-dark font-medium text-center">
              Demo accounts: nurse@flor.com, employer@flor.com, or admin@flor.com (any password)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
