'use client';

import { useEffect, useState } from 'react';

type SmsResult = { total: number; sent: number; failed: number; errors: { to: string; error?: string }[] };
type SendKind = 'reminder' | 'thankyou';

export default function AdminPage() {
  const [guestCount, setGuestCount] = useState<number | null>(null);
  const [sending, setSending] = useState<SendKind | null>(null);
  const [result, setResult] = useState<Record<SendKind, SmsResult | null>>({ reminder: null, thankyou: null });
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    fetch('/api/admin/guests')
      .then((res) => res.json())
      .then((data) => {
        if (data.error) { setLoadError(data.error); return; }
        setGuestCount(data.count);
      })
      .catch(() => setLoadError('Could not load guest list.'));
  }, []);

  async function handleSend(kind: SendKind) {
    const label = kind === 'reminder' ? 'wedding reminder' : 'thank-you message';
    const confirmed = window.confirm(
      `Send the ${label} by SMS to all ${guestCount ?? '?'} guests? This cannot be undone.`
    );
    if (!confirmed) return;

    setSending(kind);
    try {
      const res = await fetch(`/api/admin/send-${kind}`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Something went wrong.');
        setSending(null);
        return;
      }
      setResult((prev) => ({ ...prev, [kind]: data }));
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setSending(null);
    }
  }

  return (
    <main className="min-h-screen px-4 py-12" style={{ background: '#FDFAF5' }}>
      <div className="w-full max-w-lg mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.35em] uppercase mb-2" style={{ color: '#B8860B' }}>
            Admin
          </p>
          <h1 className="font-serif text-2xl" style={{ color: '#2C2C2C' }}>
            Solomon &amp; Anne&apos;s Wedding
          </h1>
          <p className="text-sm mt-2" style={{ color: '#2C2C2C', opacity: 0.6 }}>
            {loadError ? loadError : guestCount === null ? 'Loading guest list…' : `${guestCount} guests loaded`}
          </p>
        </div>

        <div className="space-y-6">
          <AdminAction
            title="Send Wedding Reminder"
            description="Texts every guest the date, time, venue, dress code, and their personal table link."
            buttonLabel="Send Reminder"
            busy={sending === 'reminder'}
            disabled={sending !== null || !guestCount}
            onClick={() => handleSend('reminder')}
            result={result.reminder}
          />

          <AdminAction
            title="Send Thank You Message"
            description="Texts every guest a thank-you note with the photo album link. Send this after the wedding."
            buttonLabel="Send Thank You"
            busy={sending === 'thankyou'}
            disabled={sending !== null || !guestCount}
            onClick={() => handleSend('thankyou')}
            result={result.thankyou}
          />
        </div>
      </div>
    </main>
  );
}

function AdminAction({
  title,
  description,
  buttonLabel,
  busy,
  disabled,
  onClick,
  result,
}: {
  title: string;
  description: string;
  buttonLabel: string;
  busy: boolean;
  disabled: boolean;
  onClick: () => void;
  result: SmsResult | null;
}) {
  return (
    <div className="rounded-2xl shadow-sm px-6 py-6 border" style={{ background: '#fff', borderColor: '#e8dfc8' }}>
      <h2 className="font-serif text-lg mb-1" style={{ color: '#2C2C2C' }}>{title}</h2>
      <p className="text-sm mb-4" style={{ color: '#2C2C2C', opacity: 0.6 }}>{description}</p>

      <button
        onClick={onClick}
        disabled={disabled}
        className="w-full rounded-lg py-3 text-sm tracking-widest uppercase text-white transition disabled:opacity-60"
        style={{ background: '#B8860B' }}
      >
        {busy ? 'Sending…' : buttonLabel}
      </button>

      {result && (
        <div className="mt-4 text-sm" style={{ color: '#2C2C2C' }}>
          <p>
            Sent <strong>{result.sent}</strong> of {result.total}
            {result.failed > 0 && <span style={{ color: '#B00020' }}> — {result.failed} failed</span>}
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
