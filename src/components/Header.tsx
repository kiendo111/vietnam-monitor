// src/components/Header.tsx
import { useState, useEffect } from 'react'

interface HeaderProps {
  articleCount: number
  sourceCount: number
  lastUpdated: Date | null
  onRefresh: () => void
  loading: boolean
  theme: 'dark' | 'light'
  onToggleTheme: () => void
  isMobile?: boolean
}

export default function Header({
  articleCount, sourceCount, lastUpdated, onRefresh, loading, theme, onToggleTheme, isMobile = false
}: HeaderProps) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const timeStr = time.toLocaleTimeString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
  const dateStr = time.toLocaleDateString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric',
  })

  const updatedStr = lastUpdated
    ? lastUpdated.toLocaleTimeString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        hour: '2-digit', minute: '2-digit',
      })
    : '--:--'

  const btnStyle = {
    background: 'var(--bg3)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    borderRadius: 2,
    cursor: 'pointer',
    letterSpacing: '0.1em',
  } as const

  // ── MOBILE HEADER ────────────────────────────────────────────
  if (isMobile) {
    return (
      <header style={{
        background: 'var(--bg2)',
        borderBottom: '1px solid var(--border)',
        height: 46,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 14px',
        flexShrink: 0,
        gap: 12,
      }}>
        {/* Compact logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <div style={{
            width: 24, height: 18, flexShrink: 0,
            background: 'var(--red)',
            borderRadius: 2,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: 'var(--gold)', fontSize: 11, lineHeight: 1 }}>★</span>
          </div>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11, fontWeight: 700,
            letterSpacing: '0.15em',
            whiteSpace: 'nowrap',
          }}>
            VIETNAM MONITOR
          </span>
        </div>

        {/* Right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          {/* Live dot */}
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: loading ? 'var(--gold)' : 'var(--green)',
            animation: 'pulse 2s infinite',
          }} />

          {/* Refresh */}
          <button
            onClick={onRefresh}
            disabled={loading}
            title="Tải lại tin tức"
            style={{
              ...btnStyle,
              color: loading ? 'var(--muted)' : 'var(--text)',
              cursor: loading ? 'not-allowed' : 'pointer',
              padding: '4px 9px',
              fontSize: 12,
            }}
          >
            {loading ? '⟳' : '↺'}
          </button>

          {/* Theme toggle */}
          <button
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
            style={{ ...btnStyle, padding: '4px 9px' }}
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>

          {/* Clock — time only */}
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11, fontWeight: 700,
            color: 'var(--text)',
          }}>
            {timeStr.slice(0, 5)}
          </span>
        </div>
      </header>
    )
  }

  // ── DESKTOP HEADER ───────────────────────────────────────────
  return (
    <header style={{
      background: 'var(--bg2)',
      borderBottom: '1px solid var(--border)',
      height: 52,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 30, height: 22,
          background: 'var(--red)',
          borderRadius: 2,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ color: 'var(--gold)', fontSize: 14, lineHeight: 1 }}>★</span>
        </div>
        <div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 13, fontWeight: 700,
            letterSpacing: '0.2em',
          }}>
            VIETNAM MONITOR
          </div>
          <div className="label" style={{ marginTop: 1 }}>
            Bảng theo dõi tin tức · Intelligence Dashboard
          </div>
        </div>
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>

        {/* Live status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: loading ? 'var(--gold)' : 'var(--green)',
            animation: 'pulse 2s infinite',
          }} />
          <span className="label">
            {loading
              ? 'ĐANG TẢI...'
              : `TRỰC TIẾP · ${articleCount} bài · ${sourceCount} nguồn`}
          </span>
        </div>

        {/* Last updated + refresh button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="label">CẬP NHẬT {updatedStr}</span>
          <button
            onClick={onRefresh}
            disabled={loading}
            title="Tải lại tin tức"
            style={{
              ...btnStyle,
              color: loading ? 'var(--muted)' : 'var(--text)',
              cursor: loading ? 'not-allowed' : 'pointer',
              padding: '3px 8px',
            }}
          >
            {loading ? '⟳' : '↺ LÀM MỚI'}
          </button>
        </div>

        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
          style={{ ...btnStyle, padding: '3px 10px' }}
        >
          {theme === 'dark' ? '☀ SÁNG' : '☾ TỐI'}
        </button>

        {/* Clock */}
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 13, fontWeight: 700,
          }}>
            {timeStr} <span className="muted" style={{ fontSize: 9 }}>ICT</span>
          </div>
          <div className="label" style={{ marginTop: 1 }}>{dateStr}</div>
        </div>
      </div>
    </header>
  )
}
