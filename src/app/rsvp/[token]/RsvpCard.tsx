'use client';

import { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { Guest } from '@/lib/supabase';

type Props = { guest: Guest; token: string };

function Divider({ star = false }: { star?: boolean }) {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="h-px flex-1" style={{ background: '#B8860B', opacity: 0.25 }} />
      {star
        ? <span style={{ color: '#B8860B', fontSize: 14 }}>✦</span>
        : <div className="w-1 h-1 rounded-full" style={{ background: '#B8860B', opacity: 0.4 }} />}
      <div className="h-px flex-1" style={{ background: '#B8860B', opacity: 0.25 }} />
    </div>
  );
}

function BotanicalLeaf({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      width="64" height="72" viewBox="0 0 64 72" fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}
    >
      <line x1="32" y1="68" x2="32" y2="12" stroke="#B8860B" strokeWidth="1.1" strokeOpacity="0.55"/>
      <path d="M32 12 C16 20 10 44 32 66 C54 44 48 20 32 12 Z"
        fill="#B8860B" fillOpacity="0.07" stroke="#B8860B" strokeWidth="1" strokeOpacity="0.5"/>
      <path d="M32 28 Q22 32 19 42" stroke="#B8860B" strokeWidth="0.75" strokeOpacity="0.45"/>
      <path d="M32 28 Q42 32 45 42" stroke="#B8860B" strokeWidth="0.75" strokeOpacity="0.45"/>
      <path d="M32 44 Q24 47 22 55" stroke="#B8860B" strokeWidth="0.75" strokeOpacity="0.3"/>
      <path d="M32 44 Q40 47 42 55" stroke="#B8860B" strokeWidth="0.75" strokeOpacity="0.3"/>
      <path d="M32 22 C24 16 14 22 18 32 C24 24 32 22 32 22 Z"
        fill="#B8860B" fillOpacity="0.07" stroke="#B8860B" strokeWidth="0.85" strokeOpacity="0.45"/>
      <path d="M32 22 C40 16 50 22 46 32 C40 24 32 22 32 22 Z"
        fill="#B8860B" fillOpacity="0.07" stroke="#B8860B" strokeWidth="0.85" strokeOpacity="0.45"/>
    </svg>
  );
}

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
    QRCode.toDataURL(rsvpUrl, { width: 160, margin: 1, color: { dark: '#2C2C2C', light: '#FDFAF5' } })
      .then(url => { if (qrRef.current) qrRef.current.src = url; })
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
    if (!res.ok) { setSaveError(json.error || 'Update failed.'); setSaving(false); return; }
    setSaving(false);
    setEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  }

  const fullName = `${guest.first_name} ${guest.last_name}`;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ background: '#FDFAF5' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <p className="text-xs tracking-[0.35em] uppercase mb-2" style={{ color: '#B8860B' }}>Your RSVP</p>
          <h1 className="font-serif text-2xl" style={{ color: '#2C2C2C' }}>Confirmation</h1>
        </div>

        {/* Wedding RSVP Card */}
        <div className="flex rounded-2xl shadow-xl overflow-hidden border" style={{ borderColor: '#e0d3b0', background: '#FDFAF5' }}>

          {/* Kente strip — left */}
          <div className="kente-strip flex-shrink-0" style={{ width: 20 }} />

          {/* Card body */}
          <div className="flex-1 relative overflow-hidden">
            <div className="h-1" style={{ background: 'linear-gradient(90deg, #B8860B, #FFD700, #B8860B)' }} />

            <div className="px-7 py-8">

              {/* Couple names */}
              <div className="text-center">
                <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: '#B8860B' }}>
                  Together with their families
                </p>
                <h2 className="font-serif leading-tight" style={{ fontSize: 26, color: '#B8860B' }}>
                  Solomon Takyi
                </h2>
                <p className="font-serif italic text-lg my-0.5" style={{ color: '#2C2C2C', opacity: 0.55 }}>&amp;</p>
                <h2 className="font-serif leading-tight" style={{ fontSize: 26, color: '#B8860B' }}>
                  Anne Agyare
                </h2>
                <p className="text-xs tracking-[0.22em] uppercase mt-2" style={{ color: '#1B5E20' }}>
                  Marriage Ceremony
                </p>
              </div>

              <Divider star />

              {/* Event details */}
              <div className="text-center space-y-1 text-sm" style={{ color: '#2C2C2C' }}>
                <p className="font-semibold">Friday, September 4, 2026</p>
                <p style={{ opacity: 0.75 }}>2:00 PM</p>
                <p className="font-medium mt-1">La Maison</p>
                <p className="text-xs" style={{ opacity: 0.6 }}>33 Washington Ave, Belleville, NJ 07109</p>
                <p className="text-xs tracking-widest uppercase mt-2 font-semibold" style={{ color: '#1B5E20' }}>
                  Dress Code: Kente
                </p>
              </div>

              <Divider />

              {/* Bible verse */}
              <p className="text-center text-xs italic leading-relaxed px-2" style={{ color: '#2C2C2C', opacity: 0.65 }}>
                &ldquo;The Lord God said, it is not good for the man to be alone.
                I will make a helper suitable for him.&rdquo;
              </p>
              <p className="text-center text-xs font-semibold mt-1.5 tracking-wide" style={{ color: '#B8860B' }}>
                — Genesis 2:18
              </p>

              <Divider star />

              {/* Guest name — large gold serif */}
              <div className="text-center mb-2">
                <p className="text-xs tracking-[0.35em] uppercase mb-2" style={{ color: '#B8860B' }}>
                  Dear Guest
                </p>
                <h2 className="font-serif font-medium" style={{ fontSize: 30, color: '#B8860B', lineHeight: 1.2 }}>
                  {fullName}
                </h2>
                <p className="text-xs mt-1.5" style={{ color: '#2C2C2C', opacity: 0.5 }}>{guest.email}</p>
              </div>

              <Divider />

              {/* Editable fields */}
              <div className="space-y-4">
                <div>
                  <p className="text-xs tracking-widest uppercase mb-1.5" style={{ color: '#B8860B' }}>Phone</p>
                  {editing ? (
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full rounded-lg px-4 py-2.5 text-sm outline-none border transition"
                      style={{ borderColor: '#d6cbb0', color: '#2C2C2C' }}
                    />
                  ) : (
                    <p className="text-sm" style={{ color: '#2C2C2C' }}>{phone}</p>
                  )}
                </div>

                <div>
                  <p className="text-xs tracking-widest uppercase mb-1.5" style={{ color: '#B8860B' }}>Attendance</p>
                  {editing ? (
                    <div className="grid grid-cols-2 gap-3">
                      {[true, false].map(val => (
                        <label
                          key={String(val)}
                          className="flex items-center justify-center border rounded-lg py-2.5 cursor-pointer transition text-xs select-none"
                          style={{
                            background: attending === val ? '#1B5E20' : 'transparent',
                            color: attending === val ? '#fff' : '#2C2C2C',
                            borderColor: attending === val ? '#1B5E20' : '#d6cbb0',
                          }}
                        >
                          <input type="radio" name="attending" checked={attending === val}
                            onChange={() => setAttending(val)} className="sr-only" />
                          {val ? 'Joyfully Accepts' : 'Regretfully Declines'}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <span
                      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs tracking-widest uppercase font-semibold border"
                      style={attending
                        ? { background: '#f0fdf4', color: '#1B5E20', borderColor: '#1B5E20' }
                        : { background: '#f5f5f5', color: '#555', borderColor: '#ccc' }}
                    >
                      {attending ? '✓ Joyfully Accepts' : '✗ Regretfully Declines'}
                    </span>
                  )}
                </div>
              </div>

              {/* QR code */}
              <Divider star />
              <div className="flex flex-col items-center gap-2">
                <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#B8860B' }}>Your RSVP Link</p>
                <div className="rounded-xl p-2 border" style={{ borderColor: '#e0d3b0', background: '#FDFAF5' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img ref={qrRef} alt="RSVP QR Code" width={160} height={160} />
                </div>
                <p className="text-xs mt-1 text-center break-all" style={{ color: '#2C2C2C', opacity: 0.4 }}>{rsvpUrl}</p>
              </div>

              {/* Botanical leaves */}
              <div className="relative flex justify-between mt-6 -mb-2 px-1 pointer-events-none">
                <BotanicalLeaf />
                <BotanicalLeaf flip />
              </div>
            </div>

            <div className="h-1" style={{ background: 'linear-gradient(90deg, #B8860B, #FFD700, #B8860B)' }} />
          </div>
        </div>

        {saveError && <p className="mt-3 text-center text-red-500 text-sm">{saveError}</p>}
        {saveSuccess && <p className="mt-3 text-center text-sm font-medium" style={{ color: '#1B5E20' }}>Changes saved!</p>}

        <div className="mt-5 space-y-3">
          {editing ? (
            <>
              <button
                onClick={handleSave} disabled={saving}
                className="w-full rounded-lg py-3 text-sm tracking-widest uppercase text-white transition disabled:opacity-60"
                style={{ background: '#B8860B' }}
                onMouseEnter={e => !saving && (e.currentTarget.style.background = '#9a700a')}
                onMouseLeave={e => (e.currentTarget.style.background = '#B8860B')}
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
              <button
                onClick={() => { setEditing(false); setPhone(guest.phone); setAttending(guest.attending); setSaveError(''); }}
                disabled={saving}
                className="w-full text-center text-xs transition py-1"
                style={{ color: '#2C2C2C', opacity: 0.4 }}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="w-full rounded-lg py-3 text-sm tracking-widest uppercase transition border"
              style={{ borderColor: '#e0d3b0', color: '#B8860B' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#B8860B')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#e0d3b0')}
            >
              Edit RSVP
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
