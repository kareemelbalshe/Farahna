/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  async rewrites() {
    const rawApi = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const apiBase = rawApi.replace(/\/+$/, '');
    const normalizedApi = apiBase.endsWith('/api') ? apiBase : `${apiBase}/api`;
    return [
      {
        source: '/api/media/:path*',
        destination: `${normalizedApi}/media/:path*`,
      },
    ];
  },
};

export default nextConfig;
