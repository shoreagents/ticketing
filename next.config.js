/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Ensure proper asset handling
  assetPrefix: process.env.NODE_ENV === 'development' ? '' : './',
  // Ensure proper base path
  basePath: '',
};

module.exports = nextConfig; 