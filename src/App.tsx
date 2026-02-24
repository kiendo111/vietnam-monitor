// src/App.tsx
import { useState, useEffect } from 'react'
import { useNews } from './hooks/useNews'
import { useTyphoon } from './hooks/useTyphoon'
import { useEcon } from './hooks/useEcon'
import { useMobile } from './hooks/useMobile'
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

  const [activeTab, setActiveTab] = useState<MobileTab>('news')
  const isMobile = useMobile()

  // Single source of truth for news data — shared across Header and NewsFeed
  const news = useNews()
  const { typhoon } = useTyphoon()
  // Single source of truth for market data — shared across Ticker and RightPanel
  const econ = useEcon()

  const sharedHeader = (
    <Header
      articleCount={news.articles.length}
      sourceCount={news.sourceCount}
      lastUpdated={news.lastUpdated}
      onRefresh={news.refresh}
      loading={news.loading}
      theme={theme}
      onToggleTheme={toggleTheme}
      isMobile={isMobile}
    />
  )

  // ── MOBILE LAYOUT ──────────────────────────────────────────────
  if (isMobile) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {sharedHeader}
        <Ticker indicators={econ.indicators} loading={econ.loading} />
        <TyphoonAlert typhoon={typhoon} />

        {/* Active tab content */}
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>

          {/* ── NEWS TAB ───────────────────────── */}
          {activeTab === 'news' && (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
                <NewsFeed articles={news.articles} loading={news.loading} error={news.error} />
              </div>
              <div style={{ height: 220, overflow: 'auto', flexShrink: 0 }}>
                <VideoNews />
              </div>
            </div>
          )}

          {/* ── MONITOR TAB ────────────────────── */}
          {activeTab === 'monitor' && <RightPanel />}

          {/* ── SOURCES TAB ────────────────────── */}
          {activeTab === 'sources' && <LeftPanel />}
        </div>

        {/* ── BOTTOM TAB BAR ─────────────────── */}
        <nav style={{
          display: 'flex',
          borderTop: '1px solid var(--border)',
          background: 'var(--bg2)',
          flexShrink: 0,
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
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
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
        <LeftPanel />
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ flex: 1, overflow: 'auto' }}>
            <NewsFeed
              articles={news.articles}
              loading={news.loading}
              error={news.error}
            />
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
