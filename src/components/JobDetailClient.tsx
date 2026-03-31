"use client";

import { useState } from "react";
import Link from "next/link";
import { JobListing } from "@/data/types";
import ScheduleInterviewModal from "@/components/ScheduleInterviewModal";

export default function JobDetailClient({ job }: { job: JobListing }) {
  const [newQuestion, setNewQuestion] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [interviewScheduled, setInterviewScheduled] = useState(false);

  const fitColor =
    (job.fitScore ?? 0) >= 90
      ? "bg-success"
      : (job.fitScore ?? 0) >= 80
      ? "bg-periwinkle"
      : "bg-amber";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-28 sm:pb-12">
      {/* Breadcrumb */}
      <div className="text-sm text-text-muted mb-6 flex items-center gap-2">
        <Link href="/jobs" className="hover:text-periwinkle transition-colors font-medium">Jobs</Link>
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
        <span className="text-text font-semibold truncate">{job.title}</span>
      </div>

      <div className="animate-fade-in-up">
        {/* Header Card */}
        <div className="bg-white rounded-2xl border border-periwinkle-100/40 p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-text">{job.title}</h1>
              <Link
                href={`/facility/${job.facilityId}`}
                className="text-periwinkle hover:text-periwinkle-dark text-sm sm:text-base mt-1.5 inline-flex items-center gap-1 transition-colors font-semibold"
              >
                {job.facilityName}
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-sm text-text-light">
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  {job.location.city}, {job.location.state}
                </span>
                <span className="font-medium">{job.type}{job.hoursPerWeek ? ` · ${job.hoursPerWeek} hrs/wk` : ""}</span>
              </div>
            </div>

            {/* Fit Score + Union */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {job.fitScore != null && (
                <div className={`${fitColor} rounded-xl px-4 py-3 text-center`}>
                  <div className="text-2xl font-extrabold text-white">{job.fitScore}%</div>
                  <div className="text-[10px] font-bold text-white/80 uppercase tracking-wider">Flor Fit</div>
                </div>
              )}
              {job.union && (
                <div className="bg-amber/10 border border-amber/15 rounded-xl px-4 py-3 text-center">
                  <div className="text-sm font-bold text-amber-dark">Union</div>
                  <div className="text-[10px] text-amber-dark">{job.unionName}</div>
                </div>
              )}
            </div>
          </div>

          {/* Pay section */}
          <div className="bg-periwinkle-50/60 rounded-xl p-5 sm:p-6 mb-6">
            <div className="text-xs font-bold text-periwinkle-dark uppercase tracking-wider mb-2">
              Pay Information
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-periwinkle-dark mb-2">
              ${job.payRange.min}–${job.payRange.max}
              <span className="text-base font-semibold text-periwinkle">/{job.payUnit}</span>
            </div>
            {(job.signOnBonus ?? 0) > 0 && (
              <div className="inline-flex items-center gap-2 bg-success-light text-success font-bold text-sm px-3 py-1.5 rounded-full mb-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ${job.signOnBonus!.toLocaleString()} sign-on bonus
              </div>
            )}
            <div className="bg-white/80 rounded-lg p-4 mt-2">
              <div className="text-xs font-bold text-periwinkle-dark mb-1">Pay Explained</div>
              <p className="text-sm text-text leading-relaxed">{job.payExplained}</p>
            </div>
          </div>

          {/* Patient ratio */}
          {job.patientRatio && (
            <div className="bg-white rounded-xl border border-periwinkle-100/40 p-4 mb-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-periwinkle-50 flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-extrabold text-periwinkle">{job.patientRatio}</span>
              </div>
              <div>
                <div className="text-sm font-bold text-text flex items-center gap-2">
                  Patient-to-nurse ratio
                  {job.patientRatioVerified && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-success bg-success-light px-2 py-0.5 rounded-full">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                      Flor Verified
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-light">
                  {job.patientRatioVerified
                    ? "This ratio is verified through our Ethics Pledge. The facility has committed to maintaining this staffing level."
                    : "Self-reported by the facility."}
                </p>
              </div>
            </div>
          )}

          {/* Schedule */}
          <div className="mb-6">
            <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Schedule</h2>
            <div className="flex flex-wrap gap-2 mb-2">
              {job.scheduleBadges.map((badge) => (
                <span key={badge} className="bg-white text-periwinkle-dark px-3.5 py-1.5 rounded-full text-sm font-semibold border border-periwinkle-100/60">
                  {badge}
                </span>
              ))}
            </div>
            <p className="text-sm text-text-light">{job.schedule}</p>
            <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 text-sm">
              {job.weekends && (
                <span className="text-text-light">Weekends: <span className="font-semibold text-text">{job.weekends}</span></span>
              )}
              {job.onCall && (
                <span className="text-text-light">On-call: <span className="font-semibold text-text">{job.onCall}</span></span>
              )}
            </div>
          </div>

          {/* Benefits badges */}
          {(job.loanForgiveness || job.tuitionReimbursement || job.relocationAssistance || job.magnetDesignated) && (
            <div className="mb-6">
              <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Benefits & Perks</h2>
              <div className="flex flex-wrap gap-2">
                {job.loanForgiveness && (
                  <span className="text-sm font-bold bg-success-light text-success px-3.5 py-1.5 rounded-full border border-success/20">
                    Loan Forgiveness Eligible
                  </span>
                )}
                {job.tuitionReimbursement && (
                  <span className="text-sm font-bold bg-info/10 text-info px-3.5 py-1.5 rounded-full border border-info/20">
                    Tuition Reimbursement
                  </span>
                )}
                {job.relocationAssistance && (
                  <span className="text-sm font-bold bg-rose-light text-rose px-3.5 py-1.5 rounded-full border border-rose/20">
                    Relocation Assistance
                  </span>
                )}
                {job.magnetDesignated && (
                  <span className="text-sm font-bold bg-periwinkle-50 text-periwinkle-dark px-3.5 py-1.5 rounded-full border border-periwinkle-100">
                    Magnet Designated
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Requirements & Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Requirements</h2>
              <ul className="space-y-2.5">
                <li className="flex items-start gap-2.5 text-sm">
                  <div className="w-5 h-5 rounded-full bg-periwinkle flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  {job.licenseRequired.state} {job.licenseRequired.type} License
                </li>
                {job.certificationsRequired.map((cert) => (
                  <li key={cert} className="flex items-start gap-2.5 text-sm">
                    <div className="w-5 h-5 rounded-full bg-periwinkle flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {cert}
                  </li>
                ))}
                {job.drivingRequired && (
                  <li className="flex items-start gap-2.5 text-sm">
                    <div className="w-5 h-5 rounded-full bg-periwinkle flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    Valid driver&apos;s license required
                  </li>
                )}
              </ul>
            </div>
            <div>
              <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Details</h2>
              <ul className="space-y-2.5 text-sm">
                {job.ehrSystem && (
                  <li className="flex items-center gap-2">
                    <span className="bg-warm-gray px-2.5 py-0.5 rounded-md text-xs font-semibold text-text-light">{job.ehrSystem}</span>
                    EHR System
                  </li>
                )}
                {job.specialty && (
                  <li className="text-text">Specialty: <span className="font-semibold">{job.specialty}</span></li>
                )}
                {job.facilityType && (
                  <li className="text-text">Facility type: <span className="font-semibold">{job.facilityType}</span></li>
                )}
                {job.preferredExperience && (
                  <li className="text-text-light">Preferred: {job.preferredExperience}</li>
                )}
                {job.note && (
                  <li className="text-text-light italic">Note: {job.note}</li>
                )}
              </ul>
            </div>
          </div>

          {/* Desktop Apply */}
          <div className="hidden sm:block mt-8 pt-6 border-t border-periwinkle-100/30">
            <div className="flex items-center gap-3 flex-wrap">
              <button className="bg-periwinkle hover:bg-periwinkle-dark text-white font-bold px-10 py-4 rounded-full text-lg transition-all duration-200 shadow-lg shadow-periwinkle/20 hover:shadow-xl hover:shadow-periwinkle/30 hover:-translate-y-0.5">
                Apply Now
              </button>
              {job.directScheduling && (job.fitScore ?? 0) >= 85 && !interviewScheduled && (
                <button
                  onClick={() => setShowScheduleModal(true)}
                  className="border-2 border-periwinkle text-periwinkle font-bold px-8 py-3.5 rounded-full text-base hover:bg-periwinkle hover:text-white transition-all duration-150"
                >
                  📅 Schedule Interview →
                </button>
              )}
              {interviewScheduled && (
                <span className="inline-flex items-center gap-2 bg-success-light text-success font-bold px-6 py-3.5 rounded-full text-base border border-success/20">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Interview Scheduled
                </span>
              )}
            </div>
            <p className="text-xs text-text-muted mt-2">Direct application — no recruiter middleman</p>
          </div>
        </div>

        {/* Q&A Section */}
        <div className="bg-white rounded-2xl border border-periwinkle-100/40 p-6 sm:p-8 animate-fade-in-up-delay-1">
          <h2 className="text-lg sm:text-xl font-extrabold mb-2">Questions & Answers</h2>
          <p className="text-sm text-text-light mb-6 leading-relaxed">
            Ask anonymous questions about this role. Answers from the facility are visible to all nurses.
          </p>

          {job.questions.length > 0 ? (
            <div className="space-y-4 mb-8">
              {job.questions.map((qa) => (
                <div key={qa.id} className="border border-periwinkle-100/40 rounded-xl p-4 hover:border-periwinkle/30 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-periwinkle-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-periwinkle">Q</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold break-words">{qa.question}</p>
                      <p className="text-xs text-text-muted mt-1">Asked {qa.askedDate}</p>
                    </div>
                  </div>
                  {qa.answer && (
                    <div className="flex items-start gap-3 mt-3 ml-0 sm:ml-10">
                      <div className="w-7 h-7 rounded-lg bg-amber/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-amber-dark">A</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm break-words leading-relaxed">{qa.answer}</p>
                        <p className="text-xs text-text-muted mt-1">
                          {qa.answeredBy} · {qa.answeredDate}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-text-muted text-sm mb-6 bg-periwinkle-50/30 rounded-xl">
              No questions yet. Be the first to ask!
            </div>
          )}

          {/* Ask a question */}
          {submitted ? (
            <div className="bg-success-light rounded-xl p-4 text-center">
              <p className="text-sm font-semibold text-success">
                Your question has been submitted anonymously. The facility will be notified.
              </p>
            </div>
          ) : (
            <div>
              <textarea
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Ask a question about this role (submitted anonymously)..."
                className="w-full border border-periwinkle-100/60 rounded-xl p-4 text-sm resize-none min-h-[80px]"
                rows={3}
              />
              <button
                onClick={() => { if (newQuestion.trim()) setSubmitted(true); }}
                disabled={!newQuestion.trim()}
                className="mt-3 bg-periwinkle hover:bg-periwinkle-dark disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-full text-sm transition-all duration-200 min-h-[44px]"
              >
                Submit Question
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile sticky apply bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 glass border-t border-periwinkle-100/40 p-4 z-40">
        <div className="space-y-2">
          <button className="w-full bg-periwinkle hover:bg-periwinkle-dark text-white font-bold py-4 rounded-full text-base transition-all duration-200 shadow-lg shadow-periwinkle/20 min-h-[44px]">
            Apply Now
          </button>
          {job.directScheduling && (job.fitScore ?? 0) >= 85 && !interviewScheduled && (
            <button
              onClick={() => setShowScheduleModal(true)}
              className="w-full border-2 border-periwinkle text-periwinkle font-bold py-3 rounded-full text-sm hover:bg-periwinkle hover:text-white transition-all duration-150"
            >
              📅 Schedule Interview →
            </button>
          )}
          {interviewScheduled && (
            <div className="w-full text-center bg-success-light text-success font-bold py-3 rounded-full text-sm border border-success/20">
              ✓ Interview Scheduled
            </div>
          )}
        </div>
      </div>

      {/* Schedule Interview Modal */}
      {showScheduleModal && (
        <ScheduleInterviewModal
          job={job}
          onClose={() => setShowScheduleModal(false)}
          onConfirm={(data) => {
            /* In production: call /api/interviews to create calendar event */
            try {
              const existing = JSON.parse(localStorage.getItem("flor-scheduled-interviews") || "[]");
              existing.push({
                id: `int-nurse-${Date.now()}`,
                jobId: job.id,
                jobTitle: job.title,
                facilityName: job.facilityName,
                date: data.date,
                time: data.time,
                duration: job.interviewDuration ?? 30,
                nurseName: data.name,
                nurseEmail: data.email,
                note: data.note,
                status: "scheduled",
              });
              localStorage.setItem("flor-scheduled-interviews", JSON.stringify(existing));
            } catch { /* ignore */ }
            setInterviewScheduled(true);
          }}
        />
      )}
    </div>
  );
}
