// src/App.tsx
import { useNews } from './hooks/useNews'
import { useTyphoon } from './hooks/useTyphoon'
import { useEcon } from './hooks/useEcon'
import Header from './components/Header'
import Ticker from './components/Ticker'
import TyphoonAlert from './components/TyphoonAlert'
import LeftPanel from './components/LeftPanel'
import NewsFeed from './components/NewsFeed'
import RightPanel from './components/RightPanel'
import VideoNews from './components/VideoNews'

export default function App() {
  // Single source of truth for news data — shared across Header and NewsFeed
  const news = useNews()
  const { typhoon } = useTyphoon()
  // Single source of truth for market data — shared across Ticker and RightPanel
  const econ = useEcon()

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      <Header
        articleCount={news.articles.length}
        sourceCount={news.sourceCount}
        lastUpdated={news.lastUpdated}
        onRefresh={news.refresh}
        loading={news.loading}
      />
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
        <RightPanel indicators={econ.indicators} econLoading={econ.loading} />
      </div>

    </div>
  )
}
