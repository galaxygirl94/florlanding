"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Resume upload is now part of the unified /onboarding flow (Step 1).
export default function ResumeRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/onboarding");
  }, [router]);
  return null;
}
