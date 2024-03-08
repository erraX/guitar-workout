/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/workouts',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
