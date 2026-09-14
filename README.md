# Personal site and private hub

Tags: [personal-site] [infra] [voice-panel]

Next.js 15 / React 19 / Tailwind, deployed as one Coolify Dockerfile app on
`coolify-vm` (container 3000, host 3210).

- `preview.spencerreyka.com` serves the personal-site preview behind Cloudflare Access.
- `admin.spencerreyka.com` serves the private launcher at `/`, also behind Access.
- The public `spencerreyka.com` remains GitHub Pages, sourced from
  `SpencerReyka/SpencerReyka.github.io` on `master`. Its footer links to the hub;
  its old `/admin/` page redirects there. Editing this repo does not update Pages.

## Hub access

Cloudflare Access allows only `spencer.reyka@gmail.com` through Google, with a 24-hour
session. The server additionally verifies the `Cf-Access-Jwt-Assertion` signature,
issuer, admin application audience, expiration, identity, and exact owner email before
rendering `app/AdminHub.tsx`. It fails closed when configuration or signing keys are
unavailable. An unsigned email header, the preview app's JWT, and NextAuth sessions
cannot authorize the hub. Middleware only redirects legacy `/admin` URLs.

Set `CF_ACCESS_ADMIN_AUD` in Coolify as a runtime variable. It is the public audience
identifier from the admin Access app, not a secret. The trusted issuer is pinned in
`lib/access.ts`; do not derive it from request headers. Never add a production test bypass.

The tunnel routes only `/` and `/_next/` on the admin hostname to this app; other paths
return 404. Access still protects the whole hostname. Hub HTML is dynamically rendered,
private/no-store, noindex, and denies framing. Cards are ordinary links; downstream apps
keep their own authentication. Sign out uses Access's logout endpoint for this application;
it does not log out other services or the Google account.

The existing NextAuth endpoints and `auth.ts` remain for the preview application; they
are not the hub's login mechanism. The public origin's generated Coolify hostname does
not bypass the render-time hub check, even with a forged Host header.

## Development and checks

```
npm ci
npm test
npm run build
npm audit --omit=dev
npm run dev
```

Node 22.18+ is required for the TypeScript security tests; the Docker image uses Node 24.
Tests sign real test JWTs and verify owner access plus wrong user, audience, issuer,
expiry, missing claims, forged signatures, and missing configuration/keys.

`next`'s PostCSS dependency is overridden to a patched 8.5.x release because the version
pinned by Next.js 15 otherwise produces security advisories. Keep the override and lockfile
in sync, and validate the production build when changing it.

## Ownership and deployment

UI and JWT validation live here. DNS/service registration lives in `../infra/services.yml`;
tunnel routing lives in `../voice-panel/apps/cloudflared/config.yml`. Coolify builds `main`
using `Dockerfile`. The container's existing health check checks the public preview render,
not an authenticated browser session.

Before changing routing, create the owner-only Access policy and set its runtime audience.
After deployment, verify anonymous requests redirect to Access, direct-origin requests
with missing/forged assertions contain no hub content, and a real owner login renders cards.
The last check requires the owner's browser. Do not weaken Access to automate it.
