// src/data/mock.ts
// Realistic sample data. In Phase 3, this gets replaced by live RSS feeds.

import type {
  NewsItem, WeatherCity, TyphoonInfo, EconIndicator, VideoNewsItem,
  GoogleTrend, SocialTrend, SpotifyTrack, MovieTrend, SpotifyAlbum, SpotifyArtist,
} from '../types'

export const GOOGLE_TRENDS: GoogleTrend[] = [
  { id: 1, rank: 1, topic: 'Giá vàng', volume: '100K+' },
  { id: 2, rank: 2, topic: 'Lịch thi đấu World Cup 2026', volume: '50K+' },
  { id: 3, rank: 3, topic: 'Tỷ giá USD/VND', volume: '50K+' },
  { id: 4, rank: 4, topic: 'Phim Lật Mặt 8', volume: '20K+' },
  { id: 5, rank: 5, topic: 'Điểm chuẩn đại học 2026', volume: '20K+' },
];

export const SPOTIFY_TRENDS: SpotifyTrack[] = [
  { id: 1, rank: 1, title: 'Chúng Ta Của Tương Lai', artist: 'Sơn Tùng M-TP', cover: 'https://i.scdn.co/image/ab67616d00001e02f23b73e3e3d73db5d73de3e3' },
  { id: 2, rank: 2, title: 'Từng Quen', artist: 'Wren Evans', cover: 'https://i.scdn.co/image/ab67616d00001e028b1a1b1a1b1a1b1a1b1a1b1a' },
  { id: 3, rank: 3, title: 'Sau Cơn Mưa', artist: 'GREY D', cover: 'https://i.scdn.co/image/ab67616d00001e02f23b73e3e3d73db5d73de3e4' },
  { id: 4, rank: 4, title: 'Đừng Làm Trái Tim Anh Đau', artist: 'Sơn Tùng M-TP', cover: 'https://i.scdn.co/image/ab67616d00001e02f23b73e3e3d73db5d73de3e5' },
  { id: 5, rank: 5, title: 'NOLOVENOLIFE', artist: 'tlinh', cover: 'https://i.scdn.co/image/ab67616d00001e02f23b73e3e3d73db5d73de3e6' },
];

export const SPOTIFY_ALBUMS: SpotifyAlbum[] = [
  { id: 1, rank: 1, title: 'ái', artist: 'tlinh', cover: 'https://i.scdn.co/image/ab67616d00001e02f23b73e3e3d73db5d73de3e6' },
  { id: 2, rank: 2, title: 'Loi Choi', artist: 'Wren Evans', cover: 'https://i.scdn.co/image/ab67616d00001e028b1a1b1a1b1a1b1a1b1a1b1a' },
  { id: 3, rank: 3, title: '99%', artist: 'MCK', cover: 'https://i.scdn.co/image/ab67616d00001e02f23b73e3e3d73db5d73de3e7' },
  { id: 4, rank: 4, title: 'Minh Tinh', artist: 'Văn Mai Hương', cover: 'https://i.scdn.co/image/ab67616d00001e02f23b73e3e3d73db5d73de3e8' },
  { id: 5, rank: 5, title: 'Đẹp', artist: 'Mono', cover: 'https://i.scdn.co/image/ab67616d00001e02f23b73e3e3d73db5d73de3e9' },
];

export const SPOTIFY_ARTISTS: SpotifyArtist[] = [
  { id: 1, rank: 1, name: 'Sơn Tùng M-TP', image: 'https://i.scdn.co/image/ab6761610000f178f23b73e3e3d73db5d73de3e3' },
  { id: 2, rank: 2, name: 'tlinh', image: 'https://i.scdn.co/image/ab6761610000f178f23b73e3e3d73db5d73de3e4' },
  { id: 3, rank: 3, name: 'Wren Evans', image: 'https://i.scdn.co/image/ab6761610000f178f23b73e3e3d73db5d73de3e5' },
  { id: 4, rank: 4, name: 'MCK', image: 'https://i.scdn.co/image/ab6761610000f178f23b73e3e3d73db5d73de3e6' },
  { id: 5, rank: 5, name: 'GREY D', image: 'https://i.scdn.co/image/ab6761610000f178f23b73e3e3d73db5d73de3e7' },
];

