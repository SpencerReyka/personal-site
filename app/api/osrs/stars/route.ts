import { activeWatchedStars, type Star } from '@/lib/osrs'

// Server-side proxy to map.starminers.site.
//
// Open and unauthenticated, unlike osrsportal's tracker, whose data endpoint returns 401 — that
// one is gated on purpose and is not ours to rehost.
//
// Thirty seconds, not five minutes: a star's whole life is about two hours and the useful signal
// is the tail of it, so stale data here means hopping to a rock that is already gone.
const UPSTREAM = 'https://map.starminers.site/data2?timestamp=0'

export const revalidate = 30

export async function GET() {
  try {
    const res = await fetch(UPSTREAM, {
      signal: AbortSignal.timeout(5000),
      next: { revalidate: 30 },
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) return Response.json({ stars: [], known: false })

    const raw = (await res.json()) as Star[]
    const stars = raw.filter(
      (s) => typeof s?.world === 'number' && typeof s?.calledLocation === 'string',
    )
    return Response.json(
      { stars: activeWatchedStars(stars), known: true, fetchedAt: new Date().toISOString() },
      { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' } },
    )
  } catch {
    return Response.json({ stars: [], known: false })
  }
}
