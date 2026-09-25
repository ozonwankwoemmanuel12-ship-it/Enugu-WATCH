import { Badge } from './Badge.jsx'
import { label, priorityBadgeTone } from '../lib/constants.js'

export default function PriorityBadge({ priority }) {
  return (
    <Badge tone={priorityBadgeTone(priority)} dot>
      {label(priority)}
    </Badge>
  )
}