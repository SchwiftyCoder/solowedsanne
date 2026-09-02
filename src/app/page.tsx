import Link from 'next/link';
import { AmpersandEmblem, BotanicalLeaf, CalendarIcon, PinIcon } from '@/components/WeddingMotifs';
import { CountdownTimer } from '@/components/CountdownTimer';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16" style={{ background: '#FDFAF5' }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.35em] uppercase mb-4" style={{ color: '#B8860B' }}>
            You Are Invited
          </p>
          <h1 className="font-serif text-3xl md:text-4xl leading-snug" style={{ color: '#2C2C2C' }}>
            Solomon Takyi
          </h1>
          <AmpersandEmblem />
          <h1 className="font-serif text-3xl md:text-4xl leading-snug" style={{ color: '#2C2C2C' }}>
            Anne Agyare
          </h1>
          <p className="text-xs tracking-[0.25em] uppercase mt-3" style={{ color: '#1B5E20' }}>
            Marriage Ceremony
          </p>
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="h-px w-14" style={{ background: '#B8860B', opacity: 0.35 }} />
            <span style={{ color: '#B8860B' }}>✦</span>
            <div className="h-px w-14" style={{ background: '#B8860B', opacity: 0.35 }} />
          </div>
        </div>

        <CountdownTimer />

        {/* Hub links */}
        <div className="rounded-2xl shadow-sm overflow-hidden border px-8 py-10 space-y-4" style={{ background: '#fff', borderColor: '#e8dfc8' }}>
          <Link
            href="/table"
            className="block w-full text-center rounded-lg py-4 text-sm tracking-widest uppercase text-white transition"
            style={{ background: '#B8860B' }}
          >
            Find Your Table
          </Link>
          <Link
            href="/program"
            className="block w-full text-center rounded-lg py-4 text-sm tracking-widest uppercase transition border"
            style={{ borderColor: '#B8860B', color: '#B8860B' }}
          >
            Wedding Program
          </Link>
        </div>

        <div className="flex items-center justify-center gap-4 mt-6 text-xs" style={{ color: '#2C2C2C', opacity: 0.55 }}>
          <span className="flex items-center gap-1.5"><CalendarIcon /> Friday, September 4, 2026</span>
          <span className="flex items-center gap-1.5"><PinIcon /> La Maison, Belleville NJ</span>
        </div>

        <div className="relative flex justify-between mt-6 px-1 pointer-events-none">
          <BotanicalLeaf />
          <BotanicalLeaf flip />
        </div>

        <div className="text-center mt-4">
          <Link href="/privacy" className="text-xs underline" style={{ color: '#2C2C2C', opacity: 0.4 }}>
            Privacy Policy &amp; Terms
          </Link>
        </div>
      </div>
    </main>
  );
}
