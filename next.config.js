/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // need this, otherwise "next export" script won't work
  },
};

module.exports = nextConfig;
