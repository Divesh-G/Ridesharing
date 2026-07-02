import { useDriverLocation } from '../../hooks/useDriverLocation'
import RideMap from './RideMap'

// Wires RideMap to a ride's live driver location in Firebase.
// Rider location is passed through as-is (only the driver moves during a ride).
function LiveRideMap({ rideId, riderLocation, ...mapProps }) {
  const driverLocation = useDriverLocation(rideId)

  return <RideMap riderLocation={riderLocation} driverLocation={driverLocation} {...mapProps} />
}

export default LiveRideMap
