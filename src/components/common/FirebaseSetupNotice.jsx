import { isFirebaseConfigured } from '../../firebase/firebaseConfig'

// Shown wherever a page relies on Firebase Realtime Database features
// (live map, ride sync) so it's clear why they're inert instead of failing silently.
function FirebaseSetupNotice() {
  if (isFirebaseConfigured) return null

  return (
    <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 px-6 py-4 text-sm text-amber-800">
      Live tracking is disabled — no Firebase project is configured. Copy{' '}
      <code className="rounded bg-amber-100 px-1 py-0.5">.env.example</code> to{' '}
      <code className="rounded bg-amber-100 px-1 py-0.5">.env</code> and fill in your Firebase
      Realtime Database credentials to enable it.
    </div>
  )
}

export default FirebaseSetupNotice
