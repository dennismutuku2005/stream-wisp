/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',           // Enable static export
  trailingSlash: true,        // Optional: adds a trailing slash to all routes
  images: {
    unoptimized: true,        // Required: disables Next.js image optimization
  },
  reactStrictMode: true,      // Recommended
};

export default nextConfig;
