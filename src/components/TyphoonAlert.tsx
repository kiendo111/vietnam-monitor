import type { TyphoonInfo } from '../types'

interface TyphoonAlertProps {
  typhoon: TyphoonInfo | null
}

export default function TyphoonAlert({ typhoon }: TyphoonAlertProps) {
  if (!typhoon) return null

  return (
    <div style={{
      background: 'rgba(200, 16, 46, 0.14)',
      borderBottom: '2px solid rgba(200, 16, 46, 0.6)',
      borderTop: '1px solid rgba(200, 16, 46, 0.3)',
      padding: '12px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      flexShrink: 0,
      animation: 'fadeIn 0.3s ease',
      minHeight: 64,
    }}>

      {/* Pulsing ⚠ BÃO tag — bigger and more urgent */}
      <div style={{
        background: 'var(--red)',
        color: 'white',
        fontFamily: 'var(--font-mono)',
        fontSize: 13,
        fontWeight: 700,
        padding: '6px 12px',
        borderRadius: 3,
        letterSpacing: '0.12em',
        flexShrink: 0,
        animation: 'pulse 1s infinite',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        lineHeight: 1.4,
        textAlign: 'center',
        minWidth: 70,
      }}>
        <span style={{ fontSize: 18 }}>⚠</span>
        <span>BÃO</span>
      </div>

      {/* Storm identity block */}
      <div style={{ flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
          <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--text)', letterSpacing: '-0.01em' }}>
            {typhoon.nameVi}
          </span>
          <span style={{ fontWeight: 400, fontSize: 13, color: 'var(--muted)' }}>
            / {typhoon.name}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{
            background: 'rgba(200,16,46,0.25)',
            color: 'var(--red)',
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: 2,
            border: '1px solid rgba(200,16,46,0.4)',
          }}>
            CẤP {typhoon.category} · {typhoon.windSpeed} km/h
          </span>
          <span style={{
            background: 'rgba(245,166,35,0.2)',
            color: 'var(--gold)',
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: 2,
            border: '1px solid rgba(245,166,35,0.35)',
            animation: 'pulse 2s infinite',
          }}>
            {typhoon.warningLevel?.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 40, background: 'rgba(200,16,46,0.3)', flexShrink: 0 }} />

      {/* Location + ETA */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, color: 'var(--text)', marginBottom: 4 }}>
          <span style={{ color: 'var(--muted)', fontSize: 10 }}>VỊ TRÍ · </span>
          {typhoon.location}
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold)' }}>
          🕐 {typhoon.eta}
        </div>
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 40, background: 'rgba(200,16,46,0.3)', flexShrink: 0 }} />

      {/* Affected provinces — highlighted background */}
      <div style={{ flexShrink: 0 }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: 'var(--muted)',
          letterSpacing: '0.15em',
          marginBottom: 6,
        }}>
          TỈNH THÀNH ẢNH HƯỞNG
        </div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {typhoon.affectedProvinces?.map(p => (
            <span key={p} style={{
              background: 'rgba(200,16,46,0.22)',
              border: '1px solid rgba(200,16,46,0.5)',
              color: 'var(--text)',
              fontSize: 11,
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: 3,
            }}>
              {p}
            </span>
          ))}
        </div>
      </div>

    </div>
  )
}