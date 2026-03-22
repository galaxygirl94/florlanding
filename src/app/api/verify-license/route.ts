import { NextRequest, NextResponse } from "next/server";
import { verifyLicense, NursysVerificationResult } from "@/lib/nursys-mock";

// TODO: Replace mock with Nursys e-Notify API call
// This is Nursys e-Notify (NOT QuickConfirm — Nursys does not offer a QuickConfirm API).
//
// Required fields for Nursys e-Notify:
//   - licenseType: "RN" | "LPN" | "APRN"
//   - licenseState: two-letter state abbreviation
//   - licenseNumber: state-issued license number
//   - nameOnLicense: full name exactly as it appears on the license
//
// Environment variable: NURSYS_API_KEY
// Endpoint: https://www.nursys.com/api/e-notify/v1/verify (placeholder)

const NURSYS_API_KEY = process.env.NURSYS_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { licenseType, licenseState, licenseNumber, nameOnLicense } = body;

    if (!licenseState || !licenseNumber || !nameOnLicense) {
      return NextResponse.json(
        { error: "Missing required fields: licenseState, licenseNumber, nameOnLicense" },
        { status: 400 }
      );
    }

    let result: NursysVerificationResult;

    if (NURSYS_API_KEY) {
      // TODO: Replace mock with Nursys e-Notify API call
      // const response = await fetch("https://www.nursys.com/api/e-notify/v1/verify", {
      //   method: "POST",
      //   headers: {
      //     "Authorization": `Bearer ${NURSYS_API_KEY}`,
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     licenseType,
      //     licenseState,
      //     licenseNumber,
      //     nameOnLicense,
      //   }),
      // });
      // result = await response.json();
      console.log("[Nursys] API key configured but using mock until integration is complete");
      result = await verifyLicense(nameOnLicense, licenseState, licenseNumber);
    } else {
      console.log("[Nursys MOCK] Verifying license:", { licenseType, licenseState, licenseNumber, nameOnLicense });
      result = await verifyLicense(nameOnLicense, licenseState, licenseNumber);
    }

    return NextResponse.json({
      verified: result.status === "active",
      status: result.status,
      expirationDate: result.expirationDate,
      state: result.state || licenseState,
      disciplineFlags: result.disciplineFlags,
      source: NURSYS_API_KEY ? "nursys-e-notify" : "mock",
    });
  } catch {
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
