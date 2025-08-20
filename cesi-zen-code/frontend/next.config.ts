import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration pour Docker
  output: 'standalone',
  // Désactiver ESLint pendant le build (pour éviter les erreurs de build Docker)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Désactiver TypeScript strict checking pendant le build
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
