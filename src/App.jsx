import { Route, Routes } from 'react-router-dom'
import { PublicLayout } from './layouts/PublicLayout.jsx'
import AppLayout from './layouts/AppLayout.jsx'
import { ProtectedRoute } from './auth/ProtectedRoute.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Incidents from './pages/Incidents.jsx'
import IncidentDetail from './pages/IncidentDetail.jsx'
import ReportIncident from './pages/ReportIncident.jsx'
import Profile from './pages/Profile.jsx'
import Patrols from './pages/Patrols.jsx'
import Alerts from './pages/Alerts.jsx'
import NotFound from './pages/NotFound.jsx'

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="incidents" element={<Incidents />} />
        <Route path="incidents/:id" element={<IncidentDetail />} />
        <Route path="report" element={<ReportIncident />} />
        <Route path="profile" element={<Profile />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="patrols" element={<Patrols />} />
      </Route>
    </Routes>
  )
}

export default App