import Link from 'next/link';
import { ProgramCard } from '@/components/ProgramCard';

export const metadata = { title: 'Wedding Program - solowedsanne' };

export default function StandaloneProgramPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ background: '#FDFAF5' }}>
      <div className="w-full max-w-md">
        <ProgramCard />

        <div className="text-center mt-6">
          <Link href="/" className="text-xs uppercase tracking-widest underline" style={{ color: '#B8860B' }}>
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
