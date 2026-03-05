"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    const success = login(email, password);
    if (success) {
      router.push("/nurse-profile");
    } else {
      setError("Invalid email or password. Don\u2019t have an account? Create your profile first.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#F8F8FA]">
      <div className="w-full max-w-md mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl border border-periwinkle-100/40 section-shadow p-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text mb-2">Welcome Back</h1>
            <p className="text-sm text-text-muted">Log in to your Flor account</p>
          </div>

          {error && (
            <div className="bg-danger-light border border-danger/20 rounded-xl p-4 mb-6 text-sm text-danger font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-periwinkle-100/60 rounded-xl px-4 py-3 text-sm min-h-[44px] hover:border-periwinkle/40 transition-colors"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Password</label>
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
              Log In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-text-muted">
              Don&apos;t have an account?{" "}
              <Link href="/nurse-profile" className="text-periwinkle hover:text-periwinkle-dark font-bold transition-colors">
                Create your profile
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
