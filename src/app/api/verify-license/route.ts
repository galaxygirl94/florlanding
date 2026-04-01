import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { submitEnrollment } from "@/lib/nursys";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      nurse_id,
      jurisdictionAbbreviation,
      licenseNumber,
      licenseType,
      address1,
      city,
      state,
      zip,
      lastFourSSN,
      birthYear,
      email,
    } = body;

    if (!nurse_id) {
      return NextResponse.json({ error: "Missing nurse_id" }, { status: 400 });
    }
    if (
      !jurisdictionAbbreviation ||
      !licenseNumber ||
      !licenseType ||
      !address1 ||
      !city ||
      !state ||
      !zip ||
      !lastFourSSN ||
      !birthYear
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { enroll_transaction_id } = await submitEnrollment({
      jurisdictionAbbreviation,
      licenseNumber,
      licenseType,
      address1,
      city,
      state,
      zip,
      lastFourSSN,
      birthYear,
      recordId: nurse_id,
      email,
    });

    const { error: dbError } = await supabaseAdmin
      .from("nurse_license_verifications")
      .upsert(
        {
          nurse_id,
          enroll_transaction_id,
          verification_status: "pending",
          jurisdiction_abbreviation: jurisdictionAbbreviation,
          license_number: licenseNumber,
          license_type: licenseType,
          address1,
          city,
          state,
          zip,
        },
        { onConflict: "nurse_id" }
      );

    if (dbError) {
      console.error("[verify-license] DB error:", dbError);
      return NextResponse.json(
        { error: "Failed to save verification" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Verification submitted" });
  } catch (err) {
    console.error("[verify-license] Error:", err);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
