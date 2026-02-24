import { useState } from 'react';
import { GOOGLE_TRENDS } from '../data/mock';
import { useWeather } from '../hooks/useWeather';
import { useSpotify } from '../hooks/useSpotify';
import { useTmdb } from '../hooks/useTmdb';
import type { AqiLevel, EconIndicator, GoogleTrend, MovieTrend, SpotifyAlbum, SpotifyArtist, SpotifyTrack } from '../types';

// Maps AQI level to color and Vietnamese label
const AQI_CONFIG: Record<AqiLevel, { color: string; label: string }> = {
  'good':          { color: 'var(--aqi-good)',          label: 'Tốt' },
  'moderate':      { color: 'var(--aqi-moderate)',      label: 'TB' },
  'unhealthy':     { color: 'var(--aqi-unhealthy)',     label: 'Xấu' },
  'very-unhealthy':{ color: 'var(--aqi-very-unhealthy)',label: 'Rất xấu' },
  'hazardous':     { color: 'var(--aqi-hazardous)',     label: 'Nguy hại' },
}

const PLATFORM_COLOR: Record<MovieTrend['platform'], string> = {
  'Netflix': '#E50914',
  'Galaxy Play': '#FFFFFF',
  'K+': '#009a4c',
};

type SpotifyTab = 'songs' | 'albums' | 'artists';

interface RightPanelProps {
  indicators: EconIndicator[];
  econLoading: boolean;
}

