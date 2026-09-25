import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth.js'
import {
  Bell,
  Clipboard,
  Home,
  LogOut,
  Menu,
  Plus,
  Siren,
  User,
} from '../components/icons.jsx'
import { initials } from '../lib/format.js'
import { ROLE_LABELS } from '../lib/constants.js'

function NavItem({ to, icon: Icon, label, end }) {
  return (
    <NavLink to={to} end={end} className={({ isActive }) => `app-link${isActive ? ' active' : ''}`}>
      <Icon width={18} height={18} />
      <span>{label}</span>
    </NavLink>
  )
}

export default function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  const canPatrol = user.role === 'patrol_officer' || user.role === 'admin'
  const canBroadcast = user.role === 'admin'

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <div className="app-shell">
      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}

      <aside className={`app-sidebar${sidebarOpen ? ' open' : ''}`} aria-label="Application navigation">
        <div className="app-brand">
          <img src="/shield.svg" alt="" width="32" height="32" />
          <span>Community Watch</span>
        </div>

        <nav className="app-nav">
          <div className="app-nav-group">Overview</div>
          <NavItem to="/app" icon={Home} label="Dashboard" end />
          <NavItem to="/app/incidents" icon={Clipboard} label="Incidents" />
          <NavItem to="/app/alerts" icon={Bell} label="Alerts" />

          {(canPatrol || canBroadcast) && <div className="app-nav-group">Operations</div>}
          {canPatrol && <NavItem to="/app/patrols" icon={Siren} label="Patrols" />}

          <div className="app-nav-group">Account</div>
          <NavItem to="/app/profile" icon={User} label="Profile" />

          <div className="mt-4">
            <Link
              to="/app/report?priority=critical&category=emergency"
              className="btn btn--danger btn--block"
              style={{ justifyContent: 'flex-start' }}
            >
              <Siren width={18} height={18} />
              Emergency Report
            </Link>
          </div>
        </nav>

        <div className="app-sidebar-user">
          <span className="avatar">{initials(user.name)}</span>
          <div className="app-user-meta">
            <div className="app-user-name">{user.name}</div>
            <div className="app-user-role">{ROLE_LABELS[user.role] || user.role}</div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="btn btn--ghost-dark btn--sm"
            aria-label="Log out"
            title="Log out"
          >
            <LogOut width={16} height={16} />
          </button>
        </div>
      </aside>

      <div className="app-main">
        <header className="app-topbar">
          <div className="app-topbar-inner">
            <button
              type="button"
              className="navbar-toggle"
              style={{ display: 'inline-flex' }}
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label="Open navigation menu"
            >
              <Menu width={20} height={20} />
            </button>
            <span className="zone-chip" style={{ textTransform: 'none' }}>
              Zone: {user.zone || 'Unspecified'}
            </span>
            <div className="flex-1" />
            <Link to="/app/report" className="btn btn--primary btn--sm">
              <Plus width={16} height={16} />
              Report
            </Link>
            <span className="avatar" aria-hidden="true">
              {initials(user.name)}
            </span>
          </div>
        </header>

        <main className="app-content" id="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}