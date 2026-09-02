'use client';

import { useEffect, useState } from 'react';
import { WEDDING_DATE } from '@/lib/wedding-details';

function getTimeLeft() {
  const diff = Math.max(0, WEDDING_DATE.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function CountdownTimer() {
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
