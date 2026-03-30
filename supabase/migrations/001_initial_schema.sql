-- Flor for Nurses — initial schema
-- Run this in the Supabase SQL editor at:
-- https://supabase.com/dashboard/project/elpcuvndwtowkwpyuylh/sql

-- ─── Extensions ─────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Nurse profiles ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS nurse_profiles (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at        timestamptz DEFAULT now(),
  full_name         text NOT NULL,
  email             text UNIQUE NOT NULL,
  phone             text,
  photo_url         text,
  years_experience  integer NOT NULL DEFAULT 0,
  specialty         text NOT NULL,
  preferred_settings text[] NOT NULL DEFAULT '{}',
  availability      text NOT NULL CHECK (availability IN ('full-time','part-time','per-diem')),
  license_number    text NOT NULL,
  license_state     text NOT NULL,
  license_verified  boolean NOT NULL DEFAULT false,
  license_expires   date,
  license_status    text NOT NULL DEFAULT '',
  discipline_flags  boolean NOT NULL DEFAULT false,
  bio               text,
  pslf_interest     boolean NOT NULL DEFAULT false,
  desired_pay_min   numeric,
  desired_pay_max   numeric,
  location_city     text,
  location_state    text,
  willing_to_travel boolean NOT NULL DEFAULT false,
  is_test_profile   boolean NOT NULL DEFAULT false
);

-- ─── Employer profiles ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS employer_profiles (
  id                     uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at             timestamptz DEFAULT now(),
  org_name               text NOT NULL,
  org_type               text NOT NULL CHECK (org_type IN ('PACE','FQHC','School District','Home Health','Other community health')),
  address                text NOT NULL,
  contact_name           text NOT NULL,
  contact_title          text,
  phone                  text NOT NULL,
  email                  text UNIQUE NOT NULL,
  is_nonprofit           boolean NOT NULL DEFAULT false,
  flor_mission_eligible  boolean NOT NULL DEFAULT false,
  verification_doc_url   text
);

-- ─── Job postings ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS job_postings (
  id                       uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at               timestamptz DEFAULT now(),
  employer_id              uuid NOT NULL REFERENCES employer_profiles(id) ON DELETE CASCADE,
  title                    text NOT NULL,
  specialty_required       text NOT NULL,
  employment_type          text NOT NULL CHECK (employment_type IN ('full-time','part-time','per-diem')),
  openings_count           integer NOT NULL DEFAULT 1,
  pay_min                  numeric NOT NULL,
  pay_max                  numeric NOT NULL,
  pay_type                 text NOT NULL CHECK (pay_type IN ('hourly','salary')),
  pay_negotiable           boolean NOT NULL DEFAULT false,
  caseload                 text,
  schedule                 text,
  weekend_required         boolean NOT NULL DEFAULT false,
  on_call_required         boolean NOT NULL DEFAULT false,
  ehr_system               text,
  description              text,
  certifications_required  text[] NOT NULL DEFAULT '{}',
  experience_preferred     text,
  pslf_eligible            boolean NOT NULL DEFAULT false,
  status                   text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','closed')),
  location_city            text,
  location_state           text
);

-- ─── Interview requests ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS interview_requests (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at   timestamptz DEFAULT now(),
  job_id       uuid REFERENCES job_postings(id) ON DELETE SET NULL,
  employer_id  uuid NOT NULL REFERENCES employer_profiles(id) ON DELETE CASCADE,
  nurse_id     uuid NOT NULL REFERENCES nurse_profiles(id) ON DELETE CASCADE,
  status       text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','declined')),
  message      text
);

-- ─── Indexes ─────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_nurse_profiles_specialty        ON nurse_profiles(specialty);
CREATE INDEX IF NOT EXISTS idx_nurse_profiles_location_state   ON nurse_profiles(location_state);
CREATE INDEX IF NOT EXISTS idx_nurse_profiles_availability     ON nurse_profiles(availability);
CREATE INDEX IF NOT EXISTS idx_nurse_profiles_license_verified ON nurse_profiles(license_verified);
CREATE INDEX IF NOT EXISTS idx_job_postings_employer           ON job_postings(employer_id);
CREATE INDEX IF NOT EXISTS idx_job_postings_status             ON job_postings(status);
CREATE INDEX IF NOT EXISTS idx_interview_requests_nurse        ON interview_requests(nurse_id);
CREATE INDEX IF NOT EXISTS idx_interview_requests_employer     ON interview_requests(employer_id);

