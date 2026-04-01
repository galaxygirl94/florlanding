import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import {
  resolveEnrollment,
  submitLookup,
  resolveLookup,
} from "@/lib/nursys";

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: pending, error: fetchError } = await supabaseAdmin
    .from("nurse_license_verifications")
    .select("*")
    .eq("verification_status", "pending");

  if (fetchError) {
    console.error("[resolve-verifications] Fetch error:", fetchError);
    return NextResponse.json({ error: "DB fetch failed" }, { status: 500 });
  }

  let processed = 0;

  for (const row of pending ?? []) {
    try {
      if (row.enroll_transaction_id && !row.lookup_transaction_id) {
        // Phase 1: enrollment is submitted but not yet confirmed
        const { success } = await resolveEnrollment(row.enroll_transaction_id);

        if (success) {
          const { lookup_transaction_id } = await submitLookup(row.nurse_id);

          await supabaseAdmin
            .from("nurse_license_verifications")
            .update({
              verification_status: "enrolled",
              lookup_transaction_id,
            })
            .eq("id", row.id);
        } else {
          await supabaseAdmin
            .from("nurse_license_verifications")
            .update({ verification_status: "failed" })
            .eq("id", row.id);
        }
      } else if (row.lookup_transaction_id) {
        // Phase 2: lookup is submitted, check results
        const result = await resolveLookup(row.lookup_transaction_id);

        if (result.found) {
          const newStatus = result.has_discipline ? "flagged" : "verified";

          await supabaseAdmin
            .from("nurse_license_verifications")
            .update({
              verification_status: newStatus,
              license_status: result.license_status,
              license_expiration: result.license_expiration,
              has_discipline: result.has_discipline,
              verified_at: new Date().toISOString(),
            })
            .eq("id", row.id);
        } else {
          await supabaseAdmin
            .from("nurse_license_verifications")
            .update({ verification_status: "failed" })
            .eq("id", row.id);
        }
      }

      processed++;

      // Respect Nursys rate limit of 25 req/min — ~2.5s between rows
      await new Promise((r) => setTimeout(r, 2500));
    } catch (err) {
      console.error(`[resolve-verifications] Error processing row ${row.id}:`, err);
    }
  }

  return NextResponse.json({ processed });
}
