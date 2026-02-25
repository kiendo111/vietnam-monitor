// src/components/TrafficMaps.tsx
// Single Mapbox traffic map with city tabs (Hanoi / Da Nang / HCMC)
// Refreshes tile data every 10 minutes; adapts to dark/light theme

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

// Public token — restrict to your Vercel domain in Mapbox dashboard
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN ?? ''

const CITIES = [
  { id: 'hanoi',  label: 'Hà Nội',  center: [105.8542, 21.0245] as [number, number], zoom: 12 },
  { id: 'danang', label: 'Đà Nẵng', center: [108.2022, 16.0544] as [number, number], zoom: 12 },
  { id: 'hcmc',   label: 'TP.HCM',  center: [106.6977, 10.7769] as [number, number], zoom: 12 },
]

// Watch data-theme attribute and return the matching Mapbox style URL
function useMapStyle() {
  const styleFor = (dark: boolean) =>
    dark
      ? 'mapbox://styles/mapbox/traffic-night-v2'
      : 'mapbox://styles/mapbox/traffic-day-v2'

  const [style, setStyle] = useState(() =>
    styleFor(document.documentElement.dataset.theme !== 'light')
  )

  useEffect(() => {
    const obs = new MutationObserver(() =>
      setStyle(styleFor(document.documentElement.dataset.theme !== 'light'))
    )
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => obs.disconnect()
  }, [])

  return style
}

export default function TrafficMaps() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const [refreshTick, setRefreshTick] = useState(0)
  const mapStyle = useMapStyle()

  // Initialize single map instance once
  useEffect(() => {
    if (!containerRef.current || !mapboxgl.accessToken) return

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: mapStyle,
      center: CITIES[0].center,
      zoom: CITIES[0].zoom,
      interactive: false,
      attributionControl: false,
    })
    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Fly to selected city when tab changes
  useEffect(() => {
    const city = CITIES[activeIdx]
    mapRef.current?.flyTo({ center: city.center, zoom: city.zoom, duration: 1000 })
  }, [activeIdx])

  // Update style on theme toggle
  useEffect(() => {
    mapRef.current?.setStyle(mapStyle)
  }, [mapStyle])

  // Refresh traffic tiles every 10 minutes
  useEffect(() => {
    const timer = setInterval(() => setRefreshTick(t => t + 1), 10 * 60 * 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (refreshTick === 0) return
    const map = mapRef.current
    if (!map) return
    map.setStyle(mapStyle)
    // Restore position after style reload
    setTimeout(() => {
      map.flyTo({ center: CITIES[activeIdx].center, zoom: CITIES[activeIdx].zoom, duration: 0 })
    }, 1000)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTick])

  if (!import.meta.env.VITE_MAPBOX_TOKEN) {
    return (
      <div style={{
        padding: '14px 0',
        fontSize: 11,
        color: 'var(--muted)',
        fontStyle: 'italic',
        textAlign: 'center',
      }}>
        Chưa cấu hình Mapbox token.
      </div>
    )
  }

  return (
    <div>
      {/* City tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border)',
        marginBottom: 8,
      }}>
        {CITIES.map((city, i) => (
          <button
            key={city.id}
            onClick={() => setActiveIdx(i)}
            style={{
              flex: 1,
              padding: '5px 4px',
              background: 'none',
              border: 'none',
              borderBottom: `2px solid ${activeIdx === i ? 'var(--red)' : 'transparent'}`,
              color: activeIdx === i ? 'var(--text)' : 'var(--muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              fontWeight: activeIdx === i ? 700 : 400,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'color 0.15s',
            }}
          >
            {city.label}
          </button>
        ))}
      </div>

      {/* Map */}
      <div
        ref={containerRef}
        style={{
          height: 150,
          borderRadius: 3,
          overflow: 'hidden',
          border: '1px solid var(--border)',
        }}
      />

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginTop: 6 }}>
        {[
          ['var(--green)', 'Thông'],
          ['var(--gold)',  'Chậm'],
          ['var(--red)',   'Kẹt'],
        ].map(([color, label]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 10, height: 3, background: color, borderRadius: 1 }} />
            <span style={{ fontSize: 9, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
              {label}
            </span>
          </div>
        ))}
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--faint)' }}>
          10 MIN
        </span>
      </div>
    </div>
  )
}
