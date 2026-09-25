import { useState } from 'react'
import { label } from '../lib/constants.js'
import { timeAgo } from '../lib/format.js'

const ZONES = [
  { key: 'A', x: 4, y: 5, w: 28, h: 23 },
  { key: 'B', x: 36, y: 5, w: 28, h: 23 },
  { key: 'C', x: 68, y: 5, w: 28, h: 23 },
  { key: 'D', x: 4, y: 34, w: 28, h: 23 },
  { key: 'E', x: 36, y: 34, w: 28, h: 23 },
  { key: 'F', x: 68, y: 34, w: 28, h: 23 },
]

function zoneFor(key) {
  return ZONES[Math.min(Math.max(key ? key.charCodeAt(0) - 65 : 0, 0), ZONES.length - 1)]
}

function hashId(id) {
  let hash = 0
  const str = String(id || '')
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return (Math.abs(hash) % 1000) / 1000
}

function markerColor(incident) {
  if (incident.status === 'resolved') return '#16a34a'
  if (incident.priority === 'critical' || incident.category === 'emergency') return '#dc2626'
  if (incident.priority === 'high') return '#d97706'
  return '#0284c7'
}

function extractZone(incident) {
  const zone = incident.location?.zone
  if (!zone) return 'A'
  const letter = String(zone).trim()[0]?.toUpperCase()
  if (/[A-F]/.test(letter)) return letter
  return 'A'
}

function positionFor(incident) {
  const zoneKey = extractZone(incident)
  const zone = zoneFor(zoneKey)
  const h = hashId(incident.id || incident.title || '')
  const x = zone.x + 4 + h * (zone.w - 8)
  const y = zone.y + 4 + ((hashId(incident.title) ) % 100) / 100 * (zone.h - 8)
  return { cx: x, cy: y, zoneKey, zone }
}

const LEGEND = [
  { color: '#dc2626', label: 'Emergency' },
  { color: '#d97706', label: 'Warning' },
  { color: '#0284c7', label: 'Information' },
  { color: '#16a34a', label: 'Resolved' },
]

export default function SafetyMap({ incidents = [], demo = false, compact = false }) {
  const [selected, setSelected] = useState(null)
  const safeList = Array.isArray(incidents) ? incidents.slice(0, 14) : []

  const popupStyle = selected
    ? {
        left: `${selected.position.cx}%`,
        top: `${selected.position.cy}%`,
        transform: 'translate(-50%, -115%)',
      }
    : null

  return (
    <div className="map-visual" style={compact ? { aspectRatio: 'auto', minHeight: 180 } : undefined}>
      <svg className="map-svg" viewBox="0 0 100 62" role="img" aria-label="Schematic community safety map">
        <defs>
          <pattern id="roadP" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M0 50h100M50 0v100" stroke="#c3d4e8" strokeWidth="0.4" strokeDasharray="2 3" />
          </pattern>
        </defs>

        {ZONES.map((zone) => (
          <g key={zone.key}>
            <rect
              x={zone.x}
              y={zone.y}
              width={zone.w}
              height={zone.h}
              rx="1.5"
              fill="#fff"
              stroke="#93b4d6"
              strokeWidth="0.35"
            />
            <text
              x={zone.x + 1.6}
              y={zone.y + 3.2}
              fontSize="2.4"
              fontWeight="700"
              fill="#64748b"
            >
              Zone {zone.key}
            </text>
          </g>
        ))}

        <rect x="0" y="0" width="100" height="31" fill="url(#roadP)" opacity="0.5" />
        <rect x="0" y="31" width="100" height="31" fill="url(#roadP)" opacity="0.5" />

        <path d="M0 31h100M50 0v62" stroke="#b7cbe2" strokeWidth="0.7" />

        {safeList.map((incident) => {
          const position = positionFor(incident)
          const color = markerColor(incident)
          const pulse = incident.status !== 'resolved'
          return (
            <g
              key={incident.id}
              className="map-marker"
              transform={`translate(${position.cx}, ${position.cy})`}
              onClick={() => setSelected({ incident, position })}
              role="button"
              aria-label={`${incident.title}, ${label(incident.status)}`}
            >
              {pulse && <circle className="halo" r="7" fill={color} opacity="0.55" />}
              <circle
                r="2.6"
                fill={color}
                stroke="#fff"
                strokeWidth="0.6"
                tabIndex="0"
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    setSelected({ incident, position })
                  }
                }}
              />
            </g>
          )
        })}
      </svg>

      <div className="map-toolbar">
        <span className="zone-chip">
          <span className="dot" style={{ width: 7, height: 7, borderRadius: '50%', background: 'currentColor' }} />
          Approximate positions
        </span>
      </div>

      {selected && popupStyle ? (
        <div className="map-popup" style={popupStyle}>
          <div className="map-popup-title">{selected.incident.title}</div>
          <dl className="kv-list" style={{ gap: 6 }}>
            <div className="kv" style={{ gridTemplateColumns: '76px 1fr' }}>
              <dt>Category</dt>
              <dd>{label(selected.incident.category)}</dd>
            </div>
            <div className="kv" style={{ gridTemplateColumns: '76px 1fr' }}>
              <dt>Location</dt>
              <dd>{selected.incident.location?.address || `Zone ${selected.position.zoneKey}`}</dd>
            </div>
            <div className="kv" style={{ gridTemplateColumns: '76px 1fr' }}>
              <dt>Time</dt>
              <dd>{timeAgo(selected.incident.createdAt)}</dd>
            </div>
            <div className="kv" style={{ gridTemplateColumns: '76px 1fr' }}>
              <dt>Status</dt>
              <dd>{label(selected.incident.status)}</dd>
            </div>
            <div className="kv" style={{ gridTemplateColumns: '76px 1fr' }}>
              <dt>Priority</dt>
              <dd>{label(selected.incident.priority)}</dd>
            </div>
            {selected.incident.reportedBy?.name && (
              <div className="kv" style={{ gridTemplateColumns: '76px 1fr' }}>
                <dt>Reported by</dt>
                <dd>{selected.incident.reportedBy.name}</dd>
              </div>
            )}
            {selected.incident.assignedTo?.name && (
              <div className="kv" style={{ gridTemplateColumns: '76px 1fr' }}>
                <dt>Responding</dt>
                <dd>{selected.incident.assignedTo.name}</dd>
              </div>
            )}
          </dl>
          <button type="button" className="btn btn--ghost btn--sm mt-2" onClick={() => setSelected(null)}>
            Close
          </button>
        </div>
      ) : null}

      {!compact && (
        <div className="map-legend">
          {LEGEND.map((item) => (
            <span key={item.label} className="legend-item">
              <span className="legend-dot" style={{ background: item.color }} />
              {item.label}
            </span>
          ))}
        </div>
      )}

      {demo && <div className="map-demo-note">Demo visualization. Position markers are approximate and sanitized — not precise real-world coordinates.</div>}
    </div>
  )
}