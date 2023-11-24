/** @type {import('next').NextConfig} */
const nextConfig = { 
    target: 'serverless',
    experimental: { nftTracing: true },
}

module.exports = nextConfig
