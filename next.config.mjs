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
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 's3-alpha-sig.figma.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'cdn.originfresh.in',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'mm-devlopment.s3.ap-south-1.amazonaws.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'cdn.madrasmandi.in',
        pathname: '/**'
      }
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
  },

  // async redirects() {
  //   return [
  //     {
  //       source: '/',
  //       destination: '/shop',
  //       permanent: false 
  //     }
  //   ];
  // }
};

export default nextConfig;
