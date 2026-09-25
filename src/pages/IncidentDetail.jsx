import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../lib/api.js'
import { useAuth } from '../auth/useAuth.js'
import { label, INCIDENT_STATUSES, STATUS_LABELS } from '../lib/constants.js'
import { formatDate } from '../lib/format.js'
import { Badge } from '../components/Badge.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import PriorityBadge from '../components/PriorityBadge.jsx'
import { CategoryIcon } from '../components/CategoryIcon.jsx'
import CommentList from '../components/CommentList.jsx'
import Modal from '../components/Modal.jsx'
import ErrorState from '../components/ErrorState.jsx'
import { LoadingBlock, Spinner } from '../components/LoadingState.jsx'
import { Check, Clock, MapPin, Message, ThumbsUp, User } from '../components/icons.jsx'

export default function IncidentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [incident, setIncident] = useState(null)
  const [state, setState] = useState('loading')
  const [error, setError] = useState(null)
  const [upvotePending, setUpvotePending] = useState(false)
  const [upvoteSuccess, setUpvoteSuccess] = useState(null)
  const [comment, setComment] = useState('')
  const [commentError, setCommentError] = useState(null)
  const [commentSending, setCommentSending] = useState(false)
  const [commentSuccess, setCommentSuccess] = useState(null)
  const [statusForm, setStatusForm] = useState({ status: '', assignedOfficerId: '', notes: '' })
  const [statusPending, setStatusPending] = useState(false)
  const [statusError, setStatusError] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deletePending, setDeletePending] = useState(false)
  const loadRef = useRef(false)

  const load = useCallback(async () => {
    setState('loading')
    setError(null)
    try {
      const data = await api.incident(id)
      setIncident(data.incident)
      setStatusForm((prev) => ({
        ...prev,
        status: data.incident.status,
        assignedOfficerId: data.incident.assignedTo?.userId || '',
      }))
      setState('ready')
    } catch (err) {
      setError(err)
      setState('error')
    }
  }, [id])

  useEffect(() => {
    if (loadRef.current) return
    loadRef.current = true
    load()
  }, [load])

  async function handleUpvote() {
    if (upvotePending || !incident) return
    setUpvotePending(true)
    setUpvoteSuccess(null)
    try {
      const data = await api.upvoteIncident(incident.id)
      setIncident((prev) => ({ ...prev, ...data.incident }))
      setUpvoteSuccess(data.hasUpvoted ? 'Thanks! Your confirmation was added.' : 'Your confirmation was removed.')
    } catch (err) {
      setUpvoteSuccess(null)
      setError(err.message)
    } finally {
      setUpvotePending(false)
    }
  }

  async function handleComment(event) {
    event.preventDefault()
    if (commentSending) return
    const text = comment.trim()
    if (!text) {
      setCommentError('Write a comment before submitting.')
      return
    }
    setCommentError(null)
    setCommentSending(true)
    setCommentSuccess(null)
    try {
      const data = await api.commentIncident(incident.id, text)
      setIncident((prev) => ({ ...prev, comments: [...(prev.comments || []), data.comment] }))
      setComment('')
      setCommentSuccess('Comment added.')
    } catch (err) {
      setCommentError(err.message)
    } finally {
      setCommentSending(false)
    }
  }

  async function handleStatusUpdate(event) {
    event.preventDefault()
    if (statusPending) return
    if (!statusForm.status) {
      setStatusError('Choose a status.')
      return
    }
    setStatusPending(true)
    setStatusError(null)
    try {
      const data = await api.updateIncidentStatus(incident.id, {
        status: statusForm.status,
        assignedOfficerId: statusForm.assignedOfficerId || undefined,
        notes: statusForm.notes || undefined,
      })
      setIncident((prev) => ({ ...prev, ...data.incident }))
      setStatusForm((prev) => ({
        ...prev,
        notes: '',
        assignedOfficerId: data.incident.assignedTo?.userId || statusForm.assignedOfficerId,
      }))
    } catch (err) {
      setStatusError(err.message)
    } finally {
      setStatusPending(false)
    }
  }

  async function handleDelete() {
    if (deletePending) return
    setDeletePending(true)
    try {
      await api.deleteIncident(incident.id)
      setConfirmOpen(false)
      navigate('/app/incidents', { replace: true })
    } catch (err) {
      setError(err.message)
      setConfirmOpen(false)
    } finally {
      setDeletePending(false)
    }
  }

  if (state === 'loading') return <LoadingBlock label="Loading incident..." />
  if (state === 'error' || !incident) {
    return (
      <div className="card">
        <ErrorState
          title="We couldn't load this incident."
          error={error}
          onRetry={load}
        />
      </div>
    )
  }

  const canModerate = user.role === 'patrol_officer' || user.role === 'admin'
  const isOwner = incident.reportedBy?.userId === user.id
  const upvotes = incident.upvotes || []
  const hasUpvoted = upvotes.includes(user.id)
  const locationText = [incident.location?.address, incident.location?.zone]
    .filter(Boolean)
    .join(' · ')

  return (
    <div>
      <Link to="/app/incidents" className="muted" style={{ fontSize: '0.9rem' }}>
        ← Back to incidents
      </Link>

      <div className="card mt-2" style={{ padding: 24 }}>
        <div className="flex items-center gap-3 flex-wrap">
          <CategoryIcon category={incident.category} size={42} />
          <div className="flex-1" style={{ minWidth: 0 }}>
            <h1 className="page-title" style={{ fontSize: '1.4rem', wordBreak: 'break-word' }}>
              {incident.title}
            </h1>
            <div className="flex items-center gap-2 flex-wrap mt-1">
              <PriorityBadge priority={incident.priority} />
              <StatusBadge status={incident.status} />
              <span className="zone-chip">{label(incident.category)}</span>
            </div>
          </div>
        </div>

        <p className="mt-3" style={{ color: 'var(--text)', lineHeight: 1.6 }}>
          {incident.description || 'No description provided.'}
        </p>

        <dl className="kv-list mt-4">
          <div className="kv">
            <dt>Location</dt>
            <dd className="flex items-center gap-1" style={{ gap: 6 }}>
              <MapPin width={15} height={15} style={{ flexShrink: 0 }} />
              {locationText || 'Not provided'}
            </dd>
          </div>
          <div className="kv">
            <dt>Reported by</dt>
            <dd className="flex items-center gap-1" style={{ gap: 6 }}>
              <User width={15} height={15} style={{ flexShrink: 0 }} />
              {incident.reportedBy?.name || 'Community member'}
            </dd>
          </div>
          <div className="kv">
            <dt>Responding</dt>
            <dd>
              {incident.assignedTo?.name || 'Not assigned yet'}
              {incident.assignedTo?.badgeNumber ? ` (${incident.assignedTo.badgeNumber})` : ''}
            </dd>
          </div>
          <div className="kv">
            <dt>Created</dt>
            <dd className="flex items-center gap-1" style={{ gap: 6 }}>
              <Clock width={15} height={15} style={{ flexShrink: 0 }} />
              {formatDate(incident.createdAt)}
            </dd>
          </div>
          <div className="kv">
            <dt>Updated</dt>
            <dd>{formatDate(incident.updatedAt)}</dd>
          </div>
          <div className="kv">
            <dt>Confirmations</dt>
            <dd>{incident.confirmationsCount ?? upvotes.length}</dd>
          </div>
        </dl>

        {Array.isArray(incident.images) && incident.images.length > 0 && (
          <div className="mt-4">
            <div className="panel-title" style={{ color: 'var(--ink)' }}>Images</div>
            <div className="grid grid--3" style={{ gap: 12 }}>
              {incident.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Incident evidence ${index + 1}`}
                  style={{ borderRadius: 12, width: '100%', objectFit: 'cover', aspectRatio: '4/3' }}
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="detail-grid mt-3">
        <div className="detail-panel">
          <div className="panel-title" style={{ color: 'var(--ink)' }}>
            <span className="flex items-center gap-2">
              <Message width={16} height={16} />
              Comments ({incident.comments?.length || 0})
            </span>
          </div>

          <form onSubmit={handleComment} noValidate className="mb-3">
            <div className="form-group mb-2">
              <label htmlFor="comment-text" className="form-label">
                Add information
              </label>
              <textarea
                id="comment-text"
                className={`form-textarea${commentError ? ' is-invalid' : ''}`}
                value={comment}
                onChange={(event) => {
                  setComment(event.target.value)
                  setCommentError(null)
                }}
                placeholder="Share a relevant, factual update..."
                style={{ minHeight: 80 }}
              />
              {commentError && <span className="form-error">{commentError}</span>}
            </div>
            <button type="submit" className="btn btn--primary btn--sm" disabled={commentSending}>
              {commentSending ? <Spinner light /> : 'Add Comment'}
            </button>
            {commentSuccess && (
              <span className="form-hint flex items-center gap-1" style={{ color: 'var(--green)', fontWeight: 600 }}>
                <Check width={14} height={14} />
                {commentSuccess}
              </span>
            )}
          </form>

          <CommentList comments={incident.comments} currentUserId={user.id} />
        </div>

        <div className="stack" style={{ gap: 16 }}>
          <div className="detail-panel">
            <div className="panel-title" style={{ color: 'var(--ink)' }}>Confirm this report</div>
            <p className="muted" style={{ fontSize: '0.9rem', marginBottom: 14 }}>
              Confirmations help community personnel verify a report. Your confirmation is tracked with your account.
            </p>
            <button
              type="button"
              className={`btn ${hasUpvoted ? 'btn--dark' : 'btn--primary'} btn--block`}
              onClick={handleUpvote}
              disabled={upvotePending}
            >
              {upvotePending ? (
                <Spinner light={!hasUpvoted} />
              ) : (
                <>
                  <ThumbsUp width={17} height={17} />
                  {hasUpvoted ? 'Confirmed' : 'Confirm Report'}
                </>
              )}
            </button>
            {error && <span className="form-error mt-2" style={{ display: 'block' }}>{error}</span>}
            {upvoteSuccess && (
              <span className="form-hint flex items-center gap-1 mt-2" style={{ color: 'var(--green)', fontWeight: 600 }}>
                <Check width={14} height={14} />
                {upvoteSuccess}
              </span>
            )}
          </div>

          {canModerate && (
            <div className="detail-panel">
              <div className="panel-title" style={{ color: 'var(--ink)' }}>Update status</div>
              <form onSubmit={handleStatusUpdate} noValidate>
                <div className="form-group mb-2">
                  <label htmlFor="status-select" className="form-label">
                    Status
                  </label>
                  <select
                    id="status-select"
                    className="form-select"
                    value={statusForm.status}
                    onChange={(event) => setStatusForm((prev) => ({ ...prev, status: event.target.value }))}
                  >
                    {INCIDENT_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group mb-2">
                  <label htmlFor="officer-id" className="form-label">
                    Assigned officer ID <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span>
                  </label>
                  <input
                    id="officer-id"
                    className="form-input"
                    value={statusForm.assignedOfficerId}
                    onChange={(event) => setStatusForm((prev) => ({ ...prev, assignedOfficerId: event.target.value }))}
                    placeholder="e.g. usr_demo_patrol_01"
                    autoComplete="off"
                  />
                </div>
                <div className="form-group mb-2">
                  <label htmlFor="status-notes" className="form-label">
                    Notes <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span>
                  </label>
                  <textarea
                    id="status-notes"
                    className="form-textarea"
                    value={statusForm.notes}
                    onChange={(event) => setStatusForm((prev) => ({ ...prev, notes: event.target.value }))}
                    placeholder="e.g. Patrol responded on site."
                    style={{ minHeight: 70 }}
                  />
                </div>
                {statusError && <span className="form-error">{statusError}</span>}
                <button type="submit" className="btn btn--primary btn--sm mt-2" disabled={statusPending}>
                  {statusPending ? <Spinner light /> : 'Save Status'}
                </button>
              </form>
            </div>
          )}

          {isOwner && (
            <div className="detail-panel">
              <div className="panel-title" style={{ color: 'var(--ink)' }}>Manage report</div>
              <p className="muted" style={{ fontSize: '0.9rem', marginBottom: 14 }}>
                You can remove this incident report if it was submitted in error.
              </p>
              <button type="button" className="btn btn--danger-ghost btn--sm" onClick={() => setConfirmOpen(true)}>
                Delete Incident
              </button>
            </div>
          )}
        </div>
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete this incident?"
      >
        <p className="modal-text">
          This permanently removes the report and its comments from the community feed. This cannot be undone.
        </p>
        <div className="modal-actions">
          <button type="button" className="btn btn--ghost" onClick={() => setConfirmOpen(false)}>
            Cancel
          </button>
          <button type="button" className="btn btn--danger" onClick={handleDelete} disabled={deletePending}>
            {deletePending ? <Spinner light /> : 'Delete'}
          </button>
        </div>
      </Modal>
    </div>
  )
}