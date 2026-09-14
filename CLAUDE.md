# personal-site

Read README.md for the current deployment and security contract.

- Next.js 15 App Router, React 19, TypeScript, Tailwind CSS v3.
- Coolify hosts the preview and private admin hub; the apex remains GitHub Pages
  in the separate SpencerReyka.github.io repository. Vercel instructions are obsolete.
- `app/page.tsx`: preview homepage, or private hub on the admin hostname.
- `app/AdminHub.tsx`: launcher; checks the signed Access assertion before rendering.
- `lib/access.ts`: pinned issuer, admin audience, signature/claims/owner verification.
- `app/admin/page.tsx` and `middleware.ts`: legacy URL redirects only.
- `app/api/voice/route.ts`: server-side backbone proxy; `BACKBONE_API_URL` is optional.
- `app/VoiceStatus.tsx`: polls voice state, hides unknown state.
- `auth.ts`: legacy NextAuth Google configuration; not used to authenticate the hub.
- `Dockerfile`: standalone output, Node 24, non-root runtime, in-image health check.

Design colors: background #0f0f0f, foreground #e8e8e8, muted #888,
accent #a78bfa, border #222. Theme lives in tailwind.config.ts.

Runtime hub configuration: CF_ACCESS_ADMIN_AUD (public application audience).
Preview's existing variables: AUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET,
BACKBONE_API_URL. Never print credentials or put them in client bundles.

Run npm test, npm run build, and npm audit --omit=dev for security changes.
Do not rely on middleware or Host headers as authorization. Missing/invalid tokens
must not render private content. Never add a production authentication bypass.
