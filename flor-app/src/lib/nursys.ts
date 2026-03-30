// Server-side only — never import in client components.
// Credentials come exclusively from environment variables.

export interface NursysLicenseResult {
  licenseNumber: string;
  state: string;
  licenseStatus: string;
  expirationDate: string | null;
  disciplineFlags: boolean;
  compactPrivileges: string[];
  rawResponse?: unknown;
}

interface NursysAuthResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
}

async function getNursysToken(): Promise<string> {
  const baseUrl = process.env.NURSYS_API_BASE_URL;
  const username = process.env.NURSYS_API_USERNAME;
  const password = process.env.NURSYS_API_PASSWORD;

  if (!baseUrl || !username || !password) {
    throw new Error("Nursys API credentials not configured");
  }

  const res = await fetch(`${baseUrl}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "password",
      username,
      password,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Nursys auth failed (${res.status}): ${text}`);
  }

  const data: NursysAuthResponse = await res.json();
  return data.access_token;
}

export async function verifyNurseLicense(
  licenseNumber: string,
  state: string
): Promise<NursysLicenseResult> {
  const baseUrl = process.env.NURSYS_API_BASE_URL;
  if (!baseUrl) throw new Error("NURSYS_API_BASE_URL not set");

  const token = await getNursysToken();

  const res = await fetch(`${baseUrl}/license/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      licenseNumber: licenseNumber.trim().toUpperCase(),
      state: state.trim().toUpperCase(),
    }),
    cache: "no-store",
  });

  if (res.status === 404) {
    return {
      licenseNumber,
      state,
      licenseStatus: "not_found",
      expirationDate: null,
      disciplineFlags: false,
      compactPrivileges: [],
    };
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Nursys license lookup failed (${res.status}): ${text}`);
  }

  const data = await res.json();

  // Map Nursys response fields to our schema.
  // Field names follow the Nursys e-Notify JSON API spec.
  return {
    licenseNumber: data.licenseNumber ?? licenseNumber,
    state: data.state ?? state,
    licenseStatus: (data.licenseStatus ?? data.status ?? "unknown").toLowerCase(),
    expirationDate: data.expirationDate ?? data.expDate ?? null,
    disciplineFlags:
      data.disciplineFlag === true ||
      data.hasDiscipline === true ||
      (data.disciplineActions && data.disciplineActions.length > 0) ||
      false,
    compactPrivileges: data.compactPrivileges ?? data.privileges ?? [],
    rawResponse: data,
  };
}
