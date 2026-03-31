"use client";

import { useState, useMemo } from "react";
import { JobListing } from "@/data/types";

interface ScheduleInterviewModalProps {
  job: JobListing;
  onClose: () => void;
  onConfirm: (data: { date: string; time: string; name: string; email: string; note: string }) => void;
}

/* ── Helpers ──────────────────────────────────────────────────────── */

const DAY_MAP: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function generateAvailableDates(job: JobListing): string[] {
  const availability = job.schedulingAvailability ?? [];
  const allowedDays = new Set<number>();
  availability.forEach((w) => w.days.forEach((d) => allowedDays.add(DAY_MAP[d] ?? -1)));

  const advanceDays = job.advanceNoticeDays ?? 1;
  const dates: string[] = [];
  const start = new Date();
  start.setDate(start.getDate() + advanceDays);

  for (let i = 0; i < 28; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    if (allowedDays.has(d.getDay())) {
      dates.push(d.toISOString().slice(0, 10));
    }
  }
  return dates;
}

function generateTimeSlots(job: JobListing): string[] {
  const availability = job.schedulingAvailability ?? [];
  if (availability.length === 0) return [];

  const window = availability[0];
  const duration = job.interviewDuration ?? 30;
  const buffer = job.interviewBuffer ?? 0;
  const step = duration + buffer;

  const [startH, startM] = window.startTime.split(":").map(Number);
  const [endH, endM] = window.endTime.split(":").map(Number);
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  const slots: string[] = [];
  for (let m = startMinutes; m + duration <= endMinutes; m += step) {
    const h = Math.floor(m / 60);
    const mm = m % 60;
    slots.push(`${h.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}`);
  }
  return slots;
}

