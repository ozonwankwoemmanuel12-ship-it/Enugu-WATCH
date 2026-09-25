import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../lib/api.js'
import { INCIDENT_CATEGORIES, INCIDENT_PRIORITIES, CATEGORY_LABELS, PRIORITY_LABELS } from '../lib/constants.js'
import { Spinner } from '../components/LoadingState.jsx'
import { Check } from '../components/icons.jsx'

export default function ReportIncident() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const presetCategory = searchParams.get('category') || ''
  const presetPriority = searchParams.get('priority') || ''

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: presetCategory,
    priority: presetPriority,
    zone: '',
    address: '',
  })
  const [errors, setErrors] = useState({})
  const [pending, setPending] = useState(false)
  const [serverError, setServerError] = useState(null)
  const [success, setSuccess] = useState(null)

  function setField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function validate() {
    const next = {}
    if (form.title.trim().length < 3) next.title = 'Give the incident a short, clear title.'
    if (form.description.trim().length < 10) next.description = 'Describe what you observed (at least 10 characters).'
    if (!form.category) next.category = 'Choose a category.'
    if (!form.priority) next.priority = 'Choose a priority.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setServerError(null)
    setSuccess(null)
    if (pending) return
    if (!validate()) return
    setPending(true)
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        priority: form.priority,
      }
      if (form.zone.trim() || form.address.trim()) {
        payload.location = {
          address: form.address.trim() || undefined,
          zone: form.zone.trim() || undefined,
        }
      }
      const data = await api.createIncident(payload)
      setSuccess('Incident reported. Thank you for helping your community.')
      setTimeout(() => {
        navigate(`/app/incidents/${data.incident.id}`, { replace: true })
      }, 1400)
    } catch (err) {
      setServerError(err.message)
    } finally {
      setPending(false)
    }
  }

  const isEmergency = form.category === 'emergency' || form.priority === 'critical'

  return (
    <div style={{ maxWidth: 720 }}>
      <div className="page-head">
        <div>
          <h1 className="page-title">Report an Incident</h1>
          <p className="page-sub">Submit a structured report with the information you have observed.</p>
        </div>
      </div>

      {isEmergency && (
        <div className="alert-banner alert-banner--error" role="alert">
          <strong>Emergency report:</strong> only file this as an emergency if immediate danger is present. Always
          contact the relevant authorities first.
        </div>
      )}

      {success && (
        <div className="alert-banner alert-banner--success fade-up" role="status">
          <span className="flex items-center gap-2">
            <Check width={18} height={18} />
            {success} Redirecting to the incident...
          </span>
        </div>
      )}

      {serverError && (
        <div className="alert-banner alert-banner--error" role="alert">
          {serverError}
        </div>
      )}

      <form className="detail-panel" onSubmit={handleSubmit} noValidate>
        <div className="form-group mb-3">
          <label htmlFor="inc-title" className="form-label">
            Title <span className="req">*</span>
          </label>
          <input
            id="inc-title"
            type="text"
            className={`form-input${errors.title ? ' is-invalid' : ''}`}
            value={form.title}
            onChange={(event) => setField('title', event.target.value)}
            placeholder="e.g. Suspicious vehicle near the market"
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? 'inc-title-error' : undefined}
            disabled={pending}
          />
          {errors.title && (
            <span id="inc-title-error" className="form-error">
              {errors.title}
            </span>
          )}
        </div>

        <div className="form-group mb-3">
          <label htmlFor="inc-desc" className="form-label">
            Description <span className="req">*</span>
          </label>
          <textarea
            id="inc-desc"
            className={`form-textarea${errors.description ? ' is-invalid' : ''}`}
            value={form.description}
            onChange={(event) => setField('description', event.target.value)}
            placeholder="What did you observe? Time, people involved, and any relevant detail."
            aria-invalid={!!errors.description}
            aria-describedby={errors.description ? 'inc-desc-error' : undefined}
            disabled={pending}
          />
          {errors.description && (
            <span id="inc-desc-error" className="form-error">
              {errors.description}
            </span>
          )}
        </div>

        <div className="grid grid--2" style={{ gap: 16 }}>
          <div className="form-group mb-3">
            <label htmlFor="inc-category" className="form-label">
              Category <span className="req">*</span>
            </label>
            <select
              id="inc-category"
              className={`form-select${errors.category ? ' is-invalid' : ''}`}
              value={form.category}
              onChange={(event) => setField('category', event.target.value)}
              aria-invalid={!!errors.category}
              aria-describedby={errors.category ? 'inc-category-error' : undefined}
              disabled={pending}
            >
              <option value="">Select a category</option>
              {INCIDENT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
            {errors.category && (
              <span id="inc-category-error" className="form-error">
                {errors.category}
              </span>
            )}
          </div>

          <div className="form-group mb-3">
            <label htmlFor="inc-priority" className="form-label">
              Priority <span className="req">*</span>
            </label>
            <select
              id="inc-priority"
              className={`form-select${errors.priority ? ' is-invalid' : ''}`}
              value={form.priority}
              onChange={(event) => setField('priority', event.target.value)}
              aria-invalid={!!errors.priority}
              aria-describedby={errors.priority ? 'inc-priority-error' : undefined}
              disabled={pending}
            >
              <option value="">Select priority</option>
              {INCIDENT_PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {PRIORITY_LABELS[p]}
                </option>
              ))}
            </select>
            {errors.priority && (
              <span id="inc-priority-error" className="form-error">
                {errors.priority}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid--2" style={{ gap: 16 }}>
          <div className="form-group mb-3">
            <label htmlFor="inc-zone" className="form-label">
              Zone <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span>
            </label>
            <input
              id="inc-zone"
              type="text"
              className="form-input"
              value={form.zone}
              onChange={(event) => setField('zone', event.target.value)}
              placeholder="e.g. GRA Zone B"
              autoComplete="off"
              disabled={pending}
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="inc-address" className="form-label">
              Address <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span>
            </label>
            <input
              id="inc-address"
              type="text"
              className="form-input"
              value={form.address}
              onChange={(event) => setField('address', event.target.value)}
              placeholder="e.g. 12 Market Road"
              autoComplete="off"
              disabled={pending}
            />
          </div>
        </div>

        <button type="submit" className="btn btn--primary" disabled={pending}>
          {pending ? <Spinner light /> : 'Submit Incident Report'}
        </button>
      </form>
    </div>
  )
}