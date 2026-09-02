'use client';

import { useEffect, useState } from 'react';
import { WEDDING_DETAILS, WEDDING_PROGRAM, getActiveProgramKey } from '@/lib/wedding-details';
import { AmpersandEmblem, Divider } from '@/components/WeddingMotifs';
import { PROGRAM_ICONS, type ProgramIconKey } from '@/components/ProgramIcons';

const ACCENT_GREEN = '#0B6B3A';
const GOLD = '#B8860B';

type ProgramItem = { time: string; event: string; icon: ProgramIconKey };

// The gold-accented order-of-events card, shared by the standalone /program
// page and the per-guest /welcome/[id]/program page (which differ only in
// where their back link points). Mirrors the printed ceremony/reception
// timeline sign: a left column running through the ceremony and a right
// column headed by the reception's own time range.
export function ProgramCard() {
  // Starts null so the server-rendered markup and the client's first render
  // match exactly - the "happening now" highlight only ever applies after
  // mount, and only on the wedding day itself.
  const [activeKey, setActiveKey] = useState<string | null>(null);

  useEffect(() => {
    setActiveKey(getActiveProgramKey());
    const interval = setInterval(() => setActiveKey(getActiveProgramKey()), 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-2xl shadow-xl overflow-hidden border" style={{ borderColor: '#e0d3b0', background: '#FDFAF5' }}>
      <div className="h-1.5" style={{ background: 'linear-gradient(90deg, #B8860B, #FFD700, #B8860B)' }} />

      <div className="px-6 sm:px-9 py-8 sm:py-10">
        <div className="text-center mb-1">
          <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: GOLD }}>
            Presented By
          </p>
          <h2 className="font-serif leading-tight" style={{ fontSize: 22, color: GOLD }}>
            Solomon Takyi
          </h2>
          <AmpersandEmblem />
          <h2 className="font-serif leading-tight" style={{ fontSize: 22, color: GOLD }}>
            Anne Agyare
          </h2>
          <p className="text-xs tracking-[0.22em] uppercase mt-3" style={{ color: ACCENT_GREEN }}>
            Ceremony &amp; Reception Timeline
          </p>
          <p className="text-xs mt-1" style={{ color: '#2C2C2C', opacity: 0.6 }}>
            {WEDDING_DETAILS.dateText}
          </p>
        </div>

        <Divider star />

        <div className="grid sm:grid-cols-2 sm:gap-x-10 gap-y-1">
          {/* Ceremony column - stretched to the reception column's height (it
              has one fewer row and no heading block), then each row grows to
              fill its even share of that height so both columns end flush
              instead of leaving dead space under the shorter one. */}
          <div className="flex flex-col h-full">
            {WEDDING_PROGRAM.ceremony.map((item, i) => (
              <ProgramRow
                key={i}
                item={item}
                last={i === WEDDING_PROGRAM.ceremony.length - 1}
                grow
                active={activeKey === `ceremony-${i}`}
              />
            ))}
          </div>

          {/* Reception column */}
          <div className="mt-6 sm:mt-0 pt-6 sm:pt-0 border-t sm:border-t-0 flex flex-col" style={{ borderColor: '#e8dfc8' }}>
            <div className="mb-4 pb-3 border-b" style={{ borderColor: GOLD }}>
              <p className="text-xs tracking-[0.25em] uppercase mb-1" style={{ color: GOLD }}>
                {WEDDING_PROGRAM.reception.heading.time}
              </p>
              <p className="font-serif text-lg" style={{ color: ACCENT_GREEN }}>
                {WEDDING_PROGRAM.reception.heading.title}
              </p>
            </div>
            {WEDDING_PROGRAM.reception.items.map((item, i) => (
              <ProgramRow
                key={i}
                item={item}
                last={i === WEDDING_PROGRAM.reception.items.length - 1}
                active={activeKey === `reception-${i}`}
              />
            ))}
          </div>
        </div>

        <Divider />

        <p className="text-center text-xs uppercase tracking-[0.3em]" style={{ color: GOLD }}>
          Thank You
        </p>
      </div>

      <div className="h-1.5" style={{ background: 'linear-gradient(90deg, #B8860B, #FFD700, #B8860B)' }} />
    </div>
  );
}

function ProgramRow({
  item,
  last,
  grow,
  active,
}: {
  item: ProgramItem;
  last: boolean;
  grow?: boolean;
  active?: boolean;
}) {
  const Icon = PROGRAM_ICONS[item.icon];
  return (
    <div
      className={`flex items-center gap-4 py-3.5 px-2 -mx-2 rounded-xl transition-colors ${grow ? 'flex-1' : ''} ${last ? '' : 'border-b'} ${active ? 'program-row-active' : ''}`}
      style={{ borderColor: '#f0e8d4' }}
    >
      <div
        className={`flex-shrink-0 rounded-full flex items-center justify-center ${active ? 'program-badge-active' : ''}`}
        style={{
          width: 46,
          height: 46,
          background: 'radial-gradient(circle at 34% 28%, #FFFDF6 0%, #FBF1D9 55%, #F0DDAF 100%)',
          border: `1px solid ${active ? GOLD : '#D9B65C'}`,
          boxShadow:
            '0 4px 7px rgba(120,88,17,0.28), 0 1px 2px rgba(120,88,17,0.2), inset 0 1.5px 1.5px rgba(255,255,255,0.95), inset 0 -2px 3px rgba(184,134,11,0.22)',
        }}
      >
        <div style={{ filter: 'drop-shadow(0 1.5px 1px rgba(120,88,17,0.4))' }}>
          <Icon color={GOLD} />
        </div>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold tracking-wide flex items-center gap-1.5" style={{ color: ACCENT_GREEN }}>
          {item.time}
          {active && (
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest" style={{ color: GOLD }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: GOLD }} />
              Happening Now
            </span>
          )}
        </p>
        <p className="font-serif leading-snug" style={{ fontSize: 16.5, color: '#2C2C2C', letterSpacing: 0.2 }}>
          {item.event}
        </p>
      </div>
    </div>
  );
}
