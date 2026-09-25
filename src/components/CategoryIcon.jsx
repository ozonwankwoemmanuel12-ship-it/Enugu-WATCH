import { Alert, Check, Cross, Handshake, MapPin, Siren, Eye } from './icons.jsx'

const MAP = {
  theft: { Icon: Alert, bg: '#fef3c7', color: '#d97706' },
  vandalism: { Icon: Cross, bg: '#f3e8ff', color: '#7c3aed' },
  suspicious_activity: { Icon: Eye, bg: '#e0f2fe', color: '#0284c7' },
  hazard: { Icon: Alert, bg: '#ffedd5', color: '#ea580c' },
  lost_and_found: { Icon: Handshake, bg: '#dcfce7', color: '#16a34a' },
  noise_complaint: { Icon: Siren, bg: '#f1f5f9', color: '#64748b' },
  emergency: { Icon: Siren, bg: '#fee2e2', color: '#dc2626' },
  other: { Icon: MapPin, bg: '#eff6ff', color: '#2563eb' },
}

export function CategoryIcon({ category, size = 32 }) {
  const fallback = MAP.other
  const { Icon, bg, color } = MAP[category] || fallback
  return (
    <span
      className="inc-icon"
      style={{ width: size, height: size, background: bg, color }}
      aria-hidden="true"
    >
      <Icon width={size * 0.55} height={size * 0.55} strokeWidth={2.2} />
    </span>
  )
}