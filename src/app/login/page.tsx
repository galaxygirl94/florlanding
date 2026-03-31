"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"nurse" | "employer">("nurse");
  const [isSignup, setIsSignup] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const { login, signup } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (isSignup) {
      if (!firstName || !lastName) {
        setError("Please enter your full name.");
        return;
      }
      const success = signup(email, password, firstName, lastName);
      if (success) {
        localStorage.setItem("flor_user_type", mode);
        router.push(mode === "employer" ? "/employer" : "/onboarding/resume");
      } else {
        setError("An account with this email already exists.");
      }
    } else {
      const success = login(email, password);
      if (success) {
        localStorage.setItem("flor_user_type", mode);
        router.push(mode === "employer" ? "/employer" : "/jobs/matched");
      } else {
        setError("Invalid email or password. Don\u2019t have an account? Sign up below.");
      }
    }
  };

  // Demo quick-login for employer
  const demoEmployerLogin = () => {
    signup("demo@bayside.com", "demo123", "Demo", "Admin");
    login("demo@bayside.com", "demo123");
    localStorage.setItem("flor_user_type", "employer");
    router.push("/employer");
  };

  const demoNurseLogin = () => {
    signup("sarah.chen@email.com", "demo123", "Sarah", "Chen");
    login("sarah.chen@email.com", "demo123");
    localStorage.setItem("flor_user_type", "nurse");
    // Load Sarah's profile
    const { MOCK_RESUME_PROFILES } = require("@/data/demo-nurses");
    localStorage.setItem("flor_nurse_profile", JSON.stringify(MOCK_RESUME_PROFILES[0]));
    router.push("/jobs/matched");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#F8F8FA]">
      <div className="w-full max-w-md mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl border border-periwinkle-100/40 section-shadow p-8 sm:p-10">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text mb-2">
              {isSignup ? "Create Your Account" : "Welcome Back"}
            </h1>
            <p className="text-sm text-text-muted">
              {isSignup ? "Join Flor today" : "Log in to your Flor account"}
            </p>
          </div>

          {/* Nurse / Employer toggle */}
          <div className="flex bg-offwhite rounded-full p-1 mb-6">
            <button
              onClick={() => setMode("nurse")}
              className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${
                mode === "nurse" ? "bg-periwinkle text-white shadow-sm" : "text-text-muted hover:text-text"
              }`}
            >
              I&apos;m a Nurse
            </button>
            <button
              onClick={() => setMode("employer")}
              className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${
                mode === "employer" ? "bg-periwinkle text-white shadow-sm" : "text-text-muted hover:text-text"
              }`}
            >
              I&apos;m an Employer
            </button>
          </div>

          {error && (
            <div className="bg-danger-light border border-danger/20 rounded-xl p-4 mb-6 text-sm text-danger font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-1.5">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full border border-periwinkle-100/60 rounded-xl px-4 py-3 text-sm min-h-[44px] hover:border-periwinkle/40 transition-colors"
                    placeholder="Jane"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-1.5">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full border border-periwinkle-100/60 rounded-xl px-4 py-3 text-sm min-h-[44px] hover:border-periwinkle/40 transition-colors"
                    placeholder="Doe"
                  />
                </div>
              </div>
            )}
            <div>
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-periwinkle-100/60 rounded-xl px-4 py-3 text-sm min-h-[44px] hover:border-periwinkle/40 transition-colors"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-periwinkle-100/60 rounded-xl px-4 py-3 text-sm min-h-[44px] hover:border-periwinkle/40 transition-colors"
                placeholder="Your password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-periwinkle hover:bg-periwinkle-dark text-white font-bold py-3.5 rounded-full text-base transition-all duration-200 shadow-lg shadow-periwinkle/20 hover:shadow-xl hover:shadow-periwinkle/30 hover:-translate-y-0.5 min-h-[48px]"
            >
              {isSignup ? "Create Account" : "Log In"}
            </button>
          </form>

          <div className="mt-5 text-center">
            <button
              onClick={() => { setIsSignup(!isSignup); setError(""); }}
              className="text-sm text-text-muted"
            >
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              <span className="text-periwinkle hover:text-periwinkle-dark font-bold transition-colors">
                {isSignup ? "Log in" : "Sign up"}
              </span>
            </button>
          </div>

          {/* Demo login buttons */}
          <div className="mt-6 pt-6 border-t border-periwinkle-100/40">
            <p className="text-xs text-text-muted text-center mb-3">Quick demo access</p>
            <div className="flex gap-2">
              <button
                onClick={demoNurseLogin}
                className="flex-1 border border-periwinkle-100/60 hover:border-periwinkle/40 text-text rounded-xl py-2.5 text-xs font-bold transition-colors hover:bg-periwinkle-50"
              >
                Demo as Nurse
              </button>
              <button
                onClick={demoEmployerLogin}
                className="flex-1 border border-periwinkle-100/60 hover:border-periwinkle/40 text-text rounded-xl py-2.5 text-xs font-bold transition-colors hover:bg-periwinkle-50"
              >
                Demo as Employer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
