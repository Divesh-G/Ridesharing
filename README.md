# Ridesharing Simulation Platform

A React + Vite frontend for a ride sharing simulation platform with separate Rider and Driver dashboards.

## Tech Stack

- React 19
- Vite
- Tailwind CSS v4
- React Router v7
- Firebase Realtime Database

## Project Structure

```
src/
  components/
    common/     # Reusable UI primitives (Button, etc.)
    layout/     # App shell (Navbar, Footer, MainLayout)
    auth/       # Auth-related components (ProtectedRoute)
  pages/
    rider/      # Rider-facing pages
    driver/     # Driver-facing pages
    Login.jsx   # Login page
  hooks/        # Custom React hooks (useAuth, useRide, useRides)
  context/      # React context providers (AuthContext, AuthProvider)
  firebase/     # Firebase config + rideService (Realtime Database)
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

## Realtime Database

Live ride data is synced through Firebase Realtime Database, accessed only
through `src/firebase/rideService.js` (never call `firebase/database`
directly from components). Each ride is stored at `rides/{rideId}`:

```
rides/
  rideId/
    rider
    driver
    status
    location
```

`useRide(rideId)` and `useRides()` in `src/hooks/` wrap `onValue` listeners
and detach them (`off`) on unmount or when the id changes, so no listener
outlives its component.

Copy `.env.example` to `.env` and fill in your Firebase project's web config
to connect to a real database:

```bash
cp .env.example .env
```

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
