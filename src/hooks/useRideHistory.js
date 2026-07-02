import { useCallback, useEffect, useState } from 'react'
import { fetchRideHistory } from '../api/rides'

// Fetches saved ride history from the API and exposes loading/error state
// plus a `reload` escape hatch for a retry button.
export function useRideHistory() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const reload = useCallback(() => {
    setLoading(true)
    setError(null)

    fetchRideHistory()
      .then(setEntries)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  return { entries, loading, error, reload }
}
