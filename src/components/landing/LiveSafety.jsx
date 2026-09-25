import { Link } from 'react-router-dom'
import { Alert, Bell } from '../icons.jsx'

const DEMO_INCIDENTS = [
  {
    id: 'dem_1',
    title: 'Suspicious vehicle near school gate',
    category: 'suspicious_activity',
    priority: 'high',
    status: 'under_review',
    location: { zone: 'A', address: 'Primary School Road' },
    reportedBy: { name: 'Demo Resident' },
    createdAt: '2026-09-18T08:00:00.000Z',
  },
  {
    id: 'dem_2',
    title: 'Fire outbreak at market shed',
    category: 'emergency',
    priority: 'critical',
    status: 'in_progress',
    location: { zone: 'B', address: 'Main Market' },
    reportedBy: { name: 'Demo Resident' },
    createdAt: '2026-09-18T09:30:00.000Z',
  },
  {
    id: 'dem_3',
    title: 'Medical emergency on Main Avenue',
    category: 'emergency',
    priority: 'critical',
    status: 'in_progress',
    location: { zone: 'C', address: 'Main Avenue' },
    reportedBy: { name: 'Demo Resident' },
    createdAt: '2026-09-18T09:45:00.000Z',
  },
  {
    id: 'dem_4',
    title: 'Streetlight vandalism reported',
    category: 'vandalism',
    priority: 'medium',
    status: 'reported',
    location: { zone: 'A', address: 'ESI Quarters' },
    reportedBy: { name: 'Demo Resident' },
    createdAt: '2026-09-18T10:00:00.000Z',
  },
  {
    id: 'dem_5',
    title: 'Open manhole covered and resolved',
    category: 'hazard',
    priority: 'medium',
    status: 'resolved',
    location: { zone: 'B', address: 'Abakpa Road' },
    reportedBy: { name: 'Demo Resident' },
    createdAt: '2026-09-17T16:00:00.000Z',
  },
]

const DEMO_ALERTS = [
  { title: 'Heavy rainfall expected tonight', severity: 'warning', zone: 'All Districts' },
  { title: 'Road closure on Emene', severity: 'info', zone: 'Zone D' },
]

export default function LiveSafety() {
  return (
    <section id="safety" className="section section--alt">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">Live Community Safety</div>
          <h2 className="section-title">Know what&rsquo;s happening around your community.</h2>
          <p className="section-sub">
            A single view of active incidents, severity and verified alerts — built for calm, informed response.
          </p>
        </div>

        <div className="grid grid--2" style={{ alignItems: 'start' }}>
          <div className="card" style={{ padding: 18 }}>
            <div className="panel-title" style={{ color: 'var(--ink)', justifyContent: 'space-between' }}>
              <span className="flex items-center gap-2">
                <Alert width={16} height={16} style={{ color: 'var(--primary)' }} />
                Active incidents
              </span>
              <span className="panel-count" style={{ color: 'var(--text-muted)' }}>
                {DEMO_INCIDENTS.filter((i) => i.status !== 'resolved').length}
              </span>
            </div>
            {DEMO_INCIDENTS.filter((i) => i.status !== 'resolved').map((incident) => (
              <div className="inc-row" key={incident.id} style={{ borderTopColor: 'var(--border)' }}>
                <div className="inc-main">
                  <div className="inc-name" style={{ color: 'var(--ink)' }}>
                    {incident.title}
                  </div>
                  <div className="inc-meta">{incident.location.address}</div>
                </div>
                <span className={`inc-status inc-status--${incident.status}`}>
                  {incident.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: 18 }}>
            <div className="panel-title" style={{ color: 'var(--ink)' }}>
              <span className="flex items-center gap-2">
                <Bell width={16} height={16} style={{ color: 'var(--primary)' }} />
                Recent alerts
              </span>
            </div>
            {DEMO_ALERTS.map((alert) => (
              <div className="inc-row" key={alert.title} style={{ borderTopColor: 'var(--border)' }}>
                <div className="inc-main">
                  <div className="inc-name" style={{ color: 'var(--ink)' }}>
                    {alert.title}
                  </div>
                  <div className="inc-meta">{alert.zone}</div>
                </div>
                <span className={`inc-status inc-status--${alert.severity === 'warning' ? 'progress' : 'review'}`}>
                  {alert.severity}
                </span>
              </div>
            ))}
            <Link to="/register" className="btn btn--ghost btn--sm btn--block mt-2">
              Follow alerts in your zone
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}