import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Emits a self-contained server bundle with only the node_modules actually reached, so the
  // runtime image carries neither the build toolchain nor the full dependency tree.
  output: 'standalone',
  async headers() {
    return [{
      source: '/:path*',
      has: [{ type: 'host', value: 'admin.spencerreyka.com' }],
      headers: [
        { key: 'Cache-Control', value: 'private, no-store, max-age=0' },
        { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Referrer-Policy', value: 'no-referrer' },
        { key: 'Content-Security-Policy', value: "frame-ancestors 'none'; object-src 'none'; base-uri 'self'" },
      ],
    }]
  },
}

export default nextConfig
