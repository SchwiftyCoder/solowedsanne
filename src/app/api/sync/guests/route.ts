import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

// Called by a Google Apps Script trigger bound to each RSVP form's response
// sheet, once per new form submission. Inserts brand-new guests (auto-assigning
// the next table number for their category) and, for guests who already exist
// (same first/last name + phone), only refreshes their email/message - table
// number and family flag are never touched here, so manual reseating in
// Supabase never gets clobbered by a late RSVP trickling in.
const GUESTS_PER_TABLE = 8;

function normalizePhone(raw: string): string {
  const digits = (raw || '').replace(/\D/g, '');
  if (digits.startsWith('00') && digits.length > 2) return `+${digits.slice(2)}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length > 0) return `+${digits}`;
  return '';
}

export async function POST(req: Request) {
  const secret = req.headers.get('x-sync-secret');
  if (!process.env.SYNC_SECRET || secret !== process.env.SYNC_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const firstName = String(body.first_name || '').trim();
    const lastName = String(body.last_name || '').trim();
    const isFamily = !!body.isFamily;
    const startingTable = Number.isFinite(body.startingTable) ? Number(body.startingTable) : 1;

    if (!firstName && !lastName) {
      return NextResponse.json({ error: 'Missing name' }, { status: 400 });
    }

    if (body.attending && !/^Yes/i.test(String(body.attending))) {
      return NextResponse.json({ skipped: true, reason: 'Not attending' });
    }

    const phone = normalizePhone(String(body.phone || ''));
    const email = String(body.email || '').trim().toLowerCase();
    const message = String(body.message || '').trim();

    const db = createServiceClient();

    const { data: existing, error: findErr } = await db
      .from('seating')
      .select('id')
      .eq('first_name', firstName)
      .eq('last_name', lastName)
      .eq('phone', phone)
      .maybeSingle();

    if (findErr) {
      console.error('[sync/guests] lookup error:', findErr);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (existing) {
      const { error: updateErr } = await db.from('seating').update({ email, message }).eq('id', existing.id);
      if (updateErr) {
        console.error('[sync/guests] update error:', updateErr);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
      }
      return NextResponse.json({ updated: true, id: existing.id });
    }

    const { data: categoryGuests, error: catErr } = await db
      .from('seating')
      .select('table_number')
      .eq('is_family', isFamily)
      .order('table_number', { ascending: false })
      .limit(1);

    if (catErr) {
      console.error('[sync/guests] category lookup error:', catErr);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    let tableNumber = startingTable;
    if (categoryGuests && categoryGuests.length > 0) {
      const lastTable = categoryGuests[0].table_number;
      const { count, error: countErr } = await db
        .from('seating')
        .select('id', { count: 'exact', head: true })
        .eq('is_family', isFamily)
        .eq('table_number', lastTable);

      if (countErr) {
        console.error('[sync/guests] count error:', countErr);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
      }

      tableNumber = (count ?? 0) >= GUESTS_PER_TABLE ? lastTable + 1 : lastTable;
    }

    const { data: inserted, error: insertErr } = await db
      .from('seating')
      .insert({ first_name: firstName, last_name: lastName, email, phone, table_number: tableNumber, message, is_family: isFamily })
      .select('id')
      .single();

    if (insertErr) {
      console.error('[sync/guests] insert error:', insertErr);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ inserted: true, id: inserted.id, table_number: tableNumber });
  } catch (err) {
    console.error('[sync/guests] Unexpected error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
