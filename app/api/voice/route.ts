// Server-side proxy to backbone-api.
//
// The browser never calls backbone-api directly, and could not: backbone-api publishes no host
// port and is reachable only by container name on Coolify's docker network. Even if it were
// exposed, the origin would need CORS and would leak an internal address to every visitor.
//
// This route is not cached. It previously claimed "Vercel caches the response for 10s" — this
// has been on Coolify behind a Cloudflare tunnel since the buildout, and `revalidate = 0` below
// makes the route dynamic, so Next sends no-store regardless. Each visitor is one request to
// backbone-api. Fine at this traffic; if it stops being fine the fix is a real cache here, not
// a comment describing one.
const BACKBONE_API_URL = process.env.BACKBONE_API_URL

export const revalidate = 0

export async function GET() {
  if (!BACKBONE_API_URL) {
    // Unconfigured is "unknown", not "offline" — the badge renders nothing rather than
    // asserting something false. Same reason backbone-api answers 503 instead of {online:false}.
    return Response.json({ online: false, since: null, lastSeen: null, known: false })
  }

  try {
    const res = await fetch(`${BACKBONE_API_URL}/api/voice/state`, {
      signal: AbortSignal.timeout(3000),
      next: { revalidate: 10 },
    })
    if (!res.ok) {
      return Response.json({ online: false, since: null, lastSeen: null, known: false })
    }
    const data = (await res.json()) as {
      online: boolean
      since: string | null
      lastSeen: string | null
    }
    return Response.json({ ...data, known: true }, {
      headers: { 'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30' },
    })
  } catch {
    // A timeout or an unreachable VM is "unknown", not "offline". The section renders nothing
    // rather than asserting something false — the two are different answers and only one of
    // them is true when the infrastructure is simply unreachable.
    return Response.json({ online: false, since: null, lastSeen: null, known: false })
  }
}
