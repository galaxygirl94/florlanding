/**
 * Rhode Island Government Jobs Scraper
 *
 * Scrapes nursing-related job listings from apply.ri.gov (Workday-powered)
 * and outputs structured JSON matching the Flor job data schema.
 *
 * Usage:
 *   npx tsx src/scrapers/ri-gov-scraper.ts
 *
 * The Workday career site API is at:
 *   POST https://ri.wd5.myworkdayjobs.com/wday/cxs/ri/RI/jobs
 */

import * as fs from "fs";
import * as path from "path";

// --- Types ---

interface WorkdaySearchPayload {
  appliedFacets: Record<string, string[]>;
  limit: number;
  offset: number;
  searchText: string;
}

interface WorkdayJobPosting {
  title: string;
  externalPath: string;
  locationsText: string;
  postedOn: string;
  bulletFields: string[];
}

interface WorkdaySearchResponse {
  total: number;
  jobPostings: WorkdayJobPosting[];
}

interface WorkdayJobDetail {
  jobPostingInfo: {
    title: string;
    location: string;
    timeType: string;
    postedOn: string;
    endDate?: string;
    jobReqId: string;
    additionalLocations?: string[];
    jobDescription: string;
    externalUrl: string;
  };
}

export interface ScrapedJobListing {
  id: string;
  facilityId: string;
  facilityName: string;
  title: string;
  payRange: { min: number; max: number };
  payUnit: string;
  payExplained: string;
  type: string;
  hoursPerWeek?: number;
  location: { city: string; state: string };
  schedule: string;
  scheduleType: string;
  scheduleBadges: string[];
  licenseRequired: { type: string; state: string };
  certificationsRequired: string[];
  drivingRequired: boolean;
  union: boolean;
  postedDate: string;
  closingDate?: string;
  questions: [];
  // Scraper-specific fields
  source: string;
  verified: boolean;
  urgent: boolean;
  jobRequisitionId: string;
  directUrl: string;
  salaryRaw?: string;
  scrapedAt: string;
}

// --- Constants ---

const BASE_URL = "https://ri.wd5.myworkdayjobs.com";
const SEARCH_API = `${BASE_URL}/wday/cxs/ri/RI/jobs`;
const CAREER_PAGE = `${BASE_URL}/RI`;
const SEARCH_KEYWORDS = ["nurse", "RN", "LPN", "nursing"];
const PAGE_SIZE = 20;
const HOURS_PER_YEAR = 2080;
const URGENT_DAYS_THRESHOLD = 7;
const REQUEST_DELAY_MS = 1000;

const OUTPUT_DIR = path.resolve(__dirname, "..", "data");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "scraped-ri-gov-jobs.json");

// --- Helpers ---

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toISODate(dateStr: string | undefined): string | undefined {
  if (!dateStr) return undefined;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return undefined;
    return d.toISOString().split("T")[0];
  } catch {
    return undefined;
  }
}

function isClosingSoon(closingDate: string | undefined): boolean {
  if (!closingDate) return false;
  const now = new Date();
  const close = new Date(closingDate);
  const diffMs = close.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= URGENT_DAYS_THRESHOLD;
}

/**
 * Parse salary text from Workday bulletFields or job description.
 * Handles formats like:
 *   "$52,000 - $65,000 annually"
 *   "$25.00 - $30.00 per hour"
 *   "$45,000.00"
 */
function parseSalary(fields: string[], description: string): {
  min: number;
  max: number;
  unit: string;
  raw: string;
  explained: string;
} {
  const salaryPatterns = [
    /\$[\d,]+(?:\.\d{2})?\s*[-–]\s*\$[\d,]+(?:\.\d{2})?\s*(?:per\s+)?(hour|hr|year|annually|annual|yr)/i,
    /\$[\d,]+(?:\.\d{2})?\s*(?:per\s+)?(hour|hr|year|annually|annual|yr)/i,
    /salary[:\s]*\$[\d,]+(?:\.\d{2})?\s*[-–]\s*\$[\d,]+(?:\.\d{2})?/i,
  ];

  const allText = [...fields, description].join(" ");

  for (const pattern of salaryPatterns) {
    const match = allText.match(pattern);
    if (match) {
      const raw = match[0];
      const numbers = raw.match(/\$[\d,]+(?:\.\d{2})?/g);
      if (!numbers) continue;

      const values = numbers.map((n) =>
        parseFloat(n.replace(/[$,]/g, ""))
      );
      const isAnnual = /year|annually|annual|yr/i.test(raw);
      const isHourly = /hour|hr/i.test(raw);

      let min = values[0];
      let max = values.length > 1 ? values[1] : values[0];
      let unit = "hr";
      let explained = raw;

      if (isAnnual) {
        // Convert annual to hourly
        const annualMin = min;
        const annualMax = max;
        min = Math.round((annualMin / HOURS_PER_YEAR) * 100) / 100;
        max = Math.round((annualMax / HOURS_PER_YEAR) * 100) / 100;
        unit = "hr";
        explained = `${raw} (converted to hourly: $${min.toFixed(2)}-$${max.toFixed(2)}/hr based on ${HOURS_PER_YEAR} hrs/yr)`;
      } else if (isHourly) {
        unit = "hr";
        explained = raw;
      }

      return { min, max, unit, raw, explained };
    }
  }

  return {
    min: 0,
    max: 0,
    unit: "hr",
    raw: "Not listed",
    explained: "Salary not listed in posting — contact employer for details",
  };
}

