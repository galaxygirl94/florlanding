-- Founding Nurse badge
alter table nurse_profiles
  add column if not exists is_founding_nurse       boolean default false,
  add column if not exists joined_at               timestamptz default now();

-- Profile views
alter table nurse_profiles
  add column if not exists profile_view_count      integer default 0,
  add column if not exists profile_views_this_week integer default 0,
  add column if not exists profile_views_reset_at  timestamptz default now();

-- Job alerts
alter table nurse_profiles
  add column if not exists job_alerts_enabled      boolean default false;

-- Mark first 100 nurses as founding
-- (run manually or via seed after enough signups)
-- update nurse_profiles set is_founding_nurse = true where id in (
--   select id from nurse_profiles order by created_at asc limit 100
-- );

-- Weekly reset cron should run:
-- update nurse_profiles set profile_views_this_week = 0, profile_views_reset_at = now()
-- where profile_views_reset_at < now() - interval '7 days';
