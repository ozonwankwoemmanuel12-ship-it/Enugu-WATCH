import { describe, expect, it } from 'vitest'
import {
  CATEGORY_LABELS,
  PRIORITY_LABELS,
  STATUS_LABELS,
  SEVERITY_LABELS,
  ROLE_LABELS,
  priorityBadgeTone,
  statusBadgeTone,
  severityBadgeTone,
  severityColor,
  categoryColor,
  label,
  INCIDENT_CATEGORIES,
  INCIDENT_PRIORITIES,
  INCIDENT_STATUSES,
  ALERT_SEVERITIES,
} from './constants.js'

describe('constants', () => {
  it('exposes every category with a human label', () => {
    INCIDENT_CATEGORIES.forEach((category) => {
      expect(CATEGORY_LABELS[category]).toBeTruthy()
    })
  })

  it('exposes priority, status and severity labels', () => {
    INCIDENT_PRIORITIES.forEach((p) => expect(PRIORITY_LABELS[p]).toBeTruthy())
    INCIDENT_STATUSES.forEach((s) => expect(STATUS_LABELS[s]).toBeTruthy())
    ALERT_SEVERITIES.forEach((s) => expect(SEVERITY_LABELS[s]).toBeTruthy())
    expect(ROLE_LABELS.resident).toBe('Resident')
    expect(ROLE_LABELS.patrol_officer).toBe('Patrol Officer')
    expect(ROLE_LABELS.admin).toBe('Administrator')
  })

  it('maps emergency severity to its distinct label', () => {
    expect(SEVERITY_LABELS.emergency).toBe('Emergency')
  })

  it('keeps priority color semantics consistent', () => {
    expect(priorityBadgeTone('critical')).toBe('red')
    expect(priorityBadgeTone('high')).toBe('amber')
    expect(priorityBadgeTone('medium')).toBe('blue')
    expect(priorityBadgeTone('low')).toBe('neutral')
  })

  it('keeps status color semantics consistent', () => {
    expect(statusBadgeTone('resolved')).toBe('green')
    expect(statusBadgeTone('in_progress')).toBe('amber')
    expect(statusBadgeTone('under_review')).toBe('blue')
    expect(statusBadgeTone('dismissed')).toBe('neutral')
  })

  it('keeps alert severity colors consistent and distinguishable', () => {
    expect(severityBadgeTone('emergency')).toBe('red')
    expect(severityBadgeTone('critical')).toBe('critical')
    expect(severityBadgeTone('warning')).toBe('amber')
    expect(severityBadgeTone('info')).toBe('blue')
    const colors = ALERT_SEVERITIES.map(severityColor)
    expect(new Set(colors).size).toBe(ALERT_SEVERITIES.length)
  })

  it('does not rely on color alone: every severity has a label', () => {
    ALERT_SEVERITIES.forEach((s) => {
      expect(SEVERITY_LABELS[s]).toBeTruthy()
      expect(severityColor(s)).toMatch(/^#/)
    })
  })

  it('labels unknown values safely', () => {
    expect(label('unknown_thing')).toBe('Unknown Thing')
    expect(label()).toBe('Unknown')
  })

  it('provides category colors for every category', () => {
    INCIDENT_CATEGORIES.forEach((category) => {
      expect(categoryColor(category)).toMatch(/^#/)
    })
  })
})