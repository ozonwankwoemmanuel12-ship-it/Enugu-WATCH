import { useEffect, useState } from 'react'
import { api } from '../lib/api.js'
import { useAuth } from '../auth/useAuth.js'
import { ROLE_LABELS } from '../lib/constants.js'
import { formatDate, initials } from '../lib/format.js'
import { Badge } from '../components/Badge.jsx'
import ErrorState from '../components/ErrorState.jsx'
import { LoadingBlock, Spinner } from '../components/LoadingState.jsx'
import { Badge as BadgeIcon, Check } from '../components/icons.jsx'

export default function Profile() {
  const { updateUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [state, setState] = useState('loading')
  const [error, setError] = useState(null)

  const [form, setForm] = useState({ name: '', zone: '', phone: '' })
  const [errors, setErrors] = useState({})
  const [pending, setPending] = useState(false)
  const [msg, setMsg] = useState(null)
  const [apiError, setApiError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await api.me()
        if (cancelled) return
        setProfile(data.user)
        setForm({
          name: data.user.name || '',
          zone: data.user.zone || '',
          phone: data.user.phone || '',
        })
        setState('ready')
      } catch (err) {
        if (cancelled) return
        setError(err)
        setState('error')
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  function setField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMsg(null)
    setApiError(null)
    if (pending) return
    const next = {}
    if (form.name.trim().length < 2) next.name = 'Enter your full name.'
    if (form.phone && !/^[+()\d\s-]{7,20}$/.test(form.phone.trim())) next.phone = 'Enter a valid phone number.'
    setErrors(next)
    if (Object.keys(next).length > 0) return
    setPending(true)
    try {
      await updateUser({
        name: form.name.trim(),
        zone: form.zone.trim() || undefined,
        phone: form.phone.trim() || undefined,
      })
      setMsg('Your profile was updated.')
    } catch (err) {
      setApiError(err.message)
    } finally {
      setPending(false)
    }
  }

  if (state === 'loading') return <LoadingBlock label="Loading your profile..." />
  if (state === 'error') {
    return (
      <div className="card">
        <ErrorState title="We couldn't load your profile." error={error} onRetry={() => window.location.reload()} />
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 760 }}>
      <div className="page-head">
        <div>
          <h1 className="page-title">Profile</h1>
          <p className="page-sub">Your account information and community role.</p>
        </div>
      </div>

      <div className="card" style={{ padding: 24 }}>
        <div className="flex items-center gap-4 flex-wrap">
          <span className="avatar" style={{ width: 64, height: 64, fontSize: '1.5rem' }}>
            {initials(profile.name)}
          </span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                {profile.name}
              </span>
              <Badge tone={profile.role === 'admin' ? 'blue' : profile.role === 'patrol_officer' ? 'amber' : 'green'}>
                {ROLE_LABELS[profile.role] || profile.role}
              </Badge>
            </div>
            <div className="muted" style={{ fontSize: '0.9rem' }}>{profile.email}</div>
          </div>
        </div>

        <dl className="kv-list mt-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          <div className="kv">
            <dt>Zone</dt>
            <dd>{profile.zone || 'Not set'}</dd>
          </div>
          <div className="kv">
            <dt>Phone</dt>
            <dd>{profile.phone || 'Not set'}</dd>
          </div>
          <div className="kv">
            <dt>Badge number</dt>
            <dd className="flex items-center gap-1" style={{ gap: 6 }}>
              <BadgeIcon width={15} height={15} />
              {profile.badgeNumber || 'Not issued'}
            </dd>
          </div>
          <div className="kv">
            <dt>Joined</dt>
            <dd>{formatDate(profile.createdAt)}</dd>
          </div>
        </dl>
      </div>

      <div className="detail-panel mt-4">
        <div className="panel-title" style={{ color: 'var(--ink)' }}>Edit profile</div>

        {msg && (
          <div className="alert-banner alert-banner--success fade-up" role="status">
            <span className="flex items-center gap-2">
              <Check width={18} height={18} />
              {msg}
            </span>
          </div>
        )}
        {apiError && (
          <div className="alert-banner alert-banner--error" role="alert">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group mb-3">
            <label htmlFor="profile-name" className="form-label">
              Full name <span className="req">*</span>
            </label>
            <input
              id="profile-name"
              type="text"
              autoComplete="name"
              className={`form-input${errors.name ? ' is-invalid' : ''}`}
              value={form.name}
              onChange={(event) => setField('name', event.target.value)}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'profile-name-error' : undefined}
            />
            {errors.name && (
              <span id="profile-name-error" className="form-error">
                {errors.name}
              </span>
            )}
          </div>

          <div className="grid grid--2" style={{ gap: 16 }}>
            <div className="form-group mb-3">
              <label htmlFor="profile-zone" className="form-label">Zone</label>
              <input
                id="profile-zone"
                type="text"
                className="form-input"
                value={form.zone}
                onChange={(event) => setField('zone', event.target.value)}
                placeholder="e.g. GRA Zone B"
                autoComplete="off"
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="profile-phone" className="form-label">Phone</label>
              <input
                id="profile-phone"
                type="tel"
                autoComplete="tel"
                className={`form-input${errors.phone ? ' is-invalid' : ''}`}
                value={form.phone}
                onChange={(event) => setField('phone', event.target.value)}
                placeholder="e.g. 0803 123 4567"
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? 'profile-phone-error' : undefined}
              />
              {errors.phone && (
                <span id="profile-phone-error" className="form-error">
                  {errors.phone}
                </span>
              )}
            </div>
          </div>

          <div className="form-group mb-3">
            <label htmlFor="profile-email" className="form-label">Email address</label>
            <input
              id="profile-email"
              type="email"
              className="form-input"
              value={profile.email}
              disabled
              aria-disabled="true"
            />
            <span className="form-hint">Email cannot be changed.</span>
          </div>

          <button type="submit" className="btn btn--primary" disabled={pending}>
            {pending ? <Spinner light /> : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}