import { ref, onValue, off, push, set, update } from 'firebase/database'
import { database } from './firebaseConfig'

export function getRideRef(rideId) {
  return database ? ref(database, `rides/${rideId}`) : null
}

export function getRidesRef() {
  return database ? ref(database, 'rides') : null
}

// Subscribes to a single ride and returns an unsubscribe function.
export function subscribeToRide(rideId, callback) {
  const rideRef = getRideRef(rideId)
  if (!rideRef) {
    callback(null)
    return () => {}
  }

  const handleValue = (snapshot) => callback(snapshot.val())

  onValue(rideRef, handleValue)
  return () => off(rideRef, 'value', handleValue)
}

// Subscribes to all rides and returns an unsubscribe function.
export function subscribeToRides(callback) {
  const ridesRef = getRidesRef()
  if (!ridesRef) {
    callback({})
    return () => {}
  }

  const handleValue = (snapshot) => callback(snapshot.val() || {})

  onValue(ridesRef, handleValue)
  return () => off(ridesRef, 'value', handleValue)
}

export async function createRide({ rider, driver = null, status = 'requested', location }) {
  const ridesRef = getRidesRef()
  if (!ridesRef) return null

  const newRideRef = push(ridesRef)
  await set(newRideRef, { rider, driver, status, location })
  return newRideRef.key
}

export function updateRideStatus(rideId, status) {
  const rideRef = getRideRef(rideId)
  return rideRef ? update(rideRef, { status }) : Promise.resolve()
}

export function updateRideLocation(rideId, location) {
  const rideRef = getRideRef(rideId)
  return rideRef ? update(rideRef, { location }) : Promise.resolve()
}

export function assignDriver(rideId, driver) {
  const rideRef = getRideRef(rideId)
  return rideRef ? update(rideRef, { driver, status: 'matched' }) : Promise.resolve()
}
