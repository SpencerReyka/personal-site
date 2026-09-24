import { fetchTog } from '@/lib/osrs-data'
import { HOME_WORLD, CONFIDENT_HITS } from '@/lib/osrs'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Tears of Guthix — world order' }

export default async function TogPage() {
  const worlds = await fetchTog()

  return (
    <main className="osrs-main">
      <h1>Tears of Guthix</h1>
      <p className="osrs-lede">
        Best stream order first, nearest world to {HOME_WORLD} breaking the tie.
      </p>

      {worlds === null ? (
        <p className="osrs-unknown">
          togcrowdsourcing.com is unreachable, so this is unknown — not &ldquo;no good worlds&rdquo;.
        </p>
      ) : (
        <>
          <table className="osrs-table">
            <thead>
              <tr><th>World</th><th>Hops</th><th>Stream order</th><th>Reports</th></tr>
            </thead>
            <tbody>
              {worlds.slice(0, 20).map((w) => (
                <tr key={w.world_number} className={w.world_number === HOME_WORLD ? 'is-home' : undefined}>
                  <td className="osrs-world">
                    {w.world_number}{w.world_number === HOME_WORLD && <span className="osrs-tag">you</span>}
                  </td>
                  <td>{w.distance}</td>
                  <td className="osrs-order">
                    {[...w.stream_order].map((c, i) => (
                      <span key={i} className={c === 'g' ? 'g' : 'b'}>{c === 'g' ? 'G' : 'b'}</span>
                    ))}
                  </td>
                  <td className={w.confident ? undefined : 'osrs-thin'}>
                    {w.hits}{!w.confident && <span title={`fewer than ${CONFIDENT_HITS} reports`}> ?</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="osrs-note">
            <strong>G</strong> is a green stream — tears. <strong>b</strong> drains them. So the
            G&rsquo;s want to be early, and <code>GGGbbb</code> is the best order there is.
          </p>
          <p className="osrs-note">
            <code>?</code> marks fewer than {CONFIDENT_HITS} reports. Still listed, because a
            perfect order with one report is worth seeing — just worth knowing it is one
            person&rsquo;s word.
          </p>
        </>
      )}
    </main>
  )
}
