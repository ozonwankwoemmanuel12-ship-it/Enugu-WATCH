import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api.js'
import { useAuth } from '../auth/useAuth.js'
import { timeAgo } from '../lib/format.js'
import { label, severityBadgeTone } from '../lib/constants.js'
import { Badge } from '../components/Badge.jsx'
import IncidentCard from '../components/IncidentCard.jsx'
import SafetyMap from '../components/SafetyMap.jsx'
import EmptyState from '../components/EmptyState.jsx'
import ErrorState from '../components/ErrorState.jsx'
import { SkeletonGrid, SkeletonRows, Spinner } from '../components/LoadingState.jsx'
import { Activity, Alert, Bell, Check, Clipboard, MapPin, Plus, Siren, Users } from '../components/icons.jsx'

function StatCard({ icon: Icon, value, labelText, color, bg, pending }) {
  return (
    <div className="stat-card">
      <span className="stat-ic" style={{ background: bg, color }}>
        <Icon width={21} height={21} />
      </span>
      <div>
        <div className="stat-value">{pending ? '…' : value}</div>
        <div className="stat-label">{labelText}</div>
      </div>
    </div>
  )
}

function AlertsPreview({ alerts, pending }) {
  if (pending) return <SkeletonRows count={3} />
  if (!Array.isArray(alerts) || alerts.length === 0) {
    return (
      <EmptyState title="No alerts right now" text="When alerts are broadcast for your zone, they will appear here." />
    )
  }
  return (
    <div className="stack" style={{ gap: 10 }}>
      {alerts.slice(0, 5).map((alert) => (
        <div key={alert.id} className={`notice-banner notice-banner--${alert.severity}`}>
          <span className="mt-1">
            <Badge tone={severityBadgeTone(alert.severity)} dot>
              {alert.severity === 'emergency' ? 'Emergency' : label(alert.severity)}
            </Badge>
          </span>
          <div>
            <strong>{alert.title}</strong>
            <div className="muted" style={{ fontSize: '0.82rem' }}>
              {alert.targetZone || 'Your community'} · {timeAgo(alert.createdAt)}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ActivityFeed({ items, pending }) {
  if (pending) return <SkeletonRows count={4} />
  if (items.length === 0) {
    return (
      <EmptyState
        title="No recent activity"
        text="Reports and alerts in your community will show up here."
      />
    )
  }
  return (
    <div>
      {items.map((item, index) => {
        const isAlert = item.kind === 'alert'
        const Icon = isAlert ? Bell : Clipboard
        return (
          <div key={item.id || index} className="inc-row" style={{ borderTopColor: 'var(--border)', borderTopWidth: 1 }}>
            <span className="inc-icon" style={{ background: isAlert ? 'var(--amber-soft)' : 'var(--primary-soft)', color: isAlert ? 'var(--amber)' : 'var(--primary)' }}>
              <Icon width={16} height={16} />
            </span>
            <div className="inc-main">
              <div className="inc-name" style={{ color: 'var(--ink)' }}>
                {isAlert ? item.title : item.title}
              </div>
              <div className="inc-meta">
                {isAlert ? item.targetZone || 'Alert' : label(item.category)} · {timeAgo(item.createdAt)}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const isOfficer = user.role === 'patrol_officer' || user.role === 'admin'
  const [incidents, setIncidents] = useState([])
  const [alerts, setAlerts] = useState([])
  const [stats, setStats] = useState(null)
  const [pending, setPending] = useState(true)
  const [error, setError] = useState(null)
  const loadedRef = useRef(false)

  const load = useCallback(async () => {
    setPending(true)
    setError(null)
    try {
      const zoneFilter = user.zone ? { zone: user.zone } : {}
      const [incidentData, alertData] = await Promise.all([
        api.incidents(),
        api.alerts(zoneFilter),
      ])
      setIncidents(incidentData.incidents || [])
      setAlerts(alertData.alerts || [])
      try {
        const statsResult = await api.stats()
        setStats(statsResult)
      } catch {
        setStats(null)
      }
    } catch (err) {
      setError(err)
    } finally {
      setPending(false)
    }
  }, [user.zone])

  useEffect(() => {
    if (loadedRef.current) return
    loadedRef.current = true
    load()
  }, [load])

  const activeIncidents = incidents.filter(
    (i) => i.status !== 'resolved' && i.status !== 'dismissed',
  )
  const communityEntries = [
    ...incidents
      .filter((i) => i.status !== 'resolved' && i.status !== 'dismissed')
      .slice(0, 8)
      .map((i) => ({ ...i, kind: 'incident' })),
    ...alerts.slice(0, 8).map((a) => ({ ...a, kind: 'alert' })),
  ]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8)

  if (error && incidents.length === 0) {
    return (
      <div className="card">
        <ErrorState
          title="We couldn't load the dashboard."
          text="There was a problem connecting to the safety service."
          onRetry={load}
          error={error}
        />
      </div>
    )
  }

  const overview = stats?.data?.overview
  const statCards = [
    {
      icon: Alert,
      value: String(overview?.inProgressIncidents ?? 0),
      label: 'Active incidents',
      color: '#2563eb',
      bg: 'var(--primary-soft)',
    },
    {
      icon: Check,
      value: String(overview?.resolvedIncidents ?? 0),
      label: 'Resolved today',
      color: '#16a34a',
      bg: 'var(--green-soft)',
    },
    {
      icon: Siren,
      value: String(overview?.activePatrolShifts ?? 0),
      label: 'Patrol shifts',
      color: '#d97706',
      bg: 'var(--amber-soft)',
    },
    {
      icon: Users,
      value: String(overview?.communityMembers?.registeredResidents ?? 0),
      label: 'Community members',
      color: '#7c3aed',
      bg: '#f3e8ff',
    },
  ]

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Welcome, {user.name.split(' ')[0]}</h1>
          <p className="page-sub">Here is the safety status for your community.</p>
        </div>
        <div className="page-actions">
          <Link to="/app/report" className="btn btn--primary">
            <Plus width={17} height={17} />
            Report Incident
          </Link>
          <Link to="/app/report?priority=critical&category=emergency" className="btn btn--danger">
            <Siren width={17} height={17} />
            Emergency
          </Link>
        </div>
      </div>

      <div className="grid grid--4 mb-4" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} pending={pending && !stats} />
        ))}
      </div>

      <div className="grid mb-4" style={{ gridTemplateColumns: '1.5fr 1fr', alignItems: 'start' }}>
        <div className="card" style={{ padding: 18 }}>
          <div className="panel-title" style={{ color: 'var(--ink)' }}>
            <span className="flex items-center gap-2">
              <Activity width={16} height={16} style={{ color: 'var(--primary)' }} />
              Active incidents
            </span>
            <span className="panel-count" style={{ color: 'var(--text-muted)' }}>
              {pending ? '…' : activeIncidents.length}
            </span>
          </div>
          {pending ? (
            <div className="grid grid--2" style={{ gap: 12 }}>
              <SkeletonGrid count={2} type="card" />
            </div>
          ) : activeIncidents.length > 0 ? (
            <div className="grid grid--2" style={{ gap: 12 }}>
              {activeIncidents.slice(0, 4).map((incident) => (
                <IncidentCard key={incident.id} incident={incident} showReporter={false} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No active incidents"
              text="Your community has no open incidents right now."
              action={
                <Link to="/app/report" className="btn btn--primary btn--sm">
                  Report something
                </Link>
              }
            />
          )}
        </div>

        <div className="grid" style={{ gridTemplateColumns: '1fr', gap: 16 }}>
          <div className="card" style={{ padding: 18 }}>
            <div className="panel-title" style={{ color: 'var(--ink)' }}>
              <span className="flex items-center gap-2">
                <Bell width={16} height={16} style={{ color: 'var(--primary)' }} />
                Relevant alerts
              </span>
            </div>
            <AlertsPreview alerts={alerts} pending={pending} />
          </div>

          <div className="card" style={{ padding: 18 }}>
            <div className="panel-title" style={{ color: 'var(--ink)' }}>
              <span className="flex items-center gap-2">
                <Activity width={16} height={16} style={{ color: 'var(--primary)' }} />
                Recent activity
              </span>
            </div>
            <ActivityFeed items={communityEntries} pending={pending} />
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 18 }}>
        <div className="panel-title" style={{ color: 'var(--ink)' }}>
          <span className="flex items-center gap-2">
            <MapPin width={16} height={16} style={{ color: 'var(--primary)' }} />
            Community safety overview
          </span>
          {!pending && <span className="muted" style={{ fontSize: '0.8rem' }}>Approximate positions within zones</span>}
        </div>
        {pending ? (
          <SkeletonGrid count={1} type="card" />
        ) : (
          <SafetyMap incidents={incidents} />
        )}
      </div>

      {isOfficer && (
        <div className="card mt-4" style={{ padding: 18 }}>
          <div className="panel-title" style={{ color: 'var(--ink)' }}>
            Patrol operations
          </div>
          <div className="muted mb-3" style={{ fontSize: '0.9rem' }}>
            Start or manage a patrol shift from the Patrols page.
          </div>
          <Link to="/app/patrols" className="btn btn--primary btn--sm">
            Open Patrols
          </Link>
        </div>
      )}
    </div>
  )
}