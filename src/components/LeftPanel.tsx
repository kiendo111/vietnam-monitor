// src/components/LeftPanel.tsx
// Contains: AI Brief placeholder, Province activity, Source list

import { PROVINCES, SOURCES } from '../data/mock'

export default function LeftPanel() {
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
      <section style={{ padding: 16, borderBottom: '1px solid var(--border)' }}>
        <div className="section-title">AI Daily Brief</div>
        <div style={{
          background: 'var(--bg3)',
          border: '1px solid var(--border)',
          borderLeft: '3px solid var(--red)',
          borderRadius: 3,
          padding: 14,
          fontSize: 12.5,
          lineHeight: 1.75,
          color: 'var(--muted)',
          fontStyle: 'italic',
          minHeight: 100,
        }}>
          Nhấn nút bên dưới để nhận bản phân tích tin tức Việt Nam hôm nay từ AI — tổng hợp từ Claude + tìm kiếm web thời gian thực.
        </div>
        <button
          disabled
          title="Tính năng AI sẽ được kích hoạt trong Phase 4"
          style={{
            marginTop: 10,
            width: '100%',
            background: 'var(--bg3)',
            color: 'var(--muted)',
            border: '1px solid var(--border)',
            padding: '8px 0',
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.1em',
            borderRadius: 3,
            cursor: 'not-allowed',
          }}
        >
          ◆ TẠO BẢN TÓM TẮT AI · SẮP RA MẮT
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

      {/* ── NEWS SOURCES ─────────────────────────────────── */}
      <section style={{ padding: 16 }}>
        <div className="section-title">Nguồn theo dõi</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {SOURCES.map(s => (
            <div key={s.name} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 10px',
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              borderRadius: 3,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                {/* Green "live" dot */}
                <div style={{
                  width: 5, height: 5,
                  borderRadius: '50%',
                  background: 'var(--green)',
                  animation: 'pulse 3s infinite',
                }} />
                <span style={{ fontSize: 12, fontWeight: 600 }}>{s.name}</span>
              </div>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 8,
                padding: '2px 5px',
                borderRadius: 2,
                background: s.lang === 'VI'
                  ? 'rgba(200,16,46,0.15)'
                  : 'rgba(245,166,35,0.15)',
                color: s.lang === 'VI' ? 'var(--red)' : 'var(--gold)',
              }}>
                {s.lang}
              </span>
            </div>
          ))}
        </div>
      </section>
    </aside>
  )
}