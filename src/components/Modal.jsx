import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Cross } from './icons.jsx'

export default function Modal({ open, onClose, title, children, actions, labelledBy }) {
  const panelRef = useRef(null)
  const titleId = labelledBy || 'modal-title'

  useEffect(() => {
    if (!open) return undefined
    const previous = document.activeElement
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    const focusTimer = setTimeout(() => {
      if (panelRef.current) {
        const focusable = panelRef.current.querySelector('button, [href], input, select, textarea')
        if (focusable) focusable.focus()
      }
    }, 0)
    return () => {
      clearTimeout(focusTimer)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      if (previous && typeof previous.focus === 'function') previous.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <div
        ref={panelRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="justify-between flex items-center mb-3">
          <h2 id={titleId} className="modal-title">
            {title}
          </h2>
          <button type="button" className="btn btn--ghost btn--sm" onClick={onClose} aria-label="Close dialog">
            <Cross width={16} height={16} />
          </button>
        </div>
        {children}
        {actions && <div className="modal-actions">{actions}</div>}
      </div>
    </div>,
    document.body,
  )
}