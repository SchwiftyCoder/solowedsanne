import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email')?.trim().toLowerCase();
  const phone = searchParams.get('phone')?.trim();

  if (!email && !phone) {
    return NextResponse.json({ error: 'email or phone required' }, { status: 400 });
  }

  try {
    const db = createServiceClient();

    const conditions: string[] = [];
    if (email) conditions.push(`email.eq.${email}`);
    if (phone) conditions.push(`phone.eq.${phone}`);

    const { data, error } = await db
      .from('guests')
      .select('rsvp_token')
      .or(conditions.join(','))
      .maybeSingle();

    if (error) {
      console.error('[check] DB error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (data) {
      return NextResponse.json({ found: true, token: data.rsvp_token });
    }

    return NextResponse.json({ found: false, token: null });
  } catch (err) {
    console.error('[check] Unexpected error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
