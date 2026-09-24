import { NextResponse, type NextRequest } from 'next/server'

// Two unrelated jobs, so the matcher covers both paths and the host decides which applies.
export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? ''

  // osrs.spencerreyka.com serves the /osrs tree at the root, so the subdomain reads as its own
  // site rather than a section of this one. A rewrite, not a redirect: the URL the visitor typed
  // is the one they keep.
  if (host.startsWith('osrs.')) {
    const url = request.nextUrl.clone()
    if (!url.pathname.startsWith('/osrs')) {
      url.pathname = url.pathname === '/' ? '/osrs' : `/osrs${url.pathname}`
      return NextResponse.rewrite(url)
    }
    return NextResponse.next()
  }

  // Legacy admin URLs go to the Access-protected hub; authentication is checked
  // in AdminHub itself and does not depend on this redirect running.
  if (request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect('https://admin.spencerreyka.com')
  }

  return NextResponse.next()
}

// The osrs host needs every path to pass through, so the matcher excludes only Next's internals
// and static files rather than naming routes.
export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] }
