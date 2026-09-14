import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { verifyAdminToken } from '@/lib/access'

const groups = [
  {
    name: 'Everyday',
    links: [
      { name: 'Location history', href: 'https://geo.spencerreyka.com', description: 'Maps, trips, and places you’ve been.', icon: '↗' },
      { name: 'Tasks', href: 'https://todo.spencerreyka.com', description: 'Projects, plans, and what’s next.', icon: '✓' },
    ],
  },
  {
    name: 'Operations',
    links: [
      { name: 'Automation', href: 'https://windmill.spencerreyka.com', description: 'Jobs and workflows in Windmill.', icon: '↻' },
      { name: 'Deployments', href: 'https://coolify.spencerreyka.com', description: 'Applications, deployments, and logs.', icon: '↑' },
      { name: 'Monitoring', href: 'https://status.spencerreyka.com', description: 'Service health and backup checks.', icon: '⌁' },
    ],
  },
]

export default async function AdminHub() {
  // This check lives at the render boundary, independent of middleware or Host routing.
  if (!await verifyAdminToken((await headers()).get('cf-access-jwt-assertion'))) notFound()

  return (
    <main>
      <header className="flex items-start justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-accent mb-3">Spencer Reyka</p>
          <h1 className="text-3xl font-semibold tracking-tight">Your home base.</h1>
          <p className="text-muted text-sm mt-2">A place for everything you run.</p>
        </div>
        <a href="/cdn-cgi/access/logout" className="text-xs text-muted hover:text-fg shrink-0 mt-1">Sign out</a>
      </header>

      {groups.map(group => (
        <section key={group.name} aria-labelledby={group.name.toLowerCase()}>
          <h2 id={group.name.toLowerCase()} className="section-heading">{group.name}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {group.links.map(link => (
              <a key={link.href} href={link.href} className="group block rounded-xl border border-border bg-[#141414] p-5 hover:border-accent transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
                <div className="flex items-center justify-between mb-4">
                  <span aria-hidden="true" className="text-accent text-xl">{link.icon}</span>
                  <span aria-hidden="true" className="text-muted group-hover:text-accent">↗</span>
                </div>
                <h3 className="text-sm font-medium">{link.name}</h3>
                <p className="text-muted text-xs mt-1">{link.description}</p>
              </a>
            ))}
          </div>
        </section>
      ))}

      <section aria-labelledby="repositories">
        <h2 id="repositories" className="section-heading">Repositories & notes</h2>
        <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm">
          {[
            ['Notes', 'notes'], ['Backbone', 'backbone'], ['Voice Panel', 'voice-panel'],
            ['Geo Wrapped', 'geo-wrapped'], ['Personal Site', 'personal-site'], ['Infrastructure', 'infra'],
          ].map(([name, repo]) => (
            <a key={repo} href={`https://github.com/SpencerReyka/${repo}`} className="text-muted hover:text-accent hover:underline">{name}</a>
          ))}
        </div>
      </section>
      <footer className="mt-16 pt-5 border-t border-border text-xs text-muted flex flex-wrap justify-between gap-4">
        <a href="https://spencerreyka.com" className="hover:text-accent">← Personal site</a>
        <a href="https://github.com/SpencerReyka/SpencerReyka.github.io/edit/master/index.html" className="hover:text-accent">Edit public site</a>
      </footer>
    </main>
  )
}
