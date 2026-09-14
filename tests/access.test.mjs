import { test } from 'node:test'
import assert from 'node:assert/strict'
import { generateKeyPair, SignJWT } from 'jose'
import { verifyAdminToken, OWNER_EMAIL } from '../lib/access.ts'

const { privateKey, publicKey } = await generateKeyPair('RS256')
const getKey = async () => publicKey
const audience = 'admin-test-audience'
const issuer = 'https://solitary-block-1911.cloudflareaccess.com'
const now = Math.floor(Date.now() / 1000)
const claims = { email: OWNER_EMAIL, type: 'app', iss: issuer, aud: audience, sub: 'owner', iat: now, exp: now + 300 }
const sign = (overrides = {}, key = privateKey) => new SignJWT({ ...claims, ...overrides }).setProtectedHeader({ alg: 'RS256' }).sign(key)

test('accepts a signed owner token for this application', async () => {
  assert.equal(await verifyAdminToken(await sign(), audience, getKey), true)
})

for (const [name, overrides] of [
  ['another user', { email: 'someone@example.com' }],
  ['another application (including preview)', { aud: 'preview-audience' }],
  ['another issuer', { iss: 'https://attacker.example.com' }],
  ['expired token', { exp: now - 1 }],
  ['not-yet-valid token', { nbf: now + 300 }],
  ['missing expiry', { exp: undefined }],
  ['missing identity', { sub: undefined }],
  ['service token', { type: 'service', email: undefined }],
]) test(`rejects ${name}`, async () => {
  assert.equal(await verifyAdminToken(await sign(overrides), audience, getKey), false)
})

test('rejects forged signatures, unsigned tokens, and malformed headers', async () => {
  const other = await generateKeyPair('RS256')
  assert.equal(await verifyAdminToken(await sign({}, other.privateKey), audience, getKey), false)
  const unsigned = `${Buffer.from('{"alg":"none"}').toString('base64url')}.${Buffer.from(JSON.stringify(claims)).toString('base64url')}.`
  for (const token of [unsigned, 'spencer.reyka@gmail.com', '', null]) {
    assert.equal(await verifyAdminToken(token, audience, getKey), false)
  }
})

test('fails closed without configuration or when signing keys cannot be loaded', async () => {
  const token = await sign()
  assert.equal(await verifyAdminToken(token, '', getKey), false)
  assert.equal(await verifyAdminToken(token, audience, async () => { throw new Error('unavailable') }), false)
})
