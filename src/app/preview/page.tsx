'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type FormData = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  attending: boolean;
};

export default function PreviewPage() {
  const router = useRouter();
  const [data, setData] = useState<FormData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const raw = sessionStorage.getItem('rsvp_form');
    if (!raw) {
      router.replace('/form');
      return;
    }
    try {
      setData(JSON.parse(raw));
    } catch {
      router.replace('/form');
    }
  }, [router]);

  async function handleConfirm() {
    if (!data) return;
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/rsvp/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || 'Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }

      sessionStorage.removeItem('rsvp_form');
      router.push(`/rsvp/${json.token}`);
    } catch {
      setError('Network error. Please try again.');
      setSubmitting(false);
    }
  }

  if (!data) return null;

  const fullName = `${data.first_name} ${data.last_name}`;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="text-xs tracking-[0.3em] uppercase text-amber-700 mb-3">Review Your RSVP</p>
          <h1 className="font-serif text-3xl md:text-4xl text-stone-800">Confirmation</h1>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-12 bg-amber-700/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-amber-700/60" />
            <div className="h-px w-12 bg-amber-700/40" />
          </div>
        </div>

        {/* Elegant RSVP Card */}
        <div
          className="relative rounded-2xl shadow-lg overflow-hidden border border-amber-200"
          style={{ background: 'linear-gradient(145deg, #fefcf3 0%, #faf5e4 50%, #fdf8ec 100%)' }}
        >
          {/* Top border accent */}
          <div className="h-1.5 bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700" />

          <div className="px-8 py-10 text-center">
            {/* Monogram / ornament */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-px flex-1 bg-amber-600/30" />
              <div className="text-amber-600 text-xl">✦</div>
              <div className="h-px flex-1 bg-amber-600/30" />
            </div>

            <p className="text-xs tracking-[0.35em] uppercase text-amber-700 mb-2">Guest</p>
            <h2 className="font-serif text-3xl text-stone-800 mb-1">{fullName}</h2>

            <div className="flex items-center justify-center gap-3 my-6">
              <div className="h-px w-8 bg-amber-600/30" />
              <div className="w-1 h-1 rounded-full bg-amber-600/50" />
              <div className="h-px w-8 bg-amber-600/30" />
            </div>

            <div className="space-y-2 text-sm text-stone-600 mb-6">
              <p>{data.email}</p>
              <p>{data.phone}</p>
            </div>

            <div
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs tracking-widest uppercase font-semibold ${
                data.attending
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-stone-100 text-stone-500 border border-stone-200'
              }`}
            >
              <span>{data.attending ? '✓' : '✗'}</span>
              {data.attending ? 'Joyfully Accepts' : 'Regretfully Declines'}
            </div>

            <div className="flex items-center justify-center gap-3 mt-8">
              <div className="h-px flex-1 bg-amber-600/30" />
              <div className="text-amber-600 text-xl">✦</div>
              <div className="h-px flex-1 bg-amber-600/30" />
            </div>
          </div>

          {/* Bottom border accent */}
          <div className="h-1.5 bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700" />
        </div>

        {error && (
          <p className="mt-4 text-center text-red-500 text-sm">{error}</p>
        )}

        <div className="mt-5 space-y-3">
          <button
            onClick={handleConfirm}
            disabled={submitting}
            className="w-full bg-stone-800 hover:bg-stone-700 text-white rounded-lg py-3 text-sm tracking-widest uppercase transition disabled:opacity-60"
          >
            {submitting ? 'Confirming…' : 'Confirm RSVP'}
          </button>

          <button
            onClick={() => router.push('/form')}
            disabled={submitting}
            className="w-full text-center text-xs text-stone-400 hover:text-stone-600 transition py-1"
          >
            ← Edit Details
          </button>
        </div>
      </div>
    </main>
  );
}
