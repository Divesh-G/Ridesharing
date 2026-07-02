export const ROLES = {
  RIDER: 'rider',
  DRIVER: 'driver',
}

export const ROUTES = {
  HOME: '/',
  RIDER: '/rider',
  DRIVER: '/driver',
}

export const KATHMANDU_CENTER = { lat: 27.7172, lng: 85.324 }

// Single shared ride used to demo live map tracking between the rider and
// driver dashboards until real ride matching exists.
export const DEMO_RIDE_ID = 'demo-kathmandu-ride'
export const DEMO_PICKUP_LOCATION = { lat: 27.7172, lng: 85.324, label: 'Thamel, Kathmandu' }
export const DEMO_DRIVER_START_LOCATION = { lat: 27.712, lng: 85.318 }

// Fixed pickup/dropoff pair used by the rider dashboard's "Request Ride"
// button until a real location picker exists.
export const DEMO_DROPOFF_LOCATION = { lat: 27.6935, lng: 85.335, label: 'Patan Durbar Square' }
