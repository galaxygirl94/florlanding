/**
 * Visiting Nurse Service of New England Scraper
 *
 * Source: https://www.vnservices.org
 */

import { fetchPage, parsePay, normalizeSpecialty, normalizeEmploymentType, normalizeShift, isNursingJob } from '../base.js';
import { resolvePay } from '../pay-resolver.js';

const SOURCE_NAME = 'vnservices';
const SOURCE_URL = 'https://www.vnservices.org';
const CAREERS_URLS = [
  'https://www.vnservices.org/careers',
  'https://www.vnservices.org/jobs',
  'https://www.vnservices.org/employment',
];

export async function scrape() {
  console.log('[vnservices] Scraping Visiting Nurse Service nursing jobs...');

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
          facility_name: 'Visiting Nurse Service of New England',
          facility_url: SOURCE_URL,
          location_city: 'Warwick',
          location_state: 'RI',
          specialty: 'Home Health',
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

      if (jobs.length > 0) break;
    } catch (err) {
      console.warn(`  [vnservices] Failed to fetch ${url}: ${err.message}`);
    }
  }

  const resolvedJobs = [];
  for (const job of jobs) {
    resolvedJobs.push(await resolvePay(job));
  }

  console.log(`[vnservices] Found ${resolvedJobs.length} nursing jobs`);
  return resolvedJobs;
}

export const sourceName = SOURCE_NAME;
export const sourceUrl = SOURCE_URL;
