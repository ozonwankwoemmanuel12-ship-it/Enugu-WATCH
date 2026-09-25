import { useEffect, useState } from 'react'

export function useDebouncedValue(value, delay = 400) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

export function formatZone(zone) {
  if (!zone) return 'Unspecified zone'
  return zone.replace(/_/g, ' ')
}