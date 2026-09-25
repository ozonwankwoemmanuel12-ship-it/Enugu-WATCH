import { Link } from 'react-router-dom'
import { Alert, Bell, Check, MapPin, Siren, Users, Clock } from '../icons.jsx'
import { label } from '../../lib/constants.js'

const DEMO_INCIDENTS = [
  { id: 'd1', name: 'Suspicious activity', location: 'Market Road, Zone A', status: 'review', icon: 'eye' },
  { id: 'd2', name: 'Fire emergency', location: 'Iweka Road, Zone B', status: 'progress', icon: 'fire' },
  { id: 'd3', name: 'Medical emergency', location: 'Main Avenue, Zone C', status: 'progress', icon: 'medical' },
  { id: 'd4', name: 'Vandalism', location: 'ESI quarters, Zone A', status: 'reported', icon: 'vandal' },
]

function DemoMap() {
  const dots = [
    { x: 30, y: 34, color: '#dc2626', pulse: true },
    { x: 66, y: 26, color: '#d97706', pulse: true },
    { x: 50, y: 58, color: '#0284c7', pulse: true },
    { x: 74, y: 60, color: '#16a34a', pulse: false },
    { x: 22, y: 66, color: '#d97706', pulse: true },
  ]
  return (
    <div className="mini-map" style={{ background: '#0f172a', padding: 2 }}>
      <svg viewBox="0 0 100 66" style={{ width: '100%', display: 'block' }} role="img" aria-label="Demo community safety map">
        <defs>
          <pattern id="miniGrid" width="12" height="12" patternUnits="userSpaceOnUse">
            <path d="M12 0H0V12" fill="none" stroke="#1e293b" strokeWidth="0.5" />
          </pattern>
          <radialGradient id="zoneGlow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="rgba(37,99,235,0.35)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect width="100" height="66" fill="#0f172a" />
        <rect width="100" height="66" fill="url(#miniGrid)" />
        <rect x="6" y="8" width="30" height="18" rx="2" fill="rgba(148,163,184,0.14)" stroke="rgba(148,163,184,0.35)" />
        <rect x="40" y="8" width="30" height="18" rx="2" fill="rgba(148,163,184,0.14)" stroke="rgba(148,163,184,0.35)" />
        <rect x="74" y="8" width="20" height="18" rx="2" fill="rgba(148,163,184,0.14)" stroke="rgba(148,163,184,0.35)" />
        <rect x="6" y="40" width="30" height="18" rx="2" fill="rgba(148,163,184,0.14)" stroke="rgba(148,163,184,0.35)" />
        <rect x="40" y="40" width="30" height="18" rx="2" fill="rgba(148,163,184,0.14)" stroke="rgba(148,163,184,0.35)" />
        <rect x="74" y="40" width="20" height="18" rx="2" fill="rgba(148,163,184,0.14)" stroke="rgba(148,163,184,0.35)" />
        <path d="M0 31H100M50 0V66" stroke="rgba(148,163,184,0.4)" strokeWidth="0.8" />
        {dots.map((dot, index) => (
          <g key={index} transform={`translate(${dot.x}, ${dot.y})`}>
            {dot.pulse && <circle r="7" fill={dot.color} opacity="0.5" />}
            <circle r="2.6" fill={dot.color} stroke="#fff" strokeWidth="0.6" />
          </g>
        ))}
        <circle cx="88" cy="20" r="4" fill="url(#zoneGlow)" />
      </svg>
      <div className="map-legend">
        <span className="legend-item"><span className="legend-dot" style={{ background: '#dc2626' }} />Emergency</span>
        <span className="legend-item"><span className="legend-dot" style={{ background: '#d97706' }} />Warning</span>
        <span className="legend-item"><span className="legend-dot" style={{ background: '#0284c7' }} />Information</span>
        <span className="legend-item"><span className="legend-dot" style={{ background: '#16a34a' }} />Resolved</span>
      </div>
    </div>
  )
}

function IncidentRow({ incident, index }) {
  return (
    <div className="inc-row">
      <span className="inc-icon" style={{ background: 'rgba(37,99,235,0.16)', color: '#60a5fa' }}>
        {index % 2 === 0 ? <MapPin width={16} height={16} /> : <Alert width={16} height={16} />}
      </span>
      <div className="inc-main">
        <div className="inc-name">{incident.name}</div>
        <div className="inc-meta">
          {incident.location} · just now
        </div>
      </div>
      <span className={`inc-status inc-status--${incident.status}`}>{label(incident.status)}</span>
    </div>
  )
}

