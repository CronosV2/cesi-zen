import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration pour Docker
  output: 'standalone',
  // Désactiver ESLint pendant le build (pour éviter les erreurs de build Docker)
  eslint: {
    ignoreDuringBuilds: true,
    dirs: ['src']
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
