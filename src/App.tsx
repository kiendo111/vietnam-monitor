// src/App.tsx
import { useState, useEffect } from 'react'
import { useNews } from './hooks/useNews'
import { useTyphoon } from './hooks/useTyphoon'
import { useEcon } from './hooks/useEcon'
import { useMobile } from './hooks/useMobile'
import { CATEGORIES } from './data/mock'
import type { Category } from './types'
import Header from './components/Header'
import Ticker from './components/Ticker'
import TyphoonAlert from './components/TyphoonAlert'
import LeftPanel from './components/LeftPanel'
import NewsFeed from './components/NewsFeed'
import RightPanel from './components/RightPanel'
import VideoNews from './components/VideoNews'

type MobileTab = 'news' | 'monitor' | 'sources'

const MOBILE_TABS: { id: MobileTab; label: string }[] = [
  { id: 'news',    label: 'Tin tức'   },
  { id: 'monitor', label: 'Theo dõi'  },
  { id: 'sources', label: 'Nguồn'     },
]

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = (localStorage.getItem('theme') as 'dark' | 'light') ?? 'dark'
    document.documentElement.setAttribute('data-theme', saved)
    return saved
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  const [textSize, setTextSize] = useState<'normal' | 'large'>(() => {
    const saved = (localStorage.getItem('textSize') as 'normal' | 'large') ?? 'normal'
    document.documentElement.style.zoom = saved === 'large' ? '1.25' : '1'
    return saved
  })

  useEffect(() => {
    document.documentElement.style.zoom = textSize === 'large' ? '1.25' : '1'
    localStorage.setItem('textSize', textSize)
  }, [textSize])

  const toggleTextSize = () => setTextSize(s => s === 'normal' ? 'large' : 'normal')

  const [activeTab, setActiveTab] = useState<MobileTab>('news')
  const isMobile = useMobile()

  // Single source of truth for news data — shared across Header and NewsFeed
  const news = useNews()
  const { typhoon } = useTyphoon()
  // Single source of truth for market data — shared across Ticker and RightPanel
  const econ = useEcon()

  // ── FILTER STATE (lifted from NewsFeed so LeftPanel can read filtered articles) ──
  const [activeCategory, setActiveCategory] = useState<Category>('all')
  const [activeSource, setActiveSource] = useState('All')
  const [search, setSearch] = useState('')

  const handleSetCategory = (cat: Category) => {
    setActiveCategory(cat)
    setActiveSource('All')
  }

  const filtered = news.articles.filter(item => {
    const matchCat = activeCategory === 'all' || item.category === activeCategory
    const matchSource = activeSource === 'All' || item.source === activeSource
    const q = search.toLowerCase()
    const matchSearch = !q
      || item.title.toLowerCase().includes(q)
      || item.titleEn.toLowerCase().includes(q)
    return matchCat && matchSource && matchSearch
  })

  const filterLabel = CATEGORIES.find(c => c.id === activeCategory)?.label ?? 'Tất cả'

  const sharedHeader = (
    <Header
      articleCount={news.articles.length}
      sourceCount={news.sourceCount}
      lastUpdated={news.lastUpdated}
      onRefresh={news.refresh}
      loading={news.loading}
      theme={theme}
      onToggleTheme={toggleTheme}
      textSize={textSize}
      onToggleTextSize={toggleTextSize}
      isMobile={isMobile}
    />
  )

  const newsFeedProps = {
    articles: news.articles,
    filtered,
    loading: news.loading,
    error: news.error,
    activeCategory,
    onSetCategory: handleSetCategory,
    activeSource,
    onSetSource: setActiveSource,
    search,
    onSearch: setSearch,
  }

  // ── MOBILE LAYOUT ──────────────────────────────────────────────
  if (isMobile) {
    return (
      <div className="app-shell">
        {sharedHeader}
        <Ticker indicators={econ.indicators} loading={econ.loading} />
        <TyphoonAlert typhoon={typhoon} />

        {/* Active tab content */}
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingBottom: 44 }}>

          {/* ── NEWS TAB ───────────────────────── */}
          {activeTab === 'news' && <NewsFeed {...newsFeedProps} />}

          {/* ── MONITOR TAB ────────────────────── */}
          {activeTab === 'monitor' && <RightPanel />}

          {/* ── SOURCES TAB ────────────────────── */}
          {activeTab === 'sources' && (
            <>
              <LeftPanel articles={filtered} filterLabel={filterLabel} />
              <VideoNews />
            </>
          )}
        </div>

        {/* ── BOTTOM TAB BAR ─────────────────── */}
        <nav style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: 'flex',
          borderTop: '1px solid var(--border)',
          background: 'var(--bg2)',
        }}>
          {MOBILE_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '12px 8px',
                background: 'none',
                border: 'none',
                borderTop: `2px solid ${activeTab === tab.id ? 'var(--red)' : 'transparent'}`,
                color: activeTab === tab.id ? 'var(--text)' : 'var(--muted)',
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                fontWeight: activeTab === tab.id ? 700 : 400,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    )
  }

  // ── DESKTOP LAYOUT ─────────────────────────────────────────────
  return (
    <div className="app-shell">
      {sharedHeader}
      <Ticker indicators={econ.indicators} loading={econ.loading} />
      <TyphoonAlert typhoon={typhoon} />

      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '256px 1fr 284px',
        overflow: 'hidden',
        minHeight: 0,
      }}>
        <LeftPanel articles={filtered} filterLabel={filterLabel} />
        <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <div style={{ flex: 1, overflow: 'auto' }}>
            <NewsFeed {...newsFeedProps} />
          </div>
          <div style={{ height: 300, overflow: 'auto' }}>
            <VideoNews />
          </div>
        </div>
        <RightPanel />
      </div>
    </div>
  )
}