/**
 * Parse location string like "Providence, RI" or "Cranston"
 */
function parseLocation(locationStr: string): { city: string; state: string } {
  if (!locationStr) return { city: "Rhode Island", state: "RI" };

  const parts = locationStr.split(",").map((s) => s.trim());
  if (parts.length >= 2) {
    return {
      city: parts[0],
      state: parts[1].replace(/\s+\d{5}.*/, "").trim() || "RI",
    };
  }
  return { city: parts[0] || "Rhode Island", state: "RI" };
}

/**
 * Infer license type from job title
 */
function inferLicenseType(title: string): string {
  const upper = title.toUpperCase();
  if (upper.includes("LPN")) return "LPN";
  if (upper.includes("CNA")) return "CNA";
  if (upper.includes("APRN") || upper.includes("ADVANCED PRACTICE")) return "APRN";
  if (upper.includes("RN") || upper.includes("REGISTERED NURSE")) return "RN";
  if (upper.includes("NURSE")) return "RN";
  return "RN";
}

/**
 * Infer schedule info from job description and fields
 */
function inferSchedule(
  fields: string[],
  description: string,
  timeType: string
): {
  schedule: string;
  scheduleType: string;
  scheduleBadges: string[];
} {
  const allText = [...fields, description, timeType].join(" ").toLowerCase();
  const badges: string[] = [];
  let scheduleType = "Days";
  let schedule = timeType || "Full-time";

  if (allText.includes("night") || allText.includes("overnight")) {
    scheduleType = "Nights";
    badges.push("Nights");
  } else if (allText.includes("evening")) {
    scheduleType = "Evenings";
    badges.push("Evenings");
  } else if (allText.includes("rotating")) {
    scheduleType = "Rotating";
    badges.push("Rotating");
  } else {
    badges.push("Days");
  }

  if (allText.includes("weekend")) badges.push("Weekends");
  if (allText.includes("on-call") || allText.includes("on call"))
    badges.push("On-Call");
  if (allText.includes("mon") && allText.includes("fri"))
    badges.push("Mon-Fri");
  if (allText.includes("part-time") || allText.includes("part time")) {
    schedule = "Part-time";
    badges.push("Part-Time");
  }
  if (allText.includes("full-time") || allText.includes("full time")) {
    schedule = "Full-time";
  }

  if (badges.length === 0) badges.push(scheduleType);

  return { schedule, scheduleType, scheduleBadges: badges };
}

/**
 * Determine the facility name from department info in description
 */
function extractDepartment(description: string): string {
  const deptPatterns = [
    /department[:\s]+([^\n<]+)/i,
    /agency[:\s]+([^\n<]+)/i,
    /organization[:\s]+([^\n<]+)/i,
  ];

  for (const pattern of deptPatterns) {
    const match = description.match(pattern);
    if (match) return match[1].trim();
  }

  return "State of Rhode Island";
}

// --- API Functions ---

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 3
): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      if (response.status >= 500 && attempt < retries) {
        await sleep(Math.pow(2, attempt) * 1000);
        continue;
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (err) {
      if (attempt === retries) throw err;
      await sleep(Math.pow(2, attempt) * 1000);
    }
  }
  throw new Error("Fetch failed after retries");
}

/**
 * Search for jobs matching a keyword. Paginates through all results.
 */
