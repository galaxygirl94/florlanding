import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const nurse_id = request.nextUrl.searchParams.get("nurse_id");
  if (!nurse_id) return NextResponse.json({ error: "Missing nurse_id" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("nurse_profiles")
    .select("*")
    .eq("nurse_id", nurse_id)
    .maybeSingle();

  if (error) {
    console.error("[nurse/profile GET]", error.message);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }

  return NextResponse.json(data ?? null);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nurse_id, ...fields } = body;

    if (!nurse_id) return NextResponse.json({ error: "Missing nurse_id" }, { status: 400 });

    const { error } = await supabaseAdmin
      .from("nurse_profiles")
      .upsert(
        { nurse_id, ...fields, updated_at: new Date().toISOString() },
        { onConflict: "nurse_id" }
      );

    if (error) {
      console.error("[nurse/profile POST]", error.message);
      return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[nurse/profile POST]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
