import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const employer_id = request.nextUrl.searchParams.get("employer_id");
  if (!employer_id) return NextResponse.json([]);

  const { data, error } = await supabaseAdmin
    .from("notifications")
    .select("id, text, sub_text, icon, type, unread, created_at")
    .eq("recipient_id", employer_id)
    .eq("recipient_type", "employer")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("[employer/notifications]", error.message);
    return NextResponse.json([]);
  }

  return NextResponse.json(data ?? []);
}
