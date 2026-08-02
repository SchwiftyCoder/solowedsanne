-- Neon (unlike Supabase) doesn't enable pgcrypto by default; needed for gen_random_uuid().
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Note: phone/email are intentionally NOT unique — couples RSVPing from a
-- shared phone number is common, and /api/table/lookup already handles
-- multiple guests matching one query via its "multiple matches" UI.
-- (first_name, last_name, phone) together act as each guest's stable identity
-- across re-imports, so the import script can upsert on conflict instead of
-- wiping and regenerating every id (and every welcome link) on every run.
CREATE TABLE IF NOT EXISTS seating (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL,
  table_number TEXT NOT NULL DEFAULT 'TBA',
  message TEXT NOT NULL DEFAULT '',
  is_family BOOLEAN,
  rsvp_status TEXT NOT NULL DEFAULT 'pending' CHECK (rsvp_status IN ('pending', 'yes', 'no')),
  excluded_from_texts BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (first_name, last_name, phone)
);

-- Migrating an existing table that still has table_number as an integer
-- (safe to run even on a table that already matches - each statement is a no-op then).
ALTER TABLE seating ALTER COLUMN table_number DROP DEFAULT;
ALTER TABLE seating ALTER COLUMN table_number TYPE TEXT USING table_number::text;
ALTER TABLE seating ALTER COLUMN table_number SET DEFAULT 'TBA';

ALTER TABLE seating ADD COLUMN IF NOT EXISTS rsvp_status TEXT NOT NULL DEFAULT 'pending';
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'seating_rsvp_status_check'
  ) THEN
    ALTER TABLE seating ADD CONSTRAINT seating_rsvp_status_check CHECK (rsvp_status IN ('pending', 'yes', 'no'));
  END IF;
END $$;

ALTER TABLE seating ADD COLUMN IF NOT EXISTS excluded_from_texts BOOLEAN NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS seating_updated_at ON seating;
CREATE TRIGGER seating_updated_at
  BEFORE UPDATE ON seating
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS seating_phone_idx ON seating (phone);
CREATE INDEX IF NOT EXISTS seating_email_idx ON seating (email);
