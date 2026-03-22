"use client";

import { useState, useEffect, useCallback } from "react";

interface ScrapeLogEntry {
  id: string;
  source_name: string;
  source_url: string;
  jobs_found: number;
  jobs_new: number;
  jobs_updated: number;
  status: string;
  error_message: string | null;
  ran_at: string;
}

interface JobRow {
  id: string;
  title: string;
  facility_name: string;
  specialty: string | null;
  pay_min: number | null;
  pay_max: number | null;
  pay_source: string | null;
  source_type: string;
  is_active: boolean;
  is_verified: boolean;
  scraped_at: string;
}

interface PayStats {
  total: number;
  facility: number;
  community: number;
  estimated: number;
  none: number;
}

export default function AdminScrapePage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [logs, setLogs] = useState<ScrapeLogEntry[]>([]);
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [stats, setStats] = useState<PayStats>({ total: 0, facility: 0, community: 0, estimated: 0, none: 0 });
  const [loading, setLoading] = useState(false);
  const [triggerStatus, setTriggerStatus] = useState("");

  // Inline pay editor
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [editPayMin, setEditPayMin] = useState("");
  const [editPayMax, setEditPayMax] = useState("");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  const fetchData = useCallback(async () => {
    if (!supabaseUrl || !supabaseAnonKey) return;
    setLoading(true);

    try {
      // Dynamic import to avoid bundling supabase in all pages
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      // Fetch scrape logs
      const { data: logData } = await supabase
        .from("scrape_log")
        .select("*")
        .order("ran_at", { ascending: false })
        .limit(50);
      setLogs(logData || []);

      // Fetch jobs
      const { data: jobData } = await supabase
        .from("jobs")
        .select("id, title, facility_name, specialty, pay_min, pay_max, pay_source, source_type, is_active, is_verified, scraped_at")
        .order("scraped_at", { ascending: false })
        .limit(200);
      setJobs(jobData || []);

      // Compute pay stats
      const allJobs = jobData || [];
      setStats({
        total: allJobs.length,
        facility: allJobs.filter((j: JobRow) => j.pay_source === "facility").length,
        community: allJobs.filter((j: JobRow) => j.pay_source === "community").length,
        estimated: allJobs.filter((j: JobRow) => ["bls_estimate", "glassdoor_estimate"].includes(j.pay_source || "")).length,
        none: allJobs.filter((j: JobRow) => j.pay_min == null).length,
      });
    } catch (err) {
      console.error("Failed to fetch admin data:", err);
    } finally {
      setLoading(false);
    }
  }, [supabaseUrl, supabaseAnonKey]);

  useEffect(() => {
    if (authenticated) fetchData();
  }, [authenticated, fetchData]);

  function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    // Client-side check — real auth happens server-side on API calls
    if (password.length >= 4) {
      setAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Invalid password");
    }
  }

  async function handleRunScraper() {
    setTriggerStatus("Triggering...");
    try {
      const res = await fetch("/api/admin/run-scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok) {
        setTriggerStatus("Scraper workflow triggered successfully");
      } else {
        setTriggerStatus(`Error: ${data.error}`);
      }
    } catch {
      setTriggerStatus("Failed to trigger scraper");
    }
  }

  async function handleToggleActive(jobId: string, currentActive: boolean) {
    if (!supabaseUrl || !supabaseAnonKey) return;
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    await supabase.from("jobs").update({ is_active: !currentActive }).eq("id", jobId);
    fetchData();
  }

  async function handleSetPay(jobId: string) {
    if (!supabaseUrl || !supabaseAnonKey) return;
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const min = Number(editPayMin);
    const max = Number(editPayMax);
    if (isNaN(min) || isNaN(max) || min <= 0 || max <= 0) return;

    await supabase.from("jobs").update({
      pay_min: min,
      pay_max: max,
      pay_source: "manual_research",
      pay_confidence: "high",
      updated_at: new Date().toISOString(),
    }).eq("id", jobId);

    setEditingJobId(null);
    setEditPayMin("");
    setEditPayMax("");
    fetchData();
  }

  if (!authenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <h1 className="text-2xl font-bold mb-6">Admin — Scrape Dashboard</h1>
        <form onSubmit={handleAuth} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm"
          />
          <button
            type="submit"
            className="w-full bg-periwinkle text-white font-semibold py-3 rounded-xl hover:bg-periwinkle-dark transition-colors"
          >
            Sign In
          </button>
          {authError && <p className="text-red-500 text-sm">{authError}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Scrape Dashboard</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRunScraper}
            className="bg-amber hover:bg-amber-dark text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            Run Scraper Now
          </button>
          <button
            onClick={fetchData}
            disabled={loading}
            className="bg-gray-100 hover:bg-gray-200 text-text font-medium px-4 py-2.5 rounded-xl text-sm transition-colors"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </div>

      {triggerStatus && (
        <div className="bg-periwinkle-50 rounded-xl p-3 text-sm mb-6">{triggerStatus}</div>
      )}

      {/* Pay Coverage Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
        {[
          { label: "Total Jobs", value: stats.total, color: "text-text" },
          { label: "Facility Pay", value: stats.facility, color: "text-green-600" },
          { label: "Community", value: stats.community, color: "text-blue-600" },
          { label: "Estimated", value: stats.estimated, color: "text-amber-600" },
          { label: "No Pay Data", value: stats.none, color: "text-red-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl card-shadow p-4 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-text-light mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Last Scrape Summary */}
      {logs.length > 0 && (
        <div className="bg-white rounded-xl card-shadow p-5 mb-8">
          <h2 className="text-lg font-bold mb-3">Last Scrape</h2>
          <p className="text-sm text-text-light">
            {new Date(logs[0].ran_at).toLocaleString()} — {logs[0].source_name} — {logs[0].status}
            {logs[0].jobs_found > 0 && ` — ${logs[0].jobs_found} found, ${logs[0].jobs_new} new`}
          </p>
        </div>
      )}

      {/* Scrape Log Table */}
      <div className="bg-white rounded-xl card-shadow p-5 mb-8 overflow-x-auto">
        <h2 className="text-lg font-bold mb-4">Recent Scrape Log</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-text-light border-b">
              <th className="pb-2 pr-4">Source</th>
              <th className="pb-2 pr-4">Status</th>
              <th className="pb-2 pr-4">Found</th>
              <th className="pb-2 pr-4">New</th>
              <th className="pb-2 pr-4">Updated</th>
              <th className="pb-2 pr-4">Time</th>
              <th className="pb-2">Error</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-gray-50">
                <td className="py-2 pr-4 font-medium">{log.source_name}</td>
                <td className="py-2 pr-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    log.status === "success" ? "bg-green-50 text-green-700" :
                    log.status === "partial" ? "bg-amber-50 text-amber-700" :
                    "bg-red-50 text-red-700"
                  }`}>{log.status}</span>
                </td>
                <td className="py-2 pr-4">{log.jobs_found}</td>
                <td className="py-2 pr-4">{log.jobs_new}</td>
                <td className="py-2 pr-4">{log.jobs_updated}</td>
                <td className="py-2 pr-4 text-text-light">{new Date(log.ran_at).toLocaleString()}</td>
                <td className="py-2 text-red-500 text-xs truncate max-w-[200px]">{log.error_message}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr><td colSpan={7} className="py-6 text-center text-text-light">No scrape logs yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-xl card-shadow p-5 overflow-x-auto">
        <h2 className="text-lg font-bold mb-4">Jobs ({jobs.length})</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-text-light border-b">
              <th className="pb-2 pr-3">Title</th>
              <th className="pb-2 pr-3">Facility</th>
              <th className="pb-2 pr-3">Specialty</th>
              <th className="pb-2 pr-3">Pay</th>
              <th className="pb-2 pr-3">Pay Source</th>
              <th className="pb-2 pr-3">Source</th>
              <th className="pb-2 pr-3">Active</th>
              <th className="pb-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-b border-gray-50">
                <td className="py-2 pr-3 font-medium max-w-[200px] truncate">{job.title}</td>
                <td className="py-2 pr-3 text-text-light max-w-[150px] truncate">{job.facility_name}</td>
                <td className="py-2 pr-3 text-text-light">{job.specialty || "—"}</td>
                <td className="py-2 pr-3">
                  {editingJobId === job.id ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={editPayMin}
                        onChange={(e) => setEditPayMin(e.target.value)}
                        placeholder="Min"
                        className="w-16 border rounded px-1 py-0.5 text-xs"
                      />
                      <span>-</span>
                      <input
                        type="number"
                        value={editPayMax}
                        onChange={(e) => setEditPayMax(e.target.value)}
                        placeholder="Max"
                        className="w-16 border rounded px-1 py-0.5 text-xs"
                      />
                      <button onClick={() => handleSetPay(job.id)} className="text-xs text-periwinkle font-medium">Save</button>
                      <button onClick={() => setEditingJobId(null)} className="text-xs text-text-light">Cancel</button>
                    </div>
                  ) : (
                    <span>{job.pay_min && job.pay_max ? `$${job.pay_min}-$${job.pay_max}` : "—"}</span>
                  )}
                </td>
                <td className="py-2 pr-3">
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    job.pay_source === "facility" ? "bg-green-50 text-green-700" :
                    job.pay_source === "community" ? "bg-blue-50 text-blue-700" :
                    job.pay_source ? "bg-gray-100 text-text-light" : "text-text-light"
                  }`}>{job.pay_source || "none"}</span>
                </td>
                <td className="py-2 pr-3">
                  <span className={`text-xs ${job.source_type === "direct" ? "text-green-600" : "text-text-light"}`}>
                    {job.source_type}
                  </span>
                </td>
                <td className="py-2 pr-3">
                  <button
                    onClick={() => handleToggleActive(job.id, job.is_active)}
                    className={`w-8 h-5 rounded-full relative transition-colors ${job.is_active ? "bg-green-400" : "bg-gray-300"}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${job.is_active ? "left-3.5" : "left-0.5"}`} />
                  </button>
                </td>
                <td className="py-2">
                  <button
                    onClick={() => {
                      setEditingJobId(job.id);
                      setEditPayMin(job.pay_min?.toString() || "");
                      setEditPayMax(job.pay_max?.toString() || "");
                    }}
                    className="text-xs text-periwinkle hover:underline"
                  >
                    Set Pay
                  </button>
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr><td colSpan={8} className="py-6 text-center text-text-light">No jobs in database</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
