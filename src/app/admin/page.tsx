'use client';

import { useEffect, useState } from 'react';
import { WEDDING_DETAILS } from '@/lib/wedding-details';

type Guest = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  table_number: number;
  message: string;
  is_family: boolean | null;
};

type SmsResult = { total: number; sent: number; failed: number; errors: { to: string; error?: string }[] };
type SendKind = 'reminder' | 'thankyou';
type CustomStep = 'compose' | 'preview';

export default function AdminPage() {
  const [guests, setGuests] = useState<Guest[] | null>(null);
  const [sending, setSending] = useState<SendKind | null>(null);
  const [result, setResult] = useState<Record<SendKind, SmsResult | null>>({ reminder: null, thankyou: null });
  const [loadError, setLoadError] = useState('');
  const [rowStatus, setRowStatus] = useState<Record<string, 'sending' | 'sent' | 'error'>>({});

  const [customStep, setCustomStep] = useState<CustomStep>('compose');
  const [customMessage, setCustomMessage] = useState('');
  const [customSending, setCustomSending] = useState(false);
  const [customResult, setCustomResult] = useState<SmsResult | null>(null);

  useEffect(() => {
    loadGuests();
  }, []);

  function loadGuests() {
    fetch('/api/admin/guests')
      .then((res) => res.json())
      .then((data) => {
        if (data.error) { setLoadError(data.error); return; }
        setGuests(data.guests ?? []);
      })
      .catch(() => setLoadError('Could not load guest list.'));
  }

  async function handleSend(kind: SendKind) {
    const label = kind === 'reminder' ? 'wedding reminder' : 'thank-you message';
    const confirmed = window.confirm(
      `Send the ${label} by SMS to all ${guests?.length ?? '?'} guests? This cannot be undone.`
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

  async function handleSendOne(guest: Guest) {
    const confirmed = window.confirm(`Send the wedding reminder by SMS to ${guest.first_name} ${guest.last_name}?`);
    if (!confirmed) return;

    setRowStatus((prev) => ({ ...prev, [guest.id]: 'sending' }));
    try {
      const res = await fetch(`/api/admin/send-reminder/${guest.id}`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Something went wrong.');
        setRowStatus((prev) => ({ ...prev, [guest.id]: 'error' }));
        return;
      }
      setRowStatus((prev) => ({ ...prev, [guest.id]: 'sent' }));
    } catch {
      setRowStatus((prev) => ({ ...prev, [guest.id]: 'error' }));
    }
  }

  async function handleSendCustom() {
    const confirmed = window.confirm(
      `Final check: send this exact message by SMS to all ${guests?.length ?? '?'} guests right now? This cannot be undone.`
    );
    if (!confirmed) return;

    setCustomSending(true);
    try {
      const res = await fetch('/api/admin/send-custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: customMessage }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Something went wrong.');
        setCustomSending(false);
        return;
      }
      setCustomResult(data);
      setCustomStep('compose');
      setCustomMessage('');
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setCustomSending(false);
    }
  }

  const tableCount = guests ? new Set(guests.map((g) => g.table_number)).size : 0;

  return (
    <main className="min-h-screen px-4 py-12" style={{ background: '#FDFAF5' }}>
      <div className="w-full max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-xs tracking-[0.35em] uppercase mb-2" style={{ color: '#B8860B' }}>
            Admin
          </p>
          <h1 className="font-serif text-2xl" style={{ color: '#2C2C2C' }}>
            Solomon &amp; Anne&apos;s Wedding
          </h1>
        </div>

        {/* Wedding info card */}
        <div className="rounded-2xl shadow-sm px-6 py-5 border mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm"
          style={{ background: '#fff', borderColor: '#e8dfc8', color: '#2C2C2C' }}>
          <InfoStat label="Guests" value={loadError ? '—' : guests === null ? '…' : String(guests.length)} />
          <InfoStat label="Tables" value={loadError ? '—' : guests === null ? '…' : String(tableCount)} />
          <InfoStat label="Date" value={WEDDING_DETAILS.dateText.replace(/^\w+, /, '')} />
          <InfoStat label="Dress Code" value={WEDDING_DETAILS.dressCode} />
          <div className="col-span-2 sm:col-span-4 text-xs pt-2 border-t" style={{ borderColor: '#f0e8d4', opacity: 0.7 }}>
            {WEDDING_DETAILS.timeText} &middot; {WEDDING_DETAILS.venueName}, {WEDDING_DETAILS.venueAddress}
          </div>
        </div>

        <div className="space-y-6 mb-8">
          <AdminAction
            title="Send Wedding Reminder"
            description="Texts every guest the date, time, venue, dress code, and their personal table link."
            buttonLabel="Send Reminder to All"
            busy={sending === 'reminder'}
            disabled={sending !== null || !guests?.length}
            onClick={() => handleSend('reminder')}
            result={result.reminder}
          />

          <AdminAction
            title="Send Thank You Message"
            description="Texts every guest a thank-you note with the photo album link. Send this after the wedding."
            buttonLabel="Send Thank You to All"
            busy={sending === 'thankyou'}
            disabled={sending !== null || !guests?.length}
            onClick={() => handleSend('thankyou')}
            result={result.thankyou}
          />

          {/* Custom message - multi-step to avoid accidental sends */}
          <div className="rounded-2xl shadow-sm px-6 py-6 border" style={{ background: '#fff', borderColor: '#e8dfc8' }}>
            <h2 className="font-serif text-lg mb-1" style={{ color: '#2C2C2C' }}>Send Custom Message</h2>
            <p className="text-sm mb-4" style={{ color: '#2C2C2C', opacity: 0.6 }}>
              Write your own SMS to text every guest. You&apos;ll preview the exact text before anything sends.
            </p>

            {customStep === 'compose' ? (
              <>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Type your message to all guests..."
                  rows={4}
                  className="w-full rounded-lg px-4 py-3 text-sm outline-none border resize-none"
                  style={{ borderColor: '#d6cbb0', color: '#2C2C2C' }}
                />
                <button
                  onClick={() => setCustomStep('preview')}
                  disabled={!customMessage.trim()}
                  className="w-full mt-4 rounded-lg py-3 text-sm tracking-widest uppercase text-white transition disabled:opacity-40"
                  style={{ background: '#B8860B' }}
                >
                  Preview Message
                </button>
              </>
            ) : (
              <>
                <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#B8860B' }}>
                  Exact text to be sent to all {guests?.length ?? '?'} guests
                </p>
                <div
                  className="rounded-lg px-4 py-3 text-sm border whitespace-pre-wrap mb-4"
                  style={{ borderColor: '#d6cbb0', color: '#2C2C2C', background: '#FDFAF5' }}
                >
                  {customMessage}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setCustomStep('compose')}
                    disabled={customSending}
                    className="flex-1 rounded-lg py-3 text-sm tracking-widest uppercase transition border disabled:opacity-50"
                    style={{ borderColor: '#B8860B', color: '#B8860B' }}
                  >
                    Back to Edit
                  </button>
                  <button
                    onClick={handleSendCustom}
                    disabled={customSending}
                    className="flex-1 rounded-lg py-3 text-sm tracking-widest uppercase text-white transition disabled:opacity-60"
                    style={{ background: '#B00020' }}
                  >
                    {customSending ? 'Sending…' : `Send to ${guests?.length ?? '?'} Guests`}
                  </button>
                </div>
              </>
            )}

            {customResult && (
              <div className="mt-4 text-sm" style={{ color: '#2C2C2C' }}>
                <p>
                  Sent <strong>{customResult.sent}</strong> of {customResult.total}
                  {customResult.failed > 0 && <span style={{ color: '#B00020' }}> — {customResult.failed} failed</span>}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Live guest list */}
        <div className="rounded-2xl shadow-sm border overflow-hidden" style={{ background: '#fff', borderColor: '#e8dfc8' }}>
          <div className="px-6 py-4 flex items-center justify-between border-b" style={{ borderColor: '#f0e8d4' }}>
            <h2 className="font-serif text-lg" style={{ color: '#2C2C2C' }}>Guest List</h2>
            <button onClick={loadGuests} className="text-xs underline" style={{ color: '#B8860B' }}>
              Refresh
            </button>
          </div>

          {loadError ? (
            <p className="px-6 py-6 text-sm" style={{ color: '#B00020' }}>{loadError}</p>
          ) : guests === null ? (
            <p className="px-6 py-6 text-sm" style={{ color: '#2C2C2C', opacity: 0.6 }}>Loading guest list…</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left uppercase text-xs tracking-wide" style={{ color: '#B8860B' }}>
                    <th className="px-6 py-2">Guest</th>
                    <th className="px-4 py-2">Phone</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Table</th>
                    <th className="px-4 py-2">Family</th>
                    <th className="px-4 py-2">Message</th>
                    <th className="px-6 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {guests.map((g) => {
                    const status = rowStatus[g.id];
                    return (
                      <tr key={g.id} className="border-t" style={{ borderColor: '#f5efdc', color: '#2C2C2C' }}>
                        <td className="px-6 py-2">{g.first_name} {g.last_name}</td>
                        <td className="px-4 py-2" style={{ opacity: 0.75 }}>{g.phone}</td>
                        <td className="px-4 py-2" style={{ opacity: 0.75 }}>{g.email || '—'}</td>
                        <td className="px-4 py-2">{g.table_number}</td>
                        <td className="px-4 py-2" style={{ opacity: 0.75 }}>
                          {g.is_family === null ? '—' : g.is_family ? 'Yes' : 'No'}
                        </td>
                        <td className="px-4 py-2 max-w-[180px] truncate" style={{ opacity: 0.75 }} title={g.message}>
                          {g.message || '—'}
                        </td>
                        <td className="px-6 py-2 text-right">
                          <button
                            onClick={() => handleSendOne(g)}
                            disabled={status === 'sending'}
                            className="text-xs px-3 py-1.5 rounded-md border transition disabled:opacity-50"
                            style={{ borderColor: '#B8860B', color: status === 'sent' ? '#1B5E20' : '#B8860B' }}
                          >
                            {status === 'sending' ? 'Sending…' : status === 'sent' ? 'Sent ✓' : status === 'error' ? 'Retry' : 'Send Reminder'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
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
