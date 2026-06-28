import { useEffect, useState } from 'react'
import { subscribeToRides } from '../firebase/rideService'

// Subscribes to the full rides collection and keeps it in sync in real time.
export function useRides() {
  const [rides, setRides] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToRides((data) => {
      setRides(data)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  return { rides, loading }
}
