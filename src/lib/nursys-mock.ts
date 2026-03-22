// Mock Nursys License Verification Service
// TODO: Replace mock with Nursys e-Notify API (not QuickConfirm — Nursys does not offer a QuickConfirm API)

export interface NursysVerificationResult {
  status: "active" | "inactive" | "expired" | "encumbered" | "not_found";
  expirationDate?: string;
  state?: string;
  disciplineFlags: string[];
}

interface MockRecord {
  name: string;
  state: string;
  licenseNumber: string;
  result: NursysVerificationResult;
}

const MOCK_RECORDS: MockRecord[] = [
  // Demo nurse profiles
  {
    name: "Sarah Chen",
    state: "RI",
    licenseNumber: "RN-2018-RI-44821",
    result: {
      status: "active",
      expirationDate: "2027-06-30",
      state: "RI",
      disciplineFlags: [],
    },
  },
  {
    name: "Marcus Williams",
    state: "RI",
    licenseNumber: "RN-2021-RI-55103",
    result: {
      status: "active",
      expirationDate: "2027-03-31",
      state: "RI",
      disciplineFlags: [],
    },
  },
  {
    name: "Priya Patel",
    state: "RI",
    licenseNumber: "RN-2012-RI-31456",
    result: {
      status: "active",
      expirationDate: "2026-12-31",
      state: "RI",
      disciplineFlags: [],
    },
  },
  // Extra records
  {
    name: "Emily Rodriguez",
    state: "RI",
    licenseNumber: "RN-2019-RI-47832",
    result: {
      status: "active",
      expirationDate: "2026-05-15",
      state: "RI",
      disciplineFlags: [],
    },
  },
  {
    name: "James Okonkwo",
    state: "RI",
    licenseNumber: "RN-2015-RI-38901",
    result: {
      status: "active",
      expirationDate: "2027-09-30",
      state: "RI",
      disciplineFlags: [],
    },
  },
  {
    name: "Linda Tran",
    state: "MA",
    licenseNumber: "RN-2020-MA-61244",
    result: {
      status: "expired",
      expirationDate: "2025-12-31",
      state: "MA",
      disciplineFlags: [],
    },
  },
  {
    name: "Robert Kim",
    state: "RI",
    licenseNumber: "RN-2017-RI-42100",
    result: {
      status: "encumbered",
      expirationDate: "2026-06-30",
      state: "RI",
      disciplineFlags: ["Probation - supervision required"],
    },
  },
  {
    name: "Angela Santos",
    state: "RI",
    licenseNumber: "RN-2016-RI-40555",
    result: {
      status: "active",
      expirationDate: "2027-01-31",
      state: "RI",
      disciplineFlags: [],
    },
  },
  {
    name: "David Chen",
    state: "RI",
    licenseNumber: "RN-2020-RI-52789",
    result: {
      status: "active",
      expirationDate: "2027-08-31",
      state: "RI",
      disciplineFlags: [],
    },
  },
  {
    name: "Michelle Foster",
    state: "RI",
    licenseNumber: "RN-2014-RI-35622",
    result: {
      status: "active",
      expirationDate: "2026-11-30",
      state: "RI",
      disciplineFlags: [],
    },
  },
];

export async function verifyLicense(
  name: string,
  state: string,
  licenseNumber: string
): Promise<NursysVerificationResult> {
  // Simulate API delay (1-2 seconds)
  const delay = 1000 + Math.random() * 1000;
  await new Promise((resolve) => setTimeout(resolve, delay));

  // Search mock records
  const record = MOCK_RECORDS.find(
    (r) =>
      normalize(r.licenseNumber) === normalize(licenseNumber) &&
      normalize(r.state) === normalize(state)
  );

  if (record) {
    return record.result;
  }

  // Also try matching by name + state if license number doesn't match exactly
  const nameRecord = MOCK_RECORDS.find(
    (r) =>
      normalize(r.name) === normalize(name) &&
      normalize(r.state) === normalize(state)
  );

  if (nameRecord) {
    return nameRecord.result;
  }

  return {
    status: "not_found",
    disciplineFlags: [],
  };
}

function normalize(s: string): string {
  return s.toLowerCase().trim();
}

export function isExpiringSoon(expirationDate?: string): boolean {
  if (!expirationDate) return false;
  const expDate = new Date(expirationDate);
  const now = new Date();
  const threeMonths = 90 * 24 * 60 * 60 * 1000;
  return expDate.getTime() - now.getTime() < threeMonths && expDate.getTime() > now.getTime();
}
