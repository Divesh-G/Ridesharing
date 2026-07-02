import { useEffect, useRef, useState } from 'react'
import { subscribeToRidesByStatus } from '../services/rideService'
import { RIDE_STATES } from '../state/rideStateMachine'

function isSameRequest(a, b) {
  if (a === b) return true
  if (!a || !b) return false
  return (
    a.status === b.status &&
    a.rider === b.rider &&
    a.requestedAt === b.requestedAt &&
    a.pickup?.lat === b.pickup?.lat &&
    a.pickup?.lng === b.pickup?.lng &&
    a.dropoff?.lat === b.dropoff?.lat &&
    a.dropoff?.lng === b.dropoff?.lng
  )
}

// Listens only for SEARCHING rides (an indexed query, not the full rides
// table — see subscribeToRidesByStatus) and only while `enabled` (the driver
// is online with no ride already assigned), so the listener detaches the
// moment it isn't needed. Reuses previous request objects when their
// contents haven't changed, so React.memo'd request cards for unrelated
// rows don't re-render on every snapshot.
export function useIncomingRideRequests(enabled) {
  const [requests, setRequests] = useState([])
  const requestsRef = useRef([])

  useEffect(() => {
    if (!enabled) {
      requestsRef.current = []
      setRequests([])
      return undefined
    }

    const unsubscribe = subscribeToRidesByStatus(RIDE_STATES.SEARCHING, (rides) => {
      const previousById = new Map(requestsRef.current.map((request) => [request.id, request]))

      const next = Object.entries(rides)
        .map(([id, ride]) => {
          const candidate = { id, ...ride }
          const previous = previousById.get(id)
          return isSameRequest(previous, candidate) ? previous : candidate
        })
        .sort((a, b) => (a.requestedAt ?? 0) - (b.requestedAt ?? 0))

      requestsRef.current = next
      setRequests(next)
    })

    return unsubscribe
  }, [enabled])

  return requests
}
