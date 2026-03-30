import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

// POST — create interview request
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { employer_id, nurse_id, job_id, message } = body;

    if (!employer_id || !nurse_id) {
      return NextResponse.json(
        { error: "employer_id and nurse_id are required" },
        { status: 400 }
      );
    }

    const db = getServiceClient();
    const { data, error } = await db
      .from("interview_requests")
      .insert({ employer_id, nurse_id, job_id: job_id ?? null, message: message ?? null, status: "pending" })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Request failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PATCH — update status (confirm/decline)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !["confirmed", "declined"].includes(status)) {
      return NextResponse.json({ error: "id and valid status required" }, { status: 400 });
    }

    const db = getServiceClient();
    const { data, error } = await db
      .from("interview_requests")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// GET — list requests for a nurse or employer
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const nurseId = searchParams.get("nurse_id");
    const employerId = searchParams.get("employer_id");

    if (!nurseId && !employerId) {
      return NextResponse.json({ error: "nurse_id or employer_id required" }, { status: 400 });
    }

    const db = getServiceClient();
    let query = db.from("interview_requests").select("*").order("created_at", { ascending: false });

    if (nurseId) query = query.eq("nurse_id", nurseId);
    if (employerId) query = query.eq("employer_id", employerId);

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Fetch failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
