import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// One-off data-cleanup endpoint for merging duplicate guest rows created by
// name-spelling mismatches between the RSVP-form import and the seating
// chart import (e.g. "Max Hyde" vs "Maxwell Hyde"). `updates` sets
// table_number on a guest by id (the record to keep); `deletes` removes
// guest rows by id (the redundant duplicate, once its table_number has been
// copied onto the kept record).
type Update = { id: string; table_number: string };

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const updates: Update[] = Array.isArray(body.updates) ? body.updates : [];
    const deletes: string[] = Array.isArray(body.deletes) ? body.deletes : [];

    const sql = db();
    let updated = 0;
    let deleted = 0;

    for (const u of updates) {
      await sql`UPDATE seating SET table_number = ${u.table_number} WHERE id = ${u.id}`;
      updated++;
    }

    for (const id of deletes) {
      await sql`DELETE FROM seating WHERE id = ${id}`;
      deleted++;
    }

    return NextResponse.json({ updated, deleted });
  } catch (err) {
    console.error('[admin/fix-guests] Unexpected error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
