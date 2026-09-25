import { Badge } from './Badge.jsx'
import { label, severityBadgeTone } from '../lib/constants.js'

export default function SeverityBadge({ severity }) {
  return (
    <Badge tone={severityBadgeTone(severity)} dot>
      {label(severity === 'emergency' ? 'emergency_severity' : severity)}
    </Badge>
  )
}