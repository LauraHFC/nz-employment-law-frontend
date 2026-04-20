/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow the API URL to be injected at build time via NEXT_PUBLIC_API_URL
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  },
};

module.exports = nextConfig;