-- ─── Row-level security (open for now — tighten with auth later) ─────────────
ALTER TABLE nurse_profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE employer_profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_postings         ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_requests   ENABLE ROW LEVEL SECURITY;

-- Allow anon reads on published jobs and non-test nurse profiles (public marketplace)
CREATE POLICY "public can read published jobs"
  ON job_postings FOR SELECT
  USING (status = 'published');

CREATE POLICY "public can read non-test nurse profiles"
  ON nurse_profiles FOR SELECT
  USING (is_test_profile = false OR is_test_profile = true); -- all readable for now; tighten post-auth

-- Allow insert for signups (anon can insert their own profile)
CREATE POLICY "anyone can create nurse profile"
  ON nurse_profiles FOR INSERT WITH CHECK (true);

CREATE POLICY "anyone can create employer profile"
  ON employer_profiles FOR INSERT WITH CHECK (true);

CREATE POLICY "employers can create job postings"
  ON job_postings FOR INSERT WITH CHECK (true);

CREATE POLICY "anyone can create interview request"
  ON interview_requests FOR INSERT WITH CHECK (true);

CREATE POLICY "anyone can read interview requests"
  ON interview_requests FOR SELECT USING (true);

CREATE POLICY "anyone can update interview requests"
  ON interview_requests FOR UPDATE USING (true);

CREATE POLICY "anyone can read employer profiles"
  ON employer_profiles FOR SELECT USING (true);

-- ─── Seed test nurse profiles ─────────────────────────────────────────────────
-- These are clearly marked is_test_profile = true
-- Call POST /api/seed-nurses to upsert these via the application, OR run:

INSERT INTO nurse_profiles (
  full_name, email, phone, years_experience, specialty,
  preferred_settings, availability, license_number, license_state,
  license_verified, license_expires, license_status, discipline_flags,
  bio, pslf_interest, desired_pay_min, desired_pay_max,
  location_city, location_state, willing_to_travel, is_test_profile
) VALUES
(
  'Maria Reyes', 'maria.reyes.test@flor.dev', '401-555-0101', 9, 'Med-Surg',
  ARRAY['FQHC','home health'], 'full-time', 'RN-RI-TEST-001', 'RI',
  true, '2026-12-31', 'active', false,
  'I''ve spent nine years on med-surg floors and I''m ready for something with a smaller panel and more continuity. I want to actually know my patients. FQHC or home health — I''m not picky as long as the mission is real.',
  true, 38, 52, 'Providence', 'RI', true, true
),
(
  'James Okafor', 'james.okafor.test@flor.dev', '617-555-0202', 15, 'Geriatrics',
  ARRAY['PACE'], 'full-time', 'RN-MA-TEST-002', 'MA',
  true, '2027-06-30', 'active', false,
  'PACE is the model. I''ve worked with frail elders my entire career and I believe most nursing home admissions are preventable with the right team. Looking for a PACE program in greater Boston where I can put that to work every day.',
  false, 45, 62, 'Boston', 'MA', false, true
),
(
  'Destiny Clark', 'destiny.clark.test@flor.dev', '203-555-0303', 4, 'Pediatrics',
  ARRAY['school district','FQHC'], 'per-diem', 'RN-CT-TEST-003', 'CT',
  true, '2025-11-30', 'active', false,
  'School nursing was not what I expected — it''s crisis response, chronic disease management, and advocacy all in one role. Per diem gives me flexibility while my kids are small. Happy to cover multiple districts.',
  true, 32, 45, 'New Haven', 'CT', true, true
),
(
  'Tomás Villanueva', 'tomas.villanueva.test@flor.dev', '508-555-0404', 7, 'Community Health',
  ARRAY['FQHC','PACE','home health'], 'part-time', 'RN-MA-TEST-004', 'MA',
  true, '2026-09-30', 'active', false,
  'I came to nursing through community health work and I''ve never left it. Part-time by design — I also teach. Looking for a FQHC or PACE where the work is patient-centered and the team is actually collaborative.',
  true, 40, 55, 'Worcester', 'MA', false, true
)
ON CONFLICT (email) DO UPDATE SET
  full_name         = EXCLUDED.full_name,
  years_experience  = EXCLUDED.years_experience,
  specialty         = EXCLUDED.specialty,
  license_verified  = EXCLUDED.license_verified,
  is_test_profile   = EXCLUDED.is_test_profile;
