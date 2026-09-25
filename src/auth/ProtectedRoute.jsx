import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './useAuth.js'

export function ProtectedRoute({ roles, children }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/app" replace />
  }

  return children
}