import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import { sendBulkSms } from '@/lib/twilio';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const db = createServiceClient();
    const { data: guests, error } = await db.from('seating').select('id, first_name, phone');

    if (error) {
      console.error('[admin/send-custom] DB error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!guests || guests.length === 0) {
      return NextResponse.json({ error: 'No guests found' }, { status: 400 });
    }

    const trimmed = message.trim();
    const recipients = guests.map((g) => ({ to: g.phone, body: `Hi ${g.first_name}! ${trimmed}` }));
    const results = await sendBulkSms(recipients);
    const failed = results.filter((r) => !r.success);

    return NextResponse.json({
      total: results.length,
      sent: results.length - failed.length,
      failed: failed.length,
      errors: failed,
    });
  } catch (err) {
    console.error('[admin/send-custom] Unexpected error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
