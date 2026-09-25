export function Spinner({ size = 'md', light = false }) {
  const cls = ['spinner', size === 'lg' ? 'spinner--lg' : '', light ? 'spinner--light' : '']
    .filter(Boolean)
    .join(' ')
  return (
    <span
      className={cls}
      role="status"
      aria-label="Loading"
      style={{ width: size === 'lg' ? 32 : 20, height: size === 'lg' ? 32 : 20 }}
    />
  )
}

export function LoadingBlock({ label = 'Loading...' }) {
  return (
    <div className="loading-block" role="status">
      <Spinner size="lg" />
      <span>{label}</span>
    </div>
  )
}

export function SkeletonGrid({ count = 6, type = 'card' }) {
  return (
    <div className={`grid grid--3${type === 'card' ? '' : ' grid--flat'}`} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`skeleton ${type === 'card' ? 'skeleton-card' : ''}`} />
      ))}
    </div>
  )
}

export function SkeletonRows({ count = 4 }) {
  return (
    <div className="stack" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height: 64 }} />
      ))}
    </div>
  )
}