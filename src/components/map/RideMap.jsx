import { memo, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { KATHMANDU_CENTER } from '../../utils/constants'
import { driverIcon, riderIcon } from './markerIcons'

const DEFAULT_CENTER = [KATHMANDU_CENTER.lat, KATHMANDU_CENTER.lng]
const DEFAULT_ZOOM = 14

function toLatLng(location) {
  return location ? [location.lat, location.lng] : null
}

function areEqual(prev, next) {
  return (
    prev.riderLocation?.lat === next.riderLocation?.lat &&
    prev.riderLocation?.lng === next.riderLocation?.lng &&
    prev.driverLocation?.lat === next.driverLocation?.lat &&
    prev.driverLocation?.lng === next.driverLocation?.lng &&
    prev.center === next.center &&
    prev.zoom === next.zoom &&
    prev.className === next.className
  )
}

// Presentational map: does not know about the ride store. Pass a live
// driverLocation prop (e.g. from useDriverLocation) to move the driver
// marker in real time. Memoized on lat/lng values (not object identity)
// since each store update produces a new object even when coordinates
// are unchanged.
function RideMap({
  riderLocation,
  driverLocation,
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  className = 'h-full w-full',
}) {
  const riderPosition = useMemo(
    () => toLatLng(riderLocation),
    [riderLocation?.lat, riderLocation?.lng],
  )
  const driverPosition = useMemo(
    () => toLatLng(driverLocation),
    [driverLocation?.lat, driverLocation?.lng],
  )

  return (
    <div className={className}>
      <MapContainer center={center} zoom={zoom} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {riderPosition && (
          <Marker position={riderPosition} icon={riderIcon}>
            <Popup>Rider</Popup>
          </Marker>
        )}

        {driverPosition && (
          <Marker position={driverPosition} icon={driverIcon}>
            <Popup>Driver</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  )
}

export default memo(RideMap, areEqual)
