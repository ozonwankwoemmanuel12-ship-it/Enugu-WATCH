import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api.js'
import { INCIDENT_CATEGORIES, INCIDENT_PRIORITIES, INCIDENT_STATUSES, CATEGORY_LABELS, PRIORITY_LABELS, STATUS_LABELS } from '../lib/constants.js'
import { useDebouncedValue } from '../lib/hooks.js'
import IncidentCard from '../components/IncidentCard.jsx'
import EmptyState from '../components/EmptyState.jsx'
import ErrorState from '../components/ErrorState.jsx'
import { SkeletonGrid } from '../components/LoadingState.jsx'
import { Plus, Search } from '../components/icons.jsx'

const ALL = 'all'

export default function Incidents() {
  const [incidents, setIncidents] = useState([])
  const [count, setCount] = useState(0)
  const [state, setState] = useState('loading')
  const [error, setError] = useState(null)

  const [filters, setFilters] = useState({
    status: ALL,
    category: ALL,
    priority: ALL,
    zone: '',
    search: '',
  })
  const debouncedSearch = useDebouncedValue(filters.search, 400)

  const runQuery = useCallback(async () => {
    setState('loading')
    setError(null)
    try {
      const params = {}
      if (filters.status !== ALL) params.status = filters.status
      if (filters.category !== ALL) params.category = filters.category
      if (filters.priority !== ALL) params.priority = filters.priority
      if (filters.zone.trim()) params.zone = filters.zone.trim()
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim()
      const data = await api.incidents(params)
      setIncidents(data.incidents || [])
      setCount(data.count ?? (data.incidents || []).length)
      setState('ready')
    } catch (err) {
      setError(err)
      setState('error')
    }
  }, [filters.status, filters.category, filters.priority, filters.zone, debouncedSearch])

  useEffect(() => {
    runQuery()
  }, [runQuery])

  function setFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  function clearFilters() {
    setFilters({ status: ALL, category: ALL, priority: ALL, zone: '', search: '' })
  }

  const hasActiveFilters =
    filters.status !== ALL ||
    filters.category !== ALL ||
    filters.priority !== ALL ||
    Boolean(filters.zone.trim()) ||
    Boolean(debouncedSearch.trim())

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Incidents</h1>
          <p className="page-sub">
            Reported and verified incidents across your community.
            {state === 'ready' && ` ${count} result${count === 1 ? '' : 's'}.`}
          </p>
        </div>
        <div className="page-actions">
          <Link to="/app/report" className="btn btn--primary">
            <Plus width={17} height={17} />
            Report
          </Link>
        </div>
      </div>

      <div className="filters" role="group" aria-label="Filter incidents">
        <div className="filter-field">
          <label htmlFor="filter-status" className="sr-only">Status</label>
          <select
            id="filter-status"
            value={filters.status}
            onChange={(event) => setFilter('status', event.target.value)}
          >
            <option value={ALL}>All statuses</option>
            {INCIDENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-field">
          <label htmlFor="filter-category" className="sr-only">Category</label>
          <select
            id="filter-category"
            value={filters.category}
            onChange={(event) => setFilter('category', event.target.value)}
          >
            <option value={ALL}>All categories</option>
            {INCIDENT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-field">
          <label htmlFor="filter-priority" className="sr-only">Priority</label>
          <select
            id="filter-priority"
            value={filters.priority}
            onChange={(event) => setFilter('priority', event.target.value)}
          >
            <option value={ALL}>All priorities</option>
            {INCIDENT_PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {PRIORITY_LABELS[p]}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-field">
          <label htmlFor="filter-zone" className="sr-only">Zone</label>
          <input
            id="filter-zone"
            type="text"
            value={filters.zone}
            onChange={(event) => setFilter('zone', event.target.value)}
            placeholder="Filter by zone"
            autoComplete="off"
          />
        </div>
        <div className="filter-field flex-1" style={{ minWidth: 220 }}>
          <label htmlFor="filter-search" className="sr-only">Search incidents</label>
          <input
            id="filter-search"
            type="search"
            value={filters.search}
            onChange={(event) => setFilter('search', event.target.value)}
            placeholder="Search incidents..."
            autoComplete="off"
            style={{ paddingLeft: 36 }}
          />
          <Search
            width={16}
            height={16}
            style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-faint)', pointerEvents: 'none' }}
          />
        </div>
        {hasActiveFilters && (
          <button type="button" className="btn btn--ghost btn--sm" onClick={clearFilters}>
            Clear filters
          </button>
        )}
      </div>

      {state === 'loading' && <SkeletonGrid count={6} />}

      {state === 'error' && (
        <div className="card">
          <ErrorState
            title="We couldn't load incidents."
            error={error}
            onRetry={runQuery}
          />
        </div>
      )}

      {state === 'ready' && (
        <>
          {incidents.length === 0 ? (
            <EmptyState
              title="No incidents found"
              text={
                hasActiveFilters
                  ? 'Your community has no reported incidents matching these filters.'
                  : 'Your community has no reported incidents yet.'
              }
              action={
                hasActiveFilters ? (
                  <button type="button" className="btn btn--ghost btn--sm" onClick={clearFilters}>
                    Clear filters
                  </button>
                ) : (
                  <Link to="/app/report" className="btn btn--primary btn--sm">
                    Report an incident
                  </Link>
                )
              }
            />
          ) : (
            <div className="grid grid--3">
              {incidents.map((incident) => (
                <IncidentCard key={incident.id} incident={incident} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}