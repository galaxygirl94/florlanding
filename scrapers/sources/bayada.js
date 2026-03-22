/**
 * BAYADA Home Health Care — Rhode Island Scraper
 *
 * Source: BAYADA careers page, filtered to Rhode Island RN positions.
 * BAYADA uses a centralized careers portal.
 */

import { fetchPage, fetchJSON, parsePay, normalizeSpecialty, normalizeEmploymentType, normalizeShift, isNursingJob, sleep } from '../base.js';
import { resolvePay } from '../pay-resolver.js';

const SOURCE_NAME = 'bayada';
const SOURCE_URL = 'https://www.bayada.com/careers';
const SEARCH_URL = 'https://www.bayada.com/careers/search?q=nurse&state=Rhode+Island';

export async function scrape() {
  console.log('[bayada] Scraping BAYADA Rhode Island nursing jobs...');

  try {
    const $ = await fetchPage(SEARCH_URL);
    const jobs = [];

    $('a[href*="job"], a[href*="career"], a[href*="position"], .job-listing, [class*="job-card"], [class*="job-result"]').each((_, el) => {
      const $el = $(el);
      const title = $el.find('h2, h3, h4, .title, .job-title').first().text().trim()
        || $el.text().trim().split('\n')[0].trim();
      const link = $el.attr('href') || $el.find('a').first().attr('href');

      if (!title || title.length > 200 || !isNursingJob(title)) return;

      // Filter to Rhode Island only
      const locationText = $el.find('.location, [class*="location"]').text().trim();
      if (locationText && !/(rhode island|ri\b|providence|warwick|cranston|pawtucket)/i.test(locationText)) {
        return;
      }

      const fullUrl = link
        ? (link.startsWith('http') ? link : `https://www.bayada.com${link}`)
        : SEARCH_URL;

      const pay = parsePay($el.find('.salary, .pay, [class*="salary"]').text().trim());

      jobs.push({
        title,
        facility_name: 'BAYADA Rhode Island',
        facility_url: SOURCE_URL,
        location_city: parseCity(locationText),
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

    const resolvedJobs = [];
    for (const job of jobs) {
      resolvedJobs.push(await resolvePay(job));
    }

    console.log(`[bayada] Found ${resolvedJobs.length} nursing jobs`);
    return resolvedJobs;
  } catch (err) {
    console.error(`[bayada] Scraper failed: ${err.message}`);
    throw err;
  }
}

function parseCity(text) {
  if (!text) return 'Providence';
  return text.split(',')[0].trim() || 'Providence';
}

export const sourceName = SOURCE_NAME;
export const sourceUrl = SOURCE_URL;