export const MOVIE_TRENDS: MovieTrend[] = [
  { id: 1, rank: 1, title: 'Lật Mặt 8: Cuộc Đua Sinh Tử', platform: 'Galaxy Play' },
  { id: 2, rank: 2, title: 'Bão Ngầm', platform: 'Netflix' },
  { id: 3, rank: 3, title: 'Trịnh Công Sơn', platform: 'K+' },
  { id: 4, rank: 4, title: 'Squid Game Season 2', platform: 'Netflix' },
  { id: 5, rank: 5, title: 'Gia Tộc Rồng (House of the Dragon) Mùa 2', platform: 'K+' },
];

export const VIDEO_NEWS: VideoNewsItem[] = [
  {
    id: 1,
    title: 'TRỰC TIẾP: Quốc hội thảo luận về luật đất đai sửa đổi',
    source: 'VTV',
    thumbnail: 'https://vtv.vn/thumb/180x120/upload/2026/02/24/quochoi-1.jpg',
    url: 'https://vtv.vn',
    live: true,
  },
  {
    id: 2,
    title: 'Bản tin thời sự 19h — Những sự kiện nổi bật trong ngày',
    source: 'VTV',
    thumbnail: 'https://vtv.vn/thumb/180x120/upload/2026/02/24/thoisuVTV.jpg',
    url: 'https://vtv.vn',
  },
  {
    id: 3,
    title: 'Phỏng vấn chuyên gia về tác động của AI đến thị trường lao động',
    source: 'VTC News',
    thumbnail: 'https://vtcnews.vn/thumb/180x120/upload/2026/02/24/ai-laodong.jpg',
    url: 'https://vtcnews.vn',
  },
  {
    id: 4,
    title: 'VN-Index tăng mạnh — Phân tích thị trường chứng khoán hôm nay',
    source: 'VnExpress Video',
    thumbnail: 'https://i1-kinhdoanh.vnecdn.net/2026/02/24/vnindex-thumb.jpg',
    url: 'https://vnexpress.net/video',
  },
  {
    id: 5,
    title: 'Đội tuyển Việt Nam chuẩn bị cho vòng loại World Cup 2026',
    source: 'Tuổi Trẻ',
    thumbnail: 'https://cdn.tuoitre.vn/zoom/480_300/2026/02/24/dtqg-thumb.jpg',
    url: 'https://tuoitre.vn',
  },
]

export const CATEGORIES = [
  { id: 'all',       label: 'Tất cả',    en: 'All' },
  { id: 'chinh-tri', label: 'Chính trị', en: 'Politics' },
  { id: 'kinh-te',   label: 'Kinh tế',   en: 'Economy' },
  { id: 'phap-luat', label: 'Pháp luật', en: 'Law' },
  { id: 'the-thao',  label: 'Thể thao',  en: 'Sports' },
  { id: 'giai-tri',  label: 'Giải trí',  en: 'Entertainment' },
  { id: 'cong-nghe', label: 'Công nghệ', en: 'Technology' },
  { id: 'english',   label: 'English',   en: 'English' },
] as const

