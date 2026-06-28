import { ref, onValue, off, push, set, update } from 'firebase/database'
import { database } from './firebaseConfig'

export function getRideRef(rideId) {
  return ref(database, `rides/${rideId}`)
}

export function getRidesRef() {
  return ref(database, 'rides')
}

// Subscribes to a single ride and returns an unsubscribe function.
export function subscribeToRide(rideId, callback) {
  const rideRef = getRideRef(rideId)
  const handleValue = (snapshot) => callback(snapshot.val())

  onValue(rideRef, handleValue)
  return () => off(rideRef, 'value', handleValue)
}

// Subscribes to all rides and returns an unsubscribe function.
export function subscribeToRides(callback) {
  const ridesRef = getRidesRef()
  const handleValue = (snapshot) => callback(snapshot.val() || {})

  onValue(ridesRef, handleValue)
  return () => off(ridesRef, 'value', handleValue)
}

export async function createRide({ rider, driver = null, status = 'requested', location }) {
  const newRideRef = push(getRidesRef())
  await set(newRideRef, { rider, driver, status, location })
  return newRideRef.key
}

export function updateRideStatus(rideId, status) {
  return update(getRideRef(rideId), { status })
}

export function updateRideLocation(rideId, location) {
  return update(getRideRef(rideId), { location })
}

export function assignDriver(rideId, driver) {
  return update(getRideRef(rideId), { driver, status: 'matched' })
}
