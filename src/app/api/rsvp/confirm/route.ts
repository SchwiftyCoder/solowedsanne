import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Web-based alternative to the SMS YES/NO reply flow. Since the guest is
// identified precisely here (by id, from the same lookup used elsewhere on
// the site), this only ever updates that one guest - unlike the SMS webhook,
// which can't tell which of two people sharing a phone number replied.
export async function POST(req: Request) {
  try {
    const { id, status } = await req.json();

    if (typeof id !== 'string' || !id) {
      return NextResponse.json({ error: 'Missing guest id' }, { status: 400 });
    }
    if (status !== 'yes' && status !== 'no') {
      return NextResponse.json({ error: 'Status must be yes or no' }, { status: 400 });
    }

    const sql = db();
    const rows = (await sql`
      UPDATE seating SET rsvp_status = ${status} WHERE id = ${id} RETURNING first_name, last_name
    `) as { first_name: string; last_name: string }[];

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Guest not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, name: `${rows[0].first_name} ${rows[0].last_name}` });
  } catch (err) {
    console.error('[rsvp/confirm] Unexpected error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
