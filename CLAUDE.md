# personal-site

Spencer Reyka's personal site. Migrated from plain HTML on GitHub Pages to Next.js on Vercel.

## Stack

- **Next.js 15** — App Router, TypeScript
- **Tailwind CSS v3** — utility-first, custom theme vars in tailwind.config.ts
- **NextAuth.js v5** — Google OAuth, protects /admin
- **Vercel** — hosting, auto-deploys on push to main
- **Cloudflare** — DNS only (gray cloud), registrar for spencerreyka.com

## Key files

- `app/page.tsx` — entire site content (edit this to update the page)
- `app/admin/page.tsx` — admin dashboard, server-side auth via `auth()`
- `app/api/ghchart/route.ts` — CORS proxy for github contribution chart
- `auth.ts` — Google provider config, email allowlist (spencer.reyka@gmail.com only)
- `middleware.ts` — protects /admin routes

## Design system

Colors defined in `tailwind.config.ts` and mirrored as CSS vars in `globals.css`:
- `bg` #0f0f0f — page background
- `fg` #e8e8e8 — body text
- `muted` #888 — secondary text, labels
- `accent` #a78bfa — purple, links
- `border` #222 — dividers

## Env vars (Vercel dashboard)

```
AUTH_SECRET           # generate with: npx auth secret
GOOGLE_CLIENT_ID      # from Google Cloud Console
GOOGLE_CLIENT_SECRET  # from Google Cloud Console
```

## Local dev

Requires Node.js LTS. First time:
```bash
npm install
npm run dev   # → localhost:3000
```

## Deploy

Push to `main` → Vercel auto-deploys. No manual step.

## DNS (Cloudflare — DNS only, gray cloud)

```
A      @    76.76.21.21
CNAME  www  cname.vercel-dns.com
```

## Status

- [x] Repo created, code pushed
- [x] Content ported from index.html
- [ ] Node.js installed on local machine
- [ ] Google Cloud Console — OAuth credentials created
- [ ] Vercel — project imported, env vars added, domain added
- [ ] Cloudflare DNS — switched from GitHub Pages records to Vercel records
