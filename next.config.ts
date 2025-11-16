import type { NextConfig } from 'next'
import './src/lib/env'

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: true,
  typedRoutes: true,
}

export default nextConfig
