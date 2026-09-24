import { rankTogWorlds, activeWatchedStars, type TogWorld, type Star, type RankedTogWorld, type ActiveStar } from './osrs'

// Server-side fetchers, shared by the pages and the API routes.
//
// Both upstreams are free community endpoints with no CORS, so the browser cannot call them and
// should not: one request per visitor per load is the difference between a guest and a nuisance.
// The `revalidate` on each fetch is the real cache — it survives the pages being per-request.
//
// Null means "we do not know", never "there is nothing". A page rendering an empty table because
// a DNS lookup failed is asserting something false.

export async function fetchTog(): Promise<RankedTogWorld[] | null> {
  try {
    const res = await fetch('https://togcrowdsourcing.com/worldinfo', {
      signal: AbortSignal.timeout(5000),
      // Stream orders change only when Jagex rolls them. Five minutes is already far finer than
      // the data moves.
      next: { revalidate: 300 },
    })
    if (!res.ok) return null
    const raw = (await res.json()) as TogWorld[]
    return rankTogWorlds(raw.filter(
      (w) => typeof w?.world_number === 'number'
        && typeof w?.hits === 'number'
        && typeof w?.stream_order === 'string'
        && w.stream_order.length === 6,
    ))
  } catch {
    return null
  }
}

export async function fetchStars(): Promise<ActiveStar[] | null> {
  try {
    const res = await fetch('https://map.starminers.site/data2?timestamp=0', {
      signal: AbortSignal.timeout(5000),
      // A star lives about two hours and the useful signal is the tail of it, so stale data here
      // is wrong data — you hop to a rock that is already gone.
      next: { revalidate: 30 },
    })
    if (!res.ok) return null
    const raw = (await res.json()) as Star[]
    return activeWatchedStars(raw.filter(
      (s) => typeof s?.world === 'number' && typeof s?.calledLocation === 'string',
    ))
  } catch {
    return null
  }
}
