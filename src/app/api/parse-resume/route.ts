import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are extracting structured nurse profile data from a resume.
Return ONLY a JSON object with no preamble or markdown.
Extract exactly these fields (use null if not found or not applicable):
{
  "firstName": null,
  "lastName": null,
  "licenseType": null,
  "licenseState": null,
  "specialty": null,
  "yearsExperience": null,
  "longestRoleHeld": null,
  "currentlyPerDiem": null,
  "perDiemDuration": null,
  "caseloadExperience": null,
  "languagesSpoken": null
}

Rules:
- licenseType must be one of: "RN" | "PN" | "NP" | "CNM" | "CRNA" | "CNS" — or null
- licenseState: two-letter US state abbreviation, or null
- specialty must be one of: "Med Surg" | "ICU/Critical Care" | "Community Health" | "Pediatrics" | "Geriatrics/Long-Term Care" | "Psychiatric/Mental Health" | "Oncology" | "OR" | "ED" | "Labor & Delivery" | "Home Health" | "Other" — pick closest match, or null
- yearsExperience must be one of: "Less than 1" | "1-3" | "3-5" | "5-10" | "10+" — calculate from earliest to most recent nursing role
- longestRoleHeld must be one of: "Less than 1 year" | "1-2 years" | "2-5 years" | "5+ years" — calculate from all job durations listed
- currentlyPerDiem: true if resume shows active per diem work, false if explicitly not, null if unclear
- perDiemDuration: one of "Less than 6 months" | "6-12 months" | "1-2 years" | "2+ years" — only if currentlyPerDiem is true, else null
- caseloadExperience: true if resume mentions ongoing patient caseload, panel, or census management (PACE, home health, outpatient), false or null otherwise
- languagesSpoken: array of language strings found on resume, or null`;

async function callClaude(
  body: object,
  extraHeaders: Record<string, string> = {}
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY!;
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      ...extraHeaders,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.content?.[0]?.text ?? "";
}

function extractJson(text: string): Record<string, unknown> {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return {};
  try {
    return JSON.parse(match[0]);
  } catch {
    return {};
  }
}

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  try {
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      // ── PDF file upload ─────────────────────────────────────────────────
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
      if (!file.type.includes("pdf")) {
        return NextResponse.json(
          { error: "Please upload a PDF. Word docs (.docx) are not supported yet." },
          { status: 400 }
        );
      }

      const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");
      const text = await callClaude(
        {
          model: "claude-sonnet-4-20250514",
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "document",
                  source: { type: "base64", media_type: "application/pdf", data: base64 },
                },
                { type: "text", text: "Extract the nursing profile data from this resume." },
              ],
            },
          ],
        },
        { "anthropic-beta": "pdfs-2024-09-25" }
      );
      return NextResponse.json(extractJson(text));
    } else {
      // ── Legacy text path (backward-compatible) ──────────────────────────
      const { content } = await request.json();
      if (!content) return NextResponse.json({ error: "No content provided" }, { status: 400 });

      const text = await callClaude({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: `Parse this nursing resume:\n\n${content}` }],
      });
      return NextResponse.json(extractJson(text));
    }
  } catch (err) {
    console.error("[parse-resume]", err);
    return NextResponse.json({}); // empty → nurse fills manually
  }
}
