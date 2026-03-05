"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { seedInterviews } from "@/data/seed-interviews";
import { seedApplications } from "@/data/seed-applications";
import { seedJobs } from "@/data/seed-jobs";
import { InterviewType, InterviewStatus, InterviewRecommendation } from "@/data/types";

const TYPE_LABELS: Record<InterviewType, string> = { phone: "Phone", video: "Video", in_person: "In-Person" };
const STATUS_COLORS: Record<InterviewStatus, string> = {
  requested: "bg-amber/20 text-amber-dark",
  confirmed: "bg-green-100 text-green-700",
  declined: "bg-red-100 text-red-700",
  completed: "bg-periwinkle-100 text-periwinkle-dark",
  cancelled: "bg-gray-100 text-gray-600",
  rescheduled: "bg-blue-100 text-blue-700",
};

export default function InterviewsPage() {
  const { user } = useAuth();
  const myJobs = seedJobs.filter((j) => j.facilityId === user?.facilityId);
  const myJobIds = myJobs.map((j) => j.id);
  const myInterviews = seedInterviews.filter((i) => myJobIds.includes(i.jobId));

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState<string | null>(null);
  const [tabFilter, setTabFilter] = useState<"upcoming" | "completed" | "all">("upcoming");

  // Schedule form state
  const [schedNurse, setSchedNurse] = useState("");
  const [schedJob, setSchedJob] = useState("");
  const [schedType, setSchedType] = useState<InterviewType>("video");
  const [schedDate, setSchedDate] = useState("");
  const [schedTime, setSchedTime] = useState("");
  const [schedDuration, setSchedDuration] = useState("30");
  const [schedInterviewers, setSchedInterviewers] = useState("");
  const [schedNotes, setSchedNotes] = useState("");
  const [schedSent, setSchedSent] = useState(false);

  // Feedback form state
  const [fbRating, setFbRating] = useState(0);
  const [fbNotes, setFbNotes] = useState("");
  const [fbRec, setFbRec] = useState<InterviewRecommendation>("move_forward");
  const [fbSaved, setFbSaved] = useState(false);

  const myApplicants = seedApplications.filter((a) => myJobIds.includes(a.jobId));

  const filteredInterviews = tabFilter === "all"
    ? myInterviews
    : tabFilter === "upcoming"
    ? myInterviews.filter((i) => i.status === "confirmed" || i.status === "requested")
    : myInterviews.filter((i) => i.status === "completed");

  const handleSchedule = () => {
    if (!schedNurse || !schedJob || !schedDate || !schedTime) return;
    setSchedSent(true);
    setTimeout(() => {
      setShowScheduleModal(false);
      setSchedSent(false);
      setSchedNurse(""); setSchedJob(""); setSchedDate(""); setSchedTime(""); setSchedNotes("");
    }, 1500);
  };

  const handleFeedback = () => {
    if (fbRating === 0) return;
    setFbSaved(true);
    setTimeout(() => {
      setShowFeedbackModal(null);
      setFbSaved(false);
      setFbRating(0); setFbNotes(""); setFbRec("move_forward");
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="animate-fade-in-up">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Interviews</h1>
            <p className="text-text-light mt-1 text-sm">Schedule, manage, and review candidate interviews</p>
          </div>
          <button
            onClick={() => setShowScheduleModal(true)}
            className="bg-amber hover:bg-amber-dark text-white font-bold px-6 py-3 rounded-full text-sm transition-colors shadow-lg shadow-amber/25 min-h-[44px]"
          >
            + Schedule Interview
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["upcoming", "completed", "all"] as const).map((t) => (
            <button key={t} onClick={() => setTabFilter(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors min-h-[44px] ${
                tabFilter === t ? "bg-periwinkle text-white" : "bg-white border border-periwinkle-100 text-text-light hover:border-periwinkle"
              }`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Interview cards */}
        <div className="space-y-4">
          {filteredInterviews.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl card-shadow">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-lg font-bold mb-2">No interviews yet</h3>
              <p className="text-text-light text-sm">Schedule an interview from your pipeline or use the button above.</p>
            </div>
          ) : (
            filteredInterviews.map((interview) => (
              <div key={interview.id} className="bg-white rounded-2xl card-shadow p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-bold">{interview.nurseName}</h3>
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${STATUS_COLORS[interview.status]}`}>
                        {interview.status}
                      </span>
                    </div>
                    <p className="text-sm text-text-light mt-1">{interview.jobTitle}</p>
                  </div>
                  <div className="bg-periwinkle-50 rounded-xl px-4 py-2 text-center flex-shrink-0 self-start">
                    <div className="text-sm font-bold text-periwinkle">{interview.scheduledDate}</div>
                    <div className="text-xs text-periwinkle-dark">{interview.scheduledTime}</div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <div className="bg-periwinkle-50/50 rounded-lg p-3">
                    <span className="text-xs text-text-light block">Type</span>
                    <span className="font-medium">{TYPE_LABELS[interview.type]}</span>
                  </div>
                  <div className="bg-periwinkle-50/50 rounded-lg p-3">
                    <span className="text-xs text-text-light block">Duration</span>
                    <span className="font-medium">{interview.duration} min</span>
                  </div>
                  <div className="bg-periwinkle-50/50 rounded-lg p-3">
                    <span className="text-xs text-text-light block">Interviewer(s)</span>
                    <span className="font-medium truncate block">{interview.interviewers[0]?.split(",")[0]}</span>
                  </div>
                </div>

                {interview.notes && (
                  <div className="mt-3 bg-periwinkle-50/30 rounded-lg p-3">
                    <p className="text-xs text-text-light mb-1">Notes</p>
                    <p className="text-sm">{interview.notes}</p>
                  </div>
                )}

                {/* Feedback display */}
                {interview.feedback && (
                  <div className="mt-3 bg-green-50 rounded-xl p-4">
                    <h4 className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-2">Interview Feedback</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <svg key={s} className={`w-4 h-4 ${s <= interview.feedback!.rating ? "text-amber" : "text-gray-200"}`}
                            fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        interview.feedback.recommendation === "move_forward" ? "bg-green-100 text-green-700" :
                        interview.feedback.recommendation === "hold" ? "bg-amber/20 text-amber-dark" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {interview.feedback.recommendation.replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className="text-sm">{interview.feedback.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-4 pt-3 border-t border-periwinkle-100 flex flex-wrap gap-2">
                  {interview.status === "completed" && !interview.feedback && (
                    <button onClick={() => setShowFeedbackModal(interview.id)}
                      className="bg-periwinkle hover:bg-periwinkle-dark text-white px-4 py-2 rounded-full text-sm font-medium transition-colors min-h-[44px]">
                      Add Feedback
                    </button>
                  )}
                  {(interview.status === "confirmed" || interview.status === "requested") && (
                    <>
                      <button className="bg-periwinkle-50 text-periwinkle-dark px-4 py-2 rounded-full text-sm font-medium hover:bg-periwinkle-100 transition-colors min-h-[44px]">
                        Reschedule
                      </button>
                      <button className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-red-100 transition-colors min-h-[44px]">
                        Cancel
                      </button>
                    </>
                  )}
                  {interview.meetingLink && interview.status === "confirmed" && (
                    <button className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-green-100 transition-colors min-h-[44px]">
                      Join Meeting
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Schedule Interview Modal */}
        {showScheduleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowScheduleModal(false)}>
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative bg-white rounded-2xl card-shadow max-w-lg w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
              {schedSent ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">✓</div>
                  <h2 className="text-xl font-bold mb-2">Interview Request Sent</h2>
                  <p className="text-text-light text-sm">The nurse will receive a notification to confirm.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Schedule Interview</h2>
                    <button onClick={() => setShowScheduleModal(false)} className="p-2 hover:bg-periwinkle-50 rounded-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-text-light block mb-1.5">Candidate *</label>
                      <select value={schedNurse} onChange={(e) => setSchedNurse(e.target.value)}
                        className="w-full border border-periwinkle-100 rounded-xl px-3 py-3 text-sm bg-white min-h-[44px]">
                        <option value="">Select candidate</option>
                        {myApplicants.map((a) => (
                          <option key={a.id} value={a.id}>{a.nurseName} — {a.jobTitle}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-text-light block mb-1.5">Job *</label>
                      <select value={schedJob} onChange={(e) => setSchedJob(e.target.value)}
                        className="w-full border border-periwinkle-100 rounded-xl px-3 py-3 text-sm bg-white min-h-[44px]">
                        <option value="">Select job</option>
                        {myJobs.map((j) => (
                          <option key={j.id} value={j.id}>{j.title}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-text-light block mb-2">Interview Type</label>
                      <div className="flex gap-2">
                        {(["phone", "video", "in_person"] as const).map((t) => (
                          <button key={t} onClick={() => setSchedType(t)}
                            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors min-h-[44px] ${
                              schedType === t ? "bg-periwinkle text-white" : "bg-periwinkle-50 text-text-light hover:bg-periwinkle-100"
                            }`}>
                            {TYPE_LABELS[t]}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-text-light block mb-1.5">Date *</label>
                        <input type="date" value={schedDate} onChange={(e) => setSchedDate(e.target.value)}
                          className="w-full border border-periwinkle-100 rounded-xl px-3 py-3 text-sm min-h-[44px]" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-text-light block mb-1.5">Time *</label>
                        <input type="time" value={schedTime} onChange={(e) => setSchedTime(e.target.value)}
                          className="w-full border border-periwinkle-100 rounded-xl px-3 py-3 text-sm min-h-[44px]" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-text-light block mb-1.5">Duration</label>
                      <select value={schedDuration} onChange={(e) => setSchedDuration(e.target.value)}
                        className="w-full border border-periwinkle-100 rounded-xl px-3 py-3 text-sm bg-white min-h-[44px]">
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="45">45 minutes</option>
                        <option value="60">60 minutes</option>
                        <option value="90">90 minutes</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-text-light block mb-1.5">Interviewer(s)</label>
                      <input type="text" value={schedInterviewers} onChange={(e) => setSchedInterviewers(e.target.value)}
                        className="w-full border border-periwinkle-100 rounded-xl px-3 py-3 text-sm min-h-[44px]"
                        placeholder="Names and titles, separated by commas" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-text-light block mb-1.5">Notes for Candidate</label>
                      <textarea value={schedNotes} onChange={(e) => setSchedNotes(e.target.value)}
                        className="w-full border border-periwinkle-100 rounded-xl p-3 text-sm resize-none" rows={3}
                        placeholder="Any preparation notes or instructions..." />
                    </div>
                    <button onClick={handleSchedule}
                      className="w-full bg-amber hover:bg-amber-dark text-white font-bold py-3 rounded-full text-base transition-colors shadow-lg shadow-amber/25 min-h-[44px]">
                      Send Interview Request
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Feedback Modal */}
        {showFeedbackModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowFeedbackModal(null)}>
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative bg-white rounded-2xl card-shadow max-w-lg w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
              {fbSaved ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">✓</div>
                  <h2 className="text-xl font-bold mb-2">Feedback Saved</h2>
                  <p className="text-text-light text-sm">Your interview feedback has been recorded.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Interview Feedback</h2>
                    <button onClick={() => setShowFeedbackModal(null)} className="p-2 hover:bg-periwinkle-50 rounded-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <p className="text-sm text-text-light mb-4">This feedback is visible to your team only — not shared with the candidate.</p>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-text-light block mb-2">Rating *</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button key={s} onClick={() => setFbRating(s)}
                            className="p-1 hover:scale-110 transition-transform">
                            <svg className={`w-8 h-8 ${s <= fbRating ? "text-amber" : "text-gray-200"}`}
                              fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-text-light block mb-2">Recommendation</label>
                      <div className="flex gap-2">
                        {([
                          { value: "move_forward" as const, label: "Move Forward", color: "bg-green-100 text-green-700" },
                          { value: "hold" as const, label: "Hold", color: "bg-amber/20 text-amber-dark" },
                          { value: "reject" as const, label: "Reject", color: "bg-red-100 text-red-700" },
                        ]).map((r) => (
                          <button key={r.value} onClick={() => setFbRec(r.value)}
                            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors min-h-[44px] ${
                              fbRec === r.value ? r.color + " ring-2 ring-offset-1 ring-current" : "bg-gray-50 text-text-light hover:bg-gray-100"
                            }`}>
                            {r.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-text-light block mb-1.5">Notes</label>
                      <textarea value={fbNotes} onChange={(e) => setFbNotes(e.target.value)}
                        className="w-full border border-periwinkle-100 rounded-xl p-3 text-sm resize-none" rows={4}
                        placeholder="Your observations about the candidate..." />
                    </div>
                    <button onClick={handleFeedback}
                      className="w-full bg-amber hover:bg-amber-dark text-white font-bold py-3 rounded-full text-base transition-colors shadow-lg shadow-amber/25 min-h-[44px]">
                      Save Feedback
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
