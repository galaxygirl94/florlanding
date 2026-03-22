/**
 * Providence Community Health Centers (PCHC) Scraper
 *
 * Source: https://www.pchcri.org (careers section)
 */

import { fetchPage, parsePay, normalizeSpecialty, normalizeEmploymentType, normalizeShift, isNursingJob } from '../base.js';
import { resolvePay } from '../pay-resolver.js';

const SOURCE_NAME = 'pchc';
const SOURCE_URL = 'https://www.pchcri.org';
const CAREERS_URLS = [
  'https://www.pchcri.org/careers',
  'https://www.pchcri.org/jobs',
  'https://www.pchcri.org/employment',
];

export async function scrape() {
  console.log('[pchc] Scraping Providence Community Health Centers nursing jobs...');

  const jobs = [];

  for (const url of CAREERS_URLS) {
    try {
      const $ = await fetchPage(url);

      $('a[href*="job"], a[href*="career"], a[href*="position"], .job-listing, [class*="job"]').each((_, el) => {
        const $el = $(el);
        const title = $el.find('h2, h3, h4, .title, .job-title').first().text().trim()
          || $el.text().trim().split('\n')[0].trim();
        const link = $el.attr('href') || $el.find('a').first().attr('href');

        if (!title || title.length > 200 || !isNursingJob(title)) return;

        const fullUrl = link
          ? (link.startsWith('http') ? link : `${SOURCE_URL}${link}`)
          : url;

        const pay = parsePay($el.find('.salary, .pay, [class*="salary"]').text().trim());

        jobs.push({
          title,
          facility_name: 'Providence Community Health Centers',
          facility_url: SOURCE_URL,
          location_city: 'Providence',
          location_state: 'RI',
          specialty: normalizeSpecialty(title),
          employment_type: normalizeEmploymentType(title),
          shift_type: normalizeShift(title),
          pay_min: pay.min,
          pay_max: pay.max,
          pay_raw: pay.raw,
          description: null,
          apply_url: fullUrl,
          source_url: fullUrl,
          source_type: 'scraped',
        });
      });

      // If we found jobs on this URL, no need to try others
      if (jobs.length > 0) break;
    } catch (err) {
      console.warn(`  [pchc] Failed to fetch ${url}: ${err.message}`);
    }
  }

  const resolvedJobs = [];
  for (const job of jobs) {
    resolvedJobs.push(await resolvePay(job));
  }

  console.log(`[pchc] Found ${resolvedJobs.length} nursing jobs`);
  return resolvedJobs;
}

export const sourceName = SOURCE_NAME;
export const sourceUrl = SOURCE_URL;
