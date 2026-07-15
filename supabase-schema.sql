-- Create seating table
-- Note: phone/email are intentionally NOT unique — couples RSVPing from a
-- shared phone number is common, and /api/table/lookup already handles
-- multiple guests matching one query via its "multiple matches" UI.
CREATE TABLE IF NOT EXISTS seating (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL,
  table_number INT NOT NULL,
  seat_number INT,
  message TEXT NOT NULL DEFAULT '',
  is_family BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Adds columns if the table already existed without them
ALTER TABLE seating ADD COLUMN IF NOT EXISTS message TEXT NOT NULL DEFAULT '';
-- is_family is intentionally left NULL for every guest for now (unset) -- fill in later, per guest, directly in the table editor.
ALTER TABLE seating ADD COLUMN IF NOT EXISTS is_family BOOLEAN;

-- Auto-update updated_at on row update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER seating_updated_at
  BEFORE UPDATE ON seating
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Indexes for lookup by phone/email
CREATE INDEX IF NOT EXISTS seating_phone_idx ON seating (phone);
CREATE INDEX IF NOT EXISTS seating_email_idx ON seating (email);
