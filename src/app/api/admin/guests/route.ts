import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const sql = db();
    const data = (await sql`SELECT id, table_number FROM seating`) as { id: string; table_number: number }[];

    const tableCount = new Set(data.map((g) => g.table_number)).size;
    return NextResponse.json({ count: data.length, tableCount });
  } catch (err) {
    console.error('[admin/guests] Unexpected error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
