import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are a nursing resume parser for Flor, a healthcare job matching platform. Extract the following fields and return ONLY valid JSON with no other text:
{
  "name": null,
  "email": null,
  "phone": null,
  "zip_code": null,
  "license_state": null,
  "license_number": null,
  "education": [],
  "specialties": [],
  "certifications": [],
  "years_total_experience": null,
  "years_primary_specialty": null,
  "shift_history": [],
  "schedule_types": [],
  "care_settings": [],
  "patient_populations": [],
  "ehr_systems": []
}
Map specialties to: Med Surg, ICU, ED, OR, L&D, NICU, Peds, Psych, Home Health, Oncology, Rehab, School Nurse, Telemetry, Cardiac, Outpatient/Clinic, SNF/LTC
Map certifications to: BLS, ACLS, PALS, NRP, TNCC, CCRN, CEN, RNC
Map care settings to: Acute care/Hospital, SNF/Long-term care, Outpatient clinic, Home health, School, Ambulatory surgery, Rehab, Psych facility
Map patient populations to: Adult, Geriatric, Pediatric, Neonatal, Maternal, Psychiatric
Map EHR systems to: Epic, Cerner/Oracle Health, Meditech, PointClickCare, Athenahealth
Be smart about nursing context. "5 South Med/Surg Tele" = Med Surg AND Telemetry. "PACU RN" = OR-adjacent. "Charge nurse in a 30-bed SNF" = SNF/LTC setting, Geriatric population. Calculate years from earliest to most recent nursing role. Only include items you're confident about.`;

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json({ error: "No content provided" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `Parse this nursing resume and return the structured JSON:\n\n${content}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Anthropic API error:", errorText);
      return NextResponse.json({ error: "Failed to parse resume" }, { status: 500 });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || "";

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Could not parse response" }, { status: 500 });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Resume parsing error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
