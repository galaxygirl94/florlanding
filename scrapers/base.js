/**
 * Scraper Base Utilities
 *
 * Shared helpers for all individual scrapers:
 *   - fetchWithRetry: HTTP fetch with exponential backoff
 *   - parsePay: Convert salary strings to { min, max } hourly
 *   - normalizeSpecialty: Map job titles to Flor specialty categories
 *   - checkDuplicate: Deduplicate against existing Supabase records
 */

import * as cheerio from 'cheerio';

const USER_AGENT = 'FlorForNurses/1.0 (job-aggregator; contact@florfornurses.com)';
const HOURS_PER_YEAR = 2080;

// -------------------------------------------------------------------
// fetchWithRetry — HTTP GET/POST with 3 retries and exponential backoff
// -------------------------------------------------------------------

export async function fetchWithRetry(url, options = {}, retries = 3) {
  const defaults = {
    headers: {
      'User-Agent': USER_AGENT,
      'Accept': 'text/html,application/xhtml+xml,application/json',
      ...options.headers,
    },
    ...options,
  };

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, defaults);

      if (response.ok) return response;

      // Retry on server errors
      if (response.status >= 500 && attempt < retries) {
        const delay = Math.pow(2, attempt) * 1000;
        console.warn(`  [fetch] ${url} returned ${response.status}, retrying in ${delay}ms...`);
        await sleep(delay);
        continue;
      }

      throw new Error(`HTTP ${response.status} from ${url}`);
    } catch (err) {
      if (attempt === retries) throw err;
      const delay = Math.pow(2, attempt) * 1000;
      console.warn(`  [fetch] ${url} failed (${err.message}), retrying in ${delay}ms...`);
      await sleep(delay);
    }
  }
}

/**
 * Fetch a page and return a cheerio instance
 */
export async function fetchPage(url) {
  const response = await fetchWithRetry(url);
  const html = await response.text();
  return cheerio.load(html);
}

/**
 * Fetch JSON from a URL
 */
export async function fetchJSON(url, options = {}) {
  const response = await fetchWithRetry(url, {
    headers: { 'Accept': 'application/json', ...options.headers },
    ...options,
  });
  return response.json();
}

// -------------------------------------------------------------------
// parsePay — Convert pay strings to { min, max } hourly rates
// -------------------------------------------------------------------

/**
 * Parse pay string into hourly min/max.
 *
 * Handles:
 *   "$38-46/hr", "$28 - $50/hour"
 *   "$88,000/year", "$75,000 - $95,000 annually"
 *   "$38.50 per hour", "$38.50/hr - $46.00/hr"
 *   "Starting at $40/hr"
 *
 * @param {string} payString - Raw pay text from scraping
 * @returns {{ min: number|null, max: number|null, raw: string }}
 */
export function parsePay(payString) {
  if (!payString) return { min: null, max: null, raw: null };

  const raw = payString.trim();
  const amounts = raw.match(/\$[\d,]+(?:\.\d{1,2})?/g);

  if (!amounts || amounts.length === 0) return { min: null, max: null, raw };

  const values = amounts.map(a => parseFloat(a.replace(/[$,]/g, '')));
  const isAnnual = /year|annual|yr|salary/i.test(raw);

  let min = values[0];
  let max = values.length > 1 ? values[1] : values[0];

  if (isAnnual) {
    min = Math.round((min / HOURS_PER_YEAR) * 100) / 100;
    max = Math.round((max / HOURS_PER_YEAR) * 100) / 100;
  }

  return { min, max, raw };
}

// -------------------------------------------------------------------
// normalizeSpecialty — Map job titles to Flor specialty categories
// -------------------------------------------------------------------

const SPECIALTY_MAP = [
  { keywords: ['icu', 'intensive care', 'critical care'], specialty: 'ICU' },
  { keywords: ['med surg', 'med-surg', 'medical surgical', 'medical-surgical'], specialty: 'Med Surg' },
  { keywords: ['pediatric', 'peds', 'nicu', 'picu'], specialty: 'Pediatrics' },
  { keywords: ['behavioral', 'mental health', 'psychiatric', 'psych'], specialty: 'Behavioral Health' },
  { keywords: ['outpatient', 'ambulatory', 'clinic'], specialty: 'Outpatient' },
  { keywords: ['school nurse', 'school nursing', 'school health'], specialty: 'School Nursing' },
  { keywords: ['long-term', 'long term', 'ltc', 'skilled nursing', 'nursing home', 'snf'], specialty: 'Long-Term Care' },
  { keywords: ['rehab', 'rehabilitation', 'physical therapy'], specialty: 'Rehab' },
  { keywords: ['home health', 'home care', 'visiting nurse', 'vna'], specialty: 'Home Health' },
  { keywords: ['or ', 'operating room', 'perioperative', 'surgical'], specialty: 'OR/Perioperative' },
  { keywords: ['emergency', ' er ', 'emergency department', 'ed '], specialty: 'Emergency' },
  { keywords: ['oncology', 'cancer'], specialty: 'Oncology' },
  { keywords: ['labor', 'delivery', 'l&d', 'ob ', 'obstetric', 'maternity'], specialty: 'Labor & Delivery' },
  { keywords: ['telemetry', 'tele'], specialty: 'Telemetry' },
  { keywords: ['cardiac', 'cardiology', 'cath lab'], specialty: 'Cardiac' },
];

/**
 * Normalize a job title into a Flor specialty category
 * @param {string} title - Job title
 * @param {string} [description] - Optional job description for additional context
 * @returns {string|null}
 */
export function normalizeSpecialty(title, description = '') {
  const text = `${title} ${description}`.toLowerCase();

  for (const { keywords, specialty } of SPECIALTY_MAP) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) return specialty;
    }
  }

  // Default based on license type
  if (/\blpn\b/i.test(title)) return 'Long-Term Care';
  if (/\bcna\b/i.test(title)) return 'Long-Term Care';

  return 'General RN';
}

/**
 * Infer employment type from text
 */
export function normalizeEmploymentType(text) {
  if (!text) return null;
  const lower = text.toLowerCase();
  if (lower.includes('per diem') || lower.includes('prn')) return 'Per Diem';
  if (lower.includes('part-time') || lower.includes('part time')) return 'Part-time';
  if (lower.includes('full-time') || lower.includes('full time')) return 'Full-time';
  return null;
}

/**
 * Infer shift type from text
 */
export function normalizeShift(text) {
  if (!text) return null;
  const lower = text.toLowerCase();
  if (lower.includes('night') || lower.includes('overnight') || lower.includes('noc')) return 'Nights';
  if (lower.includes('evening') || lower.includes('eve')) return 'Evenings';
  if (lower.includes('rotating')) return 'Rotating';
  if (lower.includes('day')) return 'Days';
  return null;
}

// -------------------------------------------------------------------
// checkDuplicate — Deduplicate by source_url against Supabase
// -------------------------------------------------------------------

/**
 * Check if a job already exists in Supabase by source_url
 * @returns {object|null} Existing job record, or null
 */
export async function checkDuplicate(supabase, sourceUrl) {
  if (!supabase || !sourceUrl) return null;

  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('id, title, updated_at')
      .eq('source_url', sourceUrl)
      .limit(1);

    if (error || !data || data.length === 0) return null;
    return data[0];
  } catch {
    return null;
  }
}

// -------------------------------------------------------------------
// Helpers
// -------------------------------------------------------------------

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Filter job list to only nursing-related titles
 */
export function isNursingJob(title) {
  return /\b(nurse|nursing|rn|lpn|cna|aprn|np\b|nurse practitioner)/i.test(title);
}
