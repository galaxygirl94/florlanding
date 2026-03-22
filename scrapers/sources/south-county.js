/**
 * South County Health Careers Scraper
 *
 * Source: https://www.southcountyhealth.org/careers
 */

import { fetchPage, parsePay, normalizeSpecialty, normalizeEmploymentType, normalizeShift, isNursingJob } from '../base.js';
import { resolvePay } from '../pay-resolver.js';

const SOURCE_NAME = 'south-county';
const SOURCE_URL = 'https://www.southcountyhealth.org/careers';

export async function scrape() {
  console.log('[south-county] Scraping South County Health nursing jobs...');

  try {
    const $ = await fetchPage(SOURCE_URL);
    const jobs = [];

    $('a[href*="job"], a[href*="career"], a[href*="position"], .job-listing, [class*="job"]').each((_, el) => {
      const $el = $(el);
      const title = $el.find('h2, h3, h4, .title, .job-title').first().text().trim()
        || $el.text().trim().split('\n')[0].trim();
      const link = $el.attr('href') || $el.find('a').first().attr('href');

      if (!title || title.length > 200 || !isNursingJob(title)) return;

      const fullUrl = link
        ? (link.startsWith('http') ? link : `https://www.southcountyhealth.org${link}`)
        : SOURCE_URL;

      const pay = parsePay($el.find('.salary, .pay, [class*="salary"]').text().trim());

      jobs.push({
        title,
        facility_name: 'South County Health',
        facility_url: SOURCE_URL,
        location_city: 'Wakefield',
        location_state: 'RI',
        specialty: normalizeSpecialty(title),
        employment_type: normalizeEmploymentType($el.find('[class*="type"]').text().trim() || title),
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

    const resolvedJobs = [];
    for (const job of jobs) {
      resolvedJobs.push(await resolvePay(job));
    }

    console.log(`[south-county] Found ${resolvedJobs.length} nursing jobs`);
    return resolvedJobs;
  } catch (err) {
    console.error(`[south-county] Scraper failed: ${err.message}`);
    throw err;
  }
}

export const sourceName = SOURCE_NAME;
export const sourceUrl = SOURCE_URL;
