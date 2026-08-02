'use client';

import { useEffect, useState } from 'react';
import { WEDDING_DETAILS, isThankYouAvailable, thankYouAvailableAt, defaultReminderText, defaultThankYouText } from '@/lib/wedding-details';

type SmsResult = { total: number; sent: number; failed: number; skipped?: number; errors: { to: string; error?: string }[] };
type Step = 'compose' | 'preview';

export default function AdminPage() {
  const [guestCount, setGuestCount] = useState<number | null>(null);
  const [tableCount, setTableCount] = useState<number | null>(null);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    fetch('/api/admin/guests')
      .then((res) => res.json())
      .then((data) => {
        if (data.error) { setLoadError(data.error); return; }
        setGuestCount(data.count);
        setTableCount(data.tableCount);
      })
      .catch(() => setLoadError('Could not load guest count.'));
  }, []);

  return (
    <main className="min-h-screen px-4 py-12" style={{ background: '#FDFAF5' }}>
      <div className="w-full max-w-lg mx-auto">
        <div className="text-center mb-8">
          <p className="text-xs tracking-[0.35em] uppercase mb-2" style={{ color: '#B8860B' }}>
            Admin
          </p>
          <h1 className="font-serif text-2xl" style={{ color: '#2C2C2C' }}>
            Solomon &amp; Anne&apos;s Wedding
          </h1>
        </div>

        {/* Wedding info card */}
        <div className="rounded-2xl shadow-sm px-6 py-5 border mb-6 grid grid-cols-2 gap-4 text-sm"
          style={{ background: '#fff', borderColor: '#e8dfc8', color: '#2C2C2C' }}>
          <InfoStat label="Tables" value={loadError ? '—' : tableCount === null ? '…' : String(tableCount)} />
          <InfoStat label="Date" value={WEDDING_DETAILS.dateText.replace(/^\w+, /, '')} />
          <div className="col-span-2 text-xs pt-2 border-t" style={{ borderColor: '#f0e8d4', opacity: 0.7 }}>
            {WEDDING_DETAILS.timeText} &middot; {WEDDING_DETAILS.venueName}, {WEDDING_DETAILS.venueAddress}
          </div>
        </div>

        <div className="space-y-6">
          <MessageComposer
            title="Send Reminder"
            description="Texts every guest a reminder you write. Personalized with each guest's name."
            endpoint="/api/admin/send-custom"
            defaultText={defaultReminderText()}
            guestCount={guestCount}
            locked={false}
          />

          <MessageComposer
            title="Send Thank You"
            description={
              isThankYouAvailable()
                ? "Texts every guest a thank-you note you write. Personalized with each guest's name."
                : `Unlocks ${thankYouAvailableAt().toLocaleDateString()} (one month after the wedding).`
            }
            endpoint="/api/admin/send-thankyou"
            defaultText={defaultThankYouText()}
            guestCount={guestCount}
            locked={!isThankYouAvailable()}
          />

          <SingleNumberComposer />
        </div>
      </div>
    </main>
  );
}

function InfoStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide" style={{ color: '#B8860B' }}>{label}</p>
      <p className="font-serif text-lg">{value}</p>
    </div>
  );
}

