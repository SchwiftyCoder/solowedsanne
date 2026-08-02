import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const sql = db();
    const guests = (await sql`
      SELECT id, first_name, last_name, phone, rsvp_status FROM seating ORDER BY first_name, last_name
    `) as { id: string; first_name: string; last_name: string; phone: string; rsvp_status: string }[];

    const yesCount = guests.filter((g) => g.rsvp_status === 'yes').length;
    return NextResponse.json({ count: guests.length, yesCount, guests });
  } catch (err) {
    console.error('[admin/guests] Unexpected error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
