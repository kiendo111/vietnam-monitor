// src/hooks/useVideoNews.ts
import { useState, useEffect, useCallback } from 'react'
import { fetchAllVideoNews } from '../services/video'
import { VIDEO_NEWS as MOCK_VIDEO_NEWS } from '../data/mock'
import type { VideoNewsItem } from '../types'

const REFRESH_INTERVAL_MS = 10 * 60 * 1000 // refresh every 10 minutes

export interface UseVideoNewsResult {
  videos: VideoNewsItem[]
  loading: boolean
  error: string | null
  refresh: () => void
}

export function useVideoNews(): UseVideoNewsResult {
  const [videos, setVideos] = useState<VideoNewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const items = await fetchAllVideoNews()
      setVideos(items)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.warn('[video] YouTube API failed:', msg)
      setVideos(MOCK_VIDEO_NEWS)
      setError(`YouTube API: ${msg}`)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch on first render
  useEffect(() => {
    load()
  }, [load])

  // Auto-refresh every 10 minutes
  useEffect(() => {
    const interval = setInterval(load, REFRESH_INTERVAL_MS)
    return () => clearInterval(interval) // cleanup when component unmounts
  }, [load])

  return {
    videos,
    loading,
    error,
    refresh: load,
  }
}
