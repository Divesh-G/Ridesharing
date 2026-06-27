// Hardcoded credentials for simulation purposes — no backend/auth provider yet.
const VALID_EMAIL = 'intern@namlotech.com'
const VALID_PASSWORD = 'namlo2026'

export function validateCredentials(email, password) {
  return email.trim().toLowerCase() === VALID_EMAIL && password === VALID_PASSWORD
}
