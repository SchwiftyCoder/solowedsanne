import twilio from 'twilio';

export async function sendRsvpSms(to: string, firstName: string, token: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const rsvpUrl = `${siteUrl}/rsvp/${token}`;

  try {
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    await client.messages.create({
      body: `Hi ${firstName}! Your RSVP is confirmed. View or update your RSVP anytime at: ${rsvpUrl}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
  } catch (err) {
    // SMS failure must not block RSVP creation
    console.error('[Twilio] SMS send failed:', err);
  }
}
