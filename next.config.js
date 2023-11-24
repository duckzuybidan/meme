/** @type {import('next').NextConfig} */
const nextConfig = { 
    serverOptions: {
        // Increase the timeout for all API routes to 5 minutes (300 seconds)
        timeout: 300000,
      },
}

module.exports = nextConfig
