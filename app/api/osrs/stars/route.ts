import { fetchStars } from '@/lib/osrs-data'

export const revalidate = 30

export async function GET() {
  const stars = await fetchStars()
  if (stars === null) return Response.json({ stars: [], known: false })
  return Response.json(
    { stars, known: true, fetchedAt: new Date().toISOString() },
    { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' } },
  )
}
