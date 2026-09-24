// Two OSRS trackers, rehosted server-side.
//
// Both upstreams are free and unauthenticated, so every page load hitting them directly would be
// rude and slow. The API routes proxy and cache; this file is the pure logic they and the tests
// share.

// ---------------------------------------------------------------------------------------------
// Tears of Guthix — togcrowdsourcing.com
// ---------------------------------------------------------------------------------------------

export type TogWorld = {
  world_number: number
  hits: number
  /** Six characters of 'g' and 'b'. Always exactly three of each. */
  stream_order: string
}

export type RankedTogWorld = TogWorld & {
  distance: number
  score: number
  confident: boolean
}

export const HOME_WORLD = 444

/**
 * Lower is better.
 *
 * Every world has exactly three green streams and three blue (verified against all 234 reported
 * worlds — all 20 possible arrangements occur). So the only thing that varies is *when* the
 * greens come, and greens early is what you want: you drink from the stream in front of you, and
 * a blue one drains the tears you already have. `gggbbb` scores 3, the minimum; `bbbggg` scores
 * 12, the maximum.
 */
export function streamScore(order: string): number {
  let total = 0
  for (let i = 0; i < order.length; i += 1) {
    if (order[i] === 'g') total += i
  }
  return total
}

/** A single report can be wrong or stale. Three agreeing is the point where it is worth a hop. */
export const CONFIDENT_HITS = 3

/**
 * Best stream order, nearest world breaking the tie.
 *
 * Deliberately not distance-first. Sorting by proximity to 444 puts your own world at the top
 * whatever its streams are, which answers a question nobody asked — you already know what world
 * you are on. The question is which world is worth hopping to, and that is decided by the stream
 * order, with distance only separating worlds that are equally good.
 *
 * Low-confidence worlds are not excluded, because a `gggbbb` with one report is still worth
 * seeing; they are marked instead, so the choice stays with the reader.
 */
export function rankTogWorlds(worlds: TogWorld[], home: number = HOME_WORLD): RankedTogWorld[] {
  return worlds
    .map((w) => ({
      ...w,
      distance: Math.abs(w.world_number - home),
      score: streamScore(w.stream_order),
      confident: w.hits >= CONFIDENT_HITS,
    }))
    .sort((a, b) =>
      a.score - b.score ||
      a.distance - b.distance ||
      b.hits - a.hits ||
      a.world_number - b.world_number)
}

// ---------------------------------------------------------------------------------------------
// Shooting stars — map.starminers.site
// ---------------------------------------------------------------------------------------------

export type Star = {
  world: number
  calledLocation: string
  tier: number
  /** Unix seconds. Null when the caller did not supply a window. */
  minTime: number | null
  maxTime: number | null
}

export type ActiveStar = Star & { secondsLeft: number | null }

/**
 * The locations worth watching, as substrings.
 *
 * Matched loosely on purpose: upstream location names are free-ish text written by whoever
 * called the star, and the same place appears as "Catherby bank" today and could appear as
 * "Catherby" tomorrow. An exact-match list would silently stop matching and the page would look
 * like a quiet night rather than a broken filter.
 */
export const WATCHED_LOCATIONS = ['catherby', 'ardougne', 'yanille'] as const

export function isWatched(location: string, watched: readonly string[] = WATCHED_LOCATIONS): boolean {
  const l = location.toLowerCase()
  return watched.some((w) => l.includes(w))
}

/**
 * Filter to the watched locations, drop anything already gone, soonest-to-despawn first.
 *
 * Upstream lists recently-called stars including expired ones — at the time this was written,
 * every star matching these three locations had already despawned. Showing those as live is the
 * failure worth avoiding: you hop, and there is nothing there.
 *
 * A star with no `maxTime` is kept rather than dropped. The caller did not supply a window, which
 * is not the same as the star being gone, and it sorts last with a null countdown so the page can
 * say "unknown" rather than invent a number.
 */
export function activeWatchedStars(
  stars: Star[],
  now: number = Date.now() / 1000,
  watched: readonly string[] = WATCHED_LOCATIONS,
): ActiveStar[] {
  return stars
    .filter((s) => isWatched(s.calledLocation, watched))
    .filter((s) => s.maxTime === null || s.maxTime === undefined || s.maxTime > now)
    .map((s) => ({
      ...s,
      secondsLeft: s.maxTime === null || s.maxTime === undefined ? null : Math.round(s.maxTime - now),
    }))
    .sort((a, b) => {
      if (a.secondsLeft === null && b.secondsLeft === null) return b.tier - a.tier
      if (a.secondsLeft === null) return 1
      if (b.secondsLeft === null) return -1
      return a.secondsLeft - b.secondsLeft
    })
}
