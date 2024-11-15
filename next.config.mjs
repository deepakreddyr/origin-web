/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  images: {
    domains: ["via.placeholder.com", "s3-alpha-sig.figma.com"],
  },
};

export default nextConfig;
