// src/services/video.ts
// RSS-based video news — uses media:content/media:thumbnail to extract thumbnails.
// No API key required. Falls back gracefully if a feed fails.

import type { VideoNewsItem } from '../types'

interface VideoFeed {
  url: string
  source: string
}

const FEEDS: VideoFeed[] = [
  { url: '/api/vtv/rss/home.rss',            source: 'VTV' },
  { url: '/api/vtcnews/rss/home.rss',         source: 'VTC News' },
  { url: '/api/vnexpress/rss/video.rss',      source: 'VnExpress Video' },
  { url: '/api/tuoitre/rss/tin-moi-nhat.rss', source: 'Tuổi Trẻ' },
  { url: '/api/thanhnien/rss/home.rss',        source: 'Thanh Niên' },
]

const MEDIA_NS = 'http://search.yahoo.com/mrss/'

// Extract the best available thumbnail URL from an RSS <item>
function extractThumbnail(item: Element): string {
  // 1. media:thumbnail
  const thumb = item.getElementsByTagNameNS(MEDIA_NS, 'thumbnail')[0]
  if (thumb?.getAttribute('url')) return thumb.getAttribute('url')!

  // 2. media:content with an image or video URL
  const content = item.getElementsByTagNameNS(MEDIA_NS, 'content')[0]
  if (content?.getAttribute('url')) {
    const type = content.getAttribute('type') ?? ''
    if (!type || type.startsWith('image') || type.startsWith('video')) {
      return content.getAttribute('url')!
    }
  }

  // 3. <enclosure> tag
  const enclosure = item.querySelector('enclosure')
  const encUrl = enclosure?.getAttribute('url') ?? ''
  if (encUrl) return encUrl

  // 4. First <img src> found in the description HTML
  const rawDesc = item.querySelector('description')?.textContent ?? ''
  const imgMatch = rawDesc.match(/src=["']([^"']+\.(jpe?g|png|webp)[^"']*)/i)
  if (imgMatch) return imgMatch[1]

  return ''
}

let nextId = 1

async function fetchVideoFeed(feed: VideoFeed): Promise<VideoNewsItem[]> {
  const res = await fetch(feed.url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const xmlText = await res.text()
  const parser = new DOMParser()
  const xml = parser.parseFromString(xmlText, 'text/xml')
  const items = Array.from(xml.querySelectorAll('item')).slice(0, 8)

  if (items.length === 0) {
    console.error(`[video][${feed.source}] No items in feed`)
    throw new Error('No items')
  }

  const videos: VideoNewsItem[] = []
  for (const item of items) {
    const title     = item.querySelector('title')?.textContent?.trim() ?? ''
    const link      = item.querySelector('link')?.textContent?.trim() ?? '#'
    const thumbnail = extractThumbnail(item)
    if (!thumbnail) continue   // skip articles without images

    videos.push({
      id:        nextId++,
      title,
      source:    feed.source,
      thumbnail,
      url:       link,
      live:      /trực tiếp|TRỰC TIẾP|🔴/i.test(title),
    })
  }

  if (videos.length === 0) throw new Error('No items with thumbnails')
  return videos
}

export async function fetchAllVideoNews(): Promise<VideoNewsItem[]> {
  const results = await Promise.allSettled(FEEDS.map(fetchVideoFeed))

  const allVideos: VideoNewsItem[] = []
  for (const r of results) {
    if (r.status === 'fulfilled') allVideos.push(...r.value)
    else console.warn('[video] Feed failed:', r.reason?.message ?? r.reason)
  }

  if (allVideos.length === 0) throw new Error('All video feeds failed')

  return allVideos.map((v, i) => ({ ...v, id: i + 1 }))
}
