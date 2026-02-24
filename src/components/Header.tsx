// src/components/Header.tsx
import { useState, useEffect } from 'react'

interface HeaderProps {
  articleCount: number
  sourceCount: number
  lastUpdated: Date | null
  onRefresh: () => void
  loading: boolean
}

export default function Header({
  articleCount, sourceCount, lastUpdated, onRefresh, loading
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
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              color: loading ? 'var(--muted)' : 'var(--text)',
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              padding: '3px 8px',
              borderRadius: 2,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? '⟳' : '↺ LÀM MỚI'}
          </button>
        </div>

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