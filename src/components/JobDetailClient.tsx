"use client";

import { useState } from "react";
import Link from "next/link";
import { JobListing } from "@/data/types";

export default function JobDetailClient({ job }: { job: JobListing }) {
  const [newQuestion, setNewQuestion] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 pb-28 sm:pb-12">
      {/* Breadcrumb */}
      <div className="text-sm text-text-muted mb-5 sm:mb-6 flex items-center gap-2">
        <Link href="/jobs" className="hover:text-periwinkle transition-colors">Jobs</Link>
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
        <span className="text-text font-medium truncate">{job.title}</span>
      </div>

      <div className="animate-fade-in-up">
        {/* Header Card */}
        <div className="bg-white rounded-2xl section-shadow p-6 sm:p-8 mb-5 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-text">{job.title}</h1>
              <Link
                href={`/facility/${job.facilityId}`}
                className="text-periwinkle hover:text-periwinkle-dark text-sm sm:text-base mt-1.5 inline-flex items-center gap-1 transition-colors"
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
                <span>{job.type}{job.hoursPerWeek ? ` · ${job.hoursPerWeek} hrs/wk` : ""}</span>
              </div>
            </div>
            {job.union && (
              <div className="bg-amber/15 rounded-2xl px-4 py-2.5 text-center flex-shrink-0 self-start">
                <div className="text-sm font-bold text-amber-dark">Union</div>
                <div className="text-[10px] text-amber-dark">{job.unionName}</div>
              </div>
            )}
          </div>

          {/* Pay section */}
          <div className="bg-gradient-to-r from-periwinkle-50 to-cream rounded-2xl p-5 sm:p-6 mb-6">
            <div className="text-xs font-bold text-periwinkle-dark uppercase tracking-wider mb-2">
              Pay Information
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-periwinkle mb-2">
              ${job.payRange.min.toFixed(2)} - ${job.payRange.max.toFixed(2)}
              <span className="text-base font-medium text-periwinkle-dark">/{job.payUnit}</span>
            </div>
            <div className="bg-white/70 rounded-xl p-3.5 sm:p-4 mt-3">
              <div className="text-xs font-bold text-periwinkle-dark mb-1">Pay Explained</div>
              <p className="text-sm text-text leading-relaxed">{job.payExplained}</p>
            </div>
          </div>

          {/* Schedule */}
          <div className="mb-6">
            <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Schedule</h2>
            <div className="flex flex-wrap gap-2 mb-2">
              {job.scheduleBadges.map((badge) => (
                <span key={badge} className="bg-periwinkle-50 text-periwinkle-dark px-3 py-1.5 rounded-lg text-sm font-medium">
                  {badge}
                </span>
              ))}
            </div>
            <p className="text-sm text-text-light">{job.schedule}</p>
          </div>

          {/* Requirements & Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            <div>
              <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Requirements</h2>
              <ul className="space-y-2.5">
                <li className="flex items-start gap-2.5 text-sm">
                  <div className="w-4 h-4 rounded-full bg-periwinkle flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  {job.licenseRequired.state} {job.licenseRequired.type} License
                </li>
                {job.certificationsRequired.map((cert) => (
                  <li key={cert} className="flex items-start gap-2.5 text-sm">
                    <div className="w-4 h-4 rounded-full bg-periwinkle flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {cert}
                  </li>
                ))}
                {job.drivingRequired && (
                  <li className="flex items-start gap-2.5 text-sm">
                    <div className="w-4 h-4 rounded-full bg-periwinkle flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
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
                    <span className="bg-warm-gray px-2.5 py-0.5 rounded-lg text-xs font-medium text-text-light">{job.ehrSystem}</span>
                    EHR System
                  </li>
                )}
                {job.specialty && (
                  <li className="text-text">Specialty: {job.specialty}</li>
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
          <div className="hidden sm:block mt-8 pt-6 border-t border-periwinkle-50">
            <button className="w-full sm:w-auto bg-periwinkle hover:bg-periwinkle-dark text-white font-bold px-10 py-4 rounded-2xl text-lg transition-all duration-200 shadow-lg shadow-periwinkle/20 hover:shadow-xl hover:shadow-periwinkle/30 hover:-translate-y-0.5">
              Apply Now
            </button>
            <p className="text-xs text-text-muted mt-2">Direct application — no recruiter middleman</p>
          </div>
        </div>

        {/* Q&A Section */}
        <div className="bg-white rounded-2xl section-shadow p-6 sm:p-8 animate-fade-in-up-delay-1">
          <h2 className="text-lg sm:text-xl font-extrabold mb-2">Questions & Answers</h2>
          <p className="text-sm text-text-light mb-6 leading-relaxed">
            Ask anonymous questions about this role. Answers from the facility are visible to all nurses.
          </p>

          {job.questions.length > 0 ? (
            <div className="space-y-4 sm:space-y-5 mb-6 sm:mb-8">
              {job.questions.map((qa) => (
                <div key={qa.id} className="border border-periwinkle-100/50 rounded-xl p-4 hover:border-periwinkle-100 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-periwinkle-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-periwinkle">Q</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium break-words">{qa.question}</p>
                      <p className="text-xs text-text-muted mt-1">Asked {qa.askedDate}</p>
                    </div>
                  </div>
                  {qa.answer && (
                    <div className="flex items-start gap-3 mt-3 ml-0 sm:ml-10">
                      <div className="w-7 h-7 rounded-lg bg-amber/15 flex items-center justify-center flex-shrink-0 mt-0.5">
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
              <p className="text-sm font-medium text-success">
                Your question has been submitted anonymously. The facility will be notified.
              </p>
            </div>
          ) : (
            <div>
              <textarea
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Ask a question about this role (submitted anonymously)..."
                className="w-full border border-periwinkle-100 rounded-xl p-3.5 sm:p-4 text-sm resize-none min-h-[80px] transition-all duration-200"
                rows={3}
              />
              <button
                onClick={() => { if (newQuestion.trim()) setSubmitted(true); }}
                disabled={!newQuestion.trim()}
                className="mt-3 bg-periwinkle hover:bg-periwinkle-dark disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all duration-200 min-h-[44px]"
              >
                Submit Question
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile sticky apply bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-periwinkle-100/50 p-4 z-40">
        <button className="w-full bg-periwinkle hover:bg-periwinkle-dark text-white font-bold py-4 rounded-2xl text-base transition-all duration-200 shadow-lg shadow-periwinkle/20 min-h-[44px]">
          Apply Now
        </button>
      </div>
    </div>
  );
}
