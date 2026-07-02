import { useEffect, useRef } from 'react'
import { updateRideLocation } from '../firebase/rideService'

const STEP = 0.0015 // roughly 150m per tick
const TICK_MS = 2000

function step(location) {
  return {
    lat: location.lat + (Math.random() - 0.5) * STEP,
    lng: location.lng + (Math.random() - 0.5) * STEP,
  }
}

// Simulates a driver's device pushing live GPS updates to Firebase, since
// there is no real driver app yet. Pushes an update immediately and then on
// a fixed interval while `active` is true.
export function useDriverSimulator(rideId, active, startLocation) {
  const locationRef = useRef(startLocation)

  useEffect(() => {
    if (!active || !rideId) return undefined

    locationRef.current = locationRef.current ?? startLocation
    updateRideLocation(rideId, locationRef.current)

    const interval = setInterval(() => {
      locationRef.current = step(locationRef.current)
      updateRideLocation(rideId, locationRef.current)
    }, TICK_MS)

    return () => clearInterval(interval)
  }, [active, rideId])
}
