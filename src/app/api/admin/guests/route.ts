import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const sql = db();
    const guests = (await sql`
      SELECT id, first_name, last_name, phone, table_number FROM seating ORDER BY first_name, last_name
    `) as { id: string; first_name: string; last_name: string; phone: string; table_number: string }[];

    return NextResponse.json({ count: guests.length, guests });
  } catch (err) {
    console.error('[admin/guests] Unexpected error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
