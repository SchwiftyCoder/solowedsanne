import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export async function GET() {
  try {
    const db = createServiceClient();
    const { data, error } = await db
      .from('seating')
      .select('id, first_name, last_name, email, phone, table_number, message, is_family')
      .order('table_number', { ascending: true });

    if (error) {
      console.error('[admin/guests] DB error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ count: data?.length ?? 0, guests: data ?? [] });
  } catch (err) {
    console.error('[admin/guests] Unexpected error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