async function searchJobs(keyword: string): Promise<WorkdayJobPosting[]> {
  const results: WorkdayJobPosting[] = [];
  let offset = 0;
  let total = Infinity;

  console.log(`  Searching for "${keyword}"...`);

  while (offset < total) {
    const payload: WorkdaySearchPayload = {
      appliedFacets: {},
      limit: PAGE_SIZE,
      offset,
      searchText: keyword,
    };

    const response = await fetchWithRetry(SEARCH_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as WorkdaySearchResponse;
    total = data.total;

    if (!data.jobPostings || data.jobPostings.length === 0) break;
    results.push(...data.jobPostings);
    offset += PAGE_SIZE;

    console.log(`    Fetched ${results.length}/${total} results`);
    await sleep(REQUEST_DELAY_MS);
  }

  return results;
}

/**
 * Fetch full job detail for a posting
 */
async function fetchJobDetail(
  externalPath: string
): Promise<WorkdayJobDetail | null> {
  const url = `${BASE_URL}/wday/cxs/ri/RI${externalPath}`;
  try {
    const response = await fetchWithRetry(url, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    return (await response.json()) as WorkdayJobDetail;
  } catch (err) {
    console.warn(`  Warning: Could not fetch detail for ${externalPath}:`, err);
    return null;
  }
}

// --- Main Pipeline ---

async function scrapeRIGovJobs(): Promise<ScrapedJobListing[]> {
  console.log("=== RI.gov Nursing Jobs Scraper ===");
  console.log(`Started at: ${new Date().toISOString()}`);
  console.log(`Target: ${CAREER_PAGE}`);
  console.log();

  // Step 1: Search for all nursing keywords
  const allPostings = new Map<string, WorkdayJobPosting>();

  for (const keyword of SEARCH_KEYWORDS) {
    const postings = await searchJobs(keyword);
    for (const posting of postings) {
      // Deduplicate by externalPath
      allPostings.set(posting.externalPath, posting);
    }
    await sleep(REQUEST_DELAY_MS);
  }

  console.log(`\nFound ${allPostings.size} unique nursing-related postings`);

  // Step 2: Fetch details and transform each posting
  const jobs: ScrapedJobListing[] = [];
  const now = new Date().toISOString();
  let idx = 0;

  for (const [externalPath, posting] of Array.from(allPostings.entries())) {
    idx++;
    console.log(
      `\nProcessing ${idx}/${allPostings.size}: ${posting.title}`
    );

    const detail = await fetchJobDetail(externalPath);
    await sleep(REQUEST_DELAY_MS);

    const info = detail?.jobPostingInfo;
    const description = info?.jobDescription ?? "";
    const bulletFields = posting.bulletFields ?? [];

    // Parse all extracted fields
    const salary = parseSalary(bulletFields, description);
    const location = parseLocation(
      info?.location ?? posting.locationsText ?? ""
    );
    const licenseType = inferLicenseType(posting.title);
    const scheduleInfo = inferSchedule(
      bulletFields,
      description,
      info?.timeType ?? ""
    );
    const department = extractDepartment(description);
    const postedDate = toISODate(info?.postedOn ?? posting.postedOn) ?? now.split("T")[0];
    const closingDate = toISODate(info?.endDate);
    const jobReqId = info?.jobReqId ?? `RI-${externalPath.replace(/\D/g, "").slice(0, 10)}`;
    const directUrl = `${CAREER_PAGE}${externalPath}`;

    const job: ScrapedJobListing = {
      id: `ri-gov-${jobReqId}`,
      facilityId: "ri-state-gov",
      facilityName: department,
      title: posting.title,
      payRange: { min: salary.min, max: salary.max },
      payUnit: salary.unit,
      payExplained: salary.explained,
      type: "Government",
      hoursPerWeek: scheduleInfo.schedule.toLowerCase().includes("part") ? undefined : 40,
      location,
      schedule: scheduleInfo.schedule,
      scheduleType: scheduleInfo.scheduleType,
      scheduleBadges: scheduleInfo.scheduleBadges,
      licenseRequired: { type: licenseType, state: "RI" },
      certificationsRequired: [],
      drivingRequired: false,
      union: false,
      postedDate,
      closingDate,
      questions: [],
      // Scraper-specific fields
      source: "apply.ri.gov",
      verified: false,
      urgent: isClosingSoon(closingDate),
      jobRequisitionId: jobReqId,
      directUrl,
      salaryRaw: salary.raw !== "Not listed" ? salary.raw : undefined,
      scrapedAt: now,
    };

    jobs.push(job);
  }

  return jobs;
}

async function main(): Promise<void> {
  try {
    const jobs = await scrapeRIGovJobs();

    // Write output
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const output = {
      metadata: {
        source: "apply.ri.gov",
        scrapedAt: new Date().toISOString(),
        totalJobs: jobs.length,
        urgentJobs: jobs.filter((j) => j.urgent).length,
        keywords: SEARCH_KEYWORDS,
      },
      jobs,
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    console.log(`\n=== Scrape Complete ===`);
    console.log(`Total jobs: ${jobs.length}`);
    console.log(`Urgent (closing within ${URGENT_DAYS_THRESHOLD} days): ${output.metadata.urgentJobs}`);
    console.log(`Output: ${OUTPUT_FILE}`);
  } catch (err) {
    console.error("Scraper failed:", err);
    process.exit(1);
  }
}

main();
