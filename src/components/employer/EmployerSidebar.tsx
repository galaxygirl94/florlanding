"use client";

import { useState } from "react";

export type Screen =
  | "dashboard"
  | "post-job"
  | "candidates"
  | "postings"
  | "messages"
  | "facility";

const NAV_ITEMS: { id: Screen; label: string; icon: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "post-job", label: "Post a Job", icon: "📝" },
  { id: "candidates", label: "Candidate Queue", icon: "👥" },
  { id: "postings", label: "Active Postings", icon: "📋" },
  { id: "messages", label: "Messages", icon: "💬" },
  { id: "facility", label: "Facility Profile", icon: "🏥" },
];

export default function EmployerSidebar({
  active,
  onChange,
}: {
  active: Screen;
  onChange: (s: Screen) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="lg:hidden fixed top-[72px] left-4 z-50 bg-white border border-[#E4E4EC] rounded-xl p-2.5 shadow-md"
        style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M3 5h14M3 10h14M3 15h14" stroke="#1E1E2E" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 z-40"
          onClick={() => setCollapsed(true)}
          style={{ top: 64 }}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-[64px] left-0 z-40
          h-[calc(100vh-64px)] bg-[#1E1E2E] transition-transform duration-300
          ${collapsed ? "-translate-x-full lg:translate-x-0" : "translate-x-0"}
          w-64 lg:w-60 flex-shrink-0
        `}
        style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
      >
        <div className="p-5 border-b border-white/10">
          <div className="text-white font-extrabold text-lg">Flor</div>
          <div className="text-[#C5C7EA] text-xs mt-0.5">Employer Portal</div>
        </div>

        <nav className="p-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onChange(item.id);
                setCollapsed(true);
              }}
              className={`
                w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                ${
                  active === item.id
                    ? "bg-[#8B8FD4] text-white shadow-md"
                    : "text-[#C5C7EA] hover:bg-white/8 hover:text-white"
                }
              `}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-[#8B8FD4] flex items-center justify-center text-white text-xs font-bold">
              BM
            </div>
            <div className="min-w-0">
              <div className="text-white text-xs font-bold truncate">Bayside Medical</div>
              <div className="text-[#C5C7EA] text-[10px]">Admin</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
