/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production'
const basePath = ''

const nextConfig = {
  // output: 'export', // keep commented if you don't need static export
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
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "pub-b7fd9c30cdbf439183b75041f5f71b92.r2.dev",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
    ],
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
