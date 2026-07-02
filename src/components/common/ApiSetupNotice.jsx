import { isMockApiConfigured } from '../../api/httpClient'

// Shown wherever a page relies on the ride history API, so it's clear why
// history is empty/not saving instead of failing silently.
function ApiSetupNotice() {
  if (isMockApiConfigured) return null

  return (
    <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 px-6 py-4 text-sm text-amber-800">
      Ride history sync is disabled — no MockAPI endpoint is configured. Create a resource at{' '}
      mockapi.io and set{' '}
      <code className="rounded bg-amber-100 px-1 py-0.5">VITE_MOCKAPI_URL</code> in{' '}
      <code className="rounded bg-amber-100 px-1 py-0.5">.env</code> to enable it.
    </div>
  )
}

export default ApiSetupNotice
