import Link from 'next/link'

export const metadata = { title: 'OSRS trackers' }

// Two parts, one shell. Both read community trackers; neither is mine.
export default function OsrsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="osrs">
      <header className="osrs-head">
        <Link href="/osrs" className="osrs-brand">OSRS</Link>
        <nav className="osrs-nav">
          <Link href="/osrs/tog">Tears of Guthix</Link>
          <Link href="/osrs/stars">Shooting stars</Link>
        </nav>
      </header>
      {children}
      <footer className="osrs-foot">
        Data from <a href="https://togcrowdsourcing.com">togcrowdsourcing.com</a> and{' '}
        <a href="https://map.starminers.site">map.starminers.site</a>, free community trackers.
        Proxied and cached server-side so this page is one visitor to them, not one per reader.
      </footer>
    </div>
  )
}
