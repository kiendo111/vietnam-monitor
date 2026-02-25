// api/trends.ts — Vercel Edge Function
// Fetches Google Trends daily trending searches for Vietnam (geo=VN)
// via the public RSS feed and returns the top results as JSON.
// Cached for 1 hour at the edge.

export const config = { runtime: 'edge' }

interface Trend {
  id: number
  rank: number
  topic: string
  volume: string
}

function formatVolume(raw: string): string {
  // Normalize "50,000+" → "50K+"  |  "1,000,000+" → "1M+"
  const num = parseInt(raw.replace(/,/g, ''), 10)
  if (isNaN(num) || num === 0) return raw.trim()
  if (num >= 1_000_000) return `${Math.round(num / 100_000) / 10}M+`
  if (num >= 1_000)     return `${Math.round(num / 1_000)}K+`
  return raw.trim()
}

export default async function handler(_req: Request): Promise<Response> {
  try {
    const res = await fetch('https://trends.google.com/trending/rss?geo=VN', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; vietnam-monitor/1.0)',
        'Accept':     'application/rss+xml, application/xml, text/xml',
      },
    })

    if (!res.ok) throw new Error(`Upstream HTTP ${res.status}`)

    const xml = await res.text()
    const trends: Trend[] = []

    // Walk through each <item> block
    const itemRegex = /<item>([\s\S]*?)<\/item>/g
    let match: RegExpExecArray | null
    let rank = 1

    while ((match = itemRegex.exec(xml)) !== null && rank <= 5) {
      const block = match[1]

      // Title may be wrapped in CDATA or plain
      const titleMatch =
        block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/s) ??
        block.match(/<title>(.*?)<\/title>/s)

      const trafficMatch = block.match(/<ht:approx_traffic>(.*?)<\/ht:approx_traffic>/s)

      if (titleMatch?.[1]) {
        trends.push({
          id:     rank,
          rank,
          topic:  titleMatch[1].trim(),
          volume: trafficMatch ? formatVolume(trafficMatch[1]) : '',
        })
        rank++
      }
    }

    return new Response(JSON.stringify({ trends }), {
      headers: {
        'Content-Type':  'application/json',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=600',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (err) {
    console.error('[trends]', err)
    return new Response(JSON.stringify({ trends: [], error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
