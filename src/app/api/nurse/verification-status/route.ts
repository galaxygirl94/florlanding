import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const nurse_id = request.nextUrl.searchParams.get("nurse_id");

  if (!nurse_id) {
    return NextResponse.json({ error: "Missing nurse_id" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("nurse_license_verifications")
    .select(
      "verification_status, flor_verified, license_status, license_expiration, has_discipline"
    )
    .eq("nurse_id", nurse_id)
    .maybeSingle();

  if (error) {
    console.error("[verification-status] DB error:", error);
    return NextResponse.json({ error: "Failed to fetch status" }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ verification_status: null });
  }

  return NextResponse.json({
    verification_status: data.verification_status,
    flor_verified: data.flor_verified,
    license_status: data.license_status,
    license_expiration: data.license_expiration,
    has_discipline: data.has_discipline,
  });
}
