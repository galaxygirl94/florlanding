/**
 * NEOGOV / GovernmentJobs.com Scraper
 *
 * Scrapes Rhode Island state government nursing jobs.
 * Primary: JSON API at governmentjobs.com
 * Fallback: apply.ri.gov (Workday-powered, redirects to ri.wd5.myworkdayjobs.com)
 */

import { fetchWithRetry, parsePay, normalizeSpecialty, normalizeEmploymentType, normalizeShift, isNursingJob, sleep } from '../base.js';
import { resolvePay } from '../pay-resolver.js';

const SOURCE_NAME = 'neogov';
const NEOGOV_API = 'https://www.governmentjobs.com/careers/rhodeisland/jobs';
const WORKDAY_API = 'https://ri.wd5.myworkdayjobs.com/wday/cxs/ri/RI/jobs';
const WORKDAY_BASE = 'https://ri.wd5.myworkdayjobs.com/RI';
const KEYWORDS = ['nurse', 'RN', 'LPN', 'nursing'];

async function scrapeNEOGOV() {
  const jobs = [];

  // Try NEOGOV JSON API first
  for (const keyword of KEYWORDS) {
    try {
      const url = `${NEOGOV_API}?keyword=${encodeURIComponent(keyword)}&format=json`;
      const response = await fetchWithRetry(url);
      const data = await response.json();

      if (Array.isArray(data)) {
        for (const item of data) {
          if (!isNursingJob(item.Title || item.title || '')) continue;

          const title = item.Title || item.title || '';
          const pay = parsePay(item.SalaryRange || item.salary || '');

          jobs.push({
            title,
            facility_name: item.Department || item.department || 'State of Rhode Island',
            location_city: item.Location || 'Providence',
            location_state: 'RI',
            specialty: normalizeSpecialty(title, item.Description || ''),
            employment_type: normalizeEmploymentType(item.JobType || item.type || ''),
            shift_type: normalizeShift(item.Description || ''),
            pay_min: pay.min,
            pay_max: pay.max,
            pay_raw: pay.raw,
            description: item.Description || item.description || null,
            apply_url: item.Url || item.url || null,
            source_url: item.Url || item.url || `${NEOGOV_API}?keyword=${keyword}`,
            source_type: 'scraped',
            posted_at: item.PostedDate || item.postedDate || null,
          });
        }
      }

      await sleep(1000);
    } catch (err) {
      console.warn(`  [neogov] NEOGOV API failed for "${keyword}": ${err.message}`);
    }
  }

  // If NEOGOV returned results, use those
  if (jobs.length > 0) return jobs;

  // Fallback: Workday API (apply.ri.gov redirects here)
  console.log('  [neogov] Falling back to Workday API...');
  return scrapeWorkday();
}

async function scrapeWorkday() {
  const jobs = [];
  const seen = new Set();

  for (const keyword of KEYWORDS) {
    let offset = 0;
    let total = Infinity;

    while (offset < total) {
      try {
        const response = await fetchWithRetry(WORKDAY_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            appliedFacets: {},
            limit: 20,
            offset,
            searchText: keyword,
          }),
        });

        const data = await response.json();
        total = data.total || 0;

        if (!data.jobPostings || data.jobPostings.length === 0) break;

        for (const posting of data.jobPostings) {
          if (seen.has(posting.externalPath)) continue;
          seen.add(posting.externalPath);

          if (!isNursingJob(posting.title)) continue;

          const pay = parsePay((posting.bulletFields || []).join(' '));
          const directUrl = `${WORKDAY_BASE}${posting.externalPath}`;

          jobs.push({
            title: posting.title,
            facility_name: 'State of Rhode Island',
            location_city: parseCity(posting.locationsText),
            location_state: 'RI',
            specialty: normalizeSpecialty(posting.title),
            employment_type: normalizeEmploymentType((posting.bulletFields || []).join(' ')),
            shift_type: normalizeShift((posting.bulletFields || []).join(' ')),
            pay_min: pay.min,
            pay_max: pay.max,
            pay_raw: pay.raw,
            description: null,
            apply_url: directUrl,
            source_url: directUrl,
            source_type: 'scraped',
            posted_at: posting.postedOn || null,
          });
        }

        offset += 20;
        await sleep(1000);
      } catch (err) {
        console.warn(`  [neogov] Workday search failed for "${keyword}" at offset ${offset}: ${err.message}`);
        break;
      }
    }
  }

  return jobs;
}

function parseCity(locationStr) {
  if (!locationStr) return 'Providence';
  const parts = locationStr.split(',');
  return parts[0].trim() || 'Providence';
}

export async function scrape() {
  console.log('[neogov] Scraping RI state government nursing jobs...');

  try {
    const rawJobs = await scrapeNEOGOV();

    // Deduplicate by source_url
    const uniqueJobs = [];
    const seen = new Set();
    for (const job of rawJobs) {
      const key = job.source_url || job.title;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueJobs.push(job);
      }
    }

    // Run pay resolution
    const resolvedJobs = [];
    for (const job of uniqueJobs) {
      resolvedJobs.push(await resolvePay(job));
    }

    console.log(`[neogov] Found ${resolvedJobs.length} nursing jobs`);
    return resolvedJobs;
  } catch (err) {
    console.error(`[neogov] Scraper failed: ${err.message}`);
    throw err;
  }
}

export const sourceName = SOURCE_NAME;
export const sourceUrl = NEOGOV_API;
