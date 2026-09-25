import { Inbox } from './icons.jsx'

export default function EmptyState({ title = 'Nothing here yet', text, action }) {
  return (
    <div className="state">
      <span className="state-ic" aria-hidden="true">
        <Inbox width={28} height={28} />
      </span>
      <div>
        <div className="state-title">{title}</div>
        {text && <div className="state-text mt-1">{text}</div>}
      </div>
      {action}
    </div>
  )
}