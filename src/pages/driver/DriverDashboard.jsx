import { useState } from 'react'
import Button from '../../components/common/Button'
import LiveRideMap from '../../components/map/LiveRideMap'
import ActiveRideCard from '../../components/ride/ActiveRideCard'
import RideRequestCard from '../../components/ride/RideRequestCard'
import { useAuth } from '../../hooks/useAuth'
import { useDriverRide } from '../../hooks/useDriverRide'
import { useIncomingRideRequests } from '../../hooks/useIncomingRideRequests'

function DriverDashboard() {
  const { user } = useAuth()
  const [online, setOnline] = useState(false)

  const { rideId, ride, error, acceptRide, rejectRide, startArriving, startTrip, completeTrip } =
    useDriverRide(user?.email)

  const requests = useIncomingRideRequests(online && !rideId)

  const stats = [
    { label: 'Status', value: online ? 'Online' : 'Offline' },
    { label: 'Rides Today', value: '0' },
    { label: 'Today’s Earnings', value: 'Rs. 0.00' },
  ]

  return (
    <section className="w-full px-8 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Driver Dashboard</h1>
          <p className="mt-1 text-gray-600">
            View incoming ride requests, manage availability, and track
            earnings.
          </p>
        </div>
        <Button variant="secondary" onClick={() => setOnline((value) => !value)}>
          {online ? 'Go Offline' : 'Go Online'}
        </Button>
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
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        {ride ? (
          <ActiveRideCard
            ride={ride}
            onStartArriving={startArriving}
            onStartTrip={startTrip}
            onCompleteTrip={completeTrip}
          />
        ) : !online ? (
          <p className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500">
            Go online to start receiving ride requests.
          </p>
        ) : requests.length > 0 ? (
          requests.map((request) => (
            <RideRequestCard
              key={request.id}
              request={request}
              onAccept={acceptRide}
              onReject={rejectRide}
            />
          ))
        ) : (
          <p className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500">
            No incoming ride requests yet.
          </p>
        )}
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="h-96 w-full">
          <LiveRideMap rideId={rideId} riderLocation={ride?.pickup} />
        </div>
      </div>
    </section>
  )
}

export default DriverDashboard
