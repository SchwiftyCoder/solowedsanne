import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Bulk table-assignment import for scripts/import-table-assignments.ps1 (the
// final seating chart CSV, which has no phone/email columns). Unlike
// import-guests, this matches existing guests by name case-insensitively and
// only ever touches table_number - it never overwrites phone/email/message on
// a guest that already exists from the RSVP-form import, and it inserts a new
// bare-bones guest (no phone/email) for anyone in the chart who isn't already
// in the database (e.g. groomsmen added straight to the seating chart).
type ImportRow = {
  first_name: string;
  last_name: string;
  table_number: string;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rows: ImportRow[] = Array.isArray(body.rows) ? body.rows : [];

    if (rows.length === 0) {
      return NextResponse.json({ error: 'rows must be a non-empty array' }, { status: 400 });
    }

    const sql = db();
    let updated = 0;
    let inserted = 0;
    const ambiguous: { first_name: string; last_name: string }[] = [];

    for (const row of rows) {
      const matches = (await sql`
        SELECT id FROM seating
        WHERE lower(first_name) = lower(${row.first_name}) AND lower(last_name) = lower(${row.last_name})
      `) as { id: string }[];

      if (matches.length > 1) {
        ambiguous.push({ first_name: row.first_name, last_name: row.last_name });
        continue;
      }

      if (matches.length === 1) {
        await sql`UPDATE seating SET table_number = ${row.table_number} WHERE id = ${matches[0].id}`;
        updated++;
        continue;
      }

      await sql`
        INSERT INTO seating (first_name, last_name, email, phone, table_number, message, is_family)
        VALUES (${row.first_name}, ${row.last_name}, '', '', ${row.table_number}, '', false)
      `;
      inserted++;
    }

    return NextResponse.json({ updated, inserted, ambiguous, total: rows.length });
  } catch (err) {
    console.error('[admin/import-tables] Unexpected error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
