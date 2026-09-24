import { fetchTog } from '@/lib/osrs-data'
import { HOME_WORLD, CONFIDENT_HITS } from '@/lib/osrs'
import { StreamOrder } from '@/app/osrs/StreamOrder'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Tears of Guthix — world order' }

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
export default async function TogPage() {
  const worlds = await fetchTog()

  // When many worlds share the best order the glyph column goes uniform, and the page looks like
  // it is showing one answer twenty times. It is not — those are the twenty *nearest* worlds that
  // all happen to be optimal, so the real decision is the hop count. Saying how many share the
  // top score turns a flat-looking column into information.
  const best = worlds?.[0]
  const sharingBest = best ? worlds!.filter((w) => w.score === best.score).length : 0

  return (
    <main className="osrs-main is-tog">
      <h1>Tears of Guthix</h1>
      <p className="osrs-lede">
        Best stream order first, nearest world to {HOME_WORLD} breaking the tie.
        {sharingBest > 1 && (
          <> <strong>{sharingBest}</strong> worlds share the best order, so below the fold the
          only thing separating them is the hop count.</>
        )}
      </p>

      {worlds === null ? (
        /* Distinct from an empty table on purpose: this is "we do not know", and the amber rule
           plus the UNKNOWN eyebrow say so without relying on the reader noticing a colour. */
        <div className="osrs-state is-down">
          <span className="osrs-state-eyebrow">Unknown</span>
          <span className="osrs-state-line">togcrowdsourcing.com is unreachable</span>
          <p className="osrs-note">
            So this is unknown — not &ldquo;no good worlds&rdquo;. An empty table here would be
            asserting something false.
          </p>
        </div>
      ) : (
        <>
          <table className="osrs-table osrs-table--tog">
            <caption className="osrs-sr">
              Game worlds ranked by Tears of Guthix stream order, best first
            </caption>
            <thead>
              <tr>
                <th scope="col">World</th>
                <th scope="col" className="osrs-num">Hops</th>
                <th scope="col">Stream order</th>
                <th scope="col" className="osrs-num">Reports</th>
              </tr>
            </thead>
            <tbody>
              {worlds.slice(0, 20).map((w) => (
                <tr key={w.world_number} className={w.world_number === HOME_WORLD ? 'is-home' : undefined}>
                  {/* The world number identifies the row, so it is the row's header. */}
                  <th scope="row" className="osrs-world">
                    {w.world_number}
                    {w.world_number === HOME_WORLD && <span className="osrs-tag">you</span>}
                  </th>
                  <td className="osrs-num">{w.distance}</td>
                  <td>
                    <StreamOrder order={w.stream_order} />
                  </td>
                  <td className={`osrs-num${w.confident ? '' : ' osrs-thin'}`}>
                    {w.hits}
                    {!w.confident && (
                      <>
                        {' '}
                        <span className="osrs-flag" aria-hidden="true">?</span>
                        <span className="osrs-sr">, fewer than {CONFIDENT_HITS} reports</span>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* The bars are only self-explanatory once; the key makes the first read free. */}
          <ul className="osrs-key">
            <li>
              <StreamOrder order="g" />
              <span>green — tears</span>
            </li>
            <li>
              <StreamOrder order="b" />
              <span>blue — drains them</span>
            </li>
          </ul>

          <p className="osrs-note">
            Greens want to be early, so a tall-then-short staircase{' '}
            <StreamOrder order="gggbbb" inline /> is the best order there is.
          </p>
          <p className="osrs-note">
            Cached up to 5 minutes. Stream orders change only when Jagex rolls them, so this is
            far finer than the data moves — and it is a bound rather than an age because the page
            renders per request while the fetch beneath it does not.
          </p>
          <p className="osrs-note">
            <span className="osrs-flag">?</span> marks fewer than {CONFIDENT_HITS} reports. Still
            listed, because a perfect order with one report is worth seeing — just worth knowing
            it is one person&rsquo;s word.
          </p>
        </>
      )}
    </main>
  )
}
