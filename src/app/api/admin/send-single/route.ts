import { NextResponse } from 'next/server';
import { sendBulkSms } from '@/lib/twilio';
import { normalizePhone, isUSNumber } from '@/lib/phone';

export async function POST(req: Request) {
  try {
    const { phone, message } = await req.json();

    if (typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }
    if (typeof phone !== 'string' || !phone.trim()) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    const to = normalizePhone(phone);
    if (!isUSNumber(to)) {
      return NextResponse.json({ error: 'Only US phone numbers are supported.' }, { status: 400 });
    }

    const [result] = await sendBulkSms([{ to, body: message.trim() }]);

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to send' }, { status: 502 });
    }

    return NextResponse.json({ success: true, to });
  } catch (err) {
    console.error('[admin/send-single] Unexpected error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
