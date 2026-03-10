import Link from "next/link";
import { seedFacilities } from "@/data/seed-facilities";
import { seedJobs } from "@/data/seed-jobs";
import FacilityClient from "./FacilityClient";

export function generateStaticParams() {
  return seedFacilities.map((f) => ({ id: f.id }));
}

export default async function FacilityProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const facility = seedFacilities.find((f) => f.id === id);
  const facilityJobs = seedJobs.filter((j) => j.facilityId === id);

  if (!facility) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Facility not found</h1>
        <Link
          href="/jobs"
          className="text-periwinkle hover:text-periwinkle-dark transition-colors font-semibold"
        >
          Back to jobs
        </Link>
      </div>
    );
  }

  return <FacilityClient facility={facility} jobs={facilityJobs} />;
}
