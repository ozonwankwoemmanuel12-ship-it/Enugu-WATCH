import { Alert } from './icons.jsx'

export default function ErrorState({ title = 'Something went wrong', text, onRetry, error }) {
  const detail = error?.message || text
  return (
    <div className="state" role="alert">
      <span className="state-ic" style={{ background: 'var(--red-soft)', color: 'var(--red)' }} aria-hidden="true">
        <Alert width={26} height={26} />
      </span>
      <div>
        <div className="state-title">{title}</div>
        {detail && <div className="state-text mt-1">{detail}</div>}
      </div>
      {onRetry && (
        <button type="button" className="btn btn--primary btn--sm" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  )
}