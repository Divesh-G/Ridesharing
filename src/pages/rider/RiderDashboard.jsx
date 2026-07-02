import Button from '../../components/common/Button'
import LiveRideMap from '../../components/map/LiveRideMap'
import RideStatusBadge from '../../components/ride/RideStatusBadge'
import { useAuth } from '../../hooks/useAuth'
import { useRiderRide } from '../../hooks/useRiderRide'
import { RIDE_STATES } from '../../state/rideStateMachine'
import { DEMO_DROPOFF_LOCATION, DEMO_PICKUP_LOCATION } from '../../utils/constants'

function RiderDashboard() {
  const { user } = useAuth()
  const { ride, rideId, error, requestRide, cancelRide, canCancel } = useRiderRide(user?.email)

  const status = ride?.status ?? RIDE_STATES.IDLE
  const hasActiveRide = Boolean(rideId && ride)

  const stats = [
    { label: 'Active Ride', node: <RideStatusBadge status={status} /> },
    { label: 'Completed Rides', node: '0' },
    { label: 'Total Spent', node: 'Rs. 0.00' },
  ]

  function handleRequestRide() {
    requestRide({ pickup: DEMO_PICKUP_LOCATION, dropoff: DEMO_DROPOFF_LOCATION })
  }

  return (
    <section className="w-full px-8 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rider Dashboard</h1>
          <p className="mt-1 text-gray-600">
            Request rides, track active trips, and view ride history.
          </p>
        </div>

        {hasActiveRide ? (
          <Button variant="secondary" onClick={cancelRide} disabled={!canCancel}>
            Cancel Ride
          </Button>
        ) : (
          <Button variant="primary" onClick={handleRequestRide}>
            Request a Ride
          </Button>
        )}
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          {error.message}
        </p>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">{stat.node}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="h-96 w-full">
          <LiveRideMap
            rideId={rideId}
            riderLocation={ride?.pickup ?? DEMO_PICKUP_LOCATION}
          />
        </div>
      </div>
    </section>
  )
}

export default RiderDashboard
