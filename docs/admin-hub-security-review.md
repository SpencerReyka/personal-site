# Admin hub review — 2026-09-14

Tags: [personal-site] [infra] [voice-panel]

Reviewed and deployed application commit: `235d64376782372c5a390ef8114298693df27c11`.
Public Pages commit: `2258b1db2d3a46029789e5b3ae8f3063771b47f8`.

## Outcome

No blocking security findings in the reviewed launcher flow. The hub is live at
`https://admin.spencerreyka.com`, linked from the GitHub Pages footer. The old public
`/admin/` placeholder redirects to the protected hostname.

This review covers the launcher and its new routing/authentication. It is not a new
audit of the downstream tools or the entire infrastructure estate.

## Verified controls

- Live Cloudflare policy allows only the owner's exact email through Google, with a
  24-hour session. No bypass or service-token policy was added to this hostname.
- Before rendering, the server verifies an RS256 signature using a pinned Cloudflare
  issuer's public keys, the specific admin audience, expiration, required identity
  claims, token type, and exact owner email. It never trusts a plain email header.
- Missing configuration or signing keys denies access. No production test bypass exists.
- Authentication happens inside the server component, not solely in middleware. Hostname
  routing only selects content; it does not grant access.
- The tunnel routes only the root and Next.js assets on the admin hostname. Live ingress
  rule checks show `/api/auth/session` and `/terminal` hit the 404 fallback.
- Responses use private/no-store caching, noindex, no-referrer, nosniff, and framing
  protections. Cards use fixed HTTPS URLs with no credentials or administrative actions.
- Existing generated Coolify origin and port 3210 do not bypass the hub's JWT check.

## Validation evidence

- `npm test`: 11 passing cases, including correctly signed owner access and rejection of
  another user, wrong application/issuer, expired/future/missing claims, forged signatures,
  unsigned tokens, and unavailable configuration/keys.
- `npm run build`: succeeds with type checking.
- `npm audit --omit=dev`: zero known vulnerabilities after replacing Next.js's vulnerable
  nested PostCSS version with patched 8.5.28 via an override and lockfile update.
- Separate local production-build test with test-only signing keys: owner request renders
  all five cards; another signed user, absent token, forged identity, middleware-subrequest
  bypass, and RSC prefetch reveal no hub content. Fixtures are outside the repo and were
  not deployed. RSC denials may return HTTP 200 with a not-found payload; the checked
  property is that private content is absent and caching remains disabled.
- Live deployed origin: missing/forged assertions, middleware-subrequest bypass, and RSC
  prefetch reveal no private content and all use no-store.
- Public admin hostname: anonymous request returns a 302 to the expected Cloudflare team
  login domain, with no hub content.
- Cloudflared validates the configuration and remains active. Coolify reports a finished
  deployment of the exact application commit above.
- Generated live inventory matches the new service declaration with no reported drift.
- GitHub Pages reports the public commit built; live homepage and `/admin/` contain the
  correct hub destination.
- Browser inspection at 390px and 1100px confirms no horizontal overflow and the expected
  cards, repository shortcuts, and sign-out link.

## Practical limits

The owner's real Google login and logout still need a browser check. Automated positive
rendering used test keys locally; it does not claim an end-to-end production Google login.

Signing out of this hub does not sign out Google or the downstream apps. Apps retain their
own authentication. The existing container health check covers the preview render rather
than an authenticated hub session. The existing broad host-port binding is unchanged;
the hub also enforces authentication at the render boundary.
