import { useCallback, useEffect, useState } from 'react'
import { useRide } from './useRide'
import { createRide, updateRideStatus } from '../services/rideService'
import { canRiderCancel, validateRideRequest } from '../state/rideValidation'
import {
  RIDE_ACTORS,
  RIDE_EVENTS,
  RIDE_STATES,
  isTerminalState,
  transition,
} from '../state/rideStateMachine'

const ACTIVE_RIDE_KEY_PREFIX = 'rideshare_active_ride_'
const AUTO_SEARCH_DELAY_MS = 600
const TERMINAL_RIDE_VISIBLE_MS = 4000

function getStoredRideId(riderId) {
  return riderId ? sessionStorage.getItem(ACTIVE_RIDE_KEY_PREFIX + riderId) : null
}

function storeRideId(riderId, rideId) {
  if (!riderId) return
  if (rideId) sessionStorage.setItem(ACTIVE_RIDE_KEY_PREFIX + riderId, rideId)
  else sessionStorage.removeItem(ACTIVE_RIDE_KEY_PREFIX + riderId)
}

// Owns the rider-facing ride lifecycle end to end: requesting a ride,
// letting the (simulated) dispatch system move it into SEARCHING, tracking
// it in real time, and cancelling it. All state changes go through
// rideStateMachine/rideValidation rather than writing store statuses
// directly, so UI components never need to know which transitions are legal.
export function useRiderRide(riderId) {
  const [rideId, setRideId] = useState(() => getStoredRideId(riderId))
  const [error, setError] = useState(null)
  const { ride, loading } = useRide(rideId)

  useEffect(() => {
    storeRideId(riderId, rideId)
  }, [riderId, rideId])

  // Simulates a dispatch system picking up a fresh request and starting to
  // search for a driver, since there's no real matching backend yet.
  useEffect(() => {
    if (ride?.status !== RIDE_STATES.REQUESTING) return undefined

    const timeout = setTimeout(() => {
      const nextState = transition(RIDE_STATES.REQUESTING, RIDE_EVENTS.BEGIN_SEARCH, RIDE_ACTORS.SYSTEM)
      updateRideStatus(rideId, nextState)
    }, AUTO_SEARCH_DELAY_MS)

    return () => clearTimeout(timeout)
  }, [ride?.status, rideId])

  // Once a ride reaches a terminal state, forget it locally (after a beat,
  // so the rider actually sees the final status) so "Request Ride" reappears.
  const rideStatus = ride?.status
  useEffect(() => {
    if (!rideStatus || !isTerminalState(rideStatus)) return undefined

    const timeout = setTimeout(() => setRideId(null), TERMINAL_RIDE_VISIBLE_MS)
    return () => clearTimeout(timeout)
  }, [rideStatus])

  const requestRide = useCallback(
    async ({ pickup, dropoff }) => {
      setError(null)

      const { valid, errors } = validateRideRequest({ riderId, pickup, dropoff })
      if (!valid) {
        setError(new Error(errors.join(', ')))
        return false
      }

      const newRideId = await createRide({
        rider: riderId,
        status: RIDE_STATES.REQUESTING,
        pickup,
        dropoff,
      })

      setRideId(newRideId)
      return true
    },
    [riderId],
  )

  const cancelRide = useCallback(() => {
    setError(null)

    if (!canRiderCancel(ride, riderId)) {
      setError(new Error('This ride can no longer be cancelled.'))
      return false
    }

    try {
      const nextState = transition(ride.status, RIDE_EVENTS.CANCEL_RIDE, RIDE_ACTORS.RIDER)
      updateRideStatus(rideId, nextState)
      return true
    } catch (err) {
      setError(err)
      return false
    }
  }, [ride, rideId, riderId])

  return {
    ride,
    rideId,
    loading,
    error,
    requestRide,
    cancelRide,
    canCancel: canRiderCancel(ride, riderId),
  }
}
