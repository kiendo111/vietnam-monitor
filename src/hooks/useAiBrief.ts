import { useState } from 'react'
import type { NewsItem } from '../types'

export function useAiBrief() {
  const [brief, setBrief] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reset = () => setBrief(null)

  const generate = async (articles: NewsItem[], category?: string) => {
    setLoading(true)
    setError(null)
    try {
      const headlines = articles.map(a => a.title)
      const res = await fetch('/api/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ headlines, category }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setBrief(data.brief)
    } catch {
      setError('Không thể tạo bản tóm tắt. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return { brief, loading, error, generate, reset }
}
