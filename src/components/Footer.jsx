import { Link } from 'react-router-dom'

const PRODUCT = [
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Features', href: '/#features' },
  { label: 'Safety Dashboard', href: '/#safety' },
]

const RESOURCES = [
  { label: 'Safety Resources', href: '/#resources' },
  { label: 'Report an Incident', href: '/app/incidents' },
  { label: 'Recent Safety Alerts', href: '/app/alerts' },
  { label: 'Get Started', href: '/register' },
]

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <img src="/shield.svg" alt="" width="32" height="32" />
              COMMUNITY WATCH
            </div>
            <p className="footer-desc">
              A structured safety and incident-management layer for Nigerian communities. See it. Report it. Verify it.
              Act together.
            </p>
          </div>
          <div>
            <div className="footer-heading">Product</div>
            <ul className="footer-links">
              {PRODUCT.map((item) => (
                <li key={item.href}>
                  <Link to={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="footer-heading">Resources</div>
            <ul className="footer-links">
              {RESOURCES.map((item) => (
                <li key={item.href}>
                  <Link to={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {year} Community Watch</span>
          <span>Built for communities across Nigeria.</span>
        </div>
      </div>
    </footer>
  )
}