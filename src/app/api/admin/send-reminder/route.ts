import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import { sendBulkSms } from '@/lib/twilio';
import { WEDDING_DETAILS, welcomeUrl } from '@/lib/wedding-details';

export async function POST() {
  try {
    const db = createServiceClient();
    const { data: guests, error } = await db.from('seating').select('id, first_name, phone');

    if (error) {
      console.error('[admin/send-reminder] DB error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!guests || guests.length === 0) {
      return NextResponse.json({ error: 'No guests found' }, { status: 400 });
    }

    const recipients = guests.map((g) => ({
      to: g.phone,
      body:
        `Hi ${g.first_name}! Reminder for ${WEDDING_DETAILS.coupleNames}'s wedding: ` +
        `${WEDDING_DETAILS.dateText} at ${WEDDING_DETAILS.timeText}, ${WEDDING_DETAILS.venueName}, ${WEDDING_DETAILS.venueAddress}. ` +
        `Dress code: ${WEDDING_DETAILS.dressCode}. Find your table: ${welcomeUrl(g.id)}`,
    }));

    const results = await sendBulkSms(recipients);
    const failed = results.filter((r) => !r.success);

    return NextResponse.json({
      total: results.length,
      sent: results.length - failed.length,
      failed: failed.length,
      errors: failed,
    });
  } catch (err) {
    console.error('[admin/send-reminder] Unexpected error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
