import { NextRequest, NextResponse } from "next/server";
import { verifyNurseLicense } from "@/lib/nursys";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { licenseNumber, state } = body;

    if (!licenseNumber || !state) {
      return NextResponse.json(
        { error: "licenseNumber and state are required" },
        { status: 400 }
      );
    }

    const result = await verifyNurseLicense(
      String(licenseNumber).trim(),
      String(state).trim()
    );

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Verification failed";

    // Don't leak credential errors to client
    if (message.includes("credentials not configured") || message.includes("auth failed")) {
      return NextResponse.json(
        { error: "License verification is temporarily unavailable. Please try again later." },
        { status: 503 }
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
