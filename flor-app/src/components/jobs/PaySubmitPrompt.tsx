"use client";

import { useState } from "react";

interface PaySubmitPromptProps {
  facilityName: string;
  specialty?: string;
}

export default function PaySubmitPrompt({ facilityName, specialty }: PaySubmitPromptProps) {
  const [payValue, setPayValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const pay = Number(payValue);
    if (isNaN(pay) || pay < 20 || pay > 200) {
      setError("Please enter an hourly rate between $20 and $200");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/pay/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          facility_name: facilityName,
          specialty: specialty || "General RN",
          pay_hourly: pay,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <p className="text-xs text-text-light mt-2 italic">
        Thank you — your data helps nurses get paid fairly.
      </p>
    );
  }

  return (
    <div className="mt-2">
      <p className="text-xs text-text-light mb-1.5">
        Know what this role pays? Help a fellow nurse.
      </p>
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-text-light">$</span>
          <input
            type="number"
            value={payValue}
            onChange={(e) => setPayValue(e.target.value)}
            placeholder="hr rate"
            className="w-24 border border-gray-200 rounded-lg pl-5 pr-2 py-1.5 text-xs"
            min={20}
            max={200}
            step={0.5}
          />
        </div>
        <button
          type="submit"
          disabled={submitting || !payValue}
          className="text-xs font-medium text-periwinkle hover:text-periwinkle-dark disabled:opacity-40 transition-colors"
        >
          {submitting ? "..." : "Submit"}
        </button>
      </form>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
