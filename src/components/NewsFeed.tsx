// src/components/NewsFeed.tsx
import { useState } from 'react'
import { CATEGORIES } from '../data/mock'
import { useNews } from '../hooks/useNews'
import type { Category } from '../types'
import { FEEDS } from '../services/rss'
import SourceSelector from './SourceSelector'

// Loading skeleton — shown while fetching
function SkeletonItem() {
  return (
    <div style={{ padding: '13px 16px', borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--faint)' }} />
        <div style={{ width: 64, height: 8, borderRadius: 2, background: 'var(--faint)' }} />
        <div style={{ width: 80, height: 8, borderRadius: 2, background: 'var(--faint)' }} />
      </div>
      <div style={{ width: '92%', height: 14, borderRadius: 2, background: 'var(--bg3)', marginBottom: 6 }} />
      <div style={{ width: '70%', height: 14, borderRadius: 2, background: 'var(--bg3)', marginBottom: 6 }} />
      <div style={{ width: '55%', height: 10, borderRadius: 2, background: 'var(--faint)' }} />
    </div>
  )
}

interface NewsFeedProps {
  // We receive the hook result from App.tsx so Header can share it too
  articles: ReturnType<typeof useNews>['articles']
  loading: boolean
  error: string | null
}

export default function NewsFeed({ articles, loading, error }: NewsFeedProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('all')
  const [activeSource, setActiveSource] = useState('All')
  const [search, setSearch] = useState('')

  const handleSetCategory = (category: Category) => {
    setActiveCategory(category)
    setActiveSource('All')
  }

  const sourcesForCategory = activeCategory === 'all'
    ? []
    : [...new Set(FEEDS.filter(f => f.category === activeCategory).map(f => f.source))]

  const filtered = articles.filter(item => {
    const matchCat = activeCategory === 'all' || item.category === activeCategory
    const matchSource = activeSource === 'All' || item.source === activeSource
    const q = search.toLowerCase()
    const matchSearch = !q
      || item.title.toLowerCase().includes(q)
      || item.titleEn.toLowerCase().includes(q)
    return matchCat && matchSource && matchSearch
  })

  const highSeverity = articles.filter(n => n.severity === 'high')

  return (
    <main style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg)', height: '100%' }}>

      {/* ── ERROR BANNER ─────────────────────────────────── */}
      {error && (
        <div style={{
          background: 'rgba(245,166,35,0.1)',
          borderBottom: '1px solid rgba(245,166,35,0.3)',
          padding: '6px 16px',
          fontSize: 11,
          color: 'var(--gold)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexShrink: 0,
        }}>
          <span>⚠</span> {error}
        </div>
      )}

      {/* ── TOP ALERT BANNER ─────────────────────────────── */}
      {!loading && highSeverity.length > 0 && (
        <div style={{
          background: 'rgba(200,16,46,0.08)',
          borderBottom: '1px solid rgba(200,16,46,0.3)',
          padding: '7px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flexShrink: 0,
          animation: 'fadeIn 0.3s ease',
        }}>
          <span style={{
            background: 'var(--red)', color: 'white',
            fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700,
            padding: '2px 7px', borderRadius: 2, letterSpacing: '0.1em', flexShrink: 0,
          }}>
            ⚠ KHẨN
          </span>
          <span style={{ fontSize: 12.5, fontWeight: 700 }}>{highSeverity[0].title}</span>
          <span style={{ fontSize: 11, color: 'var(--muted)', flexShrink: 0 }}>
            — {highSeverity[0].source}
          </span>
        </div>
      )}

      {/* ── SEARCH ───────────────────────────────────────── */}
      <div style={{
        padding: '10px 16px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg2)',
        flexShrink: 0,
      }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍  Tìm kiếm tin tức..."
          style={{
            width: '100%',
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            borderRadius: 3,
            padding: '7px 12px',
            color: 'var(--text)',
            fontSize: 13,
            fontFamily: 'var(--font-body)',
            outline: 'none',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--red)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
      </div>

      {/* ── CATEGORY TABS ────────────────────────────────── */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg2)',
        overflowX: 'auto',
        flexShrink: 0,
      }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => handleSetCategory(cat.id as Category)}
            style={{
              padding: '9px 14px',
              background: 'none', border: 'none',
              borderBottom: `2px solid ${activeCategory === cat.id ? 'var(--red)' : 'transparent'}`,
              color: activeCategory === cat.id ? 'var(--red)' : 'var(--muted)',
              fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600,
              cursor: 'pointer', whiteSpace: 'nowrap', transition: 'color 0.15s',
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* ── SOURCE SELECTOR ──────────────────────────────── */}
      {activeCategory !== 'all' && sourcesForCategory.length > 1 && (
        <SourceSelector
          sources={sourcesForCategory}
          selectedSource={activeSource}
          onSelectSource={setActiveSource}
        />
      )}

      {/* ── LEGEND + COUNT ───────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '6px 16px',
        background: 'var(--bg2)',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        <span className="label">Mức độ:</span>
        {[['var(--red)', 'Khẩn cấp'], ['var(--gold)', 'Quan trọng'], ['var(--muted)', 'Thông thường']].map(
          ([color, label]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
              <span style={{ fontSize: 10, color: 'var(--muted)' }}>{label}</span>
            </div>
          )
        )}
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--muted)' }}>
          {loading ? '...' : `${filtered.length} bài viết`}
        </span>
      </div>

      {/* ── NEWS LIST ────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto' }}>

        {/* Loading skeletons */}
        {loading && Array.from({ length: 8 }).map((_, i) => <SkeletonItem key={i} />)}

        {/* Live articles */}
        {!loading && filtered.map(item => (
          <article
            key={item.id}
            onClick={() => item.url && window.open(item.url, '_blank')}
            style={{
              padding: '13px 16px',
              borderBottom: '1px solid var(--border)',
              cursor: item.url ? 'pointer' : 'default',
              transition: 'background 0.1s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            {/* Meta row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                background: item.severity === 'high' ? 'var(--red)'
                  : item.severity === 'medium' ? 'var(--gold)'
                  : 'var(--muted)',
              }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--gold)', fontWeight: 700 }}>
                {item.source}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--muted)' }}>
                📍 {item.province}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--muted)', marginLeft: 'auto' }}>
                {item.time}
              </span>
            </div>

            {/* Vietnamese headline */}
            <div style={{
              fontSize: item.severity === 'high' ? 16 : item.severity === 'medium' ? 15 : 13.5,
              fontWeight: item.severity === 'high' ? 800 : item.severity === 'medium' ? 700 : 600,
              lineHeight: 1.45,
              marginBottom: 4,
              borderLeft: item.severity === 'high' ? '2px solid var(--red)' : 'none',
              paddingLeft: item.severity === 'high' ? 8 : 0,
            }}>
              {item.title}
            </div>

            {/* English translation (Phase 4 will fill this in via Claude) */}
            {item.titleEn && (
              <div style={{ fontSize: 11, color: 'var(--muted)', fontStyle: 'italic', lineHeight: 1.4 }}>
                {item.titleEn}
              </div>
            )}

            {/* "Open article" hint on hover */}
            {item.url && (
              <div style={{ fontSize: 10, color: 'var(--faint)', marginTop: 4 }}>
                ↗ Đọc toàn bài
              </div>
            )}
          </article>
        ))}

        {/* No results state */}
        {!loading && filtered.length === 0 && (
          <div style={{
            padding: 40, textAlign: 'center',
            color: 'var(--muted)', fontSize: 13,
          }}>
            Không tìm thấy bài viết nào.<br />
            <span style={{ fontSize: 11, marginTop: 4, display: 'block' }}>
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.
            </span>
          </div>
        )}
      </div>
    </main>
  )
}