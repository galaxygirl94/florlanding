/**
 * Flor For Nurses — Job Scraper Runner
 *
 * Orchestrates all individual scrapers, resolves pay, deduplicates,
 * and writes results to Supabase.
 *
 * Usage:
 *   node scrapers/index.js
 *
 * Environment variables:
 *   SUPABASE_URL            — Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY — Supabase service role key
 */

import { createClient } from '@supabase/supabase-js';
import { checkDuplicate } from './base.js';
import { resolvePay } from './pay-resolver.js';

// Import all scrapers
import * as neogov from './sources/neogov.js';
import * as brownHealth from './sources/brown-health.js';
import * as careNewEngland from './sources/care-new-england.js';
import * as lifespan from './sources/lifespan.js';
import * as southCounty from './sources/south-county.js';
import * as thundermist from './sources/thundermist.js';
import * as pchc from './sources/pchc.js';
import * as woodRiver from './sources/wood-river.js';
import * as vnservices from './sources/vnservices.js';
import * as bayada from './sources/bayada.js';
import * as butler from './sources/butler.js';
import * as communityCare from './sources/community-care.js';
import * as schoolDistricts from './sources/school-districts.js';

const ALL_SCRAPERS = [
  neogov,
  brownHealth,
  careNewEngland,
  lifespan,
  southCounty,
  thundermist,
  pchc,
  woodRiver,
  vnservices,
  bayada,
  butler,
  communityCare,
  schoolDistricts,
];

// -------------------------------------------------------------------
// Supabase client
// -------------------------------------------------------------------

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.warn('[runner] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set — running in dry-run mode');
    return null;
  }

  return createClient(url, key);
}

// -------------------------------------------------------------------
// Write scrape log entry
// -------------------------------------------------------------------

async function logScrapeResult(supabase, sourceName, sourceUrl, result) {
  if (!supabase) return;

  try {
    await supabase.from('scrape_log').insert({
      source_name: sourceName,
      source_url: sourceUrl,
      jobs_found: result.found,
      jobs_new: result.newJobs,
      jobs_updated: result.updated,
      status: result.status,
      error_message: result.error || null,
    });
  } catch (err) {
    console.warn(`  [runner] Failed to write scrape log for ${sourceName}: ${err.message}`);
  }
}

// -------------------------------------------------------------------
// Upsert a job into Supabase
// -------------------------------------------------------------------

