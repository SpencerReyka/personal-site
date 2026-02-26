export async function GET() {
  const res = await fetch('https://ghchart.rshah.org/a78bfa/SpencerReyka')
  const svg = await res.text()
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
