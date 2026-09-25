import { useCallback, useEffect, useState } from 'react'
import { api } from '../lib/api.js'
import { useAuth } from '../auth/useAuth.js'
import { formatDate, timeAgo } from '../lib/format.js'
import { Badge } from '../components/Badge.jsx'
import EmptyState from '../components/EmptyState.jsx'
import ErrorState from '../components/ErrorState.jsx'
import { LoadingBlock, Spinner } from '../components/LoadingState.jsx'
import { Checkpoint, Siren } from '../components/icons.jsx'

const STATUSES = ['active', 'completed', 'scheduled']
const CHECKPOINT_STATUSES = ['clear', 'issue_noted', 'hazard_resolved']

function patrolTone(status) {
  if (status === 'active') return 'blue'
  if (status === 'completed') return 'green'
  return 'neutral'
}

function notAuthorized() {
  return (
    <div className="card" style={{ maxWidth: 560 }}>
      <div className="state">
        <span className="state-ic" style={{ background: 'var(--amber-soft)', color: 'var(--amber)' }}>
          <Siren width={26} height={26} />
        </span>
        <div className="state-title">Patrols are for authorised personnel</div>
        <div className="state-text">
          Patrol shifts and checkpoints require a patrol officer or administrator role.
        </div>
      </div>
    </div>
  )
}

function CheckpointLine({ checkpoint }) {
  const tone = checkpoint.status === 'issue_noted' ? 'amber' : checkpoint.status === 'hazard_resolved' ? 'green' : 'blue'
  return (
    <div className="inc-row" style={{ borderTopColor: 'var(--border)' }}>
      <span className="inc-icon" style={{ background: 'var(--primary-soft)', color: 'var(--primary)' }}>
        <Checkpoint width={16} height={16} />
      </span>
      <div className="inc-main">
        <div className="inc-name" style={{ color: 'var(--ink)' }}>{checkpoint.name}</div>
        <div className="inc-meta">
          {checkpoint.notes || 'No notes'} · {timeAgo(checkpoint.timestamp)}
        </div>
      </div>
      <Badge tone={tone} dot>
        {checkpoint.status.replace('_', ' ')}
      </Badge>
    </div>
  )
}

