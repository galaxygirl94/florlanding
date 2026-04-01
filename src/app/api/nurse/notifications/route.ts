import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const nurse_id = request.nextUrl.searchParams.get("nurse_id");
  if (!nurse_id) return NextResponse.json([]);

  const { data, error } = await supabaseAdmin
    .from("notifications")
    .select("id, text, sub_text, icon, type, unread, created_at")
    .eq("recipient_id", nurse_id)
    .eq("recipient_type", "nurse")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("[nurse/notifications]", error.message);
    return NextResponse.json([]);
  }

  return NextResponse.json(data ?? []);
}
