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
  }
};

export default nextConfig;
