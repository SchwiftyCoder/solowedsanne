'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EntryPage() {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isPhone = (v: string) => /^\+?[\d\s\-().]{7,}$/.test(v);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) { setError('Please enter your email or phone number.'); return; }
    if (!isEmail(trimmed) && !isPhone(trimmed)) {
      setError('Please enter a valid email address or phone number.');
      return;
    }
    setLoading(true);
    setError('');
    const params = new URLSearchParams();
    if (isEmail(trimmed)) params.set('email', trimmed);
    else params.set('phone', trimmed);
    try {
      const res = await fetch(`/api/rsvp/check?${params}`);
      const data = await res.json();
      if (data.found) router.push(`/rsvp/${data.token}`);
      else router.push('/form');
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
          <p className="font-serif text-xl italic mt-1 mb-1" style={{ color: '#B8860B' }}>&amp;</p>
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
            Enter your email or phone number to RSVP<br className="hidden sm:block" /> or retrieve an existing response.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl shadow-sm px-8 py-10 border" style={{ background: '#fff', borderColor: '#e8dfc8' }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="contact" className="block text-xs tracking-widest uppercase mb-2" style={{ color: '#B8860B' }}>
                Email or Phone
              </label>
              <input
                id="contact"
                type="text"
                value={value}
                onChange={(e) => { setValue(e.target.value); setError(''); }}
                placeholder="you@example.com  or  +1 555 000 0000"
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
              {loading ? 'Checking…' : 'Continue'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: '#2C2C2C', opacity: 0.4 }}>
          Friday, September 4, 2026 · La Maison, Belleville NJ
        </p>
      </div>
    </main>
  );
}
