-- nurse_profiles
-- nurse_id is the nurse's email (localStorage auth — not yet Supabase Auth UUID)
-- When Supabase Auth is wired up, migrate nurse_id to uuid references auth.users(id)

create table if not exists nurse_profiles (
  id                  uuid primary key default gen_random_uuid(),
  nurse_id            text not null unique,         -- nurse email
  first_name          text,
  last_name           text,
  specialty           text,
  license_type        text,
  license_state       text,
  years_experience    text,
  longest_role_held   text,
  currently_per_diem  boolean,
  per_diem_duration   text,
  per_diem_reason     text,
  caseload_experience boolean,
  languages_spoken    text[],
  preferred_settings  text[],
  employment_types    text[],
  desired_pay_min     numeric,
  desired_pay_max     numeric,
  willing_to_relocate text,
  relocation_states   text[],
  start_availability  text,
  additional_notes    text,
  resume_url          text,
  onboarding_complete boolean default false,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

-- notifications
-- Shared table for both nurse and employer notifications

create table if not exists notifications (
  id             uuid primary key default gen_random_uuid(),
  recipient_id   text not null,    -- nurse email or employer id
  recipient_type text not null,    -- 'nurse' | 'employer'
  text           text not null,
  sub_text       text,
  icon           text,
  type           text,
  unread         boolean default true,
  created_at     timestamptz default now()
);

create index if not exists notifications_recipient_idx
  on notifications (recipient_id, recipient_type, created_at desc);
