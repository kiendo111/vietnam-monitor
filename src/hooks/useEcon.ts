// src/hooks/useEcon.ts
import { useState, useEffect, useCallback } from 'react'
import { fetchMarketData } from '../services/econ'
import { ECON as MOCK_ECON } from '../data/mock'
import type { EconIndicator } from '../types'

const REFRESH_INTERVAL_MS = 5 * 60 * 1000 // 5 minutes

export interface UseEconResult {
  indicators: EconIndicator[]
  loading: boolean
  error: string | null
  refresh: () => void
}

export function useEcon(): UseEconResult {
  const [indicators, setIndicators] = useState<EconIndicator[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await fetchMarketData()
      setIndicators(data)
    } catch (err) {
      console.warn('Live market data fetch failed, using mock data:', err)
      setIndicators(MOCK_ECON)
      setError('Không thể tải dữ liệu thị trường — đang dùng dữ liệu mẫu')
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

  return { indicators, loading, error, refresh: load }
}
