import { fetchStars } from '@/lib/osrs-data'
import { WATCHED_LOCATIONS } from '@/lib/osrs'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Shooting stars — Kandarin' }

/**
 * Presentation only — `secondsLeft` is untouched.
 *
 * Flooring straight to minutes printed "0m" for a star with fifty seconds left, which reads as
 * gone when it is the one you should be running to. Under a minute says so, and anything over an
 * hour splits rather than printing "97m".
 */
const left = (s: number) => {
  if (s < 60) return '< 1m'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m`
  return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, '0')}m`
}

const title = (w: string) => w[0].toUpperCase() + w.slice(1)

export default async function StarsPage() {
  const stars = await fetchStars()
  const places = WATCHED_LOCATIONS.map(title).join(', ')

  return (
    <main className="osrs-main is-stars">
      <h1>Shooting stars</h1>
      <p className="osrs-lede">{places} only, soonest to despawn first.</p>

      {stars === null ? (
        /* Solid panel, amber rule, UNKNOWN eyebrow. Deliberately a different object from the
           empty state below — confusing "we cannot reach the tracker" with "there is nothing
           there" is the one mistake this page can make. */
        <div className="osrs-state is-down">
          <span className="osrs-state-eyebrow">Unknown</span>
          <span className="osrs-state-line">map.starminers.site is unreachable</span>
          <p className="osrs-note">
            Unknown, not empty. Nothing can be said about what is live right now.
          </p>
        </div>
      ) : stars.length === 0 ? (
        /* The state a visitor sees most often, so it is composed rather than apologetic: a plain
           answer, the filter shown so you can see it is working, and the reasoning underneath. */
        <div className="osrs-state">
          <span className="osrs-state-eyebrow">All clear</span>
          <span className="osrs-state-line">Nothing live right now</span>
          <ul className="osrs-where" aria-label="Locations watched">
            {WATCHED_LOCATIONS.map((w) => (
              <li key={w}>{title(w)}</li>
            ))}
          </ul>
          <p className="osrs-note">
            Expired calls are excluded on purpose: upstream still lists them, and hopping to a
            star that has already despawned is the whole failure worth avoiding.
          </p>
        </div>
      ) : (
        <>
          <table className="osrs-table osrs-table--stars">
            <caption className="osrs-sr">
              Active crashed stars in {places}, soonest to despawn first
            </caption>
            <thead>
              <tr>
                <th scope="col">World</th>
                <th scope="col">Tier</th>
                <th scope="col">Location</th>
                <th scope="col" className="osrs-num">Despawns in</th>
              </tr>
            </thead>
            <tbody>
              {stars.map((s) => (
                <tr key={`${s.world}-${s.calledLocation}`}>
                  <th scope="row" className="osrs-world">{s.world}</th>
                  <td>
                    <span className="osrs-tier">T{s.tier}</span>
                  </td>
                  <td className="osrs-place">{s.calledLocation}</td>
                  {/* The number you act on, so it is the largest thing in the row. */}
                  <td className={s.secondsLeft === null ? 'osrs-num osrs-thin' : 'osrs-num osrs-left'}>
                    {s.secondsLeft === null ? 'unknown' : left(s.secondsLeft)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="osrs-note">
            Cached up to 30 seconds — short, because a star lives about two hours and the useful
            signal is the tail of it.
          </p>
          <p className="osrs-note">
            A star with no reported window shows <em>unknown</em> rather than an invented
            countdown — the caller did not say, which is not the same as it being gone.
          </p>
        </>
      )}
    </main>
  )
}
