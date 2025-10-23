import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// Create the plugin and let it automatically find your i18n/request.ts file
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: true, // Disable optimization for external images to prevent loops
  },
};

export default withNextIntl(nextConfig);