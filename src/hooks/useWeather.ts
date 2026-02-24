// src/hooks/useWeather.ts
import { useState, useEffect, useCallback } from 'react'
import { fetchAllCitiesWeather } from '../services/weatherLive'
import { WEATHER as MOCK_WEATHER } from '../data/mock'
import type { WeatherCity } from '../types'

const REFRESH_INTERVAL_MS = 30 * 60 * 1000 // 30 minutes

export interface UseWeatherResult {
  cities: WeatherCity[]
  loading: boolean
  error: string | null
  refresh: () => void
}

export function useWeather(): UseWeatherResult {
  const [cities, setCities] = useState<WeatherCity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await fetchAllCitiesWeather()
      if (data.length === 0) throw new Error('No city data returned')
      setCities(data)
    } catch (err) {
      console.warn('Live weather fetch failed, using mock data:', err)
      setCities(MOCK_WEATHER)
      setError('Không thể tải dữ liệu thời tiết trực tiếp — đang dùng dữ liệu mẫu')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    const interval = setInterval(load, REFRESH_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [load])

  return { cities, loading, error, refresh: load }
}
