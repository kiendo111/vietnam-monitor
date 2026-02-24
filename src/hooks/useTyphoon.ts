// src/hooks/useTyphoon.ts
import { useState, useEffect, useCallback } from 'react'
import { fetchTyphoonData } from '../services/weather'
import type { TyphoonInfo } from '../types'

const REFRESH_INTERVAL_MS = 15 * 60 * 1000 // refresh every 15 minutes

export interface UseTyphoonResult {
  typhoon: TyphoonInfo | null
  loading: boolean
  error: string | null
  refresh: () => void
}

export function useTyphoon(): UseTyphoonResult {
  const [typhoon, setTyphoon] = useState<TyphoonInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await fetchTyphoonData()
      setTyphoon(data)
    } catch (err) {
      console.warn('Typhoon data fetch failed:', err)
      setError('Không thể tải dữ liệu bão')
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch on first render
  useEffect(() => {
    load()
  }, [load])

  // Auto-refresh
  useEffect(() => {
    const interval = setInterval(load, REFRESH_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [load])

  return {
    typhoon,
    loading,
    error,
    refresh: load,
  }
}
