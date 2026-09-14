import { auth, signOut } from '@/auth'

export default async function AdminPage() {
  const session = await auth()

  return (
    <>
      <section>
        <h1 className="text-2xl font-semibold tracking-tight mb-1">Admin</h1>
        <p className="text-muted text-[0.9rem] mb-4">
          Signed in as {session?.user?.email}
        </p>
      </section>

      <h2 className="section-heading">Private services</h2>
      <div className="grid gap-3 mt-2 sm:grid-cols-2">
        {[
          ['Location history', 'https://geo.spencerreyka.com', 'Reitti maps, trips, and visits'],
          ['Tasks', 'https://todo.spencerreyka.com', 'Vikunja tasks and projects'],
          ['Automation', 'https://windmill.spencerreyka.com', 'Windmill jobs and workflows'],
          ['Infrastructure', 'https://coolify.spencerreyka.com', 'Coolify deployments and logs'],
          ['Status', 'https://status.spencerreyka.com', 'Uptime Kuma monitors and history'],
        ].map(([name, href, description]) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noopener"
            className="border border-[#2a2a2a] rounded-md px-4 py-3 hover:border-accent transition-colors"
          >
            <span className="block text-accent text-sm font-medium">{name}</span>
            <span className="block text-[0.8rem] text-muted mt-1">{description}</span>
          </a>
        ))}
      </div>

      <h2 className="section-heading">Site</h2>
      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
        <a
          href="https://github.com/SpencerReyka/personal-site/edit/main/app/page.tsx"
          target="_blank"
          rel="noopener"
          className="text-accent text-sm hover:underline"
        >
          Edit Site
        </a>
        <a
          href="https://github.com/SpencerReyka/personal-site"
          target="_blank"
          rel="noopener"
          className="text-accent text-sm hover:underline"
        >
          GitHub Repo
        </a>
        <a href="/" className="text-accent text-sm hover:underline">← Back to Site</a>
      </div>

      <div className="mt-12">
        <form
          action={async () => {
            'use server'
            await signOut({ redirectTo: '/' })
          }}
        >
          <button
            type="submit"
            className="text-[0.875rem] text-muted hover:text-fg transition-colors"
          >
            Sign out
          </button>
        </form>
      </div>
    </>
  )
}
