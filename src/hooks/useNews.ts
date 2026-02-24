// src/hooks/useNews.ts
// A custom React hook that manages fetching, caching, and auto-refreshing news.
//
// A "hook" in React is just a reusable function that manages state and side effects.
// We use it so NewsFeed.tsx stays clean — it just calls useNews() and gets data back.

import { useState, useEffect, useCallback } from 'react'
import { fetchAllNews } from '../services/rss'
import { NEWS as MOCK_NEWS } from '../data/mock'   // fallback if everything fails
import type { NewsItem } from '../types'

const REFRESH_INTERVAL_MS = 5 * 60 * 1000 // refresh every 5 minutes

export interface UseNewsResult {
  articles: NewsItem[]
  loading: boolean
  error: string | null
  lastUpdated: Date | null
  refresh: () => void    // call this to manually force a refresh
  sourceCount: number    // how many feeds loaded successfully
}

export function useNews(): UseNewsResult {
  const [articles, setArticles] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [sourceCount, setSourceCount] = useState(0)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const items = await fetchAllNews()
      setArticles(items)
      setSourceCount(new Set(items.map(i => i.source)).size)
      setLastUpdated(new Date())
    } catch (err) {
      // If live fetch fails completely, fall back to mock data
      // so the dashboard never shows an empty screen
      console.warn('Live fetch failed, using mock data:', err)
      setArticles(MOCK_NEWS)
      setSourceCount(0)
      setError('Không thể tải tin tức trực tiếp — đang dùng dữ liệu mẫu')
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch on first render
  useEffect(() => {
    load()
  }, [load])

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(load, REFRESH_INTERVAL_MS)
    return () => clearInterval(interval) // cleanup when component unmounts
  }, [load])

  return {
    articles,
    loading,
    error,
    lastUpdated,
    refresh: load,
    sourceCount,
  }
}