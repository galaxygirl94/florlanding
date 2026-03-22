/**
 * Brown University Health Careers Scraper
 *
 * Source: https://careers.brownhealth.org
 * Brown University Health operates Rhode Island Hospital, The Miriam Hospital,
 * Bradley Hospital, and other facilities.
 */

import { fetchPage, parsePay, normalizeSpecialty, normalizeEmploymentType, normalizeShift, isNursingJob, sleep } from '../base.js';
import { resolvePay } from '../pay-resolver.js';

const SOURCE_NAME = 'brown-health';
const SOURCE_URL = 'https://careers.brownhealth.org';
const SEARCH_URL = 'https://careers.brownhealth.org/search?q=nurse&location=Rhode+Island';

export async function scrape() {
  console.log('[brown-health] Scraping Brown University Health nursing jobs...');

  try {
    const $ = await fetchPage(SEARCH_URL);
    const jobs = [];

    // Parse job listings from search results page
    // Brown Health typically uses iCIMS or similar ATS
    $('a[href*="/job/"], a[href*="/jobs/"], .job-listing, .job-result, .opportunity-node, [class*="job"]').each((_, el) => {
      const $el = $(el);
      const title = $el.find('h2, h3, .job-title, .title').first().text().trim()
        || $el.text().trim().split('\n')[0].trim();
      const link = $el.attr('href') || $el.find('a').first().attr('href');

      if (!title || !isNursingJob(title)) return;

      const fullUrl = link
        ? (link.startsWith('http') ? link : `${SOURCE_URL}${link}`)
        : SOURCE_URL;

      const locationText = $el.find('.location, .job-location, [class*="location"]').text().trim();
      const payText = $el.find('.salary, .pay, .compensation, [class*="salary"], [class*="pay"]').text().trim();
      const typeText = $el.find('.type, .job-type, [class*="type"]').text().trim();

      const pay = parsePay(payText);

      jobs.push({
        title,
        facility_name: 'Brown University Health',
        facility_url: SOURCE_URL,
        location_city: parseCity(locationText),
        location_state: 'RI',
        specialty: normalizeSpecialty(title),
        employment_type: normalizeEmploymentType(typeText || title),
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

    // Resolve pay for each job
    const resolvedJobs = [];
    for (const job of jobs) {
      resolvedJobs.push(await resolvePay(job));
    }

    console.log(`[brown-health] Found ${resolvedJobs.length} nursing jobs`);
    return resolvedJobs;
  } catch (err) {
    console.error(`[brown-health] Scraper failed: ${err.message}`);
    throw err;
  }
}

function parseCity(text) {
  if (!text) return 'Providence';
  const parts = text.split(',');
  return parts[0].trim() || 'Providence';
}

export const sourceName = SOURCE_NAME;
export const sourceUrl = SOURCE_URL;