async function upsertJob(supabase, job) {
  if (!supabase) return { action: 'dry-run' };

  const existing = await checkDuplicate(supabase, job.source_url);

  if (existing) {
    // Update existing job
    const { error } = await supabase
      .from('jobs')
      .update({
        title: job.title,
        facility_name: job.facility_name,
        facility_url: job.facility_url || null,
        location_city: job.location_city,
        location_state: job.location_state || 'RI',
        specialty: job.specialty,
        employment_type: job.employment_type,
        shift_type: job.shift_type,
        pay_min: job.pay_min,
        pay_max: job.pay_max,
        pay_raw: job.pay_raw,
        pay_source: job.pay_source,
        pay_confidence: job.pay_confidence,
        description: job.description,
        apply_url: job.apply_url,
        source_type: job.source_type || 'scraped',
        is_active: true,
        scraped_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id);

    if (error) console.warn(`  [runner] Update failed for "${job.title}": ${error.message}`);
    return { action: 'updated' };
  }

  // Insert new job
  const { error } = await supabase.from('jobs').insert({
    title: job.title,
    facility_name: job.facility_name,
    facility_url: job.facility_url || null,
    location_city: job.location_city,
    location_state: job.location_state || 'RI',
    specialty: job.specialty,
    employment_type: job.employment_type,
    shift_type: job.shift_type,
    pay_min: job.pay_min,
    pay_max: job.pay_max,
    pay_raw: job.pay_raw,
    pay_source: job.pay_source,
    pay_confidence: job.pay_confidence,
    description: job.description,
    apply_url: job.apply_url,
    source_url: job.source_url,
    source_type: job.source_type || 'scraped',
    is_verified: false,
    is_active: true,
    posted_at: job.posted_at || null,
    scraped_at: new Date().toISOString(),
  });

  if (error) console.warn(`  [runner] Insert failed for "${job.title}": ${error.message}`);
  return { action: 'new' };
}

// -------------------------------------------------------------------
// Main runner
// -------------------------------------------------------------------

async function run() {
  const startTime = Date.now();
  console.log('==========================================================');
  console.log('  Flor For Nurses — Job Scraper');
  console.log(`  Started: ${new Date().toISOString()}`);
  console.log('==========================================================\n');

  const supabase = getSupabase();

  // Run all scrapers concurrently with Promise.allSettled
  const scraperResults = await Promise.allSettled(
    ALL_SCRAPERS.map(async (scraper) => {
      try {
        const jobs = await scraper.scrape();
        return {
          sourceName: scraper.sourceName,
          sourceUrl: scraper.sourceUrl,
          jobs: jobs || [],
          error: null,
        };
      } catch (err) {
        return {
          sourceName: scraper.sourceName,
          sourceUrl: scraper.sourceUrl,
          jobs: [],
          error: err.message,
        };
      }
    })
  );

  // Process results
  let totalSources = 0;
  let totalFound = 0;
  let totalNew = 0;
  let totalUpdated = 0;
  let totalFailed = 0;
  let facilityPayCount = 0;
  let estimatedPayCount = 0;
  let noPayCount = 0;

  for (const result of scraperResults) {
    totalSources++;

    if (result.status === 'rejected') {
      totalFailed++;
      console.error(`\n[FAILED] Unknown scraper — ${result.reason}`);
      continue;
    }

    const { sourceName, sourceUrl, jobs, error } = result.value;

    if (error) {
      totalFailed++;
      console.error(`\n[FAILED] ${sourceName}: ${error}`);
      await logScrapeResult(supabase, sourceName, sourceUrl, {
        found: 0, newJobs: 0, updated: 0, status: 'failed', error,
      });
      continue;
    }

    if (jobs.length === 0) {
      console.warn(`\n[WARNING] ${sourceName}: 0 jobs found (page may have changed)`);
      await logScrapeResult(supabase, sourceName, sourceUrl, {
        found: 0, newJobs: 0, updated: 0, status: 'success', error: null,
      });
      continue;
    }

    // Process each job through pay resolution and write to Supabase
    let sourceNew = 0;
    let sourceUpdated = 0;

    for (const job of jobs) {
      // Ensure pay resolution (should already be resolved by individual scrapers,
      // but run again as a safety net)
      const resolvedJob = await resolvePay(job, supabase);
      const { action } = await upsertJob(supabase, resolvedJob);

      if (action === 'new' || action === 'dry-run') sourceNew++;
      if (action === 'updated') sourceUpdated++;

      // Track pay coverage
      if (resolvedJob.pay_source === 'facility') facilityPayCount++;
      else if (resolvedJob.pay_min != null) estimatedPayCount++;
      else noPayCount++;
    }

    totalFound += jobs.length;
    totalNew += sourceNew;
    totalUpdated += sourceUpdated;

    console.log(`\n[OK] ${sourceName}: ${jobs.length} found, ${sourceNew} new, ${sourceUpdated} updated`);

    await logScrapeResult(supabase, sourceName, sourceUrl, {
      found: jobs.length, newJobs: sourceNew, updated: sourceUpdated, status: 'success',
    });
  }

  // Summary
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log('\n==========================================================');
  console.log('  SCRAPE SUMMARY');
  console.log('==========================================================');
  console.log(`  Sources scraped:     ${totalSources}`);
  console.log(`  Sources failed:      ${totalFailed}`);
  console.log(`  Total jobs found:    ${totalFound}`);
  console.log(`  New jobs inserted:   ${totalNew}`);
  console.log(`  Jobs updated:        ${totalUpdated}`);
  console.log(`  ──────────────────────────────────`);
  console.log(`  Facility pay:        ${facilityPayCount}`);
  console.log(`  Estimated pay:       ${estimatedPayCount}`);
  console.log(`  No pay data:         ${noPayCount}`);
  console.log(`  ──────────────────────────────────`);
  console.log(`  Elapsed:             ${elapsed}s`);
  console.log('==========================================================\n');
}

run().catch((err) => {
  console.error('Runner crashed:', err);
  process.exit(1);
});