export const NEWS: NewsItem[] = [
  {
    id: 1,
    title: 'Thủ tướng chỉ đạo đẩy nhanh tiến độ các dự án hạ tầng trọng điểm quốc gia',
    titleEn: 'PM directs acceleration of key national infrastructure projects',
    source: 'Nhân Dân', time: '14 phút trước',
    category: 'chinh-tri', province: 'Hà Nội', severity: 'medium',
  },
  {
    id: 2,
    title: 'VN-Index tăng mạnh vượt 1.280 điểm, dòng tiền ngoại quay trở lại',
    titleEn: 'VN-Index surges past 1,280 points as foreign capital returns',
    source: 'VnEconomy', time: '28 phút trước',
    category: 'kinh-te', province: 'TP.HCM', severity: 'low',
  },
  {
    id: 3,
    title: 'Bão số 3 SANVU dự kiến đổ bộ miền Trung trong 24–36 giờ tới, gió giật cấp 13',
    titleEn: 'Typhoon SANVU expected to make landfall in Central Vietnam within 24–36 hours',
    source: 'Báo Chính phủ', time: '41 phút trước',
    category: 'chinh-tri', province: 'Đà Nẵng', severity: 'high',
  },
  {
    id: 4,
    title: 'Xuất khẩu điện tử đạt kỷ lục mới 38 tỷ USD trong 9 tháng đầu năm',
    titleEn: 'Electronics exports hit record $38B in first nine months of the year',
    source: 'CafeF', time: '1 giờ trước',
    category: 'kinh-te', province: 'Bắc Ninh', severity: 'low',
  },
  {
    id: 5,
    title: 'Tòa án nhân dân TP.HCM tuyên phạt 12 bị cáo trong vụ lừa đảo trái phiếu nghìn tỷ',
    titleEn: 'HCMC court sentences 12 defendants in billion-dong bond fraud case',
    source: 'PLO', time: '1 giờ trước',
    category: 'phap-luat', province: 'TP.HCM', severity: 'medium',
  },
  {
    id: 6,
    title: 'Đội tuyển Việt Nam thắng 2-0 trước Thái Lan tại vòng loại World Cup',
    titleEn: 'Vietnam national team beats Thailand 2-0 in World Cup qualifier',
    source: 'Bóng đá Plus', time: '2 giờ trước',
    category: 'the-thao', province: 'Hà Nội', severity: 'low',
  },
  {
    id: 7,
    title: 'FPT Software ký hợp đồng 500 tỷ đồng mở rộng thị trường Nhật Bản',
    titleEn: 'FPT Software signs 500B VND contract expanding into Japanese market',
    source: 'GenK', time: '2 giờ trước',
    category: 'cong-nghe', province: 'TP.HCM', severity: 'low',
  },
  {
    id: 8,
    title: 'Sơn Tùng M-TP phá kỷ lục streaming với 50 triệu lượt nghe trong 24 giờ',
    titleEn: 'Son Tung M-TP breaks streaming record with 50M plays in 24 hours',
    source: 'Kenh14', time: '3 giờ trước',
    category: 'giai-tri', province: 'TP.HCM', severity: 'low',
  },
  {
    id: 9,
    title: 'Quốc hội thông qua Luật Đất đai sửa đổi với 87,3% đại biểu tán thành',
    titleEn: 'National Assembly passes revised Land Law with 87.3% approval',
    source: 'Nhân Dân', time: '3 giờ trước',
    category: 'chinh-tri', province: 'Hà Nội', severity: 'medium',
  },
  {
    id: 10,
    title: 'Tỷ lệ thất nghiệp cả nước giảm xuống còn 2,1% trong quý III/2025',
    titleEn: 'National unemployment rate drops to 2.1% in Q3 2025',
    source: 'Kinh tế Sài Gòn', time: '4 giờ trước',
    category: 'kinh-te', province: 'Toàn quốc', severity: 'low',
  },
  {
    id: 11,
    title: 'Hội nghị ASEAN về an ninh mạng khai mạc tại Hà Nội với 25 quốc gia tham dự',
    titleEn: 'ASEAN cybersecurity conference opens in Hanoi with 25 nations attending',
    source: 'Tinh tế', time: '4 giờ trước',
    category: 'cong-nghe', province: 'Hà Nội', severity: 'low',
  },
  {
    id: 12,
    title: 'Vietnam GDP grows 7.1% in Q4 2025, exceeding government target',
    titleEn: 'Vietnam GDP grows 7.1% in Q4 2025, exceeding government target',
    source: 'VIR', time: '5 giờ trước',
    category: 'english', province: 'Toàn quốc', severity: 'low',
  },
  {
    id: 13,
    title: 'Nghị định mới quy định xử phạt vi phạm an toàn thực phẩm tăng gấp đôi',
    titleEn: 'New decree doubles penalties for food safety violations',
    source: 'Báo Pháp luật VN', time: '5 giờ trước',
    category: 'phap-luat', province: 'Hà Nội', severity: 'medium',
  },
  {
    id: 14,
    title: 'Nguyễn Thùy Linh vô địch cầu lông giải Malaysia Open 2026',
    titleEn: 'Nguyen Thuy Linh wins badminton title at 2026 Malaysia Open',
    source: 'TT&VH', time: '6 giờ trước',
    category: 'the-thao', province: 'Toàn quốc', severity: 'low',
  },
]

export const WEATHER: WeatherCity[] = [
  { name: 'Hà Nội',    temp: 28, feelsLike: 31, condition: 'Nhiều mây',    icon: '⛅', aqi: 87,  aqiLevel: 'moderate',      humidity: 78, windSpeed: 12 },
  { name: 'TP.HCM',    temp: 33, feelsLike: 37, condition: 'Nắng',          icon: '☀️', aqi: 65,  aqiLevel: 'moderate',      humidity: 65, windSpeed: 8  },
  { name: 'Đà Nẵng',   temp: 29, feelsLike: 31, condition: 'Gió mạnh',     icon: '🌬️', aqi: 42,  aqiLevel: 'good',          humidity: 80, windSpeed: 45 },
  { name: 'Hải Phòng', temp: 29, feelsLike: 32, condition: 'Có mây',        icon: '🌥️', aqi: 95,  aqiLevel: 'moderate',      humidity: 82, windSpeed: 15 },
  { name: 'Cần Thơ',   temp: 34, feelsLike: 38, condition: 'Nắng gắt',     icon: '☀️', aqi: 58,  aqiLevel: 'moderate',      humidity: 60, windSpeed: 6  },
  { name: 'Huế',       temp: 26, feelsLike: 27, condition: 'Mưa vừa',      icon: '🌧️', aqi: 35,  aqiLevel: 'good',          humidity: 92, windSpeed: 22 },
  { name: 'Nha Trang', temp: 32, feelsLike: 34, condition: 'Nắng nhẹ',     icon: '🌤️', aqi: 28,  aqiLevel: 'good',          humidity: 70, windSpeed: 18 },
  { name: 'Đà Lạt',    temp: 19, feelsLike: 17, condition: 'Sương mù',     icon: '🌫️', aqi: 22,  aqiLevel: 'good',          humidity: 95, windSpeed: 5  },
  { name: 'Vũng Tàu',  temp: 31, feelsLike: 34, condition: 'Nắng',          icon: '☀️', aqi: 41,  aqiLevel: 'good',          humidity: 72, windSpeed: 14 },
  { name: 'Vinh',      temp: 30, feelsLike: 33, condition: 'Có mây',        icon: '🌥️', aqi: 72,  aqiLevel: 'moderate',      humidity: 76, windSpeed: 11 },
]

export const SOCIAL_TRENDS: SocialTrend[] = [
  { id: 1, rank: 1, topic: '#BãoSANVU',            platform: 'facebook',  volume: '4.1M', direction: 'new', category: 'Thời sự' },
  { id: 2, rank: 2, topic: 'Lương tối thiểu 2026', platform: 'zalo',      volume: '2.8M', direction: 'up',  category: 'Xã hội' },
  { id: 3, rank: 3, topic: 'Lật Mặt 8 review',     platform: 'youtube',   volume: '3.9M', direction: 'up',  category: 'Giải trí' },
  { id: 4, rank: 4, topic: '#VNIndex1300',          platform: 'threads',   volume: '1.2M', direction: 'up',  category: 'Tài chính' },
  { id: 5, rank: 5, topic: 'AI thay lập trình viên',platform: 'tiktok',   volume: '5.7M', direction: 'new', category: 'Công nghệ' },
  { id: 6, rank: 6, topic: 'Mưa lũ Tây Nguyên',    platform: 'facebook',  volume: '3.3M', direction: 'up',  category: 'Thời sự' },
  { id: 7, rank: 7, topic: 'iPhone 17 Pro giá VN',  platform: 'instagram', volume: '2.1M', direction: 'up',  category: 'Công nghệ' },
  { id: 8, rank: 8, topic: 'Xe buýt điện Hà Nội',  platform: 'threads',   volume: '980K', direction: 'new', category: 'Đô thị' },
  { id: 9, rank: 9, topic: 'Đồng Nai lũ khẩn cấp', platform: 'zalo',      volume: '1.5M', direction: 'new', category: 'Thời sự' },
  { id:10, rank:10, topic: 'Blackpink Hà Nội 2026', platform: 'instagram', volume: '4.8M', direction: 'up',  category: 'Giải trí' },
]

// Set active: true to test the typhoon banner. In Phase 3, this comes from live data.
export const TYPHOON: TyphoonInfo = {
  active: true,
  name: 'SANVU',
  nameVi: 'Bão số 3',
  category: 2,
  windSpeed: 120,
  location: 'Biển Đông, cách Đà Nẵng ~380km về phía Đông',
  eta: 'Dự kiến đổ bộ: 06:00 ngày 18/10',
  affectedProvinces: ['Quảng Trị', 'Thừa Thiên Huế', 'Đà Nẵng', 'Quảng Nam'],
  warningLevel: 'Cấp độ 3',
}

export const ECON: EconIndicator[] = [
  { label: 'VN-Index',   value: '1,284.7', change: '+12.3', pct: '+0.97%', up: true  },
  { label: 'USD/VND',    value: '25,150',  change: '-35',   pct: '-0.14%', up: false },
  { label: 'HNX-Index',  value: '238.4',   change: '+1.8',  pct: '+0.76%', up: true  },
  { label: 'Vàng (SJC)', value: '87.5tr',  change: '+0.3',  pct: '+0.34%', up: true  },
  { label: 'Dầu WTI',    value: '$71.2',   change: '-0.8',  pct: '-1.11%', up: false },
  { label: 'GDP Q3/25',  value: '6.8%',    change: 'YoY',   pct: '▲',      up: true  },
]

