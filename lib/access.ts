import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey } from 'jose'

export const ADMIN_HOST = 'admin.spencerreyka.com'
export const OWNER_EMAIL = 'spencer.reyka@gmail.com'
const issuer = 'https://solitary-block-1911.cloudflareaccess.com'
const keys = createRemoteJWKSet(new URL(`${issuer}/cdn-cgi/access/certs`))

// Verify the signature and application audience, never an unsigned identity header.
// Missing configuration and key-fetch failures must both fail closed.
export async function verifyAdminToken(
  token: string | null,
  audience = process.env.CF_ACCESS_ADMIN_AUD,
  key: JWTVerifyGetKey = keys,
) {
  if (!token || !audience) return false
  try {
    const { payload } = await jwtVerify(token, key, {
      issuer,
      audience,
      algorithms: ['RS256'],
      requiredClaims: ['exp', 'iat', 'sub', 'email'],
    })
    return payload.email === OWNER_EMAIL && payload.type === 'app'
  } catch {
    return false
  }
}
