import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { checkNotifications, submitLookup } from "@/lib/nursys";

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = yesterday.toISOString().slice(0, 10); // YYYY-MM-DD

  const notifications = await checkNotifications(dateStr, dateStr);

  let flagged = 0;

  for (const notification of notifications) {
    if (!notification.recordId) continue;

    try {
      const { data: row } = await supabaseAdmin
        .from("nurse_license_verifications")
        .select("id")
        .eq("nurse_id", notification.recordId)
        .maybeSingle();

      if (!row) continue;

      const { lookup_transaction_id } = await submitLookup(notification.recordId);

      await supabaseAdmin
        .from("nurse_license_verifications")
        .update({
          lookup_transaction_id,
          verification_status: "pending",
        })
        .eq("id", row.id);

      flagged++;

      // Respect Nursys rate limit of 25 req/min
      await new Promise((r) => setTimeout(r, 2500));
    } catch (err) {
      console.error(
        `[check-notifications] Error processing recordId ${notification.recordId}:`,
        err
      );
    }
  }

  return NextResponse.json({ flagged });
}
