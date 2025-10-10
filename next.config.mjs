/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'
const basePath = ''

const nextConfig = {
  // output: 'export',
  trailingSlash: true,
  basePath: basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true
  },
  typescript: {
    ignoreBuildErrors: true,  // Ignore TypeScript errors during build
  },
};

export default nextConfig;
