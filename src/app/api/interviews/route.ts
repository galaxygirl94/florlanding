import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/interviews — Create an interview and (in production) a Google Calendar event.
 *
 * Request body:
 *   jobId, jobTitle, facilityName, nurseEmail, nurseName, employerEmail,
 *   date, time, duration, fitScore, note
 *
 * In production this would use stored Google OAuth tokens to:
 * 1. Create a Google Calendar event with Google Meet link
 * 2. Add both nurse and employer as attendees
 * 3. Set reminders (24h and 1h)
 * 4. Return the calendar event link and Meet URL
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobTitle, facilityName, nurseEmail, nurseName, employerEmail, date, time, duration, fitScore, note } = body;

    if (!jobTitle || !date || !time || !nurseEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Build the calendar event structure (for reference / future implementation)
    const calendarEvent = {
      summary: `Interview — ${jobTitle} at ${facilityName} | Flor`,
      description: [
        "This interview was scheduled directly through Flor.",
        "",
        `Job: ${jobTitle}`,
        `Employer: ${facilityName}`,
        `Candidate Flor Fit Score: ${fitScore ?? "N/A"}%`,
        "",
        note ? `Candidate note: ${note}` : "",
        "",
        "Flor — Direct hire. No recruiters. No spam.",
      ]
        .filter(Boolean)
        .join("\n"),
      start: {
        dateTime: `${date}T${time}:00`,
        timeZone: "America/New_York",
      },
      end: {
        dateTime: computeEndTime(date, time, duration || 30),
        timeZone: "America/New_York",
      },
      attendees: [
        { email: nurseEmail, displayName: nurseName },
        ...(employerEmail ? [{ email: employerEmail }] : []),
      ],
      conferenceData: {
        createRequest: {
          requestId: `flor-${Date.now()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 1440 }, // 24 hours
          { method: "email", minutes: 60 }, // 1 hour
        ],
      },
    };

    // In production: use Google Calendar API to create the event
    // const calendar = google.calendar({ version: 'v3', auth: oauthClient });
    // const event = await calendar.events.insert({ calendarId: 'primary', requestBody: calendarEvent, conferenceDataVersion: 1 });

    return NextResponse.json({
      success: true,
      interview: {
        id: `int-${Date.now()}`,
        date,
        time,
        duration: duration || 30,
        nurseName,
        nurseEmail,
        meetLink: "https://meet.google.com/placeholder",
        calendarEventId: `evt-${Date.now()}`,
      },
      // In production: calendarEvent would include real meetLink
      _calendarEventSpec: calendarEvent,
    });
  } catch {
    return NextResponse.json({ error: "Failed to create interview" }, { status: 500 });
  }
}

function computeEndTime(date: string, time: string, durationMinutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const totalMinutes = h * 60 + m + durationMinutes;
  const endH = Math.floor(totalMinutes / 60);
  const endM = totalMinutes % 60;
  return `${date}T${endH.toString().padStart(2, "0")}:${endM.toString().padStart(2, "0")}:00`;
}
