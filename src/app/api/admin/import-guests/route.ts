import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Bulk upsert for scripts/import-seating.ps1 - protected by the same
// ADMIN_PASSWORD Basic Auth as the rest of /api/admin/* (see src/proxy.ts).
// If `replace` is set on a request, the whole seating table is wiped before
// that batch's rows are inserted - used for a full guest-list replacement
// rather than the normal incremental upsert.
type ImportRow = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  table_number: string;
  message: string;
  is_family: boolean;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rows: ImportRow[] = Array.isArray(body.rows) ? body.rows : [];
    const replace = !!body.replace;

    if (rows.length === 0 && !replace) {
      return NextResponse.json({ error: 'rows must be a non-empty array' }, { status: 400 });
    }

    const sql = db();

    if (replace) {
      await sql`DELETE FROM seating`;
    }

    let upserted = 0;

    for (const row of rows) {
      await sql`
        INSERT INTO seating (first_name, last_name, email, phone, table_number, message, is_family)
        VALUES (${row.first_name}, ${row.last_name}, ${row.email}, ${row.phone}, ${row.table_number}, ${row.message}, ${row.is_family})
        ON CONFLICT (first_name, last_name, phone)
        DO UPDATE SET
          email = EXCLUDED.email,
          table_number = EXCLUDED.table_number,
          message = EXCLUDED.message,
          is_family = EXCLUDED.is_family
      `;
      upserted++;
    }

    return NextResponse.json({ upserted, replaced: replace });
  } catch (err) {
    console.error('[admin/import-guests] Unexpected error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
