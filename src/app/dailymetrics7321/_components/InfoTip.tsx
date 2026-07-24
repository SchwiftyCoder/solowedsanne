'use client';

import { useState } from 'react';
import { Info } from 'lucide-react';

const TIP_WIDTH = 264;

export default function InfoTip({ text }: { text: string }) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  function toggle(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    if (pos) {
      setPos(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.min(Math.max(rect.left + rect.width / 2 - TIP_WIDTH / 2, 8), window.innerWidth - TIP_WIDTH - 8);
    setPos({ x, y: rect.bottom + 8 });
  }

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        aria-label="What is this?"
        className="inline-flex align-middle text-slate-500 hover:text-sky-400 focus:outline-none"
      >
        <Info size={13} />
      </button>
      {pos && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setPos(null)} />
          <div
            className="fixed z-50 rounded-lg bg-slate-950 border border-slate-600 shadow-xl p-3 text-xs leading-relaxed text-slate-200"
            style={{ left: pos.x, top: pos.y, width: TIP_WIDTH }}
          >
            {text}
          </div>
        </>
      )}
    </>
  );
}
