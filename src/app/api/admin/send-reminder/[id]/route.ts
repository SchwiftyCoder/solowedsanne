import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import { sendBulkSms } from '@/lib/twilio';
import { reminderMessage } from '@/lib/wedding-details';

type Props = { params: Promise<{ id: string }> };

export async function POST(_req: Request, { params }: Props) {
  const { id } = await params;

  try {
    const db = createServiceClient();
    const { data: guest, error } = await db
      .from('seating')
      .select('id, first_name, phone')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('[admin/send-reminder/:id] DB error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
    if (!guest) {
      return NextResponse.json({ error: 'Guest not found' }, { status: 404 });
    }

    const [result] = await sendBulkSms([
      { to: guest.phone, body: reminderMessage(guest.first_name, guest.id) },
    ]);

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to send' }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[admin/send-reminder/:id] Unexpected error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
