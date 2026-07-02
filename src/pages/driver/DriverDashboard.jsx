import { useState } from 'react'
import LiveRideMap from '../../components/map/LiveRideMap'
import FirebaseSetupNotice from '../../components/common/FirebaseSetupNotice'
import {
  DEMO_DRIVER_START_LOCATION,
  DEMO_PICKUP_LOCATION,
  DEMO_RIDE_ID,
} from '../../utils/constants'
import { useDriverSimulator } from '../../hooks/useDriverSimulator'

function DriverDashboard() {
  const [online, setOnline] = useState(false)

  useDriverSimulator(DEMO_RIDE_ID, online, DEMO_DRIVER_START_LOCATION)

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
        <button
          onClick={() => setOnline((value) => !value)}
          className="rounded-full border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-900 shadow-sm transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-50"
        >
          {online ? 'Go Offline' : 'Go Online'}
        </button>
      </div>

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

      <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="h-96 w-full">
          <LiveRideMap rideId={DEMO_RIDE_ID} riderLocation={DEMO_PICKUP_LOCATION} />
        </div>
      </div>

      <FirebaseSetupNotice />
    </section>
  )
}

export default DriverDashboard
