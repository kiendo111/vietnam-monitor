import { GOOGLE_TRENDS, SOCIAL_TRENDS } from '../data/mock';
import { useWeather } from '../hooks/useWeather';
import type { AqiLevel, Platform } from '../types';

// Maps AQI level to color and Vietnamese label
const AQI_CONFIG: Record<AqiLevel, { color: string; label: string }> = {
  'good':          { color: 'var(--aqi-good)',          label: 'Tốt' },
  'moderate':      { color: 'var(--aqi-moderate)',      label: 'TB' },
  'unhealthy':     { color: 'var(--aqi-unhealthy)',     label: 'Xấu' },
  'very-unhealthy':{ color: 'var(--aqi-very-unhealthy)',label: 'Rất xấu' },
  'hazardous':     { color: 'var(--aqi-hazardous)',     label: 'Nguy hại' },
}

const PLATFORM_LABEL: Record<Platform, string> = {
  facebook:  'FB',
  tiktok:    'TT',
  zalo:      'ZL',
  youtube:   'YT',
  threads:   'TH',
  instagram: 'IG',
}

const PLATFORM_COLOR: Record<Platform, string> = {
  facebook:  '#1877F2',
  tiktok:    '#EE1D52',
  zalo:      '#0068FF',
  youtube:   '#FF0000',
  threads:   '#888888',
  instagram: '#E1306C',
}

export default function RightPanel() {
  const { cities, loading: weatherLoading } = useWeather();

  return (
    <aside style={{
      borderLeft: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      background: 'var(--bg)',
      height: '100%',
    }}>

      {/* ── WEATHER + AQI ─────────────────────────────────── */}
      <section style={{
        padding: 16,
        borderBottom: '1px solid var(--border)',
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
                    <span style={{ fontSize: 12, fontWeight: 700 }}>{city.name}</span>
                    <span style={{ fontSize: 15, textAlign: 'center' }}>{city.icon}</span>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text)' }}>{city.condition}</div>
                      <div style={{ fontSize: 10, color: 'var(--muted)' }}>💧 {city.humidity}%  💨 {city.windSpeed}km/h</div>
                    </div>
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
      <section style={{ padding: 16, borderTop: '1px solid var(--border)' }}>
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

      {/* ── SOCIAL MEDIA TRENDS ─────────────────────── */}
      <section style={{ padding: 16, borderTop: '1px solid var(--border)' }}>
        <div className="section-title">Mạng xã hội · Đang thịnh hành</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {SOCIAL_TRENDS.map(trend => (
            <div key={trend.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* Rank */}
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', width: 14, flexShrink: 0 }}>
                {trend.rank}
              </span>

              {/* Platform badge */}
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 8,
                fontWeight: 700,
                padding: '2px 5px',
                borderRadius: 2,
                background: `${PLATFORM_COLOR[trend.platform]}20`,
                color: PLATFORM_COLOR[trend.platform],
                flexShrink: 0,
                minWidth: 22,
                textAlign: 'center',
              }}>
                {PLATFORM_LABEL[trend.platform]}
              </span>

              {/* Topic */}
              <span style={{ fontSize: 12, fontWeight: 600, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {trend.topic}
              </span>

              {/* Direction + volume */}
              <div style={{ flexShrink: 0, textAlign: 'right' }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  color: trend.direction === 'new' ? 'var(--gold)' : 'var(--green)',
                }}>
                  {trend.direction === 'new' ? 'NEW' : '▲'}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--muted)', marginLeft: 4 }}>
                  {trend.volume}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </aside>
  )
}
