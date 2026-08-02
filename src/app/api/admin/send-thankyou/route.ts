import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendBulkSms } from '@/lib/twilio';
import { isThankYouAvailable, thankYouAvailableAt } from '@/lib/wedding-details';
import { isUSNumber } from '@/lib/phone';

export async function POST(req: Request) {
  if (!isThankYouAvailable()) {
    return NextResponse.json(
      { error: `Thank-you messages can't be sent until ${thankYouAvailableAt().toLocaleDateString()}.` },
      { status: 403 }
    );
  }

  try {
    const { message } = await req.json();

    if (typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const sql = db();
    const guests = (await sql`SELECT id, first_name, phone FROM seating`) as { id: string; first_name: string; phone: string }[];

    if (guests.length === 0) {
      return NextResponse.json({ error: 'No guests found' }, { status: 400 });
    }

    const usGuests = guests.filter((g) => isUSNumber(g.phone));
    const skipped = guests.length - usGuests.length;

    const trimmed = message.trim();
    const recipients = usGuests.map((g) => ({ to: g.phone, body: `Hi ${g.first_name}! ${trimmed}` }));

    const results = await sendBulkSms(recipients);
    const failed = results.filter((r) => !r.success);

    return NextResponse.json({
      total: results.length,
      sent: results.length - failed.length,
      failed: failed.length,
      skipped,
      errors: failed,
    });
  } catch (err) {
    console.error('[admin/send-thankyou] Unexpected error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
