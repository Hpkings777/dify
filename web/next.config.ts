import type { NextConfig } from 'next'
import process from 'node:process'
import withBundleAnalyzerInit from '@next/bundle-analyzer'
import createMDX from '@next/mdx'
import { codeInspectorPlugin } from 'code-inspector-plugin'

const isDev = process.env.NODE_ENV === 'development'
const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})
const withBundleAnalyzer = withBundleAnalyzerInit({
  enabled: process.env.ANALYZE === 'true',
})

// === BRUTE FORCE ENV INJECTION BY GEMINI ===
const HPKINGS_BACKEND = 'https://hpkings-diffy.hf.space'

const nextConfig: NextConfig = {
  // Hardcoding variables directly into the client-side bundle
  env: {
    NEXT_PUBLIC_API_URL: `${HPKINGS_BACKEND}/console/api`,
    NEXT_PUBLIC_PUBLIC_API_URL: `${HPKINGS_BACKEND}/api`,
    NEXT_PUBLIC_DEPLOY_ENV: 'PRODUCTION',
    CONSOLE_API_URL: HPKINGS_BACKEND,
    SERVICE_API_URL: HPKINGS_BACKEND,
    APP_API_URL: `${HPKINGS_BACKEND}/api`,
  },
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  serverExternalPackages: ['esbuild-wasm'],
  transpilePackages: ['echarts', 'zrender'],
  turbopack: {
    rules: codeInspectorPlugin({
      bundler: 'turbopack',
    }),
  },
  productionBrowserSourceMaps: false,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hpkings-diffy.hf.space',
        port: '',
        pathname: '/**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/apps',
        permanent: false,
      },
    ]
  },
  output: 'standalone',
  compiler: {
    removeConsole: isDev ? false : { exclude: ['warn', 'error'] },
  },
  experimental: {
    turbopackFileSystemCacheForDev: false,
  },
}

export default withBundleAnalyzer(withMDX(nextConfig))
