export function Badge({ tone = 'neutral', dot = false, children }) {
  return (
    <span className={`badge badge--${tone}`}>
      {dot && <span className="dot" aria-hidden="true" />}
      {children}
    </span>
  )
}