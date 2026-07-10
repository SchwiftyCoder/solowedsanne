import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="text-amber-600 text-5xl mb-6">✦</div>
      <h1 className="font-serif text-3xl text-stone-800 mb-3">Invitation Not Found</h1>
      <p className="text-stone-500 text-sm mb-8 max-w-sm">
        We couldn&apos;t find a table assignment for that link. Please check the link or contact the couple.
      </p>
      <Link
        href="/"
        className="bg-stone-800 text-white rounded-lg px-8 py-3 text-sm tracking-widest uppercase hover:bg-stone-700 transition"
      >
        Start Over
      </Link>
    </main>
  );
}
