import { fetchStars } from '@/lib/osrs-data'
import { WATCHED_LOCATIONS } from '@/lib/osrs'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Shooting stars — Kandarin' }

const left = (s: number | null) => (s === null ? 'unknown' : `${Math.floor(s / 60)}m`)

export default async function StarsPage() {
  const stars = await fetchStars()
  const places = WATCHED_LOCATIONS.map((w) => w[0].toUpperCase() + w.slice(1)).join(', ')

  return (
    <main className="osrs-main">
      <h1>Shooting stars</h1>
      <p className="osrs-lede">{places} only, soonest to despawn first.</p>

      {stars === null ? (
        <p className="osrs-unknown">map.starminers.site is unreachable — unknown, not empty.</p>
      ) : stars.length === 0 ? (
        <p className="osrs-empty">
          Nothing live in {places} right now.
          <span className="osrs-note">
            Expired calls are excluded on purpose: upstream still lists them, and hopping to a
            star that has already despawned is the whole failure worth avoiding.
          </span>
        </p>
      ) : (
        <>
          <table className="osrs-table">
            <thead>
              <tr><th>World</th><th>Tier</th><th>Location</th><th>Despawns in</th></tr>
            </thead>
            <tbody>
              {stars.map((s) => (
                <tr key={`${s.world}-${s.calledLocation}`}>
                  <td className="osrs-world">{s.world}</td>
                  <td><span className="osrs-tier">T{s.tier}</span></td>
                  <td>{s.calledLocation}</td>
                  <td className={s.secondsLeft === null ? 'osrs-thin' : undefined}>{left(s.secondsLeft)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="osrs-note">
            A star with no reported window shows <em>unknown</em> rather than an invented
            countdown — the caller did not say, which is not the same as it being gone.
          </p>
        </>
      )}
    </main>
  )
}
