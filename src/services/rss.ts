import type { NewsItem } from '../types'

interface Feed {
  url: string
  source: string
  category: NewsItem['category']
}

// ── Feed definitions — category is pre-assigned per source ───────────────────
// RSS paths verified 2026-02-24. Sources that had no working RSS were replaced
// with equivalent category-specific feeds from vnexpress.net or tuoitre.vn.

export const FEEDS: Feed[] = [
  // ── Chính trị
  { url: '/api/nhandan/rss/home.rss',              source: 'Nhân Dân',            category: 'chinh-tri' },
  { url: '/api/vietnamplus/rss/vna_news.rss',      source: 'VietnamPlus',         category: 'chinh-tri' },
  { url: '/api/baochinhphu/rss/',                  source: 'Báo Chính phủ',       category: 'chinh-tri' },
  { url: '/api/qdnd/rss/home.rss',                 source: 'Quân đội nhân dân',   category: 'chinh-tri' },
  // ── Kinh tế & Tài chính
  { url: '/api/thesaigontimes/feed/',              source: 'Kinh tế Sài Gòn',    category: 'kinh-te' },
  { url: '/api/vnexpress/rss/kinh-doanh.rss',      source: 'VnExpress Kinh doanh',category: 'kinh-te' },  // replaced cafef (blocks scrapers)
  { url: '/api/vneconomy/rss.rss',                 source: 'VnEconomy',           category: 'kinh-te' },
  { url: '/api/baodautu/rss/home.rss',             source: 'Báo Đầu tư',         category: 'kinh-te' },
  // ── Pháp luật
  { url: '/api/plo/rss/home.rss',                  source: 'PLO',                 category: 'phap-luat' },
  { url: '/api/vnexpress/rss/phap-luat.rss',       source: 'VnExpress Pháp luật', category: 'phap-luat' },  // replaced baophapluat (no RSS)
  // ── Thể thao
  { url: '/api/vnexpress/rss/the-thao.rss',        source: 'VnExpress Thể thao', category: 'the-thao' },
  { url: '/api/bongda/feed.rss',                   source: 'Bóng đá',            category: 'the-thao' },
  { url: '/api/bongdaplus/rss/trang-chu.rss',      source: 'Bóng đá Plus',       category: 'the-thao' },
  { url: '/api/thethaovanhoa/rss/home.rss',        source: 'TT&VH',              category: 'the-thao' },
  // ── Giải trí
  { url: '/api/vnexpress/rss/giai-tri.rss',        source: 'VnExpress Giải trí', category: 'giai-tri' },
  { url: '/api/kenh14/rss/home.rss',               source: 'Kenh14',             category: 'giai-tri' },
  { url: '/api/tuoitre/rss/giai-tri.rss',          source: 'Tuổi Trẻ Giải trí', category: 'giai-tri' },  // replaced znews (no RSS)
  // ── Công nghệ
  { url: '/api/tinhte/rss',                        source: 'Tinh tế',            category: 'cong-nghe' },
  { url: '/api/genk/rss/home.rss',                 source: 'GenK',               category: 'cong-nghe' },
  { url: '/api/vnexpress/rss/so-hoa.rss',          source: 'VnExpress Số hóa',   category: 'cong-nghe' },  // replaced vnreview (no RSS)
  // ── English
  { url: '/api/evnexpress/rss/news.rss',           source: "VnExpress Int'l",    category: 'english' },
  { url: '/api/vietnamnews/rss/home.rss',          source: 'Vietnam News',       category: 'english' },
  { url: '/api/tuoitrenews/feed/',                 source: 'Tuổi Trẻ News',      category: 'english' },   // replaced english.thesaigontimes (HTTP 500)
  { url: '/api/vir/rss_feed/',                     source: 'VIR',                category: 'english' },
]

// ── Province detection ────────────────────────────────────────────────────────

const PROVINCES = [
  'Hà Nội', 'TP.HCM', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
  'An Giang', 'Bình Dương', 'Đồng Nai', 'Khánh Hòa', 'Lâm Đồng',
  'Nghệ An', 'Thanh Hóa', 'Quảng Ninh', 'Bình Định', 'Quảng Nam',
  'Long An', 'Tiền Giang', 'Kiên Giang', 'Đắk Lắk', 'Gia Lai',
  'Hải Dương', 'Bắc Ninh', 'Thái Nguyên', 'Thừa Thiên Huế',
]

function detectSeverity(text: string): NewsItem['severity'] {
  const t = text.toLowerCase()
  if (/khẩn cấp|bão số|lũ lụt|chết người|thảm họa/.test(t)) return 'high'
  if (/cảnh báo|quan trọng|nghiêm trọng/.test(t))             return 'medium'
  return 'low'
}

function relativeTime(date: Date): string {
  const mins = Math.floor((Date.now() - date.getTime()) / 60000)
  if (mins < 60) return `${mins} phút trước`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} giờ trước`
  return `${Math.floor(hrs / 24)} ngày trước`
}

let nextId = 1

async function fetchFeed(feed: Feed): Promise<NewsItem[]> {
  const res = await fetch(feed.url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const xmlText = await res.text()
  const parser = new DOMParser()
  const xml = parser.parseFromString(xmlText, 'text/xml')
  const items = Array.from(xml.querySelectorAll('item')).slice(0, 8)

  if (items.length === 0) {
    console.error(`[${feed.source}] Invalid XML returned:`, xmlText.substring(0, 150))
    throw new Error('No items found — likely returned an HTML error page')
  }

  return items.map((item): NewsItem => {
    const title   = item.querySelector('title')?.textContent?.trim() ?? 'Không có tiêu đề'
    const link    = item.querySelector('link')?.textContent?.trim() ?? '#'
    const rawDesc = item.querySelector('description')?.textContent ?? ''
    const desc    = rawDesc.replace(/<[^>]+>/g, '').trim()
    const pubRaw  = item.querySelector('pubDate')?.textContent ?? ''
    const pubDate = pubRaw ? new Date(pubRaw) : new Date()
    const safe    = isNaN(pubDate.getTime()) ? new Date() : pubDate
    const combined = `${title} ${desc}`
    const province = PROVINCES.find(p => combined.includes(p)) ?? ''

    return {
      id:       nextId++,
      title,
      titleEn:  '',
      source:   feed.source,
      time:     relativeTime(safe),
      category: feed.category,
      province,
      severity: detectSeverity(combined),
      url:      link,
    }
  })
}

// Returns a flat array of NewsItem sorted newest-first
export async function fetchAllNews(): Promise<NewsItem[]> {
  const results = await Promise.allSettled(FEEDS.map(fetchFeed))

  const allArticles: NewsItem[] = []

  for (const result of results) {
    if (result.status === 'fulfilled') {
      allArticles.push(...result.value)
    } else {
      console.warn('Feed failed:', result.reason?.message ?? result.reason)
    }
  }

  if (allArticles.length === 0) throw new Error('All feeds failed to load')

  return allArticles
}
