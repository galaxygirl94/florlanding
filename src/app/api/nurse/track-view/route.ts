import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// POST { nurse_id } — increments profile_view_count and profile_views_this_week
export async function POST(request: NextRequest) {
  try {
    const { nurse_id } = await request.json();
    if (!nurse_id) return NextResponse.json({ error: "Missing nurse_id" }, { status: 400 });

    const { data } = await supabaseAdmin
      .from("nurse_profiles")
      .select("profile_view_count, profile_views_this_week, profile_views_reset_at")
      .eq("nurse_id", nurse_id)
      .maybeSingle();

    if (!data) return NextResponse.json({ success: false });

    const resetAt = data.profile_views_reset_at
      ? new Date(data.profile_views_reset_at)
      : new Date(0);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const shouldReset = resetAt < weekAgo;

    await supabaseAdmin
      .from("nurse_profiles")
      .update({
        profile_view_count: (data.profile_view_count ?? 0) + 1,
        profile_views_this_week: shouldReset ? 1 : (data.profile_views_this_week ?? 0) + 1,
        profile_views_reset_at: shouldReset ? new Date().toISOString() : data.profile_views_reset_at,
        updated_at: new Date().toISOString(),
      })
      .eq("nurse_id", nurse_id);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false });
  }
}
