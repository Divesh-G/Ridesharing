import { httpClient, isMockApiConfigured } from './httpClient'
import { ApiNotConfiguredError, toApiError } from './errors'

// MockAPI has no concept of the app's nested ride shape, and a flat record
// is simpler to render as a history table — so translate rather than
// forwarding the live ride object as-is.
function toHistoryPayload(rideId, ride) {
  return {
    rideId,
    rider: ride.rider,
    driver: ride.driver,
    status: ride.status,
    pickupLabel: ride.pickup?.label ?? null,
    dropoffLabel: ride.dropoff?.label ?? null,
    requestedAt: ride.requestedAt ?? null,
    completedAt: Date.now(),
  }
}

// Persists a completed/cancelled/rejected ride to MockAPI. Callers are
// expected to only call this once per ride — see useRideHistorySync, which
// tracks that via the ride's `historySynced` flag.
export async function saveRideToHistory(rideId, ride) {
  if (!isMockApiConfigured) throw new ApiNotConfiguredError()

  try {
    const { data } = await httpClient.post('', toHistoryPayload(rideId, ride))
    return data
  } catch (error) {
    throw toApiError(error, 'Failed to save ride to history')
  }
}

// Fetches all saved ride history entries, most recent first.
export async function fetchRideHistory() {
  if (!isMockApiConfigured) throw new ApiNotConfiguredError()

  try {
    const { data } = await httpClient.get('')
    const entries = Array.isArray(data) ? data : []
    return [...entries].sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0))
  } catch (error) {
    throw toApiError(error, 'Failed to fetch ride history')
  }
}
