import { useState } from 'react'
import { AuthContext } from './AuthContext'
import { validateCredentials } from '../utils/auth'

const SESSION_KEY = 'rideshare_session'

function getStoredUser() {
  const stored = sessionStorage.getItem(SESSION_KEY)
  return stored ? JSON.parse(stored) : null
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)

  function login(email, password) {
    if (!validateCredentials(email, password)) {
      return false
    }
    const sessionUser = { email }
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser))
    setUser(sessionUser)
    return true
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY)
    setUser(null)
  }

  const value = { user, isAuthenticated: Boolean(user), login, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