export default function Patrols() {
  const { user } = useAuth()
  const canPatrol = user.role === 'patrol_officer' || user.role === 'admin'
  const [patrols, setPatrols] = useState([])
  const [state, setState] = useState('loading')
  const [error, setError] = useState(null)
  const [tab, setTab] = useState('all')

  const [startOpen, setStartOpen] = useState(false)
  const [startForm, setStartForm] = useState({ zone: '', initialNotes: '' })
  const [startPending, setStartPending] = useState(false)
  const [startError, setStartError] = useState(null)

  const [cpForm, setCpForm] = useState({ name: '', status: 'clear', notes: '' })
  const [cpPending, setCpPending] = useState(false)
  const [cpError, setCpError] = useState(null)

  const [endForm, setEndForm] = useState({ summary: '' })
  const [endPending, setEndPending] = useState(false)
  const [endError, setEndError] = useState(null)

  const load = useCallback(async () => {
    setState('loading')
    setError(null)
    try {
      const data = await api.patrols()
      setPatrols(data.patrols || [])
      setState('ready')
    } catch (err) {
      setError(err)
      setState('error')
    }
  }, [])

  useEffect(() => {
    if (canPatrol) load()
  }, [canPatrol, load])

  async function handleStart(event) {
    event.preventDefault()
    setStartError(null)
    if (startPending) return
    setStartPending(true)
    try {
      await api.startPatrol({
        zone: startForm.zone.trim() || undefined,
        initialNotes: startForm.initialNotes.trim() || undefined,
      })
      setStartForm({ zone: '', initialNotes: '' })
      setStartOpen(false)
      await load()
    } catch (err) {
      setStartError(err.message)
    } finally {
      setStartPending(false)
    }
  }

  async function handleCheckpoint(patrolId, event) {
    event.preventDefault()
    setCpError(null)
    if (cpPending) return
    if (!cpForm.name.trim()) {
      setCpError('Give the checkpoint a name.')
      return
    }
    setCpPending(true)
    try {
      await api.checkpointPatrol(patrolId, {
        name: cpForm.name.trim(),
        status: cpForm.status,
        notes: cpForm.notes.trim() || undefined,
      })
      setCpForm({ name: '', status: 'clear', notes: '' })
      await load()
    } catch (err) {
      setCpError(err.message)
    } finally {
      setCpPending(false)
    }
  }

  async function handleEnd(patrolId, event) {
    event.preventDefault()
    setEndError(null)
    if (endPending) return
    setEndPending(true)
    try {
      await api.endPatrol(patrolId, { summary: endForm.summary.trim() || undefined })
      setEndForm({ summary: '' })
      await load()
    } catch (err) {
      setEndError(err.message)
    } finally {
      setEndPending(false)
    }
  }

  if (!canPatrol) return notAuthorized()

  const filtered = tab === 'all' ? patrols : patrols.filter((p) => p.status === tab)
  const activePatrol = patrols.filter((p) => p.status === 'active')[0] || null

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Patrols</h1>
          <p className="page-sub">
            {activePatrol ? 'You have an active patrol shift.' : 'Start or review patrol shifts.'}
          </p>
        </div>
        <div className="page-actions">
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => setStartOpen((v) => !v)}
            aria-expanded={startOpen}
          >
            <Siren width={17} height={17} />
            Start Patrol
          </button>
        </div>
      </div>

      {startOpen && (
        <div className="detail-panel mb-4 fade-up">
          <div className="panel-title" style={{ color: 'var(--ink)' }}>Start a patrol shift</div>
          <form onSubmit={handleStart} noValidate>
            <div className="grid grid--2" style={{ gap: 16 }}>
              <div className="form-group mb-3">
                <label htmlFor="patrol-zone" className="form-label">Zone</label>
                <input
                  id="patrol-zone"
                  type="text"
                  className="form-input"
                  value={startForm.zone}
                  onChange={(event) => setStartForm((prev) => ({ ...prev, zone: event.target.value }))}
                  placeholder="e.g. GRA Zone B"
                  autoComplete="off"
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="patrol-notes" className="form-label">
                  Initial notes <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span>
                </label>
                <input
                  id="patrol-notes"
                  type="text"
                  className="form-input"
                  value={startForm.initialNotes}
                  onChange={(event) => setStartForm((prev) => ({ ...prev, initialNotes: event.target.value }))}
                  placeholder="e.g. Commencing night perimeter sweep"
                  autoComplete="off"
                />
              </div>
            </div>
            {startError && <span className="form-error">{startError}</span>}
            <button type="submit" className="btn btn--primary btn--sm mt-2" disabled={startPending}>
              {startPending ? <Spinner light /> : 'Begin Shift'}
            </button>
          </form>
        </div>
      )}

      {state === 'loading' && <LoadingBlock label="Loading patrols..." />}

      {state === 'error' && (
        <div className="card">
          <ErrorState title="We couldn't load patrols." error={error} onRetry={load} />
        </div>
      )}

      {state === 'ready' && activePatrol && (
        <div className="detail-panel patrol-live mb-4">
          <div className="panel-title" style={{ color: 'var(--ink)' }}>
            <span className="flex items-center gap-2">
              <Siren width={16} height={16} style={{ color: 'var(--info)' }} />
              Active patrol
            </span>
            <Badge tone="blue" dot>Active</Badge>
          </div>
          <div className="grid grid--2" style={{ gap: 12, marginTop: 10 }}>
            <div className="kv">
              <dt>Zone</dt>
              <dd>{activePatrol.zone || 'Unspecified'}</dd>
            </div>
            <div className="kv">
              <dt>Started</dt>
              <dd>{formatDate(activePatrol.startTime)}</dd>
            </div>
          </div>
          <div className="mt-3">
            <div className="panel-title" style={{ color: 'var(--ink)', marginBottom: 4 }}>
              Checkpoints ({activePatrol.checkpoints?.length || 0})
            </div>
            {activePatrol.checkpoints?.length ? (
              activePatrol.checkpoints.map((cp, index) => <CheckpointLine key={cp.timestamp || index} checkpoint={cp} />)
            ) : (
              <p className="muted" style={{ fontSize: '0.9rem' }}>No checkpoints logged yet.</p>
            )}

            <form onSubmit={(event) => handleCheckpoint(activePatrol.id, event)} className="card mt-3" style={{ padding: 16 }} noValidate>
              <div className="panel-title" style={{ color: 'var(--ink)' }}>Log a checkpoint</div>
              <div className="grid grid--3" style={{ gap: 12 }}>
                <div className="form-group">
                  <label htmlFor="cp-name" className="form-label">Name</label>
                  <input
                    id="cp-name"
                    type="text"
                    className="form-input"
                    value={cpForm.name}
                    onChange={(event) => setCpForm((prev) => ({ ...prev, name: event.target.value }))}
                    placeholder="e.g. School gate"
                    autoComplete="off"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cp-status" className="form-label">Status</label>
                  <select
                    id="cp-status"
                    className="form-select"
                    value={cpForm.status}
                    onChange={(event) => setCpForm((prev) => ({ ...prev, status: event.target.value }))}
                  >
                    {CHECKPOINT_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="cp-notes" className="form-label">Notes</label>
                  <input
                    id="cp-notes"
                    type="text"
                    className="form-input"
                    value={cpForm.notes}
                    onChange={(event) => setCpForm((prev) => ({ ...prev, notes: event.target.value }))}
                    placeholder="Optional"
                    autoComplete="off"
                  />
                </div>
              </div>
              {cpError && <span className="form-error">{cpError}</span>}
              <button type="submit" className="btn btn--dark btn--sm mt-2" disabled={cpPending}>
                {cpPending ? <Spinner light /> : 'Add Checkpoint'}
              </button>
            </form>

            <form onSubmit={(event) => handleEnd(activePatrol.id, event)} className="card mt-3" style={{ padding: 16 }} noValidate>
              <div className="panel-title" style={{ color: 'var(--ink)' }}>End patrol</div>
              <div className="form-group mb-2">
                <label htmlFor="end-summary" className="form-label">Summary</label>
                <input
                  id="end-summary"
                  type="text"
                  className="form-input"
                  value={endForm.summary}
                  onChange={(event) => setEndForm((prev) => ({ ...prev, summary: event.target.value }))}
                  placeholder="e.g. All checkpoints cleared, no anomalies."
                  autoComplete="off"
                />
              </div>
              {endError && <span className="form-error">{endError}</span>}
              <button type="submit" className="btn btn--ghost btn--sm" disabled={endPending}>
                {endPending ? <Spinner /> : 'End Shift'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="tabbar" role="tablist" aria-label="Patrol status">
        {['all', ...STATUSES].map((status) => (
          <button
            key={status}
            type="button"
            role="tab"
            aria-selected={tab === status}
            className={`tab${tab === status ? ' active' : ''}`}
            onClick={() => setTab(status)}
          >
            {status === 'all' ? 'All' : status[0].toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {state === 'ready' && (
        <>
          {filtered.length === 0 ? (
            <EmptyState
              title="No patrols here"
              text={tab === 'all' ? 'No patrol shifts have been recorded.' : `No ${tab} patrols right now.`}
            />
          ) : (
            <div className="grid grid--2">
              {filtered.map((patrol) => (
                <div className="card" style={{ padding: 18 }} key={patrol.id}>
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span style={{ fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                      {patrol.officerName || 'Patrol'}
                    </span>
                    <Badge tone={patrolTone(patrol.status)} dot>
                      {patrol.status}
                    </Badge>
                  </div>
                  <div className="muted mt-2" style={{ fontSize: '0.88rem' }}>
                    Zone: {patrol.zone || 'Unspecified'}
                  </div>
                  <div className="muted" style={{ fontSize: '0.88rem' }}>
                    {patrol.startTime ? `Started ${formatDate(patrol.startTime)}` : ''}
                    {patrol.endTime ? ` · Ended ${formatDate(patrol.endTime)}` : ''}
                  </div>
                  <div className="muted mt-1" style={{ fontSize: '0.88rem' }}>
                    {patrol.checkpoints?.length || 0} checkpoint{(patrol.checkpoints?.length || 0) === 1 ? '' : 's'}
                  </div>
                  {patrol.summary && (
                    <div className="mt-2" style={{ fontSize: '0.9rem', color: 'var(--text)' }}>
                      {patrol.summary}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}