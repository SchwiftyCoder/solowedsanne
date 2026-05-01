'use client';

import { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { Guest } from '@/lib/supabase';

type Props = { guest: Guest; token: string };

export default function RsvpCard({ guest, token }: Props) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const rsvpUrl = `${siteUrl}/rsvp/${token}`;

  const [phone, setPhone] = useState(guest.phone);
  const [attending, setAttending] = useState(guest.attending);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const qrRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    QRCode.toDataURL(rsvpUrl, { width: 160, margin: 1, color: { dark: '#292524', light: '#fdf8ec' } })
      .then((url) => { if (qrRef.current) qrRef.current.src = url; })
      .catch(console.error);
  }, [rsvpUrl]);

  async function handleSave() {
    setSaving(true);
    setSaveError('');

    const res = await fetch('/api/rsvp/update', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, phone, attending }),
    });
    const json = await res.json();

    if (!res.ok) {
      setSaveError(json.error || 'Update failed. Please try again.');
      setSaving(false);
      return;
    }

    setSaving(false);
    setEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  }

  const fullName = `${guest.first_name} ${guest.last_name}`;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="text-xs tracking-[0.3em] uppercase text-amber-700 mb-3">Your RSVP</p>
          <h1 className="font-serif text-3xl md:text-4xl text-stone-800">Confirmation</h1>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-12 bg-amber-700/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-amber-700/60" />
            <div className="h-px w-12 bg-amber-700/40" />
          </div>
        </div>

        {/* Invitation card */}
        <div
          className="relative rounded-2xl shadow-lg overflow-hidden border border-amber-200"
          style={{ background: 'linear-gradient(145deg, #fefcf3 0%, #faf5e4 50%, #fdf8ec 100%)' }}
        >
          <div className="h-1.5 bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700" />

          <div className="px-8 py-10">
            {/* Name section — locked */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px flex-1 bg-amber-600/30" />
                <div className="text-amber-600 text-xl">✦</div>
                <div className="h-px flex-1 bg-amber-600/30" />
              </div>
              <p className="text-xs tracking-[0.35em] uppercase text-amber-700 mb-1">Guest</p>
              <h2 className="font-serif text-3xl text-stone-800">{fullName}</h2>
              <p className="text-sm text-stone-400 mt-1">{guest.email}</p>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-amber-600/20" />
              <div className="w-1 h-1 rounded-full bg-amber-600/40" />
              <div className="h-px flex-1 bg-amber-600/20" />
            </div>

            {/* Editable fields */}
            <div className="space-y-4">
              <div>
                <p className="text-xs tracking-widest uppercase text-stone-400 mb-1.5">Phone</p>
                {editing ? (
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition text-sm"
                  />
                ) : (
                  <p className="text-stone-700 text-sm">{phone}</p>
                )}
              </div>

              <div>
                <p className="text-xs tracking-widest uppercase text-stone-400 mb-1.5">Attendance</p>
                {editing ? (
                  <div className="grid grid-cols-2 gap-3">
                    {[true, false].map((val) => (
                      <label
                        key={String(val)}
                        className={`flex items-center justify-center gap-2 border rounded-lg py-2.5 cursor-pointer transition text-xs select-none ${
                          attending === val
                            ? 'bg-stone-800 text-white border-stone-800'
                            : 'border-stone-200 text-stone-600 hover:border-stone-400'
                        }`}
                      >
                        <input type="radio" name="attending" checked={attending === val} onChange={() => setAttending(val)} className="sr-only" />
                        {val ? 'Joyfully Accepts' : 'Regretfully Declines'}
                      </label>
                    ))}
                  </div>
                ) : (
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs tracking-widest uppercase font-semibold ${
                      attending
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-stone-100 text-stone-500 border border-stone-200'
                    }`}
                  >
                    <span>{attending ? '✓' : '✗'}</span>
                    {attending ? 'Joyfully Accepts' : 'Regretfully Declines'}
                  </div>
                )}
              </div>
            </div>

            {/* QR Code */}
            <div className="mt-8 flex flex-col items-center gap-2">
              <div className="flex items-center gap-3 mb-4 w-full">
                <div className="h-px flex-1 bg-amber-600/20" />
                <div className="text-amber-600 text-xl">✦</div>
                <div className="h-px flex-1 bg-amber-600/20" />
              </div>
              <p className="text-xs tracking-widest uppercase text-stone-400 mb-2">Your RSVP Link</p>
              <div className="border border-amber-200 rounded-xl p-2" style={{ background: '#fdf8ec' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img ref={qrRef} alt="RSVP QR Code" width={160} height={160} />
              </div>
              <p className="text-xs text-stone-400 mt-1 text-center break-all">{rsvpUrl}</p>
            </div>
          </div>

          <div className="h-1.5 bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700" />
        </div>

        {saveError && <p className="mt-3 text-center text-red-500 text-sm">{saveError}</p>}
        {saveSuccess && <p className="mt-3 text-center text-emerald-600 text-sm">Changes saved!</p>}

        {/* Action buttons */}
        <div className="mt-5 space-y-3">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-stone-800 hover:bg-stone-700 text-white rounded-lg py-3 text-sm tracking-widest uppercase transition disabled:opacity-60"
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
              <button
                onClick={() => { setEditing(false); setPhone(guest.phone); setAttending(guest.attending); setSaveError(''); }}
                disabled={saving}
                className="w-full text-center text-xs text-stone-400 hover:text-stone-600 transition py-1"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="w-full border border-stone-200 hover:border-stone-400 text-stone-700 rounded-lg py-3 text-sm tracking-widest uppercase transition"
            >
              Edit RSVP
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
