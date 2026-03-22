import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { facility_name, specialty, pay_hourly, employment_type, years_experience } = body;

    // Validate required fields
    if (!facility_name || !specialty || pay_hourly == null) {
      return NextResponse.json(
        { error: 'facility_name, specialty, and pay_hourly are required' },
        { status: 400 }
      );
    }

    // Validate pay range
    const pay = Number(pay_hourly);
    if (isNaN(pay) || pay < 20 || pay > 200) {
      return NextResponse.json(
        { error: 'pay_hourly must be between $20 and $200' },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    const { error } = await supabase.from('community_pay_submissions').insert({
      facility_name,
      specialty,
      pay_hourly: pay,
      employment_type: employment_type || null,
      years_experience: years_experience != null ? Number(years_experience) : null,
      is_verified: false,
    });

    if (error) {
      console.error('Failed to insert pay submission:', error);
      return NextResponse.json(
        { error: 'Failed to save submission' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Thank you for your submission' });
  } catch (err) {
    console.error('Pay submission error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