function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function formatDateDisplay(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

/* ── Component ────────────────────────────────────────────────────── */

export default function ScheduleInterviewModal({ job, onClose, onConfirm }: ScheduleInterviewModalProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [success, setSuccess] = useState(false);

  const availableDates = useMemo(() => generateAvailableDates(job), [job]);
  const timeSlots = useMemo(() => generateTimeSlots(job), [job]);

  // Group dates by week for calendar display
  const calendarWeeks = useMemo(() => {
    if (availableDates.length === 0) return [];
    const dateSet = new Set(availableDates);

    // Start from the first available date's week start (Sunday)
    const first = new Date(availableDates[0] + "T12:00:00");
    const last = new Date(availableDates[availableDates.length - 1] + "T12:00:00");
    const weekStart = new Date(first);
    weekStart.setDate(first.getDate() - first.getDay());

    const weeks: { date: string; dayNum: number; available: boolean; isToday: boolean }[][] = [];
    const current = new Date(weekStart);
    const todayStr = new Date().toISOString().slice(0, 10);

    while (current <= last || current.getDay() !== 0) {
      if (current.getDay() === 0) weeks.push([]);
      const ds = current.toISOString().slice(0, 10);
      weeks[weeks.length - 1].push({
        date: ds,
        dayNum: current.getDate(),
        available: dateSet.has(ds),
        isToday: ds === todayStr,
      });
      current.setDate(current.getDate() + 1);
      if (weeks.length > 5 && current.getDay() === 0) break;
    }
    return weeks;
  }, [availableDates]);

  const canConfirm = selectedDate && selectedTime && name.trim() && email.trim();

  function handleConfirm() {
    if (!canConfirm) return;
    onConfirm({ date: selectedDate, time: selectedTime, name: name.trim(), email: email.trim(), note: note.trim() });
    setSuccess(true);
  }

  /* Success state */
  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
        <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 text-center animate-scale-in" onClick={(e) => e.stopPropagation()}>
          <div className="w-16 h-16 rounded-full bg-periwinkle flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-extrabold text-text mb-2">Interview scheduled!</h2>
          <p className="text-sm text-text-light leading-relaxed mb-2">
            A Google Calendar invite has been sent to your email and the employer&apos;s calendar. You will both receive a Google Meet link.
          </p>
          <p className="text-sm font-bold text-periwinkle mb-6">
            {formatDateDisplay(selectedDate)} at {formatTime(selectedTime)} &middot; {job.interviewDuration ?? 30} min
          </p>
          <button
            onClick={onClose}
            className="bg-periwinkle hover:bg-periwinkle-dark text-white font-bold px-8 py-3 rounded-full text-sm transition-all duration-200"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 max-w-lg w-full mx-0 sm:mx-4 max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-lg font-extrabold text-text">
              Schedule your interview with {job.facilityName}
            </h2>
            <p className="text-sm text-text-light mt-1">
              Pick a time that works for you. A calendar invite will be sent to both of you automatically.
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-periwinkle-50 transition-colors flex-shrink-0">
            <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Calendar grid */}
        <div className="mb-5">
          <label className="block text-xs font-bold text-text-light mb-2">Select a date</label>
          <div className="border border-periwinkle-100/40 rounded-xl overflow-hidden">
            {/* Day headers */}
            <div className="grid grid-cols-7 bg-periwinkle-50/60">
              {DAY_LABELS.map((d) => (
                <div key={d} className="text-center text-[10px] font-bold text-text-muted py-2">{d}</div>
              ))}
            </div>
            {/* Weeks */}
            {calendarWeeks.map((week, wi) => (
              <div key={wi} className="grid grid-cols-7">
                {week.map((day) => (
                  <button
                    key={day.date}
                    type="button"
                    disabled={!day.available}
                    onClick={() => { setSelectedDate(day.date); setSelectedTime(""); }}
                    className={`py-2.5 text-sm font-semibold transition-all ${
                      selectedDate === day.date
                        ? "bg-periwinkle text-white"
                        : day.available
                        ? "text-text hover:bg-periwinkle-50 cursor-pointer"
                        : "text-text-muted/30 cursor-not-allowed"
                    } ${day.isToday ? "ring-1 ring-inset ring-periwinkle/40" : ""}`}
                  >
                    {day.dayNum}
                  </button>
                ))}
              </div>
            ))}
          </div>
          {selectedDate && (
            <p className="text-xs text-periwinkle font-semibold mt-2">{formatDateDisplay(selectedDate)}</p>
          )}
        </div>

        {/* Time slots */}
        {selectedDate && (
          <div className="mb-5">
            <label className="block text-xs font-bold text-text-light mb-2">Select a time</label>
            <div className="flex flex-wrap gap-2">
              {timeSlots.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTime(t)}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
                    selectedTime === t
                      ? "bg-periwinkle text-white"
                      : "bg-white border-2 border-periwinkle/30 text-periwinkle hover:border-periwinkle hover:bg-periwinkle-50"
                  }`}
                >
                  {formatTime(t)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Confirmation fields */}
        {selectedTime && (
          <div className="space-y-3 mb-5">
            <div>
              <label className="block text-xs font-bold text-text-light mb-1.5">Your name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Preferred name"
                className="w-full rounded-xl border border-periwinkle-100/60 bg-white px-4 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-periwinkle/40"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-light mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full rounded-xl border border-periwinkle-100/60 bg-white px-4 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-periwinkle/40"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-light mb-1.5">Note to employer (optional)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value.slice(0, 200))}
                rows={2}
                maxLength={200}
                placeholder="Anything you'd like the employer to know before your interview? (optional)"
                className="w-full rounded-xl border border-periwinkle-100/60 bg-white px-4 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-periwinkle/40 resize-none"
              />
              <p className="text-[10px] text-text-muted text-right mt-0.5">{note.length}/200</p>
            </div>
          </div>
        )}

        {/* Confirm button */}
        <button
          onClick={handleConfirm}
          disabled={!canConfirm}
          className={`w-full rounded-full py-3.5 font-bold text-sm transition-all duration-200 ${
            canConfirm
              ? "bg-periwinkle hover:bg-periwinkle-dark text-white shadow-md hover:shadow-lg"
              : "bg-gray-200 text-text-muted cursor-not-allowed"
          }`}
        >
          Confirm Interview
        </button>
      </div>
    </div>
  );
}
