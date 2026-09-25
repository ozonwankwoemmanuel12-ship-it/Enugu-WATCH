import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

export function PublicLayout() {
  const location = useLocation()
  const compact = location.pathname === '/login' || location.pathname === '/register'

  return (
    <div>
      <Navbar />
      <main id="main">
        <Outlet />
      </main>
      {!compact && <Footer />}
    </div>
  )
}