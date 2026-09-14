import { NextResponse } from 'next/server'

// Legacy admin URLs go to the Access-protected hub; authentication is checked
// in AdminHub itself and does not depend on this redirect running.
export function middleware() {
  return NextResponse.redirect('https://admin.spencerreyka.com')
}

export const config = { matcher: ['/admin/:path*'] }
