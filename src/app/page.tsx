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
    if (!trimmed) {
      setError('Please enter your email or phone number.');
      return;
    }
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

      if (data.found) {
        router.push(`/rsvp/${data.token}`);
      } else {
        router.push('/form');
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Ornamental header */}
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.3em] uppercase text-amber-700 mb-3">You are invited</p>
          <h1 className="font-serif text-4xl md:text-5xl text-stone-800 leading-tight">
            RSVP
          </h1>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-12 bg-amber-700/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-amber-700/60" />
            <div className="h-px w-12 bg-amber-700/40" />
          </div>
          <p className="mt-5 text-stone-500 text-sm leading-relaxed">
            Enter your email or phone number to begin your RSVP<br className="hidden sm:block" /> or retrieve an existing one.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-stone-200 rounded-2xl shadow-sm px-8 py-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="contact" className="block text-xs tracking-widest uppercase text-stone-400 mb-2">
                Email or Phone
              </label>
              <input
                id="contact"
                type="text"
                value={value}
                onChange={(e) => { setValue(e.target.value); setError(''); }}
                placeholder="you@example.com or +1 555 000 0000"
                className="w-full border border-stone-200 rounded-lg px-4 py-3 text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition text-sm"
                disabled={loading}
              />
              {error && <p className="mt-2 text-red-500 text-xs">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-stone-800 hover:bg-stone-700 text-white rounded-lg py-3 text-sm tracking-widest uppercase transition disabled:opacity-60"
            >
              {loading ? 'Checking…' : 'Continue'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
