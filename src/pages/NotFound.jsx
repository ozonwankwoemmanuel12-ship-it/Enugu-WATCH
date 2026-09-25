import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container" style={{ paddingTop: 120, paddingBottom: 120, textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: '5rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--primary)' }}>
        404
      </div>
      <h1 className="section-title" style={{ marginBottom: 10 }}>
        Page not found
      </h1>
      <p className="muted mb-4" style={{ maxWidth: 420 }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="row" style={{ justifyContent: 'center' }}>
        <Link to="/" className="btn btn--primary">
          Back to Home
        </Link>
        <Link to="/app" className="btn btn--ghost">
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}