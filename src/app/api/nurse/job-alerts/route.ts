import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// POST { nurse_id, enabled } — toggle job alert emails
export async function POST(request: NextRequest) {
  try {
    const { nurse_id, enabled } = await request.json();
    if (!nurse_id || typeof enabled !== "boolean") {
      return NextResponse.json({ error: "Missing nurse_id or enabled" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("nurse_profiles")
      .update({ job_alerts_enabled: enabled, updated_at: new Date().toISOString() })
      .eq("nurse_id", nurse_id);

    if (error) {
      console.error("[job-alerts POST]", error.message);
      return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[job-alerts POST]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
