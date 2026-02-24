// src/services/weatherLive.ts
// Fetches live weather + AQI data from Open-Meteo (free, no API key required)
import type { WeatherCity, AqiLevel } from '../types'

interface CityConfig {
  name: string
  lat: number
  lon: number
}

const CITIES: CityConfig[] = [
  { name: 'Hà Nội',    lat: 21.028,  lon: 105.854 },
  { name: 'TP.HCM',    lat: 10.823,  lon: 106.630 },
  { name: 'Đà Nẵng',   lat: 16.054,  lon: 108.202 },
  { name: 'Hải Phòng', lat: 20.844,  lon: 106.688 },
  { name: 'Cần Thơ',   lat: 10.045,  lon: 105.747 },
  { name: 'Huế',       lat: 16.467,  lon: 107.590 },
  { name: 'Nha Trang', lat: 12.244,  lon: 109.197 },
  { name: 'Đà Lạt',    lat: 11.940,  lon: 108.458 },
  { name: 'Vũng Tàu',  lat: 10.346,  lon: 107.084 },
  { name: 'Vinh',      lat: 18.671,  lon: 105.692 },
]

// WMO weather interpretation codes → Vietnamese label + emoji
const WMO_CODES: Record<number, { label: string; icon: string }> = {
  0:  { label: 'Nắng',           icon: '☀️'  },
  1:  { label: 'Ít mây',         icon: '🌤️' },
  2:  { label: 'Có mây',         icon: '⛅'  },
  3:  { label: 'Nhiều mây',      icon: '🌥️' },
  45: { label: 'Sương mù',       icon: '🌫️' },
  48: { label: 'Sương mù',       icon: '🌫️' },
  51: { label: 'Mưa phùn nhẹ',  icon: '🌦️' },
  53: { label: 'Mưa phùn vừa',  icon: '🌦️' },
  55: { label: 'Mưa phùn dày',  icon: '🌧️' },
  61: { label: 'Mưa nhẹ',       icon: '🌧️' },
  63: { label: 'Mưa vừa',       icon: '🌧️' },
  65: { label: 'Mưa to',        icon: '🌧️' },
  71: { label: 'Tuyết nhẹ',     icon: '🌨️' },
  73: { label: 'Tuyết vừa',     icon: '🌨️' },
  75: { label: 'Tuyết nặng',    icon: '❄️'  },
  77: { label: 'Tuyết hạt',     icon: '❄️'  },
  80: { label: 'Mưa rào nhẹ',   icon: '🌦️' },
  81: { label: 'Mưa rào vừa',   icon: '🌧️' },
  82: { label: 'Mưa rào lớn',   icon: '⛈️'  },
  85: { label: 'Mưa tuyết',     icon: '🌨️' },
  86: { label: 'Mưa tuyết lớn', icon: '🌨️' },
  95: { label: 'Giông bão',      icon: '⛈️'  },
  96: { label: 'Giông + mưa đá',icon: '⛈️'  },
  99: { label: 'Giông mưa đá',  icon: '⛈️'  },
}

function wmoToCondition(code: number): { label: string; icon: string } {
  return WMO_CODES[code] ?? { label: 'Không xác định', icon: '🌡️' }
}

function aqiToLevel(aqi: number): AqiLevel {
  if (aqi <= 50)  return 'good'
  if (aqi <= 100) return 'moderate'
  if (aqi <= 150) return 'unhealthy'
  if (aqi <= 200) return 'very-unhealthy'
  return 'hazardous'
}

async function fetchCityWeather(city: CityConfig): Promise<WeatherCity> {
  const [weatherRes, aqiRes] = await Promise.all([
    fetch(
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${city.lat}&longitude=${city.lon}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m` +
      `&timezone=Asia%2FBangkok`
    ),
    fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality` +
      `?latitude=${city.lat}&longitude=${city.lon}` +
      `&current=us_aqi`
    ),
  ])

  if (!weatherRes.ok) throw new Error(`Weather fetch failed for ${city.name}: ${weatherRes.status}`)
  if (!aqiRes.ok) throw new Error(`AQI fetch failed for ${city.name}: ${aqiRes.status}`)

  const weatherData = await weatherRes.json()
  const aqiData = await aqiRes.json()

  const cur = weatherData.current
  const condition = wmoToCondition(cur.weather_code)
  const aqi = Math.round(aqiData.current?.us_aqi ?? 0)

  return {
    name:       city.name,
    temp:       Math.round(cur.temperature_2m),
    feelsLike:  Math.round(cur.apparent_temperature),
    condition:  condition.label,
    icon:       condition.icon,
    aqi,
    aqiLevel:   aqiToLevel(aqi),
    humidity:   Math.round(cur.relative_humidity_2m),
    windSpeed:  Math.round(cur.wind_speed_10m),
  }
}

export async function fetchAllCitiesWeather(): Promise<WeatherCity[]> {
  const results = await Promise.allSettled(CITIES.map(fetchCityWeather))

  return results
    .map((result, i) => {
      if (result.status === 'fulfilled') return result.value
      console.warn(`Weather fetch failed for ${CITIES[i].name}:`, result.reason)
      return null
    })
    .filter((city): city is WeatherCity => city !== null)
}
