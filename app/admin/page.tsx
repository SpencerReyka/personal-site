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

      <h2 className="section-heading">Quick Links</h2>
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

      <h2 className="section-heading">Notes</h2>
      <p className="text-[0.85rem] text-muted">
        Placeholder — add whatever you want here. Dashboard, links, notes, tools.
      </p>

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