export const TICKER_ITEMS = [
  'VN-Index +0.97% ↑ 1,284.7', 'USD/VND 25,150 ↓', 'Vàng SJC 87.5tr/lượng',
  'GDP Q3: +6.8% YoY', 'CPI tháng 9: +3.2%', 'Xuất khẩu 9T: $290 tỷ USD',
  'FDI giải ngân +8.4%', 'Dầu WTI $71.2 ↓', 'HNX +0.76% ↑ 238.4',
  'VN-Index +0.97% ↑ 1,284.7', 'USD/VND 25,150 ↓', 'Vàng SJC 87.5tr/lượng',
  'GDP Q3: +6.8% YoY', 'CPI tháng 9: +3.2%', 'Xuất khẩu 9T: $290 tỷ USD',
  'FDI giải ngân +8.4%', 'Dầu WTI $71.2 ↓', 'HNX +0.76% ↑ 238.4',
]

export const SOURCES = [
  // Chính trị
  { name: 'Nhân Dân',           url: 'https://nhandan.vn',           lang: 'VI' },
  { name: 'VietnamPlus',        url: 'https://vietnamplus.vn',       lang: 'VI' },
  { name: 'Báo Chính phủ',      url: 'https://baochinhphu.vn',      lang: 'VI' },
  { name: 'Quân đội nhân dân',  url: 'https://qdnd.vn',              lang: 'VI' },
  // Kinh tế & Tài chính
  { name: 'Kinh tế Sài Gòn',   url: 'https://thesaigontimes.vn',   lang: 'VI' },
  { name: 'VnExpress Kinh doanh', url: 'https://vnexpress.net',     lang: 'VI' },
  { name: 'VnEconomy',          url: 'https://vneconomy.vn',         lang: 'VI' },
  { name: 'Báo Đầu tư',         url: 'https://baodautu.vn',         lang: 'VI' },
  // Pháp luật
  { name: 'PLO',                url: 'https://plo.vn',               lang: 'VI' },
  { name: 'VnExpress Pháp luật',url: 'https://vnexpress.net',        lang: 'VI' },
  // Thể thao
  { name: 'Bóng đá',            url: 'https://bongda.com.vn',       lang: 'VI' },
  { name: 'Bóng đá Plus',       url: 'https://bongdaplus.vn',       lang: 'VI' },
  { name: 'TT&VH',              url: 'https://thethaovanhoa.vn',     lang: 'VI' },
  // Giải trí
  { name: 'VnExpress Giải trí', url: 'https://vnexpress.net',       lang: 'VI' },
  { name: 'Kenh14',             url: 'https://kenh14.vn',            lang: 'VI' },
  { name: 'Tuổi Trẻ Giải trí', url: 'https://tuoitre.vn',           lang: 'VI' },
  // Công nghệ
  { name: 'Tinh tế',            url: 'https://tinhte.vn',            lang: 'VI' },
  { name: 'GenK',               url: 'https://genk.vn',              lang: 'VI' },
  { name: 'VnExpress Số hóa',   url: 'https://vnexpress.net',        lang: 'VI' },
  // English
  { name: "VnExpress Int'l",    url: 'https://e.vnexpress.net',     lang: 'EN' },
  { name: 'Vietnam News',       url: 'https://vietnamnews.vn',       lang: 'EN' },
  { name: 'Tuổi Trẻ News',      url: 'https://tuoitrenews.vn',      lang: 'EN' },
  { name: 'VIR',                url: 'https://vir.com.vn',           lang: 'EN' },
]

export const PROVINCES = [
  { name: 'Hà Nội',    count: 8, level: 'high'   as const },
  { name: 'TP.HCM',    count: 6, level: 'high'   as const },
  { name: 'Đà Nẵng',  count: 4, level: 'medium' as const },
  { name: 'Bắc Ninh', count: 3, level: 'medium' as const },
  { name: 'Đắk Lắk',  count: 2, level: 'high'   as const },
  { name: 'Cần Thơ',  count: 2, level: 'low'    as const },
  { name: 'Hải Phòng',count: 1, level: 'low'    as const },
]