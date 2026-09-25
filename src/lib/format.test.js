import { describe, expect, it } from 'vitest'
import { compactNumber, formatDate, initials, timeAgo } from './format.js'

describe('format utils', () => {
  it('formats initials', () => {
    expect(initials('Ada Obi')).toBe('AO')
    expect(initials('chinedu okeke')).toBe('CO')
    expect(initials('')).toBe('?')
  })

  it('formats compact numbers', () => {
    expect(compactNumber(0)).toBe('0')
    expect(compactNumber(12)).toBe('12')
    expect(compactNumber(1000)).toBe('1k')
    expect(compactNumber(1284)).toBe('1.3k')
    expect(compactNumber(undefined)).toBe('0')
  })

  it('returns empty string for invalid dates', () => {
    expect(formatDate(null)).toBe('')
    expect(formatDate('not-a-date')).toBe('')
    expect(timeAgo(null)).toBe('')
  })

  it('renders relative time for the past', () => {
    const now = Date.now()
    expect(timeAgo(new Date(now).toISOString())).toBe('just now')
    expect(timeAgo(new Date(now - 5 * 60 * 1000).toISOString())).toBe('5 min ago')
    expect(timeAgo(new Date(now - 3 * 60 * 60 * 1000).toISOString())).toBe('3 hrs ago')
  })
})