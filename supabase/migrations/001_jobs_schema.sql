-- Flor For Nurses — Job Scraping Schema
-- Migration 001: Core tables for jobs, pay intelligence, and scrape logging

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ============================================================
-- Table: jobs
-- All nursing job listings (both scraped and directly posted)
-- ============================================================
create table jobs (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  facility_name    text not null,
  facility_url     text,
  location_city    text,
  location_state   text default 'RI',
  specialty        text,
  employment_type  text,       -- Full-time, Part-time, Per Diem, PRN
  shift_type       text,
  pay_min          numeric,    -- hourly
  pay_max          numeric,    -- hourly
  pay_raw          text,       -- original pay string as scraped
  pay_source       text,       -- 'facility', 'community', 'bls_estimate', 'glassdoor_estimate', null
  pay_confidence   text,       -- 'high', 'medium', 'estimated', null
  description      text,
  apply_url        text,
  source_url       text,
  source_type      text,       -- 'direct' or 'scraped'
  is_verified      boolean default false,
  is_active        boolean default true,
  posted_at        timestamptz,
  scraped_at       timestamptz default now(),
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- Index for deduplication lookups and common queries
create index idx_jobs_source_url on jobs (source_url);
create index idx_jobs_is_active on jobs (is_active);
create index idx_jobs_specialty on jobs (specialty);
create index idx_jobs_facility_name on jobs (facility_name);

-- ============================================================
-- Table: pay_intelligence
-- Curated pay data by specialty and facility for fallback estimates
-- ============================================================
create table pay_intelligence (
  id              uuid primary key default gen_random_uuid(),
  specialty       text,
  facility_name   text,
  location_state  text default 'RI',
  pay_min         numeric,
  pay_max         numeric,
  pay_source      text,       -- 'bls', 'community_submitted', 'manual_research'
  confidence      text,       -- 'high', 'medium', 'estimated'
  effective_date  date,
  created_at      timestamptz default now()
);

create index idx_pay_intelligence_specialty on pay_intelligence (specialty);
create index idx_pay_intelligence_facility on pay_intelligence (facility_name);

-- ============================================================
-- Table: community_pay_submissions
-- Anonymous nurse-submitted pay data points
-- ============================================================
create table community_pay_submissions (
  id               uuid primary key default gen_random_uuid(),
  facility_name    text,
  specialty        text,
  pay_hourly       numeric,
  employment_type  text,
  years_experience integer,
  submitted_at     timestamptz default now(),
  is_verified      boolean default false
);

-- ============================================================
-- Table: scrape_log
-- Audit trail for every scraper run
-- ============================================================
create table scrape_log (
  id            uuid primary key default gen_random_uuid(),
  source_name   text,
  source_url    text,
  jobs_found    integer,
  jobs_new      integer,
  jobs_updated  integer,
  status        text,          -- 'success', 'failed', 'partial'
  error_message text,
  ran_at        timestamptz default now()
);

create index idx_scrape_log_ran_at on scrape_log (ran_at desc);
create index idx_scrape_log_source on scrape_log (source_name);
