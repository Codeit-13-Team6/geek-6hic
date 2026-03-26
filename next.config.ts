import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "images.unsplash.com",
      "example.com",
      "lh3.googleusercontent.com",
      "sprint-fe-project.s3.ap-northeast-2.amazonaws.com",
    ],
  },
};

export default nextConfig;
