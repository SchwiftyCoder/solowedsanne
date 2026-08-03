'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AmpersandEmblem, BotanicalLeaf } from '@/components/WeddingMotifs';
import { WEDDING_DATE } from '@/lib/wedding-details';

type Match = { id: string; name: string };
type Guest = { id: string; name: string };
type Status = 'yes' | 'no';

function getTimeLeft() {
  const diff = Math.max(0, WEDDING_DATE.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function CountdownTimer() {
  // Starts null so the server-rendered markup and the client's first render
  // match exactly - the real countdown only ever runs client-side, after mount.
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft> | null>(null);

  useEffect(() => {
    setTimeLeft(getTimeLeft());
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      {([
        ['Days', timeLeft?.days],
        ['Hours', timeLeft?.hours],
        ['Min', timeLeft?.minutes],
        ['Sec', timeLeft?.seconds],
      ] as const).map(([label, value]) => (
        <div key={label} className="text-center">
          <p className="font-serif text-2xl" style={{ color: '#1B5E20' }}>{value ?? '—'}</p>
          <p className="text-[10px] uppercase tracking-widest" style={{ color: '#B8860B' }}>{label}</p>
        </div>
      ))}
    </div>
  );
}

export default function RsvpPage() {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [guest, setGuest] = useState<Guest | null>(null);
  const [confirmed, setConfirmed] = useState<Status | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) { setError('Please enter your name, email, or phone number.'); return; }

    setLoading(true);
    setError('');
    setMatches(null);
    try {
      const res = await fetch(`/api/table/lookup?q=${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Something went wrong.'); setLoading(false); return; }

      if (data.found && data.multiple) {
        setMatches(data.matches);
        setLoading(false);
        return;
      }

      if (data.found) {
        setGuest({ id: data.id, name: `${data.first_name} ${data.last_name}` });
        setLoading(false);
        return;
      }

      setError("We couldn't find an invitation for that name, email, or phone number. Please contact Solomon & Anne directly.");
      setLoading(false);
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  async function handleConfirm(status: Status) {
    if (!guest) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/rsvp/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: guest.id, status }),
      });
      if (!res.ok) {
        setError('Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }
      setConfirmed(status);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16" style={{ background: '#FDFAF5' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.35em] uppercase mb-4" style={{ color: '#B8860B' }}>
            RSVP
          </p>
          <h1 className="font-serif text-3xl md:text-4xl leading-snug" style={{ color: '#2C2C2C' }}>
            Solomon Takyi
          </h1>
          <AmpersandEmblem />
          <h1 className="font-serif text-3xl md:text-4xl leading-snug" style={{ color: '#2C2C2C' }}>
            Anne Agyare
          </h1>
          <p className="mt-5 text-sm leading-relaxed" style={{ color: '#2C2C2C', opacity: 0.6 }}>
            {confirmed
              ? 'Thank you for confirming!'
              : guest
              ? 'Please confirm your attendance below.'
              : 'Enter your name, email, or phone number to confirm your attendance.'}
          </p>
        </div>

        <CountdownTimer />

        <div className="rounded-2xl shadow-sm overflow-hidden border px-8 py-10" style={{ background: '#fff', borderColor: '#e8dfc8' }}>
          {confirmed ? (
            <div className="text-center">
              <p className="font-serif text-xl mb-2" style={{ color: '#1B5E20' }}>
                {confirmed === 'yes' ? "You're all set!" : 'Thanks for letting us know.'}
              </p>
              <p className="text-sm" style={{ color: '#2C2C2C', opacity: 0.7 }}>
                {confirmed === 'yes'
                  ? `We've got ${guest?.name} down as attending. Can't wait to celebrate with you!`
                  : `We're sorry ${guest?.name} can't make it - you'll be missed.`}
              </p>
            </div>
          ) : guest ? (
            <div className="text-center">
              <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#B8860B' }}>
                Confirming for
              </p>
              <p className="font-serif text-xl mb-6" style={{ color: '#2C2C2C' }}>{guest.name}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleConfirm('yes')}
                  disabled={submitting}
                  className="flex-1 rounded-lg py-3 text-sm tracking-widest uppercase text-white transition disabled:opacity-60"
                  style={{ background: '#1B5E20' }}
                >
                  {submitting ? 'Saving…' : 'Yes, Attending'}
                </button>
                <button
                  onClick={() => handleConfirm('no')}
                  disabled={submitting}
                  className="flex-1 rounded-lg py-3 text-sm tracking-widest uppercase transition border disabled:opacity-60"
                  style={{ borderColor: '#B00020', color: '#B00020' }}
                >
                  {submitting ? 'Saving…' : "Can't Attend"}
                </button>
              </div>
              {error && <p className="mt-3 text-xs text-red-500">{error}</p>}
              <button
                onClick={() => setGuest(null)}
                className="text-xs mt-4 underline"
                style={{ color: '#B8860B' }}
              >
                Not you? Search again
              </button>
            </div>
          ) : matches ? (
            <div className="space-y-3">
              <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#B8860B' }}>
                A few guests matched — which one is you?
              </p>
              {matches.map((m) => (
                <button
                  key={m.id}
                  onClick={() => { setGuest({ id: m.id, name: m.name }); setMatches(null); }}
                  className="w-full text-left rounded-lg px-4 py-3 text-sm border transition"
                  style={{ borderColor: '#d6cbb0', color: '#2C2C2C' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#B8860B')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#d6cbb0')}
                >
                  {m.name}
                </button>
              ))}
              <button
                onClick={() => setMatches(null)}
                className="text-xs mt-2 underline"
                style={{ color: '#B8860B' }}
              >
                None of these — try again
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="contact" className="block text-xs tracking-widest uppercase mb-2" style={{ color: '#B8860B' }}>
                  Name, Email, or Phone
                </label>
                <input
                  id="contact"
                  type="text"
                  value={value}
                  onChange={(e) => { setValue(e.target.value); setError(''); }}
                  placeholder="Jane Doe, you@example.com, or +1 555 000 0000"
                  disabled={loading}
                  className="w-full rounded-lg px-4 py-3 text-sm outline-none transition border"
                  style={{ borderColor: '#d6cbb0', color: '#2C2C2C' }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#d6cbb0')}
                />
                {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
              </div>

              <p className="text-xs leading-relaxed" style={{ color: '#2C2C2C', opacity: 0.55 }}>
                By continuing, you agree to receive SMS updates about the wedding (reminders and RSVP
                confirmations) at the number on file. Msg &amp; data rates may apply. Reply STOP to opt out.{' '}
                <Link href="/privacy" className="underline">Privacy Policy</Link>.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg py-3 text-sm tracking-widest uppercase text-white transition disabled:opacity-60"
                style={{ background: '#B8860B' }}
              >
                {loading ? 'Looking Up…' : 'Continue'}
              </button>
            </form>
          )}
        </div>

        <div className="relative flex justify-between mt-6 px-1 pointer-events-none">
          <BotanicalLeaf />
          <BotanicalLeaf flip />
        </div>

        <div className="text-center mt-4">
          <Link href="/" className="text-xs underline" style={{ color: '#2C2C2C', opacity: 0.4 }}>
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
