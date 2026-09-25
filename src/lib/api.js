const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://1-community-watch-api.vercel.app/api/v1'
const TIMEOUT_MS = Number(import.meta.env.VITE_API_TIMEOUT_MS) || 15000

const TOKEN_KEY = 'community_watch_token'

let activeToken = null

export function setAuthToken(token) {
  activeToken = token
  if (token) {
    try {
      localStorage.setItem(TOKEN_KEY, token)
    } catch {
      // storage unavailable
    }
  } else {
    try {
      localStorage.removeItem(TOKEN_KEY)
    } catch {
      // storage unavailable
    }
  }
}

export function getAuthToken() {
  if (activeToken) return activeToken
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function clearAuthToken() {
  activeToken = null
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch {
    // storage unavailable
  }
}

export function friendlyHttpError(status) {
  if (!status) {
    return 'We could not reach the safety service. Check your connection and try again.'
  }
  switch (status) {
    case 400:
    case 422:
      return 'Please check your information and try again.'
    case 401:
      return 'Your session has expired. Please sign in again.'
    case 403:
      return "You don't have permission to perform this action."
    case 404:
      return 'We could not find what you were looking for.'
    case 409:
      return 'This action conflicts with existing data. Please review and try again.'
    case 429:
      return 'You are making requests too quickly. Please wait a moment and try again.'
    case 500:
    case 502:
    case 503:
      return 'The safety service is temporarily unavailable. Please try again shortly.'
    default:
      return 'Something went wrong. Please try again.'
  }
}

export class ApiError extends Error {
  constructor(status, message) {
    super(message || friendlyHttpError(status))
    this.status = status
    this.name = 'ApiError'
  }
}

async function request(path, { method = 'GET', body, params } = {}) {
  const headers = {}
  const token = getAuthToken()
  if (token) headers.Authorization = `Bearer ${token}`
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  let url = `${BASE_URL}${path}`
  if (params) {
    const qs = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') qs.set(key, value)
    })
    const query = qs.toString()
    if (query) url += `?${query}`
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  let res
  try {
    res = await fetch(url, {
      method,
      headers,
      signal: controller.signal,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new ApiError(null, 'The safety service took too long to respond. Please try again.')
    }
    throw new ApiError(null, 'We could not reach the safety service. Check your connection and try again.')
  } finally {
    clearTimeout(timer)
  }

  if (!res.ok) {
    throw new ApiError(res.status)
  }

  if (res.status === 204) return null
  const data = await res.json()
  return data
}

export const api = {
  stats: () => request('/public/stats'),

  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  me: () => request('/auth/me'),
  updateMe: (payload) => request('/auth/me', { method: 'PATCH', body: payload }),

  incidents: (params) => request('/incidents', { params }),
  incident: (id) => request(`/incidents/${id}`),
  createIncident: (payload) => request('/incidents', { method: 'POST', body: payload }),
  deleteIncident: (id) => request(`/incidents/${id}`, { method: 'DELETE' }),
  updateIncidentStatus: (id, payload) => request(`/incidents/${id}/status`, { method: 'PATCH', body: payload }),
  upvoteIncident: (id) => request(`/incidents/${id}/upvote`, { method: 'POST', body: {} }),
  commentIncident: (id, message) => request(`/incidents/${id}/comments`, { method: 'POST', body: { message } }),

  patrols: (params) => request('/patrols', { params }),
  startPatrol: (payload) => request('/patrols/start', { method: 'POST', body: payload }),
  checkpointPatrol: (id, payload) => request(`/patrols/${id}/checkpoint`, { method: 'POST', body: payload }),
  endPatrol: (id, payload) => request(`/patrols/${id}/end`, { method: 'POST', body: payload }),

  alerts: (params) => request('/alerts', { params }),
  createAlert: (payload) => request('/alerts', { method: 'POST', body: payload }),
}