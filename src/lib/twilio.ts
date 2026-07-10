import twilio from 'twilio';

// Factory function so the client is never instantiated at module evaluation
// time (which happens during Next.js build with placeholder env vars).
export function createSmsClient() {
  return twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);
}

export type SmsResult = { to: string; success: boolean; error?: string };

export async function sendBulkSms(
  recipients: { to: string; body: string }[],
  concurrency = 5
): Promise<SmsResult[]> {
  const client = createSmsClient();
  const from = process.env.TWILIO_PHONE_NUMBER!;
  const results: SmsResult[] = [];

  for (let i = 0; i < recipients.length; i += concurrency) {
    const batch = recipients.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map(async (r): Promise<SmsResult> => {
        try {
          await client.messages.create({ to: r.to, from, body: r.body });
          return { to: r.to, success: true };
        } catch (err) {
          return { to: r.to, success: false, error: err instanceof Error ? err.message : 'Unknown error' };
        }
      })
    );
    results.push(...batchResults);
  }

  return results;
}
