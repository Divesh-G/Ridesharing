export class ApiError extends Error {
  constructor(message, { status = null, cause } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.cause = cause
  }
}

export class ApiNotConfiguredError extends ApiError {
  constructor() {
    super('MockAPI is not configured. Set VITE_MOCKAPI_URL in .env.')
    this.name = 'ApiNotConfiguredError'
  }
}

// Normalizes an Axios error into an ApiError with a message that
// distinguishes "server responded with an error" from "no response at all"
// (network down, wrong URL, CORS) from an unexpected client-side failure.
export function toApiError(error, fallbackMessage) {
  if (error.response) {
    return new ApiError(`${fallbackMessage} (${error.response.status})`, {
      status: error.response.status,
      cause: error,
    })
  }

  if (error.request) {
    return new ApiError(`${fallbackMessage} — no response from server`, { cause: error })
  }

  return new ApiError(fallbackMessage, { cause: error })
}
