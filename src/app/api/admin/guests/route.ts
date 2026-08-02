import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export async function GET() {
  try {
    const db = createServiceClient();
    const { data, error } = await db.from('seating').select('id, table_number');

    if (error) {
      console.error('[admin/guests] DB error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    const tableCount = new Set((data ?? []).map((g) => g.table_number)).size;
    return NextResponse.json({ count: data?.length ?? 0, tableCount });
  } catch (err) {
    console.error('[admin/guests] Unexpected error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
