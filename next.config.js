/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  images: {
    unoptimized: true, // when need to run "next export" script, uncomment the below configuration
    remotePatterns: [
      {
        hostname: "*", // allow images from any url
      },
    ],
  },
};

module.exports = nextConfig;
