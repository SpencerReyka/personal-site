import Link from 'next/link'
import { fetchTog, fetchStars } from '@/lib/osrs-data'
import { HOME_WORLD, WATCHED_LOCATIONS } from '@/lib/osrs'
import { StreamOrder } from '@/app/osrs/StreamOrder'

export const dynamic = 'force-dynamic'

/**
 * Presentation only — `secondsLeft` is untouched. Matches the stars table so the hub and the
 * page never disagree about the same star. Flooring straight to minutes prints "0m" for a star
 * with fifty seconds left, which reads as gone when it is the one worth running to.
 */
const left = (s: number) => {
  if (s < 60) return '< 1m'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m`
  return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, '0')}m`
}

/**
 * The stream order, drawn rather than spelled.
 *
 * Six baseline-aligned bars: green tall and bright, blue short and dim. `gggbbb` therefore has a
 * falling-staircase silhouette recognisable in peripheral vision, which is the actual use — a
 * column of worlds scanned in a second while alt-tabbed out of a game. Height is the primary
 * channel, so the order survives colour blindness and a washed-out phone screen; hue and
 * lightness only reinforce it.
 *
 * The bars are decoration as far as assistive tech is concerned; the letters follow as
 * visually-hidden text so the cell still announces something meaningful.
 *
 * Duplicated between the hub and the table rather than shared: Next only permits its own export
 * fields from `layout.tsx`/`page.tsx`, and a section this small does not earn a components
 * directory of its own.
 */
export default async function OsrsIndex() {
  const [worlds, stars] = await Promise.all([fetchTog(), fetchStars()])
  const best = worlds?.[0] ?? null
  const soonest = stars?.[0] ?? null
  const places = WATCHED_LOCATIONS.map((w) => w[0].toUpperCase() + w.slice(1)).join(', ')

  return (
    <main className="osrs-main">
      <h1>OSRS trackers</h1>
      <p className="osrs-lede">Two community trackers, narrowed to what I actually use.</p>

      {/* Each card answers its page's question in one line, so the hub is usually the only page
          worth loading. Both cards keep the same three rows — label, figure, footnote — and the
          footnote is pinned to the bottom, so they stay aligned even when one has nothing to
          show and the other has a full answer. */}
      <div className="osrs-cards">
        <Link href="/osrs/tog" className="osrs-card">
          <h2>Tears of Guthix</h2>
          {worlds === null ? (
            <p className="osrs-figure osrs-down">upstream unreachable</p>
          ) : best ? (
            <p className="osrs-figure">
              <strong>w{best.world_number}</strong>
              <StreamOrder order={best.stream_order} />
            </p>
          ) : (
            <p className="osrs-figure osrs-none">no worlds reported</p>
          )}
          <p className="osrs-sub">
            {best
              ? `${best.distance} hops from ${HOME_WORLD} · ${best.hits} reports`
              : `ranked for world ${HOME_WORLD}`}
          </p>
        </Link>

        <Link href="/osrs/stars" className="osrs-card">
          <h2>Shooting stars</h2>
          {stars === null ? (
            <p className="osrs-figure osrs-down">upstream unreachable</p>
          ) : soonest ? (
            <p className="osrs-figure">
              <strong>w{soonest.world}</strong>
              <span className="osrs-tier">T{soonest.tier}</span>
            </p>
          ) : (
            /* The usual case. "None live" is an answer, not a failure, so it reads as ordinary
               muted text rather than borrowing the amber of the unreachable state. */
            <p className="osrs-figure osrs-none">none live</p>
          )}
          {/* The countdown is the number you act on, so it rides along on the hub rather than
              making you open the page to find out whether the star is worth the hop. */}
          <p className="osrs-sub">
            {soonest
              ? `${soonest.calledLocation}${soonest.secondsLeft === null ? '' : ` · ${left(soonest.secondsLeft)} left`}`
              : places}
          </p>
        </Link>
      </div>
    </main>
  )
}
