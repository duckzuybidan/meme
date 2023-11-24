/** @type {import('next').NextConfig} */
const nextConfig = { 
    async rewrites() {
        return [
          {
            source: '/api/:path*',
            destination: '/api/:path*',
            apiTimeout: 300,
          },
        ]
    },
}

module.exports = nextConfig
