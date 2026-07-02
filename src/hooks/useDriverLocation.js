import { useEffect, useRef, useState } from 'react'
import { subscribeToRide } from '../services/rideService'

function isSameLocation(a, b) {
  if (a === b) return true
  if (!a || !b) return false
  return a.lat === b.lat && a.lng === b.lng
}

// Subscribes to a ride's driver location and only updates state when the
// coordinates actually change, so unrelated field updates on the ride
// (status, etc.) don't trigger extra marker re-renders.
export function useDriverLocation(rideId) {
  const [location, setLocation] = useState(null)
  const lastLocation = useRef(null)

  useEffect(() => {
    if (!rideId) {
      lastLocation.current = null
      setLocation(null)
      return
    }

    const unsubscribe = subscribeToRide(rideId, (ride) => {
      const next = ride?.location ?? null
      if (!isSameLocation(lastLocation.current, next)) {
        lastLocation.current = next
        setLocation(next)
      }
    })

    return unsubscribe
  }, [rideId])

  return location
}