export default function RightPanel({ indicators, econLoading }: RightPanelProps) {
  const { cities, loading: weatherLoading } = useWeather();
  const { tracks, albums, artists, loading: spotifyLoading, error: spotifyError } = useSpotify();
  const { movies, loading: tmdbLoading, error: tmdbError } = useTmdb();
  const [activeSpotifyTab, setActiveSpotifyTab] = useState<SpotifyTab>('songs');

  return (
    <aside style={{
      borderLeft: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      background: 'var(--bg)',
    }}>

      {/* ── ECONOMIC INDICATORS ──────────────────────────── */}
      <section style={{ padding: 16, borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          Chỉ số kinh tế
          {!econLoading && (
            <span style={{ fontSize: 8, color: 'var(--green)', fontFamily: 'var(--font-mono)', marginLeft: 'auto' }}>
              ● LIVE
            </span>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {econLoading
            ? Array(6).fill(null).map((_, i) => (
                <div key={i} style={{
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  borderRadius: 3,
                  padding: '8px 10px',
                  opacity: 0.4,
                  height: 52,
                }} />
              ))
            : indicators.map(ind => (
                <div key={ind.label} style={{
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  borderRadius: 3,
                  padding: '8px 10px',
                }}>
                  <div className="label" style={{ marginBottom: 3 }}>{ind.label}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700 }}>{ind.value}</div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    color: ind.up ? 'var(--green)' : 'var(--red)',
                    marginTop: 2,
                  }}>
                    {ind.up ? '▲' : '▼'} {ind.pct}
                  </div>
                </div>
              ))
          }
        </div>
      </section>

      {/* ── WEATHER + AQI ─────────────────────────────────── */}
      <section style={{
        padding: 16,
        borderBottom: '1px solid var(--border)',
        flex: '1 1 auto',
        overflowY: 'auto',
        minHeight: 0,
      }}>
        <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          Thời tiết & Chất lượng không khí
          {!weatherLoading && (
            <span style={{ fontSize: 8, color: 'var(--green)', fontFamily: 'var(--font-mono)', marginLeft: 'auto' }}>
              ● LIVE
            </span>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {weatherLoading
            ? Array(10).fill(null).map((_, i) => (
                <div key={i} style={{
                  height: 46,
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  borderRadius: 3,
                  opacity: 0.4,
                }} />
              ))
            : cities.map(city => {
                const aqi = AQI_CONFIG[city.aqiLevel]
                return (
                  <div key={city.name} style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 28px 1fr auto',
                    alignItems: 'center',
                    gap: 8,
                    padding: '7px 10px',
                    background: 'var(--bg3)',
                    border: '1px solid var(--border)',
                    borderRadius: 3,
                  }}>
                    {/* City name */}
                    <span style={{ fontSize: 12, fontWeight: 700 }}>{city.name}</span>

                    {/* Weather icon */}
                    <span style={{ fontSize: 15, textAlign: 'center' }}>{city.icon}</span>

                    {/* Condition + humidity */}
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text)' }}>{city.condition}</div>
                      <div style={{ fontSize: 10, color: 'var(--muted)' }}>💧 {city.humidity}%  💨 {city.windSpeed}km/h</div>
                    </div>

                    {/* Temp + AQI badge */}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700 }}>
                        {city.temp}°C
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: city.aqiLevel === 'good' ? 8 : 10,
                        fontWeight: city.aqiLevel === 'good' ? 400 : 700,
                        padding: city.aqiLevel === 'good' ? '1px 5px' : '2px 7px',
                        borderRadius: 2,
                        background: city.aqiLevel === 'good' ? `${aqi.color}25` : `${aqi.color}35`,
                        color: aqi.color,
                        marginTop: 2,
                        border: city.aqiLevel === 'good' ? 'none' : `1px solid ${aqi.color}60`,
                      }}>
                        AQI {city.aqi} · {aqi.label}
                      </div>
                    </div>
                  </div>
                )
              })
          }
        </div>
      </section>

      {/* ── GOOGLE TRENDS ───────────────────────────── */}
      <section style={{ padding: 16, borderTop: '1px solid var(--border)', flexShrink: 0 }}>
        <div className="section-title">Google Trends · Việt Nam</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {GOOGLE_TRENDS.map(trend => (
            <a
              key={trend.id}
              href={`https://www.google.com/search?q=${encodeURIComponent(trend.topic)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', width: 16 }}>{trend.rank}</span>
              <span style={{ fontSize: 12, fontWeight: 600, flex: 1 }}>{trend.topic}</span>
              <span style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{trend.volume}</span>
            </a>
          ))}
        </div>
      </section>

      {/* ── SPOTIFY TRENDS ───────────────────────────── */}
      <section style={{ padding: 16, borderTop: '1px solid var(--border)', flexShrink: 0 }}>
        <div className="section-title">Spotify · Top 10</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {(['songs', 'albums', 'artists'] as SpotifyTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveSpotifyTab(tab)}
              style={{
                background: activeSpotifyTab === tab ? 'var(--bg-active)' : 'var(--bg3)',
                border: '1px solid var(--border)',
                borderRadius: 4,
                padding: '4px 8px',
                fontSize: 11,
                fontWeight: 600,
                color: activeSpotifyTab === tab ? 'var(--text)' : 'var(--muted)',
                cursor: 'pointer',
              }}
            >
              {tab === 'songs' ? 'Bài hát' : tab === 'albums' ? 'Album' : 'Nghệ sĩ'}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {spotifyLoading && Array.from({ length: 10 }).map((_, i) => <div key={i} style={{ height: 32, background: 'var(--bg3)', borderRadius: 2 }} />)}
          {spotifyError && <div style={{ fontSize: 11, color: 'var(--red)' }}>{spotifyError}</div>}
          {!spotifyLoading && !spotifyError && activeSpotifyTab === 'songs' && tracks.map(song => (
            <div key={song.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src={song.cover} width="32" height="32" style={{ borderRadius: 2, flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.title}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)' }}>{song.artist}</div>
              </div>
            </div>
          ))}
          {!spotifyLoading && !spotifyError && activeSpotifyTab === 'albums' && albums.map(album => (
            <div key={album.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src={album.cover} width="32" height="32" style={{ borderRadius: 2, flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{album.title}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)' }}>{album.artist}</div>
              </div>
            </div>
          ))}
          {!spotifyLoading && !spotifyError && activeSpotifyTab === 'artists' && artists.map(artist => (
            <div key={artist.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src={artist.image} width="32" height="32" style={{ borderRadius: '50%', flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{artist.name}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MOVIE TRENDS ───────────────────────────── */}
      <section style={{ padding: 16, borderTop: '1px solid var(--border)', flex: '1 1 auto', overflowY: 'auto', minHeight: 0 }}>
        <div className="section-title">Phim ảnh · Thịnh hành</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {tmdbLoading && Array.from({ length: 10 }).map((_, i) => <div key={i} style={{ height: 20, background: 'var(--bg3)', borderRadius: 2 }} />)}
          {tmdbError && <div style={{ fontSize: 11, color: 'var(--red)' }}>{tmdbError}</div>}
          {!tmdbLoading && !tmdbError && movies.map(movie => (
            <div key={movie.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
               <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', width: 16 }}>{movie.rank}</span>
               <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{movie.title}</div>
               </div>
               <span style={{
                  fontSize: 8,
                  fontWeight: 700,
                  padding: '2px 5px',
                  borderRadius: 2,
                  background: `${PLATFORM_COLOR[movie.platform]}25`,
                  color: PLATFORM_COLOR[movie.platform],
                  flexShrink: 0,
                }}>
                  {movie.platform}
                </span>
            </div>
          ))}
        </div>
      </section>
    </aside>
  )
}
