/**
 * Nursys e-Notify API client
 * Docs: https://api.nursys.com
 * Auth: HTTP Basic (NURSYS_USERNAME / NURSYS_PASSWORD)
 */

const BASE_URL = process.env.NURSYS_API_URL!;

function authHeader(): string {
  const credentials = Buffer.from(
    `${process.env.NURSYS_USERNAME}:${process.env.NURSYS_PASSWORD}`
  ).toString("base64");
  return `Basic ${credentials}`;
}

async function apiRequest(
  method: "GET" | "POST",
  path: string,
  body?: unknown
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Nursys API ${res.status} on ${method} ${path}: ${text}`);
  }
  return res.json();
}

// ── Types ─────────────────────────────────────────────────────────────────

export interface EnrollmentData {
  jurisdictionAbbreviation: string;
  licenseNumber: string;
  licenseType: string;
  address1: string;
  city: string;
  state: string;
  zip: string;
  lastFourSSN: string;
  birthYear: string;
  recordId: string;
  email?: string;
}

export interface EnrollmentResult {
  enroll_transaction_id: string;
}

export interface ResolveEnrollmentResult {
  success: boolean;
}

export interface LookupResult {
  lookup_transaction_id: string;
}

export interface ResolveLookupResult {
  found: boolean;
  license_status?: string;
  license_expiration?: string;
  has_discipline?: boolean;
}

export interface NotificationRecord {
  recordId: string;
}

// ── API functions ──────────────────────────────────────────────────────────

/**
 * Step 1 of 4: Enroll a nurse in Nursys e-Notify.
 * Returns a transaction ID to poll via resolveEnrollment().
 */
export async function submitEnrollment(
  data: EnrollmentData
): Promise<EnrollmentResult> {
  const result = await apiRequest("POST", "/enrollment", data);
  return { enroll_transaction_id: result.transactionId };
}

/**
 * Step 2 of 4: Poll enrollment result.
 * Returns { success: true } once the enrollment has been processed.
 */
export async function resolveEnrollment(
  enrollTransactionId: string
): Promise<ResolveEnrollmentResult> {
  const result = await apiRequest("GET", `/enrollment/${enrollTransactionId}`);
  return { success: result.status === "success" };
}

/**
 * Step 3 of 4: Submit a license lookup for an enrolled nurse.
 * recordId = the nurse's Supabase user ID (passed as our internal identifier).
 * Returns a transaction ID to poll via resolveLookup().
 */
export async function submitLookup(recordId: string): Promise<LookupResult> {
  const result = await apiRequest("POST", "/lookup", { recordId });
  return { lookup_transaction_id: result.transactionId };
}

/**
 * Step 4 of 4: Poll lookup result.
 * Returns license status details once Nursys has responded.
 */
export async function resolveLookup(
  lookupTransactionId: string
): Promise<ResolveLookupResult> {
  const result = await apiRequest("GET", `/lookup/${lookupTransactionId}`);
  if (result.status !== "found") {
    return { found: false };
  }
  return {
    found: true,
    license_status: result.licenseStatus,
    license_expiration: result.licenseExpiration,
    has_discipline: result.hasDiscipline ?? false,
  };
}

/**
 * Fetch change notifications for a date range.
 * Used by the daily cron job to detect nurses whose license status changed.
 */
export async function checkNotifications(
  startDate: string,
  endDate: string
): Promise<NotificationRecord[]> {
  const result = await apiRequest(
    "GET",
    `/notification?startDate=${startDate}&endDate=${endDate}`
  );
  return Array.isArray(result) ? result : [];
}
