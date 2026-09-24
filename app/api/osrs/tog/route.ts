import { fetchTog } from '@/lib/osrs-data'

export const revalidate = 300

export async function GET() {
  const worlds = await fetchTog()
  if (worlds === null) return Response.json({ worlds: [], known: false })
  return Response.json(
    { worlds, known: true, fetchedAt: new Date().toISOString() },
    { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } },
  )
}
