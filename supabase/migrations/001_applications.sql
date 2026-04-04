-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 001 — applications table + nurse_profiles column additions
-- Run in Supabase SQL editor or via `supabase db push`
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Applications table ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS applications (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  nurse_id    uuid        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  job_id      text        NOT NULL,
  status      text        NOT NULL DEFAULT 'Applied'
                CHECK (status IN ('Applied','Under Review','Viewed','Interview','Offer')),
  applied_at  timestamptz DEFAULT now() NOT NULL,
  updated_at  timestamptz DEFAULT now() NOT NULL
);

-- Auto-update updated_at on any row change
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS applications_updated_at ON applications;
CREATE TRIGGER applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Prevent duplicate applications for the same nurse+job
CREATE UNIQUE INDEX IF NOT EXISTS applications_nurse_job_unique
  ON applications (nurse_id, job_id);

-- ── Row-level security ────────────────────────────────────────────────────────

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Nurses see own applications" ON applications;
CREATE POLICY "Nurses see own applications"
  ON applications FOR SELECT
  USING (auth.uid() = nurse_id);

DROP POLICY IF EXISTS "Nurses insert own applications" ON applications;
CREATE POLICY "Nurses insert own applications"
  ON applications FOR INSERT
  WITH CHECK (auth.uid() = nurse_id);

-- ── nurse_profiles — add columns if missing ───────────────────────────────────
-- Safe to run multiple times (IF NOT EXISTS guards each column).

DO $$
BEGIN
  -- license_verified
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'nurse_profiles' AND column_name = 'license_verified'
  ) THEN
    ALTER TABLE nurse_profiles ADD COLUMN license_verified boolean NOT NULL DEFAULT false;
  END IF;

  -- license_verified_at
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'nurse_profiles' AND column_name = 'license_verified_at'
  ) THEN
    ALTER TABLE nurse_profiles ADD COLUMN license_verified_at timestamptz;
  END IF;

  -- specialty
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'nurse_profiles' AND column_name = 'specialty'
  ) THEN
    ALTER TABLE nurse_profiles ADD COLUMN specialty text;
  END IF;

  -- location_zip
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'nurse_profiles' AND column_name = 'location_zip'
  ) THEN
    ALTER TABLE nurse_profiles ADD COLUMN location_zip text;
  END IF;
END $$;
