import { RIDE_STATES } from '../state/rideStateMachine'
import { generateRideId, patchRide, setRide, subscribeToStore } from './rideStore'

// Subscribes to a single ride and returns an unsubscribe function.
export function subscribeToRide(rideId, callback) {
  if (!rideId) {
    callback(null)
    return () => {}
  }

  return subscribeToStore((rides) => callback(rides[rideId] ?? null))
}

// Subscribes to all rides and returns an unsubscribe function.
export function subscribeToRides(callback) {
  return subscribeToStore(callback)
}

// Subscribes only to rides matching `status`.
export function subscribeToRidesByStatus(status, callback) {
  return subscribeToStore((rides) => {
    const filtered = Object.fromEntries(
      Object.entries(rides).filter(([, ride]) => ride.status === status),
    )
    callback(filtered)
  })
}

export async function createRide({
  rider,
  driver = null,
  status = RIDE_STATES.REQUESTING,
  pickup,
  dropoff,
  location,
}) {
  const rideId = generateRideId()
  setRide(rideId, {
    rider,
    driver,
    status,
    pickup,
    dropoff,
    location,
    requestedAt: Date.now(),
  })
  return rideId
}

export function updateRideStatus(rideId, status) {
  patchRide(rideId, { status })
  return Promise.resolve()
}

export function updateRideLocation(rideId, location) {
  patchRide(rideId, { location })
  return Promise.resolve()
}

export function assignDriver(rideId, driver) {
  patchRide(rideId, { driver, status: RIDE_STATES.ACCEPTED })
  return Promise.resolve()
}

// Marks a ride as persisted to the ride history API, so useRideHistorySync
// (running in every open tab) doesn't post it more than once.
export function markRideHistorySynced(rideId) {
  patchRide(rideId, { historySynced: true })
  return Promise.resolve()
}
