import { memo } from 'react'
import Button from '../common/Button'

// Reusable incoming-request row: pickup/dropoff summary plus accept/reject
// actions. Memoized so the list can skip re-rendering rows whose data
// hasn't actually changed (see useIncomingRideRequests).
function RideRequestCard({ request, onAccept, onReject }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div>
        <p className="font-semibold text-gray-900">
          {request.pickup?.label ?? 'Pickup location'} → {request.dropoff?.label ?? 'Dropoff location'}
        </p>
        <p className="mt-1 text-sm text-gray-500">Rider: {request.rider}</p>
      </div>
      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => onReject(request)}>
          Reject
        </Button>
        <Button variant="primary" onClick={() => onAccept(request)}>
          Accept
        </Button>
      </div>
    </div>
  )
}

export default memo(RideRequestCard)
