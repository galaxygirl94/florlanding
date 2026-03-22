/**
 * Rhode Island School Districts — School Nurse Scraper
 *
 * Scrapes Warwick Public Schools and Providence Public Schools
 * HR/careers pages for school nurse positions.
 */

import { fetchPage, parsePay, normalizeSpecialty, normalizeEmploymentType, normalizeShift, isNursingJob } from '../base.js';
import { resolvePay } from '../pay-resolver.js';

const SOURCE_NAME = 'school-districts';

const DISTRICTS = [
  {
    name: 'Warwick Public Schools',
    city: 'Warwick',
    urls: [
      'https://www.warwickschools.org/employment',
      'https://www.warwickschools.org/careers',
      'https://www.warwickschools.org/page/human-resources',
    ],
  },
  {
    name: 'Providence Public Schools',
    city: 'Providence',
    urls: [
      'https://www.providenceschools.org/careers',
      'https://www.providenceschools.org/employment',
      'https://www.providenceschools.org/page/human-resources',
    ],
  },
];

export async function scrape() {
  console.log('[school-districts] Scraping school district nursing jobs...');

  const allJobs = [];

  for (const district of DISTRICTS) {
    let found = false;

    for (const url of district.urls) {
      if (found) break;

      try {
        const $ = await fetchPage(url);
        const jobs = [];

        // School district sites vary widely — cast a broad net
        $('a, li, tr, .posting, [class*="job"], [class*="position"]').each((_, el) => {
          const $el = $(el);
          const text = $el.text().trim();

          // Look for nurse-related text in any element
          if (!text || text.length > 300) return;
          if (!isNursingJob(text)) return;

          // Extract a clean title
          const title = $el.find('a, h3, h4, strong, .title').first().text().trim() || text.split('\n')[0].trim();
          if (title.length > 150) return;

          const link = $el.attr('href') || $el.find('a').first().attr('href');
          const fullUrl = link
            ? (link.startsWith('http') ? link : `${new URL(url).origin}${link}`)
            : url;

          const pay = parsePay(text);

          jobs.push({
            title: title.substring(0, 150),
            facility_name: district.name,
            facility_url: url,
            location_city: district.city,
            location_state: 'RI',
            specialty: 'School Nursing',
            employment_type: 'Full-time',
            shift_type: 'Days',
            pay_min: pay.min,
            pay_max: pay.max,
            pay_raw: pay.raw,
            description: null,
            apply_url: fullUrl,
            source_url: fullUrl,
            source_type: 'scraped',
          });
        });

        // Deduplicate within this district
        const seen = new Set();
        for (const job of jobs) {
          const key = job.title.toLowerCase();
          if (!seen.has(key)) {
            seen.add(key);
            allJobs.push(job);
          }
        }

        if (jobs.length > 0) found = true;
      } catch (err) {
        console.warn(`  [school-districts] Failed to fetch ${url}: ${err.message}`);
      }
    }
  }

  const resolvedJobs = [];
  for (const job of allJobs) {
    resolvedJobs.push(await resolvePay(job));
  }

  console.log(`[school-districts] Found ${resolvedJobs.length} school nurse jobs`);
  return resolvedJobs;
}

export const sourceName = SOURCE_NAME;
export const sourceUrl = 'https://www.warwickschools.org/employment';
