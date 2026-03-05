import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/florlanding",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
