import { useCallback, useEffect, useState } from 'react'
import { api } from '../lib/api.js'
import { useAuth } from '../auth/useAuth.js'
import { ALERT_SEVERITIES, label, severityBadgeTone } from '../lib/constants.js'
import { formatDate } from '../lib/format.js'
import { Badge } from '../components/Badge.jsx'
import EmptyState from '../components/EmptyState.jsx'
import ErrorState from '../components/ErrorState.jsx'
import { LoadingBlock, Spinner } from '../components/LoadingState.jsx'
import { Bell, Check } from '../components/icons.jsx'

const ALL = 'all'

function AlertCard({ alert }) {
  return (
    <div className={`notice-banner notice-banner--${alert.severity}`}>
      <span className="mt-1">
        <Badge tone={severityBadgeTone(alert.severity)} dot>
          {alert.severity === 'emergency' ? 'Emergency' : label(alert.severity)}
        </Badge>
      </span>
      <div>
        <strong>{alert.title}</strong>
        <div className="muted" style={{ fontSize: '0.82rem' }}>
          {alert.targetZone || 'Your community'}
          {alert.expiresAt ? ` · expires ${formatDate(alert.expiresAt)}` : ''} · {formatDate(alert.createdAt)}
        </div>
        <div style={{ marginTop: 4 }}>{alert.message}</div>
        {alert.broadcastBy?.name && (
          <div className="muted" style={{ fontSize: '0.8rem', marginTop: 4 }}>
            Broadcast by {alert.broadcastBy.name}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Alerts() {
  const { user } = useAuth()
  const isAdmin = user.role === 'admin'
  const [alerts, setAlerts] = useState([])
  const [state, setState] = useState('loading')
  const [error, setError] = useState(null)

  const [filters, setFilters] = useState({ severity: ALL, zone: user.zone || '' })
  const [broadcastOpen, setBroadcastOpen] = useState(false)
  const [broadcastForm, setBroadcastForm] = useState({
    title: '',
    message: '',
    severity: 'warning',
    targetZone: user.zone || '',
    expiresInHours: '24',
  })
  const [broadcastErrors, setBroadcastErrors] = useState({})
  const [broadcastPending, setBroadcastPending] = useState(false)
  const [broadcastError, setBroadcastError] = useState(null)
  const [broadcastSuccess, setBroadcastSuccess] = useState(null)

  const load = useCallback(async () => {
    setState('loading')
    setError(null)
    try {
      const params = {}
      if (filters.severity !== ALL) params.severity = filters.severity
      if (filters.zone.trim()) params.zone = filters.zone.trim()
      const data = await api.alerts(params)
      setAlerts(data.alerts || [])
      setState('ready')
    } catch (err) {
      setError(err)
      setState('error')
    }
  }, [filters.severity, filters.zone])

  useEffect(() => {
    load()
  }, [load])

  function setFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  function setBroadcast(field, value) {
    setBroadcastForm((prev) => ({ ...prev, [field]: value }))
    setBroadcastErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  async function handleBroadcast(event) {
    event.preventDefault()
    setBroadcastError(null)
    setBroadcastSuccess(null)
    if (broadcastPending) return
    const next = {}
    if (broadcastForm.title.trim().length < 3) next.title = 'Give the alert a short title.'
    if (broadcastForm.message.trim().length < 10) next.message = 'Write the alert message (at least 10 characters).'
    if (!arrayIncludes(ALERT_SEVERITIES, broadcastForm.severity)) next.severity = 'Choose a valid severity.'
    setBroadcastErrors(next)
    if (Object.keys(next).length > 0) return
    setBroadcastPending(true)
    try {
      await api.createAlert({
        title: broadcastForm.title.trim(),
        message: broadcastForm.message.trim(),
        severity: broadcastForm.severity,
        targetZone: broadcastForm.targetZone.trim() || undefined,
        expiresInHours: broadcastForm.expiresInHours ? Number(broadcastForm.expiresInHours) : undefined,
      })
      setBroadcastForm((prev) => ({ ...prev, title: '', message: '' }))
      setBroadcastSuccess('Safety alert broadcast to the selected zone.')
      await load()
    } catch (err) {
      setBroadcastError(err.message)
    } finally {
      setBroadcastPending(false)
    }
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Safety Alerts</h1>
          <p className="page-sub">
            Verified alerts relevant to your community
            {user.zone ? ` (${user.zone})` : ''}. Alerts are reviewed before they are distributed.
          </p>
        </div>
        {isAdmin && (
          <div className="page-actions">
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => setBroadcastOpen((v) => !v)}
              aria-expanded={broadcastOpen}
            >
              <Bell width={17} height={17} />
              Broadcast Alert
            </button>
          </div>
        )}
      </div>

      {isAdmin && broadcastOpen && (
        <div className="detail-panel mb-4 fade-up">
          <div className="panel-title" style={{ color: 'var(--ink)' }}>Broadcast a safety alert</div>
          <form onSubmit={handleBroadcast} noValidate>
            <div className="grid grid--2" style={{ gap: 16 }}>
              <div className="form-group mb-3">
                <label htmlFor="alert-title" className="form-label">Title</label>
                <input
                  id="alert-title"
                  type="text"
                  className={`form-input${broadcastErrors.title ? ' is-invalid' : ''}`}
                  value={broadcastForm.title}
                  onChange={(event) => setBroadcast('title', event.target.value)}
                  placeholder="e.g. Water main break notice"
                  autoComplete="off"
                />
                {broadcastErrors.title && <span className="form-error">{broadcastErrors.title}</span>}
              </div>
              <div className="form-group mb-3">
                <label htmlFor="alert-severity" className="form-label">Severity</label>
                <select
                  id="alert-severity"
                  className={`form-select${broadcastErrors.severity ? ' is-invalid' : ''}`}
                  value={broadcastForm.severity}
                  onChange={(event) => setBroadcast('severity', event.target.value)}
                >
                  {ALERT_SEVERITIES.map((s) => (
                    <option key={s} value={s}>
                      {s === 'emergency' ? 'Emergency' : label(s)}
                    </option>
                  ))}
                </select>
                {broadcastErrors.severity && <span className="form-error">{broadcastErrors.severity}</span>}
              </div>
            </div>

            <div className="form-group mb-3">
              <label htmlFor="alert-message" className="form-label">Message</label>
              <textarea
                id="alert-message"
                className={`form-textarea${broadcastErrors.message ? ' is-invalid' : ''}`}
                value={broadcastForm.message}
                onChange={(event) => setBroadcast('message', event.target.value)}
                placeholder="Describe the alert and what residents should do."
              />
              {broadcastErrors.message && <span className="form-error">{broadcastErrors.message}</span>}
            </div>

            <div className="grid grid--2" style={{ gap: 16 }}>
              <div className="form-group mb-3">
                <label htmlFor="alert-zone" className="form-label">Target zone</label>
                <input
                  id="alert-zone"
                  type="text"
                  className="form-input"
                  value={broadcastForm.targetZone}
                  onChange={(event) => setBroadcast('targetZone', event.target.value)}
                  placeholder="e.g. GRA Zone B"
                  autoComplete="off"
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="alert-expiry" className="form-label">Expires in (hours)</label>
                <input
                  id="alert-expiry"
                  type="number"
                  min="1"
                  max="720"
                  className="form-input"
                  value={broadcastForm.expiresInHours}
                  onChange={(event) => setBroadcast('expiresInHours', event.target.value)}
                />
              </div>
            </div>

            {broadcastError && <span className="form-error">{broadcastError}</span>}
            {broadcastSuccess && (
              <span className="form-hint flex items-center gap-1 mt-2" style={{ color: 'var(--green)', fontWeight: 600 }}>
                <Check width={14} height={14} />
                {broadcastSuccess}
              </span>
            )}
            <button type="submit" className="btn btn--primary btn--sm mt-2" disabled={broadcastPending}>
              {broadcastPending ? <Spinner light /> : 'Broadcast Alert'}
            </button>
          </form>
        </div>
      )}

      <div className="filters" role="group" aria-label="Filter alerts">
        <div className="filter-field">
          <label htmlFor="alert-filter-severity" className="sr-only">Severity</label>
          <select
            id="alert-filter-severity"
            value={filters.severity}
            onChange={(event) => setFilter('severity', event.target.value)}
          >
            <option value={ALL}>All severities</option>
            {ALERT_SEVERITIES.map((s) => (
              <option key={s} value={s}>
                {s === 'emergency' ? 'Emergency' : label(s)}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-field">
          <label htmlFor="alert-filter-zone" className="sr-only">Zone</label>
          <input
            id="alert-filter-zone"
            type="text"
            value={filters.zone}
            onChange={(event) => setFilter('zone', event.target.value)}
            placeholder="Filter by zone"
            autoComplete="off"
          />
        </div>
        {(filters.severity !== ALL || Boolean(filters.zone.trim())) && (
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => setFilters({ severity: ALL, zone: isAdmin ? '' : user.zone || '' })}>
            Clear filters
          </button>
        )}
      </div>

      {state === 'loading' && <LoadingBlock label="Loading alerts..." />}

      {state === 'error' && (
        <div className="card">
          <ErrorState title="We couldn't load alerts." error={error} onRetry={load} />
        </div>
      )}

      {state === 'ready' && (
        <>
          {alerts.length === 0 ? (
            <EmptyState
              title="No alerts right now"
              text={
                filters.severity !== ALL || filters.zone.trim()
                  ? 'No alerts match the current filters.'
                  : 'When your community broadcasts safety alerts, they will appear here.'
              }
            />
          ) : (
            <div className="stack" style={{ gap: 14 }}>
              {alerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function arrayIncludes(arr, value) {
  return arr.includes(value)
}