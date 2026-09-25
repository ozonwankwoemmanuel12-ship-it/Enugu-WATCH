export const INCIDENT_CATEGORIES = [
  'theft',
  'vandalism',
  'suspicious_activity',
  'hazard',
  'lost_and_found',
  'noise_complaint',
  'emergency',
  'other',
]

export const INCIDENT_PRIORITIES = ['low', 'medium', 'high', 'critical']

export const INCIDENT_STATUSES = ['reported', 'under_review', 'in_progress', 'resolved', 'dismissed']

export const PATROL_STATUSES = ['active', 'completed', 'scheduled']

export const ALERT_SEVERITIES = ['info', 'warning', 'critical', 'emergency']

export const ROLES = ['resident', 'patrol_officer', 'admin']

const LABELS = {
  theft: 'Theft',
  vandalism: 'Vandalism',
  suspicious_activity: 'Suspicious Activity',
  hazard: 'Hazard',
  lost_and_found: 'Lost & Found',
  noise_complaint: 'Noise Complaint',
  emergency: 'Emergency',
  other: 'Other',
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
  reported: 'Reported',
  under_review: 'Under Review',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  dismissed: 'Dismissed',
  active: 'Active',
  completed: 'Completed',
  scheduled: 'Scheduled',
  info: 'Info',
  warning: 'Warning',
  emergency_severity: 'Emergency',
  resident: 'Resident',
  patrol_officer: 'Patrol Officer',
  admin: 'Administrator',
  clear: 'Clear',
  issue_noted: 'Issue Noted',
  hazard_resolved: 'Hazard Resolved',
}

export function label(key) {
  if (!key) return 'Unknown'
  if (key === 'emergency') return LABELS.emergency
  return LABELS[key] || key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export const CATEGORY_LABELS = Object.fromEntries(INCIDENT_CATEGORIES.map((c) => [c, label(c)]))
export const PRIORITY_LABELS = Object.fromEntries(INCIDENT_PRIORITIES.map((p) => [p, label(p)]))
export const STATUS_LABELS = Object.fromEntries(INCIDENT_STATUSES.map((s) => [s, label(s)]))
export const SEVERITY_LABELS = Object.fromEntries(ALERT_SEVERITIES.map((s) => [s, s === 'emergency' ? 'Emergency' : label(s)]))
export const ROLE_LABELS = Object.fromEntries(ROLES.map((r) => [r, label(r)]))

export function priorityBadgeTone(priority) {
  switch (priority) {
    case 'low':
      return 'neutral'
    case 'medium':
      return 'blue'
    case 'high':
      return 'amber'
    case 'critical':
      return 'red'
    default:
      return 'neutral'
  }
}

export function statusBadgeTone(status) {
  switch (status) {
    case 'reported':
      return 'neutral'
    case 'under_review':
      return 'blue'
    case 'in_progress':
      return 'amber'
    case 'resolved':
      return 'green'
    case 'dismissed':
      return 'neutral'
    default:
      return 'neutral'
  }
}

export function severityBadgeTone(severity) {
  switch (severity) {
    case 'info':
      return 'blue'
    case 'warning':
      return 'amber'
    case 'critical':
      return 'critical'
    case 'emergency':
      return 'red'
    default:
      return 'neutral'
  }
}

export function severityColor(severity) {
  switch (severity) {
    case 'emergency':
      return '#dc2626'
    case 'critical':
      return '#ea580c'
    case 'warning':
      return '#d97706'
    default:
      return '#0284c7'
  }
}

export function categoryColor(category) {
  switch (category) {
    case 'emergency':
      return '#dc2626'
    case 'theft':
      return '#d97706'
    case 'suspicious_activity':
      return '#0284c7'
    case 'hazard':
      return '#ea580c'
    case 'vandalism':
      return '#7c3aed'
    case 'lost_and_found':
      return '#16a34a'
    case 'noise_complaint':
      return '#64748b'
    default:
      return '#2563eb'
  }
}

export const ALERT_SEVERITY_LABEL = {
  info: 'Info',
  warning: 'Warning',
  critical: 'Critical',
  emergency: 'Emergency',
}