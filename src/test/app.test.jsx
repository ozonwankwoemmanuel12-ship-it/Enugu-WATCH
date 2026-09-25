import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../auth/AuthContext.jsx'
import App from '../App.jsx'
import { api, ApiError } from '../lib/api.js'

vi.mock('../lib/api.js', () => {
  const api = {
    stats: vi.fn(),
    register: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
    me: vi.fn(),
    updateMe: vi.fn(),
    incidents: vi.fn(),
    incident: vi.fn(),
    createIncident: vi.fn(),
    deleteIncident: vi.fn(),
    updateIncidentStatus: vi.fn(),
    upvoteIncident: vi.fn(),
    commentIncident: vi.fn(),
    patrols: vi.fn(),
    startPatrol: vi.fn(),
    checkpointPatrol: vi.fn(),
    endPatrol: vi.fn(),
    alerts: vi.fn(),
    createAlert: vi.fn(),
  }
  class ApiError extends Error {
    constructor(status, message) {
      super(message || String(status))
      this.status = status
    }
  }
  return {
    api,
    ApiError,
    setAuthToken: vi.fn(),
    getAuthToken: vi.fn(),
    clearAuthToken: vi.fn(),
    friendlyHttpError: vi.fn(),
  }
})

const user = {
  id: 'u-1',
  name: 'Ada Test',
  email: 'ada@example.com',
  role: 'resident',
  zone: 'Zone A',
  phone: null,
  createdAt: '2026-09-01T08:00:00.000Z',
}

const statsPayload = {
  success: true,
  data: {
    platform: 'Community Watch',
    timestamp: '2026-09-18T09:00:00.000Z',
    overview: {
      totalIncidentsReported: 16,
      resolvedIncidents: 2,
      inProgressIncidents: 3,
      resolutionRatePercentage: '13%',
      activePatrolShifts: 5,
      activeSafetyAlerts: 2,
      communityMembers: { registeredResidents: 43, activePatrolOfficers: 11 },
    },
    recentPublicNotices: [],
  },
}

const incident = {
  id: 'inc-1',
  title: 'Drainage cover missing on Agbani Road',
  description: 'Open drainage cover next to the market.',
  category: 'infrastructure',
  priority: 'high',
  status: 'open',
  location: { zone: 'Zone A', address: 'Agbani Road', latitude: 6.45, longitude: 7.5 },
  reportedBy: { name: 'Ada Test', userId: 'u-1' },
  assignedTo: null,
  upvotes: [],
  confirmationsCount: 0,
  comments: [],
  images: [],
  createdAt: '2026-09-18T08:00:00.000Z',
  updatedAt: '2026-09-18T08:00:00.000Z',
}

function renderApp(path = '/') {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </AuthProvider>,
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  api.me.mockRejectedValue(new ApiError(401, 'Unauthorized'))
  api.stats.mockResolvedValue(statsPayload)
  api.incidents.mockResolvedValue({ success: true, count: 1, incidents: [incident] })
  api.alerts.mockResolvedValue({ success: true, count: 0, alerts: [] })
})

describe('app smoke', () => {
  it('renders the landing page with real statistics', async () => {
    renderApp('/')
    const heading = await screen.findByRole('heading', { name: /Safer communities start with/ })
    expect(heading).toBeInTheDocument()
    expect(screen.getAllByText('Active incidents').length).toBeGreaterThan(0)
    expect((await screen.findAllByText('3')).length).toBeGreaterThan(0)
    expect(api.stats).toHaveBeenCalled()
  })

  it('shows fallback text for land/home stats when the stats request fails', async () => {
    api.stats.mockRejectedValue(new ApiError(500, 'Server error'))
    renderApp('/')
    expect(await screen.findByText(/Safety statistics currently unavailable\./)).toBeInTheDocument()
  })

  it('redirects an unauthenticated visitor from /app to /login', async () => {
    renderApp('/app')
    expect(await screen.findByRole('heading', { name: 'Welcome back' })).toBeInTheDocument()
    expect(api.incidents).not.toHaveBeenCalled()
  })

  it('renders the dashboard for an authenticated user', async () => {
    api.me.mockResolvedValue({ success: true, user })
    renderApp('/app')
    expect(await screen.findByText('Welcome, Ada')).toBeInTheDocument()
    expect(api.incidents).toHaveBeenCalled()
  })

  it('logs in and reaches the dashboard', async () => {
    api.login.mockResolvedValue({ success: true, message: 'ok', token: 'jwt-token', user })
    renderApp('/login')
    await userEvent.type(await screen.findByLabelText(/email/i), 'ada@example.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'secret')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))
    expect(await screen.findByText('Welcome, Ada')).toBeInTheDocument()
  })

  it('shows the login error banner on invalid credentials', async () => {
    api.login.mockRejectedValue(new ApiError(401, 'Invalid email or password'))
    renderApp('/login')
    await userEvent.type(await screen.findByLabelText(/email/i), 'ada@example.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'wrong')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))
    expect(await screen.findByText('Invalid email or password')).toBeInTheDocument()
  })

  it('renders the incident list page with one incident and its title', async () => {
    api.me.mockResolvedValue({ success: true, user })
    renderApp('/app/incidents')
    expect(await screen.findByText(incident.title)).toBeInTheDocument()
  })

  it('shows a structured 404 for unknown public routes', async () => {
    renderApp('/does-not-exist')
    expect(await screen.findByText('Page not found')).toBeInTheDocument()
  })

  it('sends the selected status filter to the incidents endpoint', async () => {
    api.me.mockResolvedValue({ success: true, user })
    renderApp('/app/incidents')
    await screen.findByText(incident.title)
    api.incidents.mockClear()
    await userEvent.selectOptions(await screen.findByLabelText('Status'), 'resolved')
    await waitFor(() => expect(api.incidents).toHaveBeenCalledWith({ status: 'resolved' }))
  })

  it('hides the Patrols navigation from residents', async () => {
    api.me.mockResolvedValue({ success: true, user })
    renderApp('/app')
    await screen.findByText('Welcome, Ada')
    expect(screen.queryByRole('link', { name: 'Patrols' })).not.toBeInTheDocument()
  })

  it('shows the Patrols navigation to patrol officers', async () => {
    api.me.mockResolvedValue({ success: true, user: { ...user, role: 'patrol_officer' } })
    api.patrols.mockResolvedValue({ success: true, count: 0, patrols: [] })
    renderApp('/app')
    await screen.findByText('Welcome, Ada')
    expect(await screen.findByRole('link', { name: 'Patrols' })).toBeInTheDocument()
  })
})