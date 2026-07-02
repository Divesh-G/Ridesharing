import { useEffect, useRef } from 'react'
import { updateRideLocation } from '../services/rideService'

const STEP = 0.0004 // roughly a believable per-second urban driving jitter
const TICK_MS = 1000

function step(location) {
  return {
    lat: location.lat + (Math.random() - 0.5) * STEP,
    lng: location.lng + (Math.random() - 0.5) * STEP,
  }
}

// Simulates a driver device pushing live GPS updates to the ride store once a
// second, since there's no real GPS source yet. Restarts from `startLocation`
// whenever `rideId` changes (a new ride shouldn't continue from wherever the
// last one ended), and always clears its interval on cleanup so no stray
// timer keeps writing after a ride ends, the driver goes offline, or the
// component unmounts.
export function useDriverSimulator(rideId, active, startLocation) {
  const locationRef = useRef(startLocation)
  const lastRideIdRef = useRef(rideId)

  if (lastRideIdRef.current !== rideId) {
    lastRideIdRef.current = rideId
    locationRef.current = startLocation
  }

  useEffect(() => {
    if (!active || !rideId) return undefined

    updateRideLocation(rideId, locationRef.current)

    const interval = setInterval(() => {
      locationRef.current = step(locationRef.current)
      updateRideLocation(rideId, locationRef.current)
    }, TICK_MS)

    return () => clearInterval(interval)
  }, [active, rideId])

  return locationRef
}
