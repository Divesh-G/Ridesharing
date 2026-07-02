# Ridesharing Simulation Platform

A React + Vite frontend for a ride sharing simulation platform with separate Rider and Driver dashboards.

## Tech Stack

- React 19
- Vite
- Tailwind CSS v4
- React Router v7
- Local ride store (BroadcastChannel + localStorage — see below)

## Project Structure

```
src/
  components/
    common/     # Reusable UI primitives (Button, etc.)
    layout/     # App shell (Navbar, Footer, MainLayout)
    auth/       # Auth-related components (ProtectedRoute)
    map/        # Leaflet map + live driver/rider markers
    ride/       # Ride status badge, request/active ride cards
  pages/
    rider/      # Rider-facing pages
    driver/     # Driver-facing pages
    Login.jsx   # Login page
  hooks/        # Custom React hooks (useAuth, useRide, useRides, ...)
  context/      # React context providers (AuthContext, AuthProvider)
  state/        # rideStateMachine + rideValidation (ride workflow rules)
  services/     # rideStore (local store) + rideService (public data API)
  api/          # API request modules (placeholder)
  utils/        # Shared constants and helpers (auth credential validation)
```

## Authentication

This is a frontend-only simulation: there is no backend, so login is checked
against a single hardcoded credential pair in `src/utils/auth.js`.

- Email: `intern@namlotech.com`
- Password: `namlo2026`

On successful login, the session is stored in `sessionStorage` and persists
across page refreshes until the browser tab is closed or the user logs out.
`/rider` and `/driver` are protected routes — visiting them while logged out
redirects to `/login` and returns you to the original page after signing in.

## Ride Data & Realtime Sync

There is no backend. Ride data lives in an in-memory store
(`src/services/rideStore.js`) that:

- persists to `localStorage` so a refreshed/newly opened tab sees current rides immediately, and
- broadcasts every change over a `BroadcastChannel`, so a rider tab and a driver tab open in the same browser stay in sync in real time, the same way separate Firebase clients would.

Components never touch the store directly — they go through
`src/services/rideService.js`, which exposes the same shape regardless of
storage backend (`subscribeToRide`, `subscribeToRides`,
`subscribeToRidesByStatus`, `createRide`, `updateRideStatus`,
`updateRideLocation`, `assignDriver`). Each ride is stored as:

```
rides: {
  [rideId]: { rider, driver, status, pickup, dropoff, location, requestedAt }
}
```

`useRide(rideId)` and `useRides()` in `src/hooks/` wrap `subscribeToRide`/
`subscribeToRides` and unsubscribe on unmount or when the id changes, so no
listener outlives its component.

Because sync only happens within one browser (via `BroadcastChannel`), the
rider and driver dashboards need to be open as two tabs of the *same*
browser session to see each other's updates — there's no cross-device sync
without a real backend.

## Getting Started

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` - start the dev server
- `npm run build` - production build
- `npm run preview` - preview the production build
- `npm run lint` - run oxlint
