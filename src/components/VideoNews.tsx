// src/components/VideoNews.tsx
import { useVideoNews } from '../hooks/useVideoNews'
import { useState } from 'react'

export default function VideoNews() {
  const { videos, loading, error } = useVideoNews()
  const [activeTab, setActiveTab] = useState('Live')

  const sources = ['Live', ...Array.from(new Set(videos.map(v => v.source)))]

  const filteredVideos = videos.filter(video => {
    if (activeTab === 'Live') {
      return video.live
    }
    return video.source === activeTab
  })

  return (
    <div style={{ borderTop: '1px solid var(--border)', background: 'var(--bg2)', padding: '12px 16px', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
      <div className="section-title">Video News</div>
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 12 }}>
        {sources.map(source => (
          <button
            key={source}
            onClick={() => setActiveTab(source)}
            style={{
              padding: '8px 12px',
              background: activeTab === source ? 'var(--bg3)' : 'transparent',
              border: 'none',
              borderBottom: `2px solid ${activeTab === source ? 'var(--red)' : 'transparent'}`,
              color: activeTab === source ? 'var(--text)' : 'var(--muted)',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {source} {source === 'Live' && '🔴'}
          </button>
        ))}
      </div>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'var(--red)' }}>{error}</div>}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {filteredVideos.map(video => (
            <a key={video.id} href={video.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ position: 'relative' }}>
                  <img src={video.thumbnail} alt={video.title} style={{ width: '100%', height: 120, objectFit: 'cover' }} />
                  {video.live && (
                    <div style={{ position: 'absolute', top: 8, left: 8, background: 'var(--red)', color: 'white', padding: '2px 6px', borderRadius: 2, fontSize: 10, fontWeight: 'bold' }}>
                      LIVE
                    </div>
                  )}
                </div>
                <div style={{ padding: 12 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{video.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>{video.source}</div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

