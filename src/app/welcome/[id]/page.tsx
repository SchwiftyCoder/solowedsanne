import { notFound } from 'next/navigation';
import { createServiceClient } from '@/lib/supabase';

type Props = { params: Promise<{ id: string }> };

const PHOTOS_URL = 'https://drive.google.com/drive/folders/15bBYA-TGtC2SHhTbLprLiqRAniDxty4s?usp=sharing';

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

export default async function WelcomePage({ params }: Props) {
  const { id } = await params;

  const db = createServiceClient();
  const { data: guest, error } = await db
    .from('seating')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !guest) {
    notFound();
  }

  const fullName = `${guest.first_name} ${guest.last_name}`;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ background: '#FDFAF5' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <p className="text-xs tracking-[0.35em] uppercase mb-2" style={{ color: '#B8860B' }}>Welcome</p>
          <h1 className="font-serif text-2xl" style={{ color: '#2C2C2C' }}>{fullName}</h1>
        </div>

        {/* Welcome card */}
        <div className="flex rounded-2xl shadow-xl overflow-hidden border" style={{ borderColor: '#e0d3b0', background: '#FDFAF5' }}>
          <div className="kente-strip flex-shrink-0" style={{ width: 20 }} />

          <div className="flex-1 relative overflow-hidden">
            <div className="h-1" style={{ background: 'linear-gradient(90deg, #B8860B, #FFD700, #B8860B)' }} />

            <div className="px-7 py-8">
              {/* Couple names */}
              <div className="text-center mb-1">
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

              {/* Table number */}
              <div className="text-center">
                <p className="text-xs tracking-[0.35em] uppercase mb-1" style={{ color: '#B8860B' }}>Your Table</p>
                <p className="font-serif" style={{ fontSize: 48, color: '#1B5E20', lineHeight: 1.1 }}>
                  {guest.table_number}
                </p>
                {guest.seat_number != null && (
                  <p className="text-xs tracking-widest uppercase" style={{ color: '#2C2C2C', opacity: 0.5 }}>
                    Seat {guest.seat_number}
                  </p>
                )}
              </div>

              {/* Photos link */}
              <Divider />
              <div className="text-center">
                <a
                  href={PHOTOS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full rounded-lg py-3 text-sm tracking-widest uppercase text-white transition"
                  style={{ background: '#B8860B' }}
                >
                  View Wedding Photos
                </a>
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
      </div>
    </main>
  );
}
