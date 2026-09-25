import { Badge } from './Badge.jsx'
import { label, statusBadgeTone } from '../lib/constants.js'

export default function StatusBadge({ status }) {
  return (
    <Badge tone={statusBadgeTone(status)} dot>
      {label(status)}
    </Badge>
  )
}