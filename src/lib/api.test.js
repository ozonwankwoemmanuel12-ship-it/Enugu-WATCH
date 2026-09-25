import { describe, expect, it } from 'vitest'
import { ApiError, friendlyHttpError } from './api.js'

describe('friendlyHttpError', () => {
  it('maps common HTTP status codes to friendly messages', () => {
    expect(friendlyHttpError(401)).toContain('session has expired')
    expect(friendlyHttpError(403)).toContain("don't have permission")
    expect(friendlyHttpError(404)).toContain('could not find')
    expect(friendlyHttpError(429)).toContain('too quickly')
    expect(friendlyHttpError(500)).toContain('temporarily unavailable')
    expect(friendlyHttpError(503)).toContain('temporarily unavailable')
  })

  it('never exposes raw status text', () => {
    const message = friendlyHttpError(500)
    expect(message).not.toMatch(/Internal Server Error/)
  })

  it('handles network failures', () => {
    expect(friendlyHttpError(null)).toContain('could not reach')
  })
})

describe('ApiError', () => {
  it('carries status and a friendly message', () => {
    const error = new ApiError(404)
    expect(error.status).toBe(404)
    expect(error.message).toContain('could not find')
    expect(error instanceof Error).toBe(true)
  })

  it('prefers an explicit message', () => {
    const error = new ApiError(400, 'Please check your information and try again.')
    expect(error.message).toBe('Please check your information and try again.')
  })
})