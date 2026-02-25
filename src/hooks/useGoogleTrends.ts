import { useState, useEffect } from 'react'
import type { GoogleTrend } from '../types'

export function useGoogleTrends() {
  const [trends, setTrends]   = useState<GoogleTrend[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/trends')
        if (!res.ok) throw new Error()
        const data = await res.json()
        if (!cancelled) {
          setTrends(data.trends ?? [])
          setError(null)
        }
      } catch {
        if (!cancelled) setError('Không thể tải xu hướng.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    // Re-fetch every hour to keep trends fresh
    const timer = setInterval(load, 60 * 60 * 1000)
    return () => {
      cancelled = true
      clearInterval(timer)
    }
  }, [])

  return { trends, loading, error }
}
