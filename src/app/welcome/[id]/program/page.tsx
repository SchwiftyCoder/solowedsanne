import Link from 'next/link';
import { WEDDING_DETAILS, WEDDING_PROGRAM } from '@/lib/wedding-details';
import { AmpersandEmblem, Divider } from '@/components/WeddingMotifs';

type Props = { params: Promise<{ id: string }> };

export default async function ProgramPage({ params }: Props) {
  const { id } = await params;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ background: '#FDFAF5' }}>
      <div className="w-full max-w-md">
        <div className="rounded-2xl shadow-xl overflow-hidden border" style={{ borderColor: '#e0d3b0', background: '#FDFAF5' }}>
          <div className="h-1" style={{ background: 'linear-gradient(90deg, #B8860B, #FFD700, #B8860B)' }} />

          <div className="px-7 py-8">
            <div className="text-center mb-1">
              <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: '#B8860B' }}>
                Presented By
              </p>
              <h2 className="font-serif leading-tight" style={{ fontSize: 22, color: '#B8860B' }}>
                Solomon Takyi
              </h2>
              <AmpersandEmblem />
              <h2 className="font-serif leading-tight" style={{ fontSize: 22, color: '#B8860B' }}>
                Anne Agyare
              </h2>
              <p className="text-xs tracking-[0.22em] uppercase mt-3" style={{ color: '#1B5E20' }}>
                Wedding Program
              </p>
              <p className="text-xs mt-1" style={{ color: '#2C2C2C', opacity: 0.6 }}>
                {WEDDING_DETAILS.dateText}
              </p>
            </div>

            <Divider star />

            <div className="space-y-3">
              {WEDDING_PROGRAM.map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-20 flex-shrink-0 text-right text-xs font-semibold tracking-wide" style={{ color: '#1B5E20' }}>
                    {item.time}
                  </div>
                  <div className="w-px self-stretch" style={{ background: '#B8860B', opacity: 0.4 }} />
                  <div className="text-sm uppercase tracking-wide" style={{ color: '#2C2C2C' }}>
                    {item.event}
                  </div>
                </div>
              ))}
            </div>

            <Divider />

            <p className="text-center text-xs uppercase tracking-[0.3em]" style={{ color: '#B8860B' }}>
              Thank You
            </p>
          </div>

          <div className="h-1" style={{ background: 'linear-gradient(90deg, #B8860B, #FFD700, #B8860B)' }} />
        </div>

        <div className="text-center mt-6">
          <Link href={`/welcome/${id}`} className="text-xs uppercase tracking-widest underline" style={{ color: '#B8860B' }}>
            Back to Your Table
          </Link>
        </div>
      </div>
    </main>
  );
}
