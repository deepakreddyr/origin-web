/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL
  },
  images: {
    domains: [
      'via.placeholder.com',
      's3-alpha-sig.figma.com',
      'cdn.originfresh.in',
      'mm-devlopment.s3.ap-south-1.amazonaws.com'
    ]
  },
  async headers() {
    return [
      {
        source: `/.well-known/assetlinks.json`,
        headers: [
          { key: `Content-Type`, value: `application/json` },
          { key: `Cache-Control`, value: `public, max-age=3600` }
        ]
      },
      {
        source: `/.well-known/apple-app-site-association`,
        headers: [
          { key: `Content-Type`, value: `application/json` },
          { key: `Cache-Control`, value: `public, max-age=3600` }
        ]
      },
      {
        source: `/apple-app-site-association`,
        headers: [
          { key: `Content-Type`, value: `application/json` },
          { key: `Cache-Control`, value: `public, max-age=3600` }
        ]
      }
    ];
  }
};

export default nextConfig;
