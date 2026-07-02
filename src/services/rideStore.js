const STORAGE_KEY = 'rideshare_rides_v1'
const CHANNEL_NAME = 'rideshare-rides'

function loadInitialRides() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

let rides = loadInitialRides()
const listeners = new Set()
const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(CHANNEL_NAME) : null

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rides))
  } catch {
    // Storage can be unavailable (private browsing, quota) — the in-memory
    // store still works for this tab, it just won't survive a refresh.
  }
}

function notify() {
  listeners.forEach((listener) => listener(rides))
}

// Another tab wrote to the store — adopt its snapshot so every open tab
// (e.g. a rider dashboard and a driver dashboard) stays in sync in real time
// without any server in between.
channel?.addEventListener('message', (event) => {
  rides = event.data
  notify()
})

function commit(nextRides) {
  rides = nextRides
  persist()
  notify()
  channel?.postMessage(rides)
}

export function generateRideId() {
  return typeof crypto?.randomUUID === 'function'
    ? crypto.randomUUID()
    : `ride_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

export function setRide(rideId, ride) {
  commit({ ...rides, [rideId]: ride })
}

export function patchRide(rideId, patch) {
  const existing = rides[rideId]
  if (!existing) return
  commit({ ...rides, [rideId]: { ...existing, ...patch } })
}

// Calls `listener` immediately with the current rides, then again on every
// change — local or from another tab — mirroring the "fire on subscribe,
// then on every update" shape ride hooks are already built around.
export function subscribeToStore(listener) {
  listeners.add(listener)
  listener(rides)
  return () => listeners.delete(listener)
}
