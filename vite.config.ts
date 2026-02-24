import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // ── Chính trị ─────────────────────────────────────────────────────────
      '/api/nhandan': {
        target: 'https://nhandan.vn',
        changeOrigin: true, secure: false,
        rewrite: (path) => path.replace(/^\/api\/nhandan/, '')
      },
      '/api/vietnamplus': {
        target: 'https://vietnamplus.vn',
        changeOrigin: true, secure: false,
        rewrite: (path) => path.replace(/^\/api\/vietnamplus/, '')
      },
      '/api/baochinhphu': {
        target: 'https://baochinhphu.vn',
        changeOrigin: true, secure: false,
        rewrite: (path) => path.replace(/^\/api\/baochinhphu/, '')
      },
      '/api/qdnd': {
        target: 'https://qdnd.vn',
        changeOrigin: true, secure: false,
        rewrite: (path) => path.replace(/^\/api\/qdnd/, '')
      },
      // ── Kinh tế & Tài chính ───────────────────────────────────────────────
      '/api/thesaigontimes': {
        target: 'https://thesaigontimes.vn',
        changeOrigin: true, secure: false,
        rewrite: (path) => path.replace(/^\/api\/thesaigontimes/, '')
      },
      '/api/vneconomy': {
        target: 'https://vneconomy.vn',
        changeOrigin: true, secure: false,
        rewrite: (path) => path.replace(/^\/api\/vneconomy/, '')
      },
      '/api/baodautu': {
        target: 'https://baodautu.vn',
        changeOrigin: true, secure: false,
        rewrite: (path) => path.replace(/^\/api\/baodautu/, '')
      },
      // ── Pháp luật ─────────────────────────────────────────────────────────
      '/api/plo': {
        target: 'https://plo.vn',
        changeOrigin: true, secure: false,
        rewrite: (path) => path.replace(/^\/api\/plo/, '')
      },
      // ── Thể thao ──────────────────────────────────────────────────────────
      '/api/bongdaplus': {
        target: 'https://bongdaplus.vn',
        changeOrigin: true, secure: false,
        rewrite: (path) => path.replace(/^\/api\/bongdaplus/, '')
      },
      '/api/bongda': {
        target: 'https://bongda.com.vn',        // without www — avoids 308 redirect
        changeOrigin: true, secure: false,
        rewrite: (path) => path.replace(/^\/api\/bongda/, '')
      },
      '/api/thethaovanhoa': {
        target: 'https://thethaovanhoa.vn',
        changeOrigin: true, secure: false,
        rewrite: (path) => path.replace(/^\/api\/thethaovanhoa/, '')
      },
      // ── Giải trí + Công nghệ + Kinh doanh + Pháp luật (VnExpress cats) ───
      '/api/vnexpress': {
        target: 'https://vnexpress.net',
        changeOrigin: true, secure: false,
        rewrite: (path) => path.replace(/^\/api\/vnexpress/, '')
      },
      '/api/kenh14': {
        target: 'https://kenh14.vn',
        changeOrigin: true, secure: false,
        rewrite: (path) => path.replace(/^\/api\/kenh14/, '')
      },
      '/api/tuoitre': {
        target: 'https://tuoitre.vn',
        changeOrigin: true, secure: false,
        rewrite: (path) => path.replace(/^\/api\/tuoitre/, '')
      },
      // ── Công nghệ ─────────────────────────────────────────────────────────
      '/api/tinhte': {
        target: 'https://tinhte.vn',
        changeOrigin: true, secure: false,
        rewrite: (path) => path.replace(/^\/api\/tinhte/, '')
      },
      '/api/genk': {
        target: 'https://genk.vn',
        changeOrigin: true, secure: false,
        rewrite: (path) => path.replace(/^\/api\/genk/, '')
      },
      // ── English ───────────────────────────────────────────────────────────
      '/api/evnexpress': {
        target: 'https://e.vnexpress.net',
        changeOrigin: true, secure: false,
        rewrite: (path) => path.replace(/^\/api\/evnexpress/, '')
      },
      '/api/vietnamnews': {
        target: 'https://vietnamnews.vn',
        changeOrigin: true, secure: false,
        rewrite: (path) => path.replace(/^\/api\/vietnamnews/, '')
      },
      '/api/tuoitrenews': {
        target: 'https://tuoitrenews.vn',
        changeOrigin: true, secure: false,
        rewrite: (path) => path.replace(/^\/api\/tuoitrenews/, '')
      },
      '/api/vir': {
        target: 'https://vir.com.vn',
        changeOrigin: true, secure: false,
        rewrite: (path) => path.replace(/^\/api\/vir/, '')
      },
      // ── Video news ────────────────────────────────────────────────────────
      '/api/vtv': {
        target: 'https://vtv.vn',
        changeOrigin: true, secure: false,
        rewrite: (path) => path.replace(/^\/api\/vtv/, '')
      },
      '/api/vtcnews': {
        target: 'https://vtcnews.vn',
        changeOrigin: true, secure: false,
        rewrite: (path) => path.replace(/^\/api\/vtcnews/, '')
      },
      '/api/thanhnien': {
        target: 'https://thanhnien.vn',
        changeOrigin: true, secure: false,
        rewrite: (path) => path.replace(/^\/api\/thanhnien/, '')
      },
      // ── Market data (econ) ────────────────────────────────────────────────
      '/api/stooq': {
        target: 'https://stooq.com',
        changeOrigin: true, secure: false,
        rewrite: (path) => path.replace(/^\/api\/stooq/, '')
      },
      '/api/arcgis': {
        target: 'https://services9.arcgis.com/RHVPKKiFTONKtxq3',
        changeOrigin: true, secure: false,
        rewrite: (path) => path.replace(/^\/api\/arcgis/, 'https://services9.arcgis.com/RHVPKKiFTONKtxq3')
      },
      '/api/yahoo': {
        target: 'https://query1.finance.yahoo.com',
        changeOrigin: true, secure: false,
        rewrite: (path) => path.replace(/^\/api\/yahoo/, '')
      },
    }
  }
})
