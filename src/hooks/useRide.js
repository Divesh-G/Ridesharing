import { useEffect, useState } from 'react'
import { subscribeToRide } from '../services/rideService'

// Subscribes to a single ride by id and keeps it in sync in real time.
export function useRide(rideId) {
  const [ride, setRide] = useState(null)
  const [loading, setLoading] = useState(Boolean(rideId))

  useEffect(() => {
    if (!rideId) {
      setRide(null)
      setLoading(false)
      return
    }

    setLoading(true)
    const unsubscribe = subscribeToRide(rideId, (data) => {
      setRide(data)
      setLoading(false)
    })

    return unsubscribe
  }, [rideId])

  return { ride, loading }
}
