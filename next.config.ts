import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Permet de lancer un build de vérification (NEXT_DIST_DIR=.next-build) sans casser le serveur de dev.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
}

export default nextConfig
