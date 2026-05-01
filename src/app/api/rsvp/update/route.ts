import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export async function PATCH(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { token, phone, attending } = body;

  if (!token) {
    return NextResponse.json({ error: 'token is required' }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  if (phone !== undefined) updates.phone = String(phone).trim();
  if (attending !== undefined) updates.attending = Boolean(attending);

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No updatable fields provided' }, { status: 400 });
  }

  const db = createServiceClient();

  const { data, error } = await db
    .from('guests')
    .update(updates)
    .eq('rsvp_token', token)
    .select('rsvp_token')
    .maybeSingle();

  if (error) {
    console.error('[update] DB error:', error);
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Phone number already in use' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update RSVP' }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: 'RSVP not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
