import { memo } from 'react'
import Button from '../common/Button'
import RideStatusBadge from './RideStatusBadge'
import { RIDE_STATES } from '../../state/rideStateMachine'

const NEXT_ACTION = {
  [RIDE_STATES.ACCEPTED]: { label: 'Start Heading to Pickup', handlerKey: 'onStartArriving' },
  [RIDE_STATES.ARRIVING]: { label: 'Start Trip', handlerKey: 'onStartTrip' },
  [RIDE_STATES.ONGOING]: { label: 'Complete Trip', handlerKey: 'onCompleteTrip' },
}

// Reusable "current assigned ride" summary: pickup/dropoff, live status
// badge, and whichever single action is legal next (driving the state
// machine forward rather than exposing every possible event as a button).
function ActiveRideCard({ ride, onStartArriving, onStartTrip, onCompleteTrip }) {
  const action = NEXT_ACTION[ride.status]
  const handlers = { onStartArriving, onStartTrip, onCompleteTrip }

  return (
    <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div>
        <p className="font-semibold text-gray-900">
          {ride.pickup?.label ?? 'Pickup'} → {ride.dropoff?.label ?? 'Dropoff'}
        </p>
        <div className="mt-2">
          <RideStatusBadge status={ride.status} />
        </div>
      </div>
      {action && (
        <Button variant="primary" onClick={handlers[action.handlerKey]}>
          {action.label}
        </Button>
      )}
    </div>
  )
}

export default memo(ActiveRideCard)
