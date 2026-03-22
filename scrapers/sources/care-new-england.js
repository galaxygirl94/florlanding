/**
 * Care New England Careers Scraper
 *
 * Source: https://www.carenewengland.org/careers
 * Operates Kent Hospital, Women & Infants Hospital, Butler Hospital, and VNA of Care New England.
 */

import { fetchPage, parsePay, normalizeSpecialty, normalizeEmploymentType, normalizeShift, isNursingJob } from '../base.js';
import { resolvePay } from '../pay-resolver.js';

const SOURCE_NAME = 'care-new-england';
const SOURCE_URL = 'https://www.carenewengland.org/careers';

export async function scrape() {
  console.log('[care-new-england] Scraping Care New England nursing jobs...');

  try {
    const $ = await fetchPage(SOURCE_URL);
    const jobs = [];

    // Care New England may link to external ATS — look for job links
    $('a[href*="job"], a[href*="career"], a[href*="position"], .job-listing, .careers-listing').each((_, el) => {
      const $el = $(el);
      const title = $el.find('h2, h3, h4, .title, .job-title').first().text().trim()
        || $el.text().trim().split('\n')[0].trim();
      const link = $el.attr('href') || $el.find('a').first().attr('href');

      if (!title || title.length > 200 || !isNursingJob(title)) return;

      const fullUrl = link
        ? (link.startsWith('http') ? link : `https://www.carenewengland.org${link}`)
        : SOURCE_URL;

      const locationText = $el.find('.location, [class*="location"]').text().trim();
      const payText = $el.find('.salary, .pay, [class*="salary"]').text().trim();
      const typeText = $el.find('.type, [class*="type"]').text().trim();

      const pay = parsePay(payText);

      jobs.push({
        title,
        facility_name: 'Care New England',
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

    const resolvedJobs = [];
    for (const job of jobs) {
      resolvedJobs.push(await resolvePay(job));
    }

    console.log(`[care-new-england] Found ${resolvedJobs.length} nursing jobs`);
    return resolvedJobs;
  } catch (err) {
    console.error(`[care-new-england] Scraper failed: ${err.message}`);
    throw err;
  }
}

function parseCity(text) {
  if (!text) return 'Warwick';
  return text.split(',')[0].trim() || 'Warwick';
}

export const sourceName = SOURCE_NAME;
export const sourceUrl = SOURCE_URL;
