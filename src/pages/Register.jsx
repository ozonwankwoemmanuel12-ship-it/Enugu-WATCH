import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth.js'
import { ApiError } from '../lib/api.js'
import { Check } from '../components/icons.jsx'
import { Spinner } from '../components/LoadingState.jsx'

export default function Register() {
  const { user, register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', zone: '', phone: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState(null)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    if (user) navigate('/app', { replace: true })
  }, [user, navigate])

  function setField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function validate() {
    const next = {}
    if (form.name.trim().length < 2) next.name = 'Enter your full name.'
    if (!form.email.trim()) next.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = 'Enter a valid email address.'
    if (!form.password) next.password = 'Create a password.'
    else if (form.password.length < 8) next.password = 'Use at least 8 characters.'
    if (form.phone && !/^[+()\d\s-]{7,20}$/.test(form.phone.trim())) next.phone = 'Enter a valid phone number.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError(null)
    if (pending) return
    if (!validate()) return
    setPending(true)
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        zone: form.zone.trim() || undefined,
        phone: form.phone.trim() || undefined,
      })
      navigate('/app', { replace: true })
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Registration failed. Please try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="auth-panel">
      <div className="auth-panel-hero">
        <div className="auth-panel-hero-inner">
          <div className="eyebrow" style={{ borderColor: 'rgba(60,130,246,.4)' }}>
            Join your community
          </div>
          <h2 style={{ color: '#f8fafc', fontSize: '2rem', fontWeight: 800, marginBottom: 16 }}>
            Privacy by design. Verified by your community.
          </h2>
          <p style={{ color: '#94a3b8', marginBottom: 28 }}>
            Reports are reviewed before wider alerts are distributed. Only necessary information is shared.
          </p>
          {['Report incidents in your zone', 'Receive verified alerts', 'No password stored — session secured by the safety service'].map((item) => (
            <div className="hero-check" key={item}>
              <Check width={18} height={18} />
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="auth-panel-form">
        <form className="auth-card" onSubmit={handleSubmit} noValidate>
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-sub">Join as a community resident. It takes less than a minute.</p>

          {formError && (
            <div className="alert-banner alert-banner--error" role="alert">
              {formError}
            </div>
          )}

          <div className="form-group mb-3">
            <label htmlFor="reg-name" className="form-label">
              Full name <span className="req">*</span>
            </label>
            <input
              id="reg-name"
              type="text"
              autoComplete="name"
              className={`form-input${errors.name ? ' is-invalid' : ''}`}
              value={form.name}
              onChange={(event) => setField('name', event.target.value)}
              placeholder="e.g. Ada Obi"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'reg-name-error' : undefined}
            />
            {errors.name && (
              <span id="reg-name-error" className="form-error">
                {errors.name}
              </span>
            )}
          </div>

          <div className="form-group mb-3">
            <label htmlFor="reg-email" className="form-label">
              Email address <span className="req">*</span>
            </label>
            <input
              id="reg-email"
              type="email"
              autoComplete="email"
              className={`form-input${errors.email ? ' is-invalid' : ''}`}
              value={form.email}
              onChange={(event) => setField('email', event.target.value)}
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'reg-email-error' : undefined}
            />
            {errors.email && (
              <span id="reg-email-error" className="form-error">
                {errors.email}
              </span>
            )}
          </div>

          <div className="form-group mb-3">
            <label htmlFor="reg-password" className="form-label">
              Password <span className="req">*</span>
            </label>
            <input
              id="reg-password"
              type="password"
              autoComplete="new-password"
              className={`form-input${errors.password ? ' is-invalid' : ''}`}
              value={form.password}
              onChange={(event) => setField('password', event.target.value)}
              placeholder="At least 8 characters"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'reg-password-error' : undefined}
            />
            {errors.password && (
              <span id="reg-password-error" className="form-error">
                {errors.password}
              </span>
            )}
          </div>

          <div className="form-group mb-3">
            <label htmlFor="reg-zone" className="form-label">
              Zone <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span>
            </label>
            <input
              id="reg-zone"
              type="text"
              autoComplete="off"
              className="form-input"
              value={form.zone}
              onChange={(event) => setField('zone', event.target.value)}
              placeholder="e.g. GRA Zone B"
            />
            <span className="form-hint">Shown when you report incidents so responders know your area.</span>
          </div>

          <div className="form-group mb-2">
            <label htmlFor="reg-phone" className="form-label">
              Phone <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span>
            </label>
            <input
              id="reg-phone"
              type="tel"
              autoComplete="tel"
              className={`form-input${errors.phone ? ' is-invalid' : ''}`}
              value={form.phone}
              onChange={(event) => setField('phone', event.target.value)}
              placeholder="e.g. 0803 123 4567"
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? 'reg-phone-error' : undefined}
            />
            {errors.phone && (
              <span id="reg-phone-error" className="form-error">
                {errors.phone}
              </span>
            )}
          </div>

          <button type="submit" className="btn btn--primary btn--block mt-3" disabled={pending}>
            {pending ? <Spinner light /> : 'Create Account'}
          </button>

          <div className="auth-alt">
            Already registered? <Link to="/login">Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  )
}