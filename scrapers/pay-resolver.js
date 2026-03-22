/**
 * Pay Resolver — determines the best available pay data for a job
 *
 * Priority order:
 *   1. Facility-listed pay (scraped directly) — pay_source: 'facility', confidence: 'high'
 *   2. Community submitted pay from pay_intelligence table — pay_source: 'community', confidence: 'medium'
 *   3. Manually researched facility pay — pay_source: 'glassdoor_estimate', confidence: 'medium'
 *   4. BLS RI baseline for that specialty — pay_source: 'bls_estimate', confidence: 'estimated'
 *   5. No pay data available — all pay fields null
 */

import { BLS_RI_BASELINES } from './data/bls-ri-pay-baseline.js';
import { FACILITY_PAY_RESEARCH } from './data/facility-pay-research.js';

/**
 * Look up community-submitted pay intelligence from Supabase
 * Returns { pay_min, pay_max } or null
 */
async function getCommunityPay(supabase, facilityName, specialty) {
  if (!supabase) return null;

  try {
    let query = supabase
      .from('pay_intelligence')
      .select('pay_min, pay_max')
      .eq('pay_source', 'community_submitted');

    if (facilityName) {
      query = query.ilike('facility_name', `%${facilityName}%`);
    }
    if (specialty) {
      query = query.ilike('specialty', `%${specialty}%`);
    }

    const { data, error } = await query
      .order('effective_date', { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) return null;
    if (data[0].pay_min == null && data[0].pay_max == null) return null;

    return { pay_min: data[0].pay_min, pay_max: data[0].pay_max };
  } catch (err) {
    console.warn(`  [pay-resolver] Community pay lookup failed:`, err.message);
    return null;
  }
}

/**
 * Look up manually researched facility pay from local data
 */
function getFacilityResearchPay(facilityName) {
  if (!facilityName) return null;

  const normalizedName = facilityName.toLowerCase();

  for (const [name, data] of Object.entries(FACILITY_PAY_RESEARCH)) {
    if (normalizedName.includes(name.toLowerCase()) || name.toLowerCase().includes(normalizedName)) {
      if (data.pay_min != null && data.pay_max != null) {
        return data;
      }
    }
  }

  return null;
}

/**
 * Look up BLS baseline pay for a specialty
 */
function getBLSBaselinePay(specialty) {
  if (!specialty) return BLS_RI_BASELINES['General RN'] || null;

  const normalizedSpecialty = specialty.toLowerCase();

  for (const [name, data] of Object.entries(BLS_RI_BASELINES)) {
    if (normalizedSpecialty.includes(name.toLowerCase()) || name.toLowerCase().includes(normalizedSpecialty)) {
      return data;
    }
  }

  // Fall back to General RN
  return BLS_RI_BASELINES['General RN'] || null;
}

/**
 * Resolve pay for a job object.
 *
 * @param {object} job - Job object with at least: pay_min, pay_max, facility_name, specialty
 * @param {object} [supabase] - Optional Supabase client for community pay lookup
 * @returns {object} Job object with pay_min, pay_max, pay_source, pay_confidence populated
 */
export async function resolvePay(job, supabase = null) {
  // Priority 1: Facility-listed pay (already scraped)
  if (job.pay_min != null && job.pay_max != null && job.pay_min > 0 && job.pay_max > 0) {
    return {
      ...job,
      pay_source: job.pay_source || 'facility',
      pay_confidence: job.pay_confidence || 'high',
    };
  }

  // Priority 2: Community submitted pay
  const communityPay = await getCommunityPay(supabase, job.facility_name, job.specialty);
  if (communityPay) {
    console.log(`  [pay-resolver] Using community pay for "${job.title}" at ${job.facility_name}`);
    return {
      ...job,
      pay_min: communityPay.pay_min,
      pay_max: communityPay.pay_max,
      pay_source: 'community',
      pay_confidence: 'medium',
    };
  }

  // Priority 3: Manually researched facility pay
  const facilityResearch = getFacilityResearchPay(job.facility_name);
  if (facilityResearch) {
    console.log(`  [pay-resolver] Using researched pay for "${job.title}" at ${job.facility_name}`);
    return {
      ...job,
      pay_min: facilityResearch.pay_min,
      pay_max: facilityResearch.pay_max,
      pay_source: 'glassdoor_estimate',
      pay_confidence: 'medium',
    };
  }

  // Priority 4: BLS RI baseline for specialty
  const blsPay = getBLSBaselinePay(job.specialty);
  if (blsPay) {
    console.log(`  [pay-resolver] Using BLS estimate for "${job.title}" (${job.specialty || 'General RN'})`);
    return {
      ...job,
      pay_min: blsPay.pay_min,
      pay_max: blsPay.pay_max,
      pay_source: 'bls_estimate',
      pay_confidence: 'estimated',
    };
  }

  // Priority 5: No pay data
  console.log(`  [pay-resolver] No pay data available for "${job.title}"`);
  return {
    ...job,
    pay_min: null,
    pay_max: null,
    pay_source: null,
    pay_confidence: null,
  };
}
