import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration pour Docker
  output: 'standalone',
  // Désactiver ESLint pendant le build (pour éviter les erreurs de build Docker)
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['src']
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
