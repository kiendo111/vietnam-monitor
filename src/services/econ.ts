// src/services/econ.ts
// Multi-source market data — all CORS-enabled, direct browser fetch (no proxy required)
//
// Source map:
//   VN-Index  → kbbuddywts.kbsec.com.vn (KB Securities public API, no auth)
//   HNX-Index → kbbuddywts.kbsec.com.vn (KB Securities public API, no auth)
//   USD/VND   → open.er-api.com          (free, no key, current rate only)
//   Gold      → /api/stooq → stooq.com  (Vite proxy — Stooq drops CORS on browser Origin)
//   Oil WTI   → /api/stooq → stooq.com  (Vite proxy)

import type { EconIndicator } from '../types'

// ── KB Securities (KBS) public API ───────────────────────────────────────────
// Supports: VNINDEX, HNXINDEX, HNX30, VN30, VN100, UPCOMINDEX
// CORS: access-control-allow-origin: * (confirmed with browser Origin header)
// Returns newest-first array; prices are actual values (no scaling needed)

interface KBSRow {
  t: string       // timestamp e.g. "2026-02-24 07:00"
  c: string | number  // close price
}

interface KBSResponse {
  symbol: string
  data_day: KBSRow[]
}

async function fetchKBSIndex(
  symbol: string,
  label: string,
  format: (p: number) => string
): Promise<EconIndicator> {
  const now   = new Date()
  const start = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
  const fmt   = (d: Date) =>
    `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`
  const url = `https://kbbuddywts.kbsec.com.vn/iis-server/investment/index/${symbol}/data_day?sdate=${fmt(start)}&edate=${fmt(now)}`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`KBS ${symbol}: HTTP ${res.status}`)

  const data: KBSResponse = await res.json()
  const rows = data.data_day
  if (!rows?.length) throw new Error(`KBS ${symbol}: no data rows`)

  // Array is newest-first
  const today = parseFloat(String(rows[0].c))
  const prev  = rows.length > 1 ? parseFloat(String(rows[1].c)) : today

  if (isNaN(today)) throw new Error(`KBS ${symbol}: invalid close "${rows[0].c}"`)

  const change = today - prev
  const pct    = prev !== 0 ? (change / prev) * 100 : 0

  return {
    label,
    value:  format(today),
    change: (change >= 0 ? '+' : '') + change.toFixed(2),
    pct:    (pct >= 0 ? '+' : '') + pct.toFixed(2) + '%',
    up:     change >= 0,
  }
}

// ── Stooq CSV helper ─────────────────────────────────────────────────────────
// Stooq drops access-control-allow-origin when browser Origin header is present
// → must go through Vite proxy (/api/stooq → stooq.com)

function parseStooqCSV(csv: string): { today: number; prev: number } | null {
  const lines = csv.trim().split('\n').filter(l => l.trim() && !l.startsWith('Date'))
  if (lines.length < 2) return null
  const close = (line: string) => parseFloat(line.split(',')[4])
  const today = close(lines[lines.length - 1])
  const prev  = close(lines[lines.length - 2])
  if (isNaN(today) || isNaN(prev)) return null
  return { today, prev }
}

async function fetchStooq(
  symbol: string,
  label: string,
  format: (p: number) => string
): Promise<EconIndicator> {
  const now   = new Date()
  const start = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
  const fmt   = (d: Date) => d.toISOString().slice(0, 10).replace(/-/g, '')
  const url   = `/api/stooq/q/d/l/?s=${encodeURIComponent(symbol)}&i=d&d1=${fmt(start)}&d2=${fmt(now)}`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Stooq ${symbol}: HTTP ${res.status}`)

  const parsed = parseStooqCSV(await res.text())
  if (!parsed) throw new Error(`Stooq ${symbol}: insufficient data rows`)

  const change = parsed.today - parsed.prev
  const pct    = parsed.prev !== 0 ? (change / parsed.prev) * 100 : 0

  return {
    label,
    value:  format(parsed.today),
    change: (change >= 0 ? '+' : '') + change.toFixed(2),
    pct:    (pct >= 0 ? '+' : '') + pct.toFixed(2) + '%',
    up:     change >= 0,
  }
}

// ── USD/VND via open.er-api.com ───────────────────────────────────────────────
// CORS-enabled, free, no key — current rate only (no daily change available)

async function fetchUSDVND(): Promise<EconIndicator> {
  const res = await fetch('https://open.er-api.com/v6/latest/USD')
  if (!res.ok) throw new Error(`ExchangeRate API: HTTP ${res.status}`)
  const data = await res.json()
  if (data.result !== 'success') throw new Error('ExchangeRate API: non-success result')
  const rate: number | undefined = data.rates?.VND
  if (!rate) throw new Error('VND rate missing from response')

  return {
    label:  'USD/VND',
    value:  Math.round(rate).toLocaleString('vi-VN'),
    change: '---',
    pct:    '---',
    up:     true,
  }
}

// ── Main export ───────────────────────────────────────────────────────────────

export async function fetchMarketData(): Promise<EconIndicator[]> {
  const fetches: Promise<EconIndicator>[] = [
    fetchKBSIndex('VNINDEX',   'VN-Index',  (p) => p.toFixed(2)),
    fetchKBSIndex('HNXINDEX',  'HNX-Index', (p) => p.toFixed(2)),
    fetchUSDVND(),
    fetchStooq('xauusd', 'Gold (XAU)', (p) => `$${Math.round(p).toLocaleString()}`),
    fetchStooq('cl.c',   'Dầu WTI',   (p) => `$${p.toFixed(1)}`),
  ]

  const results = await Promise.allSettled(fetches)

  const indicators: EconIndicator[] = results
    .map((r, i) => {
      if (r.status === 'fulfilled') return r.value
      console.warn(`[econ] fetch #${i} failed:`, (r as PromiseRejectedResult).reason?.message ?? (r as PromiseRejectedResult).reason)
      return null
    })
    .filter((ind): ind is EconIndicator => ind !== null)

  if (indicators.length === 0) throw new Error('All market data sources failed')

  // Static GDP — no real-time API available
  indicators.push({ label: 'GDP Q3/25', value: '6.8%', change: 'YoY', pct: '▲', up: true })

  return indicators
}
