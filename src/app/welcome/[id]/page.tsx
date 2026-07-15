import { notFound } from 'next/navigation';
import { createServiceClient } from '@/lib/supabase';
import { WEDDING_DETAILS, venueMapsUrl } from '@/lib/wedding-details';
import { AmpersandEmblem, Divider, BotanicalLeaf, CalendarIcon, ClockIcon, PinIcon } from '@/components/WeddingMotifs';

type Props = { params: Promise<{ id: string }> };

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
        <div className="relative rounded-2xl shadow-xl overflow-hidden border" style={{ borderColor: '#e0d3b0', background: '#FDFAF5' }}>
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
                <AmpersandEmblem />
                <h2 className="font-serif leading-tight" style={{ fontSize: 26, color: '#B8860B' }}>
                  Anne Agyare
                </h2>
                <p className="text-xs tracking-[0.22em] uppercase mt-2" style={{ color: '#1B5E20' }}>
                  Marriage Ceremony
                </p>
              </div>

              <Divider star />

              {/* Event details - compact */}
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-center" style={{ color: '#2C2C2C' }}>
                <span className="flex items-center gap-1"><CalendarIcon /> Fri, Sep 4, 2026</span>
                <span className="flex items-center gap-1"><ClockIcon /> {WEDDING_DETAILS.timeText}</span>
                <a
                  href={venueMapsUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 underline"
                  style={{ color: '#2C2C2C' }}
                >
                  <PinIcon /> La Maison, Belleville NJ
                </a>
              </div>
              <p className="text-center text-xs tracking-widest uppercase mt-2 font-semibold" style={{ color: '#1B5E20' }}>
                Dress Code: Kente
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

              {guest.message && (
                <>
                  <Divider />
                  <div className="text-center">
                    <p className="text-xs tracking-[0.3em] uppercase mb-1" style={{ color: '#B8860B' }}>
                      Your Message to the Couple
                    </p>
                    <p className="text-xs italic leading-relaxed px-2" style={{ color: '#2C2C2C', opacity: 0.7 }}>
                      &ldquo;{guest.message}&rdquo;
                    </p>
                  </div>
                </>
              )}

              {/* Photos link */}
              <Divider />
              <div className="text-center">
                <p className="text-xs italic mb-3" style={{ color: '#2C2C2C', opacity: 0.65 }}>
                  Upload your beautiful pictures here and view others&apos;!
                </p>
                <a
                  href={WEDDING_DETAILS.photosUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full rounded-lg py-3 text-sm tracking-widest uppercase text-white transition"
                  style={{ background: '#B8860B' }}
                >
                  Wedding Photo Album
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
    </main>
  );
}
