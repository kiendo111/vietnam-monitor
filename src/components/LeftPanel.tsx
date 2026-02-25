// src/components/LeftPanel.tsx
// Contains: AI Brief, Province activity, Traffic map

import { useEffect } from 'react'
import { PROVINCES } from '../data/mock'
import { useAiBrief } from '../hooks/useAiBrief'
import TrafficMaps from './TrafficMaps'
import type { NewsItem } from '../types'

interface LeftPanelProps {
  articles: NewsItem[]   // already-filtered articles from App.tsx
  filterLabel: string    // e.g. "Tất cả", "Kinh tế", "Thể thao"
}

export default function LeftPanel({ articles, filterLabel }: LeftPanelProps) {
  const { brief, loading, error, generate, reset } = useAiBrief()

  // Clear the brief whenever the active filter changes
  useEffect(() => {
    reset()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterLabel])

  const btnLabel = filterLabel === 'Tất cả'
    ? `◆ TÓM TẮT TIN TỨC (${articles.length})`
    : `◆ TÓM TẮT: ${filterLabel.toUpperCase()} (${articles.length})`

  return (
    <aside style={{
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      overflowX: 'hidden',
      background: 'var(--bg)',
      height: '100%',
    }}>
      {/* ── AI BRIEF ─────────────────────────────────────── */}
      <section style={{ padding: 16, borderBottom: '1px solid var(--border)', flex: 1 }}>
        <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          AI Daily Brief
          <span style={{ fontSize: 8, color: 'var(--gold)', fontFamily: 'var(--font-mono)', marginLeft: 'auto' }}>
            ◆ CLAUDE
          </span>
        </div>
        <div style={{
          background: 'var(--bg3)',
          border: '1px solid var(--border)',
          borderLeft: `3px solid ${error ? 'var(--gold)' : 'var(--red)'}`,
          borderRadius: 3,
          padding: 14,
          fontSize: 12.5,
          lineHeight: 1.75,
          minHeight: 100,
          color: brief ? 'var(--text)' : 'var(--muted)',
          fontStyle: brief ? 'normal' : 'italic',
        }}>
          {loading
            ? <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--gold)' }}>◆ Đang phân tích tin tức…</span>
            : error
            ? error
            : brief
            ? brief
            : 'Nhấn nút bên dưới để nhận bản phân tích tin tức Việt Nam hôm nay từ Claude AI.'}
        </div>
        <button
          onClick={() => generate(articles, filterLabel)}
          disabled={loading || articles.length === 0}
          style={{
            marginTop: 10,
            width: '100%',
            background: loading ? 'var(--bg3)' : 'rgba(200,16,46,0.08)',
            color: loading ? 'var(--muted)' : 'var(--red)',
            border: `1px solid ${loading ? 'var(--border)' : 'rgba(200,16,46,0.3)'}`,
            padding: '8px 0',
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.1em',
            borderRadius: 3,
            cursor: loading || articles.length === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? '◆ ĐANG TẠO…' : btnLabel}
        </button>
      </section>

      {/* ── PROVINCE ACTIVITY ────────────────────────────── */}
      <section style={{ padding: 16, borderBottom: '1px solid var(--border)' }}>
        <div className="section-title">Hoạt động theo tỉnh</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {PROVINCES.map(p => (
            <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* Province name */}
              <span style={{ flex: 1, fontSize: 12, fontWeight: 600 }}>{p.name}</span>
              {/* Activity bar */}
              <div style={{ width: 64, height: 3, background: 'var(--faint)', borderRadius: 2 }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(100, (p.count / 10) * 100)}%`,
                  borderRadius: 2,
                  background: p.level === 'high' ? 'var(--red)'
                    : p.level === 'medium' ? 'var(--gold)'
                    : 'var(--muted)',
                }} />
              </div>
              {/* Count */}
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--muted)',
                width: 14,
                textAlign: 'right',
              }}>
                {p.count}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── LIVE TRAFFIC ──────────────────────────────────── */}
      <section style={{ padding: 16 }}>
        <div className="section-title">Giao thông trực tiếp</div>
        <TrafficMaps />
      </section>
    </aside>
  )
}
