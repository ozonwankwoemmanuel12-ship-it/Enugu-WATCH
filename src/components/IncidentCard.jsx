import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge.jsx'
import PriorityBadge from './PriorityBadge.jsx'
import { CategoryIcon } from './CategoryIcon.jsx'
import { Message, MapPin, ThumbsUp, Clock } from './icons.jsx'
import { label } from '../lib/constants.js'
import { timeAgo } from '../lib/format.js'

function Location({ location }) {
  const parts = []
  if (location?.address) parts.push(location.address)
  if (location?.zone) parts.push(location.zone)
  return parts.length > 0 ? parts.join(' · ') : 'Location not provided'
}

export default function IncidentCard({ incident, showReporter = true }) {
  const link = `/app/incidents/${incident.id}`
  const upvotes = Array.isArray(incident.upvotes) ? incident.upvotes.length : Number(incident.upvotes || 0)
  const comments = Array.isArray(incident.comments) ? incident.comments.length : Number(incident.comments || 0)

  return (
    <article className="incident-card">
      <div className="flex items-center gap-2 flex-wrap">
        <CategoryIcon category={incident.category} size={34} />
        <div className="flex-1" style={{ minWidth: 0 }}>
          <div className="incident-card-title">
            <Link to={link}>{incident.title}</Link>
          </div>
        </div>
      </div>

      <div className="incident-meta">
        <PriorityBadge priority={incident.priority} />
        <StatusBadge status={incident.status} />
      </div>

      {incident.description && <p className="incident-desc">{incident.description}</p>}

      <div className="flex items-center gap-2 flex-wrap" style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
        <span className="incident-stat">
          <MapPin width={14} height={14} />
          <span>
            <Location location={incident.location} />
          </span>
        </span>
        <span className="incident-stat">
          <Clock width={14} height={14} />
          <span>{timeAgo(incident.createdAt)}</span>
        </span>
      </div>

      <div className="incident-footer">
        <div className="flex items-center gap-3">
          <span className="incident-stat">
            <ThumbsUp width={15} height={15} />
            {upvotes}
          </span>
          <span className="incident-stat">
            <Message width={15} height={15} />
            {comments}
          </span>
        </div>
        {showReporter && incident.reportedBy?.name && (
          <span className="incident-stat" style={{ maxWidth: '45%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {label('reporter')} {incident.reportedBy.name}
          </span>
        )}
      </div>
    </article>
  )
}

export { Location as IncidentLocationText }