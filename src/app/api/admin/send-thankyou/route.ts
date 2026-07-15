import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import { sendBulkSms } from '@/lib/twilio';
import { WEDDING_DETAILS, isThankYouAvailable, thankYouAvailableAt } from '@/lib/wedding-details';

export async function POST() {
  if (!isThankYouAvailable()) {
    return NextResponse.json(
      { error: `Thank-you messages can't be sent until ${thankYouAvailableAt().toLocaleDateString()}.` },
      { status: 403 }
    );
  }

  try {
    const db = createServiceClient();
    const { data: guests, error } = await db.from('seating').select('id, first_name, phone');

    if (error) {
      console.error('[admin/send-thankyou] DB error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!guests || guests.length === 0) {
      return NextResponse.json({ error: 'No guests found' }, { status: 400 });
    }

    const recipients = guests.map((g) => ({
      to: g.phone,
      body:
        `Hi ${g.first_name}! Thank you so much for celebrating with ${WEDDING_DETAILS.coupleNames} on our wedding day — ` +
        `it meant the world to have you there. Relive the day and add your own photos here: ${WEDDING_DETAILS.photosUrl}`,
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
    console.error('[admin/send-thankyou] Unexpected error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
