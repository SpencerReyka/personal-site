// Server-side proxy to backbone-api.
//
// The browser never calls backbone-api directly. Two reasons: the origin would need CORS and
// would leak the backbone hostname to every visitor, and a browser fetch cannot be cached at
// the edge the way this route can. Vercel caches the response for 10s, so a burst of visitors
// is one request to the VM, not one each.
const BACKBONE_API_URL = process.env.BACKBONE_API_URL

export const revalidate = 0

export async function GET() {
  if (!BACKBONE_API_URL) {
    // Unconfigured is "unknown", not "offline" — the badge renders nothing rather than
    // asserting something false. Same reason backbone-api answers 503 instead of {online:false}.
    return Response.json({ online: false, since: null, known: false })
  }

  try {
    const res = await fetch(`${BACKBONE_API_URL}/api/voice/state`, {
      signal: AbortSignal.timeout(3000),
      next: { revalidate: 10 },
    })
    if (!res.ok) {
      return Response.json({ online: false, since: null, known: false })
    }
    const data = (await res.json()) as { online: boolean; since: string | null }
    return Response.json({ ...data, known: true }, {
      headers: { 'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30' },
    })
  } catch {
    // A timeout or an unreachable VM is also "unknown". The collector only runs part of the
    // day, so the badge has to be honest about the difference between "not in voice" and
    // "cannot tell" — otherwise it is confidently wrong for the hours nothing is running.
    return Response.json({ online: false, since: null, known: false })
  }
}
