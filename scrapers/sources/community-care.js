/**
 * Community Care Alliance Scraper
 *
 * Source: https://www.communitycareri.org
 */

import { fetchPage, parsePay, normalizeSpecialty, normalizeEmploymentType, normalizeShift, isNursingJob } from '../base.js';
import { resolvePay } from '../pay-resolver.js';

const SOURCE_NAME = 'community-care';
const SOURCE_URL = 'https://www.communitycareri.org';
const CAREERS_URLS = [
  'https://www.communitycareri.org/careers',
  'https://www.communitycareri.org/jobs',
  'https://www.communitycareri.org/employment',
];

export async function scrape() {
  console.log('[community-care] Scraping Community Care Alliance nursing jobs...');

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
          facility_name: 'Community Care Alliance',
          facility_url: SOURCE_URL,
          location_city: 'Woonsocket',
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

      if (jobs.length > 0) break;
    } catch (err) {
      console.warn(`  [community-care] Failed to fetch ${url}: ${err.message}`);
    }
  }

  const resolvedJobs = [];
  for (const job of jobs) {
    resolvedJobs.push(await resolvePay(job));
  }

  console.log(`[community-care] Found ${resolvedJobs.length} nursing jobs`);
  return resolvedJobs;
}

export const sourceName = SOURCE_NAME;
export const sourceUrl = SOURCE_URL;
