// src/components/Ticker.tsx
// The scrolling market data bar under the header.

import { TICKER_ITEMS } from '../data/mock'
import type { EconIndicator } from '../types'

interface TickerProps {
  indicators: EconIndicator[]
  loading: boolean
}

function buildTickerItems(indicators: EconIndicator[]): string[] {
  return indicators.map(ind => {
    // Skip arrow + pct for indicators with no daily change (e.g. USD/VND rate-only)
    if (ind.pct === '---') return `${ind.label} ${ind.value}`
    const arrow = ind.up ? '↑' : '↓'
    return `${ind.label} ${ind.value} ${ind.pct} ${arrow}`
  })
}

export default function Ticker({ indicators, loading }: TickerProps) {
  const items = loading || indicators.length === 0
    ? TICKER_ITEMS
    : buildTickerItems(indicators)

  return (
    <div style={{
      background: 'var(--red)',
      height: 26,
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      {/* Fixed label on the left */}
      <div style={{
        background: 'var(--red-dim)',
        padding: '0 12px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.15em',
        flexShrink: 0,
        zIndex: 1,
        whiteSpace: 'nowrap',
      }}>
        ▶ THỊ TRƯỜNG
      </div>

      {/* Scrolling content — duplicated so it loops seamlessly */}
      <div style={{
        display: 'flex',
        animation: 'ticker 45s linear infinite',
        whiteSpace: 'nowrap',
      }}>
        {[...items, ...items].map((item, i) => (
          <span key={i} style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            fontWeight: 700,
            marginRight: 48,
          }}>
            {item}
            <span style={{ color: 'rgba(255,255,255,0.3)', margin: '0 24px 0 0' }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}