export default function Hero({ stats, statsError }) {
  const overview = stats?.data?.overview
  const notices = stats?.data?.recentPublicNotices || []

  const kpis = [
    { label: 'Active incidents', value: overview ? String(overview.inProgressIncidents ?? 0) : '—', icon: Alert, color: '#60a5fa' },
    { label: 'Resolved today', value: overview ? String(overview.resolvedIncidents ?? 0) : '—', icon: Check, color: '#4ade80' },
    { label: 'Active patrols', value: overview ? String(overview.activePatrolShifts ?? 0) : '—', icon: Siren, color: '#fbbf24' },
    {
      label: 'Community members',
      value: overview?.communityMembers ? String(overview.communityMembers.registeredResidents ?? 0) : '—',
      icon: Users,
      color: '#c4b5fd',
    },
  ]

  return (
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-copy">
          <div className="eyebrow fade-up">See it. Report it. Verify it. Act together.</div>
          <h1 className="hero-title fade-up" style={{ animationDelay: '0.05s' }}>
            Safer communities start with <span className="accent">better information.</span>
          </h1>
          <p className="hero-sub fade-up" style={{ animationDelay: '0.12s' }}>
            Report incidents, receive verified alerts, coordinate emergency response and keep your community connected
            through one trusted safety platform.
          </p>
          <div className="hero-ctas fade-up" style={{ animationDelay: '0.18s' }}>
            <Link to="/register" className="btn btn--primary btn--lg">
              Report an Incident
            </Link>
            <a href="#how-it-works" className="btn btn--ghost-dark btn--lg">
              See How It Works
            </a>
          </div>
          {statsError ? (
            <div className="hero-badges">
              <div className="stats-fallback">
                <Alert width={16} height={16} />
                Safety statistics currently unavailable.
              </div>
            </div>
          ) : (
            <div className="hero-badges fade-up" style={{ animationDelay: '0.24s' }}>
              <span className="hero-badge">
                <Check width={16} height={16} />
                Real community data
              </span>
              <span className="hero-badge">
                <Check width={16} height={16} />
                Verified alerts
              </span>
              <span className="hero-badge">
                <Check width={16} height={16} />
                Role-based access
              </span>
            </div>
          )}
        </div>

        <div className="hero-dash fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="dash-frame">
            <div className="dash-top">
              <span className="dash-dot" />
              <span className="dash-dot" />
              <span className="dash-dot" />
            </div>
            <div className="dash-topbar">
              <div className="dash-title">Community Safety Overview</div>
              <span className="dash-badge-pill">Live</span>
            </div>
            <div className="dash-body">
              <div className="kpi-grid">
                {kpis.map((kpi) => (
                  <div className="kpi-card" key={kpi.label}>
                    <div className="kpi-label">
                      <kpi.icon width={13} height={13} color={kpi.color} />
                      {kpi.label}
                    </div>
                    <div className="kpi-value">{kpi.value}</div>
                  </div>
                ))}
              </div>

              <div className="dash-row">
                <div className="dash-panel">
                  <div className="panel-title">
                    Live Incidents
                    <span className="panel-count">4</span>
                  </div>
                  {DEMO_INCIDENTS.map((incident, index) => (
                    <IncidentRow key={incident.id} incident={incident} index={index} />
                  ))}
                </div>
                <div className="dash-panel">
                  <div className="panel-title">
                    <span className="flex items-center gap-1">
                      <MapPin width={13} height={13} /> Safety Map
                    </span>
                  </div>
                  <DemoMap />
                  <div className="panel-title" style={{ marginTop: 14 }}>
                    <span className="flex items-center gap-1">
                      <Bell width={13} height={13} /> Recent Alerts
                    </span>
                    <span className="panel-count">{notices.length}</span>
                  </div>
                  {notices.length > 0 ? (
                    notices.slice(0, 2).map((notice) => (
                      <div className="notice-row" key={`${notice.title}-${notice.createdAt}`}>
                        <span className="inc-icon" style={{ background: 'rgba(22,163,74,0.16)', color: '#4ade80' }}>
                          <Check width={15} height={15} />
                        </span>
                        <div className="notice-main">
                          <div className="notice-title">{notice.title}</div>
                          <div className="notice-meta">
                            {notice.targetZone} · {notice.severity === 'info' ? 'Info' : 'Alert'}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="notice-meta" style={{ padding: '10px 0' }}>No recent notices.</div>
                  )}
                </div>
              </div>

              <div className="dash-panel" style={{ marginTop: 14 }}>
                <div className="panel-title">
                  <span className="flex items-center gap-1">
                    <MapPin width={13} height={13} /> Live Feed
                  </span>
                  <span className="panel-count">Live</span>
                </div>
                <div className="inc-row" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className="inc-icon" style={{ background: 'rgba(37,99,235,0.16)', color: '#60a5fa' }}>
                    <Clock width={16} height={16} />
                  </span>
                  <div className="inc-main">
                    <div className="inc-name">Patrol officers now active across 5 zones</div>
                    <div className="inc-meta">Zone updates · verified by community personnel</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}