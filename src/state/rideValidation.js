import { RIDE_ACTORS, RIDE_EVENTS, canTransition } from './rideStateMachine'

function hasCoordinates(location) {
  return typeof location?.lat === 'number' && typeof location?.lng === 'number'
}

// Validates a ride request payload before it becomes a ride record
// (IDLE -> REQUESTING). Returns { valid, errors } rather than throwing, since
// this is meant to back form/UI validation, not just guard state transitions.
export function validateRideRequest({ riderId, pickup, dropoff } = {}) {
  const errors = []

  if (!riderId) errors.push('riderId is required')
  if (!hasCoordinates(pickup)) errors.push('pickup location is required')
  if (!hasCoordinates(dropoff)) errors.push('dropoff location is required')

  return { valid: errors.length === 0, errors }
}

// A transition is only legal if the state machine allows the event AND the
// actor triggering it actually owns the ride (the rider who requested it, or
// the driver assigned to it) — canTransition alone only checks the actor's
// *role*, not their identity.
export function canRiderCancel(ride, riderId) {
  if (!ride || !riderId || ride.rider !== riderId) return false
  return canTransition(ride.status, RIDE_EVENTS.CANCEL_RIDE, RIDE_ACTORS.RIDER)
}

export function canDriverAccept(ride) {
  if (!ride) return false
  return canTransition(ride.status, RIDE_EVENTS.DRIVER_ACCEPT, RIDE_ACTORS.DRIVER)
}

export function canDriverReject(ride) {
  if (!ride) return false
  return canTransition(ride.status, RIDE_EVENTS.DRIVER_REJECT, RIDE_ACTORS.DRIVER)
}

// Covers the driver-only progression events that require the driver already
// be assigned to the ride: DRIVER_ARRIVING, START_TRIP, COMPLETE_TRIP.
export function canDriverAdvance(ride, driverId, event) {
  if (!ride || !driverId || ride.driver !== driverId) return false
  return canTransition(ride.status, event, RIDE_ACTORS.DRIVER)
}
