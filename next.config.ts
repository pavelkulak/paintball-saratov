import type { NextConfig } from 'next'

function getBitrixImagePatterns() {
  const apiUrl = process.env.BITRIX_API_URL

  if (!apiUrl) {
    return []
  }

  try {
    const uploadUrl = new URL('/upload/**', apiUrl)
    return [uploadUrl]
  } catch {
    return []
  }
}

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: getBitrixImagePatterns(),
  },
}

export default nextConfig
