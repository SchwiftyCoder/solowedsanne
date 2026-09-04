import { NextRequest, NextResponse } from 'next/server';
import { db, type Seating } from '@/lib/db';

function normalizePhoneDigits(v: string) {
  return v.replace(/\D/g, '');
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q')?.trim();

  if (!query) {
    return NextResponse.json({ error: 'q is required' }, { status: 400 });
  }

  try {
    const sql = db();
    const guests = (await sql`
      SELECT id, first_name, last_name, email, phone, table_number FROM seating
    `) as Pick<Seating, 'id' | 'first_name' | 'last_name' | 'email' | 'phone' | 'table_number'>[];

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(query);
    const queryDigits = normalizePhoneDigits(query);
    const isPhone = !isEmail && queryDigits.length >= 7;

    let matches;
    if (isEmail) {
      const q = query.toLowerCase();
      matches = guests.filter((g) => g.email.toLowerCase() === q);
    } else if (isPhone) {
      matches = guests.filter((g) => {
        const gDigits = normalizePhoneDigits(g.phone);
        return gDigits.length > 0 && (gDigits === queryDigits || gDigits.endsWith(queryDigits) || queryDigits.endsWith(gDigits));
      });
    } else {
      const q = query.toLowerCase();
      matches = guests.filter(
        (g) =>
          g.first_name.toLowerCase().includes(q) ||
          g.last_name.toLowerCase().includes(q) ||
          `${g.first_name} ${g.last_name}`.toLowerCase().includes(q)
      );
    }

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
