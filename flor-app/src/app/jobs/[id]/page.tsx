"use client";

import { use, useState } from "react";
import Link from "next/link";
import { seedJobs } from "@/data/seed-jobs";


export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const job = seedJobs.find((j) => j.id === id);
  const [newQuestion, setNewQuestion] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Job not found</h1>
        <Link href="/jobs" className="text-periwinkle hover:underline">Back to listings</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-24 sm:pb-10">
      {/* Breadcrumb */}
      <div className="text-sm text-text-light mb-4 sm:mb-6">
        <Link href="/jobs" className="hover:text-periwinkle">Jobs</Link>
        <span className="mx-2">/</span>
        <span className="text-text">{job.title}</span>
      </div>

      <div className="animate-fade-in-up">
        {/* Header */}
        <div className="bg-white rounded-2xl card-shadow p-5 sm:p-8 mb-5 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text">{job.title}</h1>
              <Link
                href={`/facility/${job.facilityId}`}
                className="text-periwinkle hover:underline text-sm sm:text-base mt-1 inline-block"
              >
                {job.facilityName}
              </Link>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-text-light">
                <span>{job.location.city}, {job.location.state}</span>
                <span>{job.type}{job.hoursPerWeek ? `, ${job.hoursPerWeek} hours/week` : ""}</span>
              </div>
            </div>
            {job.union && (
              <div className="bg-amber/20 rounded-xl px-4 py-2 text-center flex-shrink-0 self-start">
                <div className="text-sm font-bold text-amber-dark">Union</div>
                <div className="text-[10px] text-amber-dark">{job.unionName}</div>
              </div>
            )}
          </div>

          {/* Pay Explained — most prominent */}
          <div className="bg-periwinkle-50 rounded-2xl p-5 sm:p-6 mb-6">
            <div className="text-xs font-semibold text-periwinkle-dark uppercase tracking-wider mb-2">
              Pay Information
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-periwinkle mb-2">
              ${job.payRange.min.toFixed(2)} - ${job.payRange.max.toFixed(2)}
              <span className="text-base font-normal text-periwinkle-dark">/{job.payUnit}</span>
            </div>
            <div className="bg-white/60 rounded-xl p-3 sm:p-4 mt-3">
              <div className="text-xs font-semibold text-periwinkle-dark mb-1">Pay Explained</div>
              <p className="text-sm text-text leading-relaxed">{job.payExplained}</p>
            </div>
          </div>

          {/* Schedule */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-text-light uppercase tracking-wider mb-3">Schedule</h2>
            <div className="flex flex-wrap gap-2 mb-2">
              {job.scheduleBadges.map((badge) => (
                <span key={badge} className="bg-periwinkle-100 text-periwinkle-dark px-3 py-1.5 rounded-full text-sm font-medium">
                  {badge}
                </span>
              ))}
            </div>
            <p className="text-sm text-text-light">{job.schedule}</p>
          </div>

          {/* Requirements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h2 className="text-sm font-semibold text-text-light uppercase tracking-wider mb-3">Requirements</h2>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-periwinkle mt-0.5">●</span>
                  {job.licenseRequired.state} {job.licenseRequired.type} License
                </li>
                {job.certificationsRequired.map((cert) => (
                  <li key={cert} className="flex items-start gap-2 text-sm">
                    <span className="text-periwinkle mt-0.5">●</span>
                    {cert}
                  </li>
                ))}
                {job.drivingRequired && (
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-periwinkle mt-0.5">●</span>
                    Valid driver&apos;s license required
                  </li>
                )}
              </ul>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-text-light uppercase tracking-wider mb-3">Details</h2>
              <ul className="space-y-2 text-sm">
                {job.ehrSystem && (
                  <li className="flex items-center gap-2">
                    <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs font-medium">{job.ehrSystem}</span>
                    EHR System
                  </li>
                )}
                {job.specialty && (
                  <li>Specialty: {job.specialty}</li>
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
          <div className="hidden sm:block mt-8 pt-6 border-t border-periwinkle-100">
            <button className="w-full sm:w-auto bg-amber hover:bg-amber-dark text-white font-bold px-10 py-4 rounded-full text-lg transition-colors shadow-lg shadow-amber/25">
              Apply Now
            </button>
            <p className="text-xs text-text-light mt-2">Direct application — no recruiter middleman</p>
          </div>
        </div>

        {/* Q&A Section */}
        <div className="bg-white rounded-2xl card-shadow p-5 sm:p-8 animate-fade-in-up-delay-1">
          <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Questions & Answers</h2>
          <p className="text-sm text-text-light mb-6">
            Ask anonymous questions about this role. Answers from the facility are visible to all nurses.
          </p>

          {job.questions.length > 0 ? (
            <div className="space-y-4 sm:space-y-5 mb-6 sm:mb-8">
              {job.questions.map((qa) => (
                <div key={qa.id} className="border border-periwinkle-100 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-periwinkle-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-periwinkle">Q</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium break-words">{qa.question}</p>
                      <p className="text-xs text-text-light mt-1">Asked {qa.askedDate}</p>
                    </div>
                  </div>
                  {qa.answer && (
                    <div className="flex items-start gap-3 mt-3 ml-0 sm:ml-10">
                      <div className="w-7 h-7 rounded-full bg-amber/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-amber-dark">A</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm break-words">{qa.answer}</p>
                        <p className="text-xs text-text-light mt-1">
                          {qa.answeredBy} · {qa.answeredDate}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-text-light text-sm mb-6">
              No questions yet. Be the first to ask!
            </div>
          )}

          {/* Ask a question */}
          {submitted ? (
            <div className="bg-periwinkle-50 rounded-xl p-4 text-center">
              <p className="text-sm font-medium text-periwinkle-dark">
                Your question has been submitted anonymously. The facility will be notified.
              </p>
            </div>
          ) : (
            <div>
              <textarea
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Ask a question about this role (submitted anonymously)..."
                className="w-full border border-periwinkle-100 rounded-xl p-3 sm:p-4 text-sm resize-none min-h-[80px]"
                rows={3}
              />
              <button
                onClick={() => { if (newQuestion.trim()) setSubmitted(true); }}
                disabled={!newQuestion.trim()}
                className="mt-3 bg-periwinkle hover:bg-periwinkle-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-full text-sm transition-colors min-h-[44px]"
              >
                Submit Question
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile sticky apply bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-periwinkle-100 p-4 z-40">
        <button className="w-full bg-amber hover:bg-amber-dark text-white font-bold py-4 rounded-full text-base transition-colors shadow-lg shadow-amber/25 min-h-[44px]">
          Apply Now
        </button>
      </div>
    </div>
  );
}
