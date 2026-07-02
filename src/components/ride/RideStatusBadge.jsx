import { memo } from 'react'
import { RIDE_STATES } from '../../state/rideStateMachine'

const STATUS_META = {
  [RIDE_STATES.IDLE]: { label: 'No active ride', className: 'bg-gray-100 text-gray-600' },
  [RIDE_STATES.REQUESTING]: { label: 'Requesting…', className: 'bg-amber-100 text-amber-700' },
  [RIDE_STATES.SEARCHING]: { label: 'Searching for a driver…', className: 'bg-amber-100 text-amber-700' },
  [RIDE_STATES.ACCEPTED]: { label: 'Driver assigned', className: 'bg-indigo-100 text-indigo-700' },
  [RIDE_STATES.ARRIVING]: { label: 'Driver arriving', className: 'bg-indigo-100 text-indigo-700' },
  [RIDE_STATES.ONGOING]: { label: 'Trip in progress', className: 'bg-blue-100 text-blue-700' },
  [RIDE_STATES.COMPLETED]: { label: 'Trip completed', className: 'bg-green-100 text-green-700' },
  [RIDE_STATES.CANCELLED]: { label: 'Ride cancelled', className: 'bg-red-100 text-red-700' },
  [RIDE_STATES.REJECTED]: { label: 'Driver unavailable', className: 'bg-red-100 text-red-700' },
}

// Reusable status pill — maps a RIDE_STATES value to rider-facing copy and
// color, so pages don't hardcode status strings/colors themselves.
function RideStatusBadge({ status }) {
  const meta = STATUS_META[status] ?? STATUS_META[RIDE_STATES.IDLE]

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${meta.className}`}
    >
      {meta.label}
    </span>
  )
}

export default memo(RideStatusBadge)
