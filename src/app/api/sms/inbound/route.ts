import twilio from 'twilio';
import { db } from '@/lib/db';
import { normalizePhone } from '@/lib/phone';

// The URL to configure in the Twilio Console under your phone number's
// Messaging settings ("A message comes in" webhook), so guest replies to
// the reminder text ("Reply YES or NO to RSVP!") land here automatically.
function xmlResponse(message: string) {
  const twiml = new twilio.twiml.MessagingResponse();
  twiml.message(message);
  return new Response(twiml.toString(), { headers: { 'Content-Type': 'text/xml' } });
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const params: Record<string, string> = {};
  formData.forEach((value, key) => { params[key] = String(value); });

  const signature = req.headers.get('x-twilio-signature') || '';
  const url = `${(process.env.SITE_URL ?? '').replace(/\/$/, '')}/api/sms/inbound`;
  const isValid = twilio.validateRequest(process.env.TWILIO_AUTH_TOKEN!, signature, url, params);

  if (!isValid) {
    return new Response('Forbidden', { status: 403 });
  }

  const from = normalizePhone(params.From || '');
  const body = (params.Body || '').trim().toLowerCase();

  let status: 'yes' | 'no' | null = null;
  if (body.startsWith('y')) status = 'yes';
  else if (body.startsWith('n')) status = 'no';

  if (!status) {
    return xmlResponse('Sorry, we didn’t catch that. Please reply with just YES or NO to RSVP.');
  }

  try {
    const sql = db();
    const updated = (await sql`
      UPDATE seating SET rsvp_status = ${status} WHERE phone = ${from} RETURNING first_name
    `) as { first_name: string }[];

    if (updated.length === 0) {
      return xmlResponse('Thanks for your reply, but we couldn’t find your invitation. Please contact Solomon & Anne directly.');
    }

    const names = updated.map((g) => g.first_name).join(' & ');
    return xmlResponse(
      status === 'yes'
        ? `Thanks, ${names}! We've got you down as attending. Can't wait to celebrate with you!`
        : `Thanks for letting us know, ${names}. We're sorry you can't make it - we'll miss you!`
    );
  } catch (err) {
    console.error('[sms/inbound] Unexpected error:', err);
    return xmlResponse('Thanks for your reply - something went wrong on our end recording it, please contact the couple directly.');
  }
}
