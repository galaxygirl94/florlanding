"use client";

import { useState } from "react";

interface Props {
  size?: "sm" | "md";
}

export default function FlorVerifiedBadge({ size = "md" }: Props) {
  const [showTooltip, setShowTooltip] = useState(false);

  const isSmall = size === "sm";

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        className={`inline-flex items-center gap-1 rounded-full font-semibold bg-green-50 text-green-700 border border-green-200 cursor-default ${
          isSmall ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
        }`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        aria-label="Flor Verified — license verified via Nursys"
      >
        <svg
          className={isSmall ? "w-3 h-3" : "w-4 h-4"}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Flor Verified
      </button>

      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-64 text-xs text-white bg-gray-800 rounded-lg px-3 py-2 shadow-lg pointer-events-none">
          License verified in real time via Nursys, the national nurse licensing database.
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
        </div>
      )}
    </div>
  );
}
