import axios from 'axios'

const baseURL = import.meta.env.VITE_MOCKAPI_URL

// e.g. https://<project-id>.mockapi.io/api/v1/rides — the full resource
// endpoint, created for free at mockapi.io. Without it, ride history
// persistence is disabled rather than crashing the app (see rides.js).
export const isMockApiConfigured = Boolean(baseURL)

if (!isMockApiConfigured) {
  console.warn(
    '[mockapi] Missing VITE_MOCKAPI_URL — ride history persistence is disabled. Create a resource at mockapi.io and set VITE_MOCKAPI_URL to its endpoint.',
  )
}

export const httpClient = axios.create({
  baseURL,
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
})
