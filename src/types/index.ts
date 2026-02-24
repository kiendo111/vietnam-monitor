// src/types/index.ts
// These are "blueprints" — they define the shape of our data.
// TypeScript uses these to catch mistakes before they become bugs.

export type Severity = 'high' | 'medium' | 'low'

export type Category =
  | 'all'
  | 'chinh-tri'
  | 'kinh-te'
  | 'phap-luat'
  | 'the-thao'
  | 'giai-tri'
  | 'cong-nghe'
  | 'english'

export type AqiLevel = 'good' | 'moderate' | 'unhealthy' | 'very-unhealthy' | 'hazardous'

export type Platform = 'facebook' | 'tiktok' | 'zalo' | 'youtube' | 'threads' | 'instagram'

export type TrendDirection = 'up' | 'down' | 'new'

// A single news article
export interface NewsItem {
  id: number
  title: string       // Vietnamese headline — shown first, bigger
  titleEn: string     // English translation — shown below, smaller/muted
  source: string
  time: string
  category: Category
  province: string
  severity: Severity
  url?: string        // optional — the ? means it might not exist
}

// Weather + AQI data for one city
export interface WeatherCity {
  name: string        // short name e.g. "Hà Nội"
  temp: number        // Celsius
  feelsLike: number
  condition: string   // e.g. "Nhiều mây" (Cloudy)
  icon: string        // emoji icon
  aqi: number         // Air Quality Index number
  aqiLevel: AqiLevel
  humidity: number    // percentage
  windSpeed: number   // km/h
}

// One trending topic on social media
export interface SpotifyTrack {
  id: number;
  rank: number;
  title: string;
  artist: string;
  cover: string; // URL to album art
}

export interface SpotifyAlbum {
  id: number;
  rank: number;
  title: string;
  artist: string;
  cover: string; // URL to album art
}

export interface SpotifyArtist {
  id: number;
  rank: number;
  name: string;
  image: string; // URL to artist image
}

export interface GoogleTrend {
  id: number;
  rank: number;
  topic: string;
  volume: string; // e.g. "50K+ searches"
}

export interface MovieTrend {
  id: number;
  rank: number;
  title: string;
  platform: 'Netflix' | 'Galaxy Play' | 'K+';
}


// Typhoon / storm information
export interface TyphoonInfo {
  active: boolean             // if false, the whole banner is hidden
  name?: string               // international name e.g. "SANVU"
  nameVi?: string             // Vietnamese name e.g. "Bão số 3"
  category?: number           // 1-5 scale
  windSpeed?: number          // km/h
  location?: string           // current position description
  eta?: string                // estimated landfall time
  affectedProvinces?: string[]
  warningLevel?: string       // e.g. "Cấp độ 3"
}

// A single video news item
export interface VideoNewsItem {
  id: number
  title: string
  source: string
  thumbnail: string
  url: string
  live?: boolean
}

// Economic market indicator
export interface EconIndicator {
  label: string
  value: string
  change: string
  pct: string
  up: boolean
}
