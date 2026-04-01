import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Weekly cron — resets profile_views_this_week for all nurses
export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error, count } = await supabaseAdmin
    .from("nurse_profiles")
    .update({
      profile_views_this_week: 0,
      profile_views_reset_at: new Date().toISOString(),
    })
    .neq("profile_views_this_week", 0)
    .select("id", { count: "exact", head: true });

  if (error) {
    console.error("[reset-profile-views]", error.message);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }

  return NextResponse.json({ reset: count ?? 0 });
}
