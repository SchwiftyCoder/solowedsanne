import { NextRequest, NextResponse } from 'next/server';
import { db, type Seating } from '@/lib/db';

// Letters, spaces, and common name punctuation only - no digits, no @ (this
// endpoint only ever matches by name now, never email or phone).
const NAME_PATTERN = /^[A-Za-z\s.'-]+$/;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q')?.trim();

  if (!query) {
    return NextResponse.json({ error: 'q is required' }, { status: 400 });
  }

  if (!NAME_PATTERN.test(query)) {
    return NextResponse.json({ error: 'Please enter a name using letters only.' }, { status: 400 });
  }

  try {
    const sql = db();
    const guests = (await sql`
      SELECT id, first_name, last_name, table_number FROM seating
    `) as Pick<Seating, 'id' | 'first_name' | 'last_name' | 'table_number'>[];

    const q = query.toLowerCase();
    const matches = guests.filter((g) => `${g.first_name} ${g.last_name}`.toLowerCase().includes(q));

    if (matches.length === 0) {
      return NextResponse.json({ found: false });
    }

    if (matches.length === 1) {
      const m = matches[0];
      return NextResponse.json({
        found: true,
        id: m.id,
        first_name: m.first_name,
        last_name: m.last_name,
        table_number: m.table_number,
      });
    }

    return NextResponse.json({
      found: true,
      multiple: true,
      matches: matches.map((m) => ({ id: m.id, name: `${m.first_name} ${m.last_name}` })),
    });
  } catch (err) {
    console.error('[table/lookup] Unexpected error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
