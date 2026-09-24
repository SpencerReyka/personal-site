import Link from 'next/link'
import { fetchTog, fetchStars } from '@/lib/osrs-data'
import { HOME_WORLD, WATCHED_LOCATIONS } from '@/lib/osrs'

export const dynamic = 'force-dynamic'

export default async function OsrsIndex() {
  const [worlds, stars] = await Promise.all([fetchTog(), fetchStars()])
  const best = worlds?.[0] ?? null
  const soonest = stars?.[0] ?? null
  const places = WATCHED_LOCATIONS.map((w) => w[0].toUpperCase() + w.slice(1)).join(', ')

  return (
    <main className="osrs-main">
      <h1>OSRS trackers</h1>
      <p className="osrs-lede">Two community trackers, narrowed to what I actually use.</p>

      <div className="osrs-cards">
        <Link href="/osrs/tog" className="osrs-card">
          <h2>Tears of Guthix</h2>
          {worlds === null ? (
            <p className="osrs-unknown">upstream unreachable</p>
          ) : best ? (
            <p className="osrs-figure">
              <strong>w{best.world_number}</strong>
              <span className="osrs-order">
                {[...best.stream_order].map((c, i) => (
                  <span key={i} className={c === 'g' ? 'g' : 'b'}>{c === 'g' ? 'G' : 'b'}</span>
                ))}
              </span>
            </p>
          ) : null}
          <p className="osrs-sub">
            {best ? `${best.distance} hops from ${HOME_WORLD} · ${best.hits} reports` : `ranked for world ${HOME_WORLD}`}
          </p>
        </Link>

        <Link href="/osrs/stars" className="osrs-card">
          <h2>Shooting stars</h2>
          {stars === null ? (
            <p className="osrs-unknown">upstream unreachable</p>
          ) : soonest ? (
            <p className="osrs-figure">
              <strong>w{soonest.world}</strong>
              <span className="osrs-tier">T{soonest.tier}</span>
            </p>
          ) : (
            <p className="osrs-figure osrs-none">none live</p>
          )}
          <p className="osrs-sub">
            {soonest ? soonest.calledLocation : places}
          </p>
        </Link>
      </div>
    </main>
  )
}
