import { WEDDING_DETAILS, WEDDING_PROGRAM } from '@/lib/wedding-details';
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
          {/* Ceremony column */}
          <div>
            {WEDDING_PROGRAM.ceremony.map((item, i) => (
              <ProgramRow key={i} item={item} last={i === WEDDING_PROGRAM.ceremony.length - 1} />
            ))}
          </div>

          {/* Reception column */}
          <div className="mt-6 sm:mt-0 pt-6 sm:pt-0 border-t sm:border-t-0" style={{ borderColor: '#e8dfc8' }}>
            <div className="mb-4 pb-3 border-b" style={{ borderColor: GOLD }}>
              <p className="text-xs tracking-[0.25em] uppercase mb-1" style={{ color: GOLD }}>
                {WEDDING_PROGRAM.reception.heading.time}
              </p>
              <p className="font-serif text-lg" style={{ color: ACCENT_GREEN }}>
                {WEDDING_PROGRAM.reception.heading.title}
              </p>
            </div>
            {WEDDING_PROGRAM.reception.items.map((item, i) => (
              <ProgramRow key={i} item={item} last={i === WEDDING_PROGRAM.reception.items.length - 1} />
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

function ProgramRow({ item, last }: { item: ProgramItem; last: boolean }) {
  const Icon = PROGRAM_ICONS[item.icon];
  return (
    <div
      className={`flex items-start gap-3 py-3 ${last ? '' : 'border-b'}`}
      style={{ borderColor: '#f0e8d4' }}
    >
      <div
        className="flex-shrink-0 rounded-full flex items-center justify-center"
        style={{ width: 36, height: 36, background: '#fff', border: `1px solid ${GOLD}` }}
      >
        <Icon color={GOLD} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold tracking-wide" style={{ color: ACCENT_GREEN }}>
          {item.time}
        </p>
        <p className="text-sm uppercase tracking-wide leading-snug" style={{ color: '#2C2C2C' }}>
          {item.event}
        </p>
      </div>
    </div>
  );
}
