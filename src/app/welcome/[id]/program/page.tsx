import Link from 'next/link';
import { ProgramCard } from '@/components/ProgramCard';

type Props = { params: Promise<{ id: string }> };

export default async function ProgramPage({ params }: Props) {
  const { id } = await params;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ background: '#FDFAF5' }}>
      <div className="w-full max-w-2xl">
        <ProgramCard />

        <div className="text-center mt-6">
          <Link href={`/welcome/${id}`} className="text-xs uppercase tracking-widest underline" style={{ color: '#B8860B' }}>
            Back to Your Table
          </Link>
        </div>
      </div>
    </main>
  );
}