function MessageComposer({
  title,
  description,
  endpoint,
  defaultText,
  guestCount,
  locked,
}: {
  title: string;
  description: string;
  endpoint: string;
  defaultText: string;
  guestCount: number | null;
  locked: boolean;
}) {
  const [step, setStep] = useState<Step>('compose');
  const [message, setMessage] = useState(defaultText);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<SmsResult | null>(null);

  async function handleSend() {
    const confirmed = window.confirm(
      `Final check: send this exact message by SMS to all ${guestCount ?? '?'} guests right now? This cannot be undone.`
    );
    if (!confirmed) return;

    setSending(true);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Something went wrong.');
        setSending(false);
        return;
      }
      setResult(data);
      setStep('compose');
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="rounded-2xl shadow-sm px-6 py-6 border" style={{ background: '#fff', borderColor: '#e8dfc8' }}>
      <h2 className="font-serif text-lg mb-1" style={{ color: '#2C2C2C' }}>{title}</h2>
      <p className="text-sm mb-4" style={{ color: '#2C2C2C', opacity: 0.6 }}>{description}</p>

      {locked ? (
        <div className="rounded-lg px-4 py-3 text-sm text-center" style={{ background: '#FDFAF5', color: '#2C2C2C', opacity: 0.6 }}>
          Locked until the unlock date above.
        </div>
      ) : step === 'compose' ? (
        <>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message to all guests..."
            rows={4}
            className="w-full rounded-lg px-4 py-3 text-sm outline-none border resize-none"
            style={{ borderColor: '#d6cbb0', color: '#2C2C2C' }}
          />
          <button
            onClick={() => setStep('preview')}
            disabled={!message.trim()}
            className="w-full mt-4 rounded-lg py-3 text-sm tracking-widest uppercase text-white transition disabled:opacity-40"
            style={{ background: '#B8860B' }}
          >
            Preview Message
          </button>
        </>
      ) : (
        <>
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#B8860B' }}>
            Example text (name is swapped in per guest) - going to all {guestCount ?? '?'} guests
          </p>
          <div
            className="rounded-lg px-4 py-3 text-sm border whitespace-pre-wrap mb-4"
            style={{ borderColor: '#d6cbb0', color: '#2C2C2C', background: '#FDFAF5' }}
          >
            Hi Guest! {message}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setStep('compose')}
              disabled={sending}
              className="flex-1 rounded-lg py-3 text-sm tracking-widest uppercase transition border disabled:opacity-50"
              style={{ borderColor: '#B8860B', color: '#B8860B' }}
            >
              Back to Edit
            </button>
            <button
              onClick={handleSend}
              disabled={sending}
              className="flex-1 rounded-lg py-3 text-sm tracking-widest uppercase text-white transition disabled:opacity-60"
              style={{ background: '#B00020' }}
            >
              {sending ? 'Sending…' : `Send to ${guestCount ?? '?'} Guests`}
            </button>
          </div>
        </>
      )}

      {result && (
        <div className="mt-4 text-sm" style={{ color: '#2C2C2C' }}>
          <p>
            Sent <strong>{result.sent}</strong> of {result.total}
            {result.failed > 0 && <span style={{ color: '#B00020' }}> — {result.failed} failed</span>}
            {!!result.skipped && <span style={{ opacity: 0.7 }}> — {result.skipped} skipped (non-US number)</span>}
          </p>
          {result.failed > 0 && (
            <ul className="mt-2 text-xs space-y-1" style={{ opacity: 0.7 }}>
              {result.errors.slice(0, 10).map((e, i) => (
                <li key={i}>{e.to}: {e.error}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function SingleNumberComposer() {
  const [step, setStep] = useState<Step>('compose');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; error?: string } | null>(null);

  async function handleSend() {
    const confirmed = window.confirm(`Final check: send this exact message to ${phone} right now?`);
    if (!confirmed) return;

    setSending(true);
    setResult(null);
    try {
      const res = await fetch('/api/admin/send-single', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult({ error: data.error || 'Something went wrong.' });
        return;
      }
      setResult({ success: true });
      setStep('compose');
      setMessage('');
    } catch {
      setResult({ error: 'Something went wrong. Please try again.' });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="rounded-2xl shadow-sm px-6 py-6 border" style={{ background: '#fff', borderColor: '#e8dfc8' }}>
      <h2 className="font-serif text-lg mb-1" style={{ color: '#2C2C2C' }}>Test</h2>
      <p className="text-sm mb-4" style={{ color: '#2C2C2C', opacity: 0.6 }}>
        Send a one-off text to any US phone number, not tied to a guest record.
      </p>

      {step === 'compose' ? (
        <>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number, e.g. (555) 123-4567"
            className="w-full rounded-lg px-4 py-3 text-sm outline-none border mb-3"
            style={{ borderColor: '#d6cbb0', color: '#2C2C2C' }}
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            rows={3}
            className="w-full rounded-lg px-4 py-3 text-sm outline-none border resize-none"
            style={{ borderColor: '#d6cbb0', color: '#2C2C2C' }}
          />
          <button
            onClick={() => setStep('preview')}
            disabled={!phone.trim() || !message.trim()}
            className="w-full mt-4 rounded-lg py-3 text-sm tracking-widest uppercase text-white transition disabled:opacity-40"
            style={{ background: '#B8860B' }}
          >
            Preview Message
          </button>
        </>
      ) : (
        <>
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#B8860B' }}>
            Exact text to be sent to {phone}
          </p>
          <div
            className="rounded-lg px-4 py-3 text-sm border whitespace-pre-wrap mb-4"
            style={{ borderColor: '#d6cbb0', color: '#2C2C2C', background: '#FDFAF5' }}
          >
            {message}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setStep('compose')}
              disabled={sending}
              className="flex-1 rounded-lg py-3 text-sm tracking-widest uppercase transition border disabled:opacity-50"
              style={{ borderColor: '#B8860B', color: '#B8860B' }}
            >
              Back to Edit
            </button>
            <button
              onClick={handleSend}
              disabled={sending}
              className="flex-1 rounded-lg py-3 text-sm tracking-widest uppercase text-white transition disabled:opacity-60"
              style={{ background: '#B00020' }}
            >
              {sending ? 'Sending…' : 'Send'}
            </button>
          </div>
        </>
      )}

      {result && (
        <p className="mt-4 text-sm" style={{ color: result.error ? '#B00020' : '#1B5E20' }}>
          {result.error || 'Sent successfully.'}
        </p>
      )}
    </div>
  );
}
