import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Cross, Menu } from './icons.jsx'

const LINKS = [
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Features', href: '/#features' },
  { label: 'Safety', href: '/#safety' },
  { label: 'Resources', href: '/#resources' },
]

export default function Navbar() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  const onHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname, location.hash])

  const cls = ['navbar', onHome ? 'navbar--transparent' : '', scrolled ? 'navbar--scrolled' : '']
    .filter(Boolean)
    .join(' ')

  return (
    <header className={cls}>
      <div className="container navbar-inner">
        <Link to="/" className="brand" aria-label="Community Watch home">
          <img src="/shield.svg" alt="" width="34" height="34" />
          <span className="brand-name">COMMUNITY WATCH</span>
        </Link>

        <nav className="navbar-links" aria-label="Primary">
          {LINKS.map((link) => (
            <Link key={link.href} to={link.href} className="navbar-link">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="navbar-actions">
          <Link to="/login" className="navbar-link">
            Log In
          </Link>
          <Link to="/register" className="btn btn--primary btn--sm">
            Get Started
          </Link>
          <button
            type="button"
            className="navbar-toggle"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Open navigation menu"
          >
            {open ? <Cross width={20} height={20} /> : <Menu width={20} height={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" className="mobile-menu" aria-label="Mobile">
          {LINKS.map((link) => (
            <Link key={link.href} to={link.href} className="navbar-link">
              {link.label}
            </Link>
          ))}
          <Link to="/login" className="btn btn--ghost btn--block">
            Log In
          </Link>
          <Link to="/register" className="btn btn--primary btn--block">
            Get Started
          </Link>
        </nav>
      )}
    </header>
  )
}