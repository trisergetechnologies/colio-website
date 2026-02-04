/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'
const basePath = ''

const nextConfig = {
  // output: 'export',
  trailingSlash: true,
  basePath: basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.colio.in",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,  // Ignore TypeScript errors during build
  },
};

export default nextConfig;
