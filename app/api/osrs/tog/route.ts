import { rankTogWorlds, type TogWorld } from '@/lib/osrs'

// Server-side proxy to togcrowdsourcing.com.
//
// The browser cannot call it directly — no CORS headers — and should not anyway: this is a free
// community endpoint and one request per visitor per load is the difference between a guest and
// a nuisance. Cached for five minutes, which is far finer than the data moves; stream orders
// change only when Jagex rolls them.
const UPSTREAM = 'https://togcrowdsourcing.com/worldinfo'

export const revalidate = 300

export async function GET() {
  try {
    const res = await fetch(UPSTREAM, {
      signal: AbortSignal.timeout(5000),
      next: { revalidate: 300 },
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) return Response.json({ worlds: [], known: false }, { status: 200 })

    const raw = (await res.json()) as TogWorld[]
    // Guard the shape rather than trusting it. A community endpoint can change, and a page
    // rendering `undefined` positions as a ranking is worse than a page saying it does not know.
    const worlds = raw.filter(
      (w) => typeof w?.world_number === 'number'
        && typeof w?.hits === 'number'
        && typeof w?.stream_order === 'string'
        && w.stream_order.length === 6,
    )
    return Response.json(
      { worlds: rankTogWorlds(worlds), known: true, fetchedAt: new Date().toISOString() },
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } },
    )
  } catch {
    // Unreachable upstream is "unknown", not "no good worlds". The page renders nothing rather
    // than asserting something false — same rule as the voice badge.
    return Response.json({ worlds: [], known: false })
  }
}
