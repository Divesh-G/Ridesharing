import { useCallback, useEffect, useState } from 'react'
import { useRide } from './useRide'
import { useDriverSimulator } from './useDriverSimulator'
import { assignDriver, updateRideStatus } from '../services/rideService'
import { canDriverAccept, canDriverAdvance, canDriverReject } from '../state/rideValidation'
import {
  RIDE_ACTORS,
  RIDE_EVENTS,
  RIDE_STATES,
  isTerminalState,
  transition,
} from '../state/rideStateMachine'
import { DEMO_DRIVER_START_LOCATION } from '../utils/constants'

const ACTIVE_RIDE_KEY_PREFIX = 'rideshare_driver_ride_'
const TERMINAL_RIDE_VISIBLE_MS = 4000
const MOVEMENT_STATES = new Set([RIDE_STATES.ACCEPTED, RIDE_STATES.ARRIVING, RIDE_STATES.ONGOING])

function getStoredRideId(driverId) {
  return driverId ? sessionStorage.getItem(ACTIVE_RIDE_KEY_PREFIX + driverId) : null
}

function storeRideId(driverId, rideId) {
  if (!driverId) return
  if (rideId) sessionStorage.setItem(ACTIVE_RIDE_KEY_PREFIX + driverId, rideId)
  else sessionStorage.removeItem(ACTIVE_RIDE_KEY_PREFIX + driverId)
}

// Owns the driver-facing ride lifecycle: accepting/rejecting incoming
// requests, advancing an assigned ride through ARRIVING -> ONGOING ->
// COMPLETED, and simulating GPS movement while it's active. Every
// transition is checked against rideValidation before it's written to the
// store, so illegal actions surface as `error` instead of corrupting
// ride state.
export function useDriverRide(driverId) {
  const [rideId, setRideId] = useState(() => getStoredRideId(driverId))
  const [error, setError] = useState(null)
  const { ride } = useRide(rideId)

  useEffect(() => {
    storeRideId(driverId, rideId)
  }, [driverId, rideId])

  // Once the assigned ride reaches a terminal state, forget it locally
  // (after a beat, so the driver sees the final status) so new requests
  // reappear.
  const rideStatus = ride?.status
  useEffect(() => {
    if (!rideStatus || !isTerminalState(rideStatus)) return undefined

    const timeout = setTimeout(() => setRideId(null), TERMINAL_RIDE_VISIBLE_MS)
    return () => clearTimeout(timeout)
  }, [rideStatus])

  // Broadcasts simulated GPS movement only while the assigned ride is in a
  // state where the driver is actually en route or on a trip; the interval
  // it owns is cleaned up automatically once that's no longer true.
  useDriverSimulator(
    rideId,
    Boolean(ride && MOVEMENT_STATES.has(ride.status)),
    DEMO_DRIVER_START_LOCATION,
  )

  const acceptRide = useCallback(
    (request) => {
      setError(null)

      if (!canDriverAccept(request)) {
        setError(new Error('This ride is no longer available.'))
        return false
      }

      assignDriver(request.id, driverId)
      setRideId(request.id)
      return true
    },
    [driverId],
  )

  const rejectRide = useCallback((request) => {
    setError(null)

    if (!canDriverReject(request)) {
      setError(new Error('This ride is no longer available.'))
      return false
    }

    const nextState = transition(request.status, RIDE_EVENTS.DRIVER_REJECT, RIDE_ACTORS.DRIVER)
    updateRideStatus(request.id, nextState)
    return true
  }, [])

  const advance = useCallback(
    (event) => {
      setError(null)

      if (!canDriverAdvance(ride, driverId, event)) {
        setError(new Error('This action is not available right now.'))
        return false
      }

      try {
        const nextState = transition(ride.status, event, RIDE_ACTORS.DRIVER)
        updateRideStatus(rideId, nextState)
        return true
      } catch (err) {
        setError(err)
        return false
      }
    },
    [ride, rideId, driverId],
  )

  return {
    rideId,
    ride,
    error,
    acceptRide,
    rejectRide,
    startArriving: () => advance(RIDE_EVENTS.DRIVER_ARRIVING),
    startTrip: () => advance(RIDE_EVENTS.START_TRIP),
    completeTrip: () => advance(RIDE_EVENTS.COMPLETE_TRIP),
  }
}
