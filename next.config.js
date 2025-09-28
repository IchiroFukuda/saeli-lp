/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/index.html',
      },
      {
        source: '/privacy',
        destination: '/privacy.html',
      },
    ];
  },
}

module.exports = nextConfig
