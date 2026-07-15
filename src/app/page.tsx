'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AmpersandEmblem, BotanicalLeaf, CalendarIcon, PinIcon } from '@/components/WeddingMotifs';

type Match = { id: string; name: string };

export default function EntryPage() {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<Match[] | null>(null);

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
        router.push(`/welcome/${data.id}`);
        return;
      }

      setError("We couldn't find an invitation for that name, email, or phone number. Please contact Solomon & Anne directly.");
      setLoading(false);
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16" style={{ background: '#FDFAF5' }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.35em] uppercase mb-4" style={{ color: '#B8860B' }}>
            You Are Invited
          </p>
          <h1 className="font-serif text-3xl md:text-4xl leading-snug" style={{ color: '#2C2C2C' }}>
            Solomon Takyi
          </h1>
          <AmpersandEmblem />
          <h1 className="font-serif text-3xl md:text-4xl leading-snug" style={{ color: '#2C2C2C' }}>
            Anne Agyare
          </h1>
          <p className="text-xs tracking-[0.25em] uppercase mt-3" style={{ color: '#1B5E20' }}>
            Marriage Ceremony
          </p>
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="h-px w-14" style={{ background: '#B8860B', opacity: 0.35 }} />
            <span style={{ color: '#B8860B' }}>✦</span>
            <div className="h-px w-14" style={{ background: '#B8860B', opacity: 0.35 }} />
          </div>
          <p className="mt-5 text-sm leading-relaxed" style={{ color: '#2C2C2C', opacity: 0.6 }}>
            Enter your name, email, or phone number to find<br className="hidden sm:block" /> your table.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl shadow-sm overflow-hidden border px-8 py-10" style={{ background: '#fff', borderColor: '#e8dfc8' }}>
          {matches ? (
            <div className="space-y-3">
              <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#B8860B' }}>
                A few guests matched — which one is you?
              </p>
              {matches.map((m) => (
                <button
                  key={m.id}
                  onClick={() => router.push(`/welcome/${m.id}`)}
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

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg py-3 text-sm tracking-widest uppercase text-white transition disabled:opacity-60"
                style={{ background: '#B8860B' }}
                onMouseEnter={e => !loading && (e.currentTarget.style.background = '#9a700a')}
                onMouseLeave={e => (e.currentTarget.style.background = '#B8860B')}
              >
                {loading ? 'Looking Up…' : 'Continue'}
              </button>
            </form>
          )}
        </div>

        <div className="flex items-center justify-center gap-4 mt-6 text-xs" style={{ color: '#2C2C2C', opacity: 0.55 }}>
          <span className="flex items-center gap-1.5"><CalendarIcon /> Friday, September 4, 2026</span>
          <span className="flex items-center gap-1.5"><PinIcon /> La Maison, Belleville NJ</span>
        </div>

        <div className="relative flex justify-between mt-6 px-1 pointer-events-none">
          <BotanicalLeaf />
          <BotanicalLeaf flip />
        </div>
      </div>
    </main>
  );
}
