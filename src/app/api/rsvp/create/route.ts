import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { createServiceClient } from '@/lib/supabase';
import { sendRsvpSms } from '@/lib/twilio';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { first_name, last_name, email, phone, attending } = body;

  if (!first_name || !last_name || !email || !phone || attending === undefined) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const normalizedPhone = String(phone).trim();

  const db = createServiceClient();

  // Check for duplicate email or phone — return existing RSVP instead of creating new
  const { data: existing } = await db
    .from('guests')
    .select('rsvp_token')
    .or(`email.eq.${normalizedEmail},phone.eq.${normalizedPhone}`)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ token: existing.rsvp_token, duplicate: true });
  }

  const rsvp_token = uuidv4();

  const { error } = await db.from('guests').insert({
    first_name: String(first_name).trim(),
    last_name: String(last_name).trim(),
    email: normalizedEmail,
    phone: normalizedPhone,
    attending: Boolean(attending),
    rsvp_token,
  });

  if (error) {
    console.error('[create] DB insert error:', error);
    // Handle race-condition duplicate
    if (error.code === '23505') {
      const { data: race } = await db
        .from('guests')
        .select('rsvp_token')
        .or(`email.eq.${normalizedEmail},phone.eq.${normalizedPhone}`)
        .maybeSingle();
      if (race) {
        return NextResponse.json({ token: race.rsvp_token, duplicate: true });
      }
    }
    return NextResponse.json({ error: 'Failed to save RSVP' }, { status: 500 });
  }

  // Fire-and-forget SMS — failure must not block response
  await sendRsvpSms(normalizedPhone, String(first_name).trim(), rsvp_token);

  return NextResponse.json({ token: rsvp_token, duplicate: false }, { status: 201 });
}
