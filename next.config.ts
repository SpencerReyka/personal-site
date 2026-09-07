import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Emits a self-contained server bundle with only the node_modules actually reached, so the
  // runtime image carries neither the build toolchain nor the full dependency tree.
  output: 'standalone',
}

export default nextConfig
