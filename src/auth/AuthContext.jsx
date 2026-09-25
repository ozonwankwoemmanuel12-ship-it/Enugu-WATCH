import { useCallback, useEffect, useMemo, useState } from 'react'
import { api, ApiError, setAuthToken, clearAuthToken } from '../lib/api.js'
import { AuthContext, VERIFY_ERROR } from './context.js'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [initializing, setInitializing] = useState(true)
  const [sessionError, setSessionError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function verify() {
      try {
        const data = await api.me()
        if (cancelled) return
        setUser(data.user)
        setSessionError(null)
      } catch (err) {
        if (cancelled) return
        if (err instanceof ApiError && err.status === 401) {
          clearAuthToken()
          setUser(null)
          setSessionError(null)
        } else {
          setUser(null)
          setSessionError(VERIFY_ERROR)
        }
      } finally {
        if (!cancelled) setInitializing(false)
      }
    }
    verify()
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (email, password) => {
    const data = await api.login({ email, password })
    setAuthToken(data.token)
    setUser(data.user)
    setSessionError(null)
    return data.user
  }, [])

  const register = useCallback(async (payload) => {
    const data = await api.register(payload)
    setAuthToken(data.token)
    setUser(data.user)
    setSessionError(null)
    return data.user
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.logout()
    } catch {
      // Best-effort server logout; local state is cleared regardless.
    }
    clearAuthToken()
    setUser(null)
    setSessionError(null)
  }, [])

  const updateUser = useCallback(async (payload) => {
    const data = await api.updateMe(payload)
    setUser((prev) => ({ ...(prev || {}), ...data.user }))
    return data.user
  }, [])

  const value = useMemo(
    () => ({
      user,
      initializing,
      sessionError,
      login,
      register,
      logout,
      updateUser,
    }),
    [user, initializing, sessionError, login, register, logout, updateUser],
  )

  if (initializing) {
    return (
      <div className="loading-block" role="status">
        <span className="spinner spinner--lg" />
        <span>Loading...</span>
      </div>
    )
  }

  if (sessionError === VERIFY_ERROR && !initializing) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div className="state" role="alert">
          <div className="state-title">We could not verify your session.</div>
          <div className="state-text">Check your connection, then try again. Your account information is safe.</div>
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}