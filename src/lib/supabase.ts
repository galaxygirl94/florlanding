import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/** Returns true only when env vars are present — lets callers degrade gracefully in dev. */
export const isSupabaseConfigured = (): boolean =>
  !!(supabaseUrl && supabaseAnonKey);

export type ApplicationRow = {
  id: string;
  nurse_id: string;
  job_id: string;
  status: "Applied" | "Under Review" | "Viewed" | "Interview" | "Offer";
  applied_at: string;
  updated_at: string;
};

export type NurseProfileRow = {
  id: string;
  license_verified: boolean;
  license_verified_at: string | null;
  specialty: string | null;
  location_zip: string | null;
};
