import { useEffect, useRef } from 'react'
import { useRides } from './useRides'
import { saveRideToHistory } from '../api/rides'
import { isMockApiConfigured } from '../api/httpClient'
import { isTerminalState } from '../state/rideStateMachine'
import { markRideHistorySynced } from '../services/rideService'

// Watches every ride in the store and posts it to the history API exactly
// once, the moment it reaches a terminal state (COMPLETED/CANCELLED/
// REJECTED) — regardless of which dashboard is open, or which tab triggered
// the transition. Mounted once at the app root (MainLayout).
//
// Cross-tab duplicate posts are avoided via the ride's own `historySynced`
// flag (patched back into the shared store after a successful save, so
// every open tab sees it) rather than a purely local ref — `pendingRef`
// alone only prevents a single tab from double-posting while a request is
// in flight, not two tabs racing on the same ride.
export function useRideHistorySync() {
  const { rides } = useRides()
  const pendingRef = useRef(new Set())

  useEffect(() => {
    if (!isMockApiConfigured) return

    Object.entries(rides).forEach(([rideId, ride]) => {
      if (!isTerminalState(ride.status)) return
      if (ride.historySynced) return
      if (pendingRef.current.has(rideId)) return

      pendingRef.current.add(rideId)
      saveRideToHistory(rideId, ride)
        .then(() => markRideHistorySynced(rideId))
        .catch(() => {
          // Left unsynced — retried automatically the next time this effect
          // runs (any ride update in the store), instead of being dropped.
        })
        .finally(() => pendingRef.current.delete(rideId))
    })
  }, [rides])
}
