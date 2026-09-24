import { rankTogWorlds, activeWatchedStars, HOME_WORLD, WATCHED_LOCATIONS, type TogWorld, type Star } from '@/lib/osrs'

// Rendered per request, not prerendered at build.
//
// With `revalidate` alone Next prerenders this at build time and serves that HTML — so a single
// failed fetch during the build gets baked in, and the page tells every visitor the upstream is
// unreachable long after it recovered. Observed exactly that on the first build.
//
// Dynamic does not mean uncached: the `next: { revalidate }` on each fetch below still holds the
// upstream responses for 5 minutes and 30 seconds, so this costs the community endpoints the
// same as before. What changes is that "unreachable" now means *now*, which is the only way the
// message is true.
export const dynamic = 'force-dynamic'
export const metadata = { title: 'OSRS trackers' }

async function getTog() {
  try {
    const res = await fetch('https://togcrowdsourcing.com/worldinfo', {
      signal: AbortSignal.timeout(5000), next: { revalidate: 300 },
    })
    if (!res.ok) return null
    const raw = (await res.json()) as TogWorld[]
    return rankTogWorlds(raw.filter((w) => typeof w?.world_number === 'number' && w?.stream_order?.length === 6))
  } catch { return null }
}

async function getStars() {
  try {
    const res = await fetch('https://map.starminers.site/data2?timestamp=0', {
      signal: AbortSignal.timeout(5000), next: { revalidate: 30 },
    })
    if (!res.ok) return null
    const raw = (await res.json()) as Star[]
    return activeWatchedStars(raw.filter((s) => typeof s?.world === 'number' && typeof s?.calledLocation === 'string'))
  } catch { return null }
}

const mins = (s: number | null) => (s === null ? '—' : `${Math.floor(s / 60)}m`)

export default async function OsrsPage() {
  const [tog, stars] = await Promise.all([getTog(), getStars()])

  return (
    <main style={{ maxWidth: 780, margin: '0 auto', padding: '2rem 1.25rem', lineHeight: 1.5 }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>OSRS trackers</h1>
      <p style={{ opacity: 0.7, marginTop: 0, fontSize: '0.9rem' }}>
        Tears of Guthix ranked for world {HOME_WORLD}; stars filtered to{' '}
        {WATCHED_LOCATIONS.join(', ')}.
      </p>

      <h2 style={{ fontSize: '1.15rem', marginTop: '2rem' }}>Tears of Guthix</h2>
      {tog === null ? (
        <p style={{ opacity: 0.7 }}>
          togcrowdsourcing.com is unreachable, so this is unknown — not &ldquo;no good worlds&rdquo;.
        </p>
      ) : (
        <>
          <p style={{ fontSize: '0.85rem', opacity: 0.7, marginTop: 0 }}>
            Best stream order first, nearest world breaking the tie. <code>G</code> is a green
            stream (tears), <code>b</code> drains them — so you want the G&rsquo;s early.
          </p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', opacity: 0.6 }}>
                <th style={{ padding: '0.3rem 0' }}>World</th>
                <th>Hops</th>
                <th>Order</th>
                <th>Reports</th>
              </tr>
            </thead>
            <tbody>
              {tog.slice(0, 15).map((w) => (
                <tr key={w.world_number} style={{ borderTop: '1px solid rgba(128,128,128,0.2)' }}>
                  <td style={{ padding: '0.35rem 0', fontWeight: w.world_number === HOME_WORLD ? 700 : 400 }}>
                    {w.world_number}{w.world_number === HOME_WORLD ? ' (you)' : ''}
                  </td>
                  <td>{w.distance}</td>
                  <td style={{ fontFamily: 'ui-monospace, monospace', letterSpacing: '0.15em' }}>
                    {[...w.stream_order].map((c, i) => (
                      <span key={i} style={{ opacity: c === 'g' ? 1 : 0.35 }}>{c === 'g' ? 'G' : 'b'}</span>
                    ))}
                  </td>
                  <td style={{ opacity: w.confident ? 1 : 0.5 }}>
                    {w.hits}{w.confident ? '' : ' ?'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>
            <code>?</code> marks fewer than three reports — still shown, because a perfect order
            with one report is worth seeing; just worth knowing it is one person&rsquo;s word.
          </p>
        </>
      )}

      <h2 style={{ fontSize: '1.15rem', marginTop: '2.5rem' }}>Shooting stars</h2>
      {stars === null ? (
        <p style={{ opacity: 0.7 }}>map.starminers.site is unreachable — unknown, not empty.</p>
      ) : stars.length === 0 ? (
        <p style={{ opacity: 0.7 }}>
          No live star in {WATCHED_LOCATIONS.join(', ')} right now. Expired calls are excluded
          deliberately: upstream still lists them, and hopping to a despawned star is the whole
          failure worth avoiding.
        </p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ textAlign: 'left', opacity: 0.6 }}>
              <th style={{ padding: '0.3rem 0' }}>World</th>
              <th>Tier</th>
              <th>Location</th>
              <th>Despawns in</th>
            </tr>
          </thead>
          <tbody>
            {stars.map((s) => (
              <tr key={`${s.world}-${s.calledLocation}`} style={{ borderTop: '1px solid rgba(128,128,128,0.2)' }}>
                <td style={{ padding: '0.35rem 0' }}>{s.world}</td>
                <td>T{s.tier}</td>
                <td>{s.calledLocation}</td>
                <td>{mins(s.secondsLeft)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p style={{ fontSize: '0.8rem', opacity: 0.55, marginTop: '2.5rem' }}>
        Data from togcrowdsourcing.com and map.starminers.site, both free community endpoints.
        Proxied and cached server-side (5 min / 30 s) so this page is one visitor to them, not one
        per reader.
      </p>
    </main>
  )
}
