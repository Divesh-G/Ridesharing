import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// getDatabase() throws synchronously if databaseURL/projectId are missing,
// which would crash the whole app before it can render. No Firebase project
// exists yet, so real-time features stay disabled until VITE_FIREBASE_* env
// vars are set (see .env.example) instead of taking the app down.
export const isFirebaseConfigured = Boolean(
  firebaseConfig.databaseURL && firebaseConfig.projectId,
)

if (!isFirebaseConfigured) {
  console.warn(
    '[firebase] Missing VITE_FIREBASE_* env vars — real-time features (live map, ride sync) are disabled. Copy .env.example to .env and fill in your Firebase project credentials.',
  )
}

const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null

export const database = app ? getDatabase(app) : null
