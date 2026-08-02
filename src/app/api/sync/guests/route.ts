import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { normalizePhone } from '@/lib/phone';

// Called by a Google Apps Script trigger bound to each RSVP form's response
// sheet, once per new form submission. Inserts brand-new guests (table_number
// starts as 'TBA' - real seating hasn't been assigned yet) and, for guests who
// already exist (same first/last name + phone), only refreshes their
// email/message - table number and family flag are never touched here, so
// manual edits in the database never get clobbered by a late RSVP trickling in.

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

    if (!firstName && !lastName) {
      return NextResponse.json({ error: 'Missing name' }, { status: 400 });
    }

    if (body.attending && !/^Yes/i.test(String(body.attending))) {
      return NextResponse.json({ skipped: true, reason: 'Not attending' });
    }

    const phone = normalizePhone(String(body.phone || ''));
    const email = String(body.email || '').trim().toLowerCase();
    const message = String(body.message || '').trim();

    const sql = db();

    const existingRows = (await sql`
      SELECT id FROM seating WHERE first_name = ${firstName} AND last_name = ${lastName} AND phone = ${phone}
    `) as { id: string }[];

    if (existingRows.length > 0) {
      const id = existingRows[0].id;
      await sql`UPDATE seating SET email = ${email}, message = ${message} WHERE id = ${id}`;
      return NextResponse.json({ updated: true, id });
    }

    const insertedRows = (await sql`
      INSERT INTO seating (first_name, last_name, email, phone, message, is_family)
      VALUES (${firstName}, ${lastName}, ${email}, ${phone}, ${message}, ${isFamily})
      RETURNING id
    `) as { id: string }[];

    return NextResponse.json({ inserted: true, id: insertedRows[0].id });
  } catch (err) {
    console.error('[sync/guests] Unexpected error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
