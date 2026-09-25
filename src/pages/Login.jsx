import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth.js'
import { ApiError } from '../lib/api.js'
import { Check } from '../components/icons.jsx'
import { Spinner } from '../components/LoadingState.jsx'

export default function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState(null)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    if (user) navigate('/app', { replace: true })
  }, [user, navigate])

  function validate() {
    const next = {}
    if (!email.trim()) next.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = 'Enter a valid email address.'
    if (!password) next.password = 'Password is required.'
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
      await login(email.trim(), password)
      navigate(location.state?.from || '/app', { replace: true })
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Login failed. Please try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="auth-panel">
      <div className="auth-panel-hero">
        <div className="auth-panel-hero-inner">
          <div className="eyebrow" style={{ borderColor: 'rgba(60,130,246,.4)' }}>
            Community Watch
          </div>
          <h2 style={{ color: '#f8fafc', fontSize: '2rem', fontWeight: 800, marginBottom: 16 }}>
            Sign in to keep your community safe.
          </h2>
          <p style={{ color: '#94a3b8', marginBottom: 28 }}>
            Report incidents, follow verified alerts and coordinate response through one trusted platform.
          </p>
          {['Structured incident reports', 'Verified safety alerts', 'Role-based community access'].map((item) => (
            <div className="hero-check" key={item}>
              <Check width={18} height={18} />
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="auth-panel-form">
        <form className="auth-card" onSubmit={handleSubmit} noValidate>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-sub">Sign in to your Community Watch account.</p>

          {formError && (
            <div className="alert-banner alert-banner--error" role="alert">
              {formError}
            </div>
          )}

          <div className="form-group mb-3">
            <label htmlFor="login-email" className="form-label">
              Email address
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              className={`form-input${errors.email ? ' is-invalid' : ''}`}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'login-email-error' : undefined}
            />
            {errors.email && (
              <span id="login-email-error" className="form-error">
                {errors.email}
              </span>
            )}
          </div>

          <div className="form-group mb-2">
            <label htmlFor="login-password" className="form-label">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              className={`form-input${errors.password ? ' is-invalid' : ''}`}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Your password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'login-password-error' : undefined}
            />
            {errors.password && (
              <span id="login-password-error" className="form-error">
                {errors.password}
              </span>
            )}
          </div>

          <button type="submit" className="btn btn--primary btn--block mt-3" disabled={pending}>
            {pending ? <Spinner light /> : 'Sign In'}
          </button>

          <div className="auth-alt">
            New to Community Watch?{' '}
            <Link to="/register">Create an account</Link>
          </div>
        </form>
      </div>
    </div>
  )
}