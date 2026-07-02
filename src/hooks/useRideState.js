import { useCallback, useState } from 'react'
import {
  InvalidTransitionError,
  RIDE_STATES,
  getAvailableEvents,
  isTerminalState,
  transition,
} from '../state/rideStateMachine'

// Drives a single ride through rideStateMachine's transitions. `send`
// validates the event against the current state/actor before applying it,
// so invalid actions (e.g. a rider trying to COMPLETE_TRIP) are rejected
// with an InvalidTransitionError in `error` instead of corrupting state.
//
// Pass `onTransition` to run a side effect (e.g. persisting the new status
// to the ride store) after a successful transition.
export function useRideState(initialState = RIDE_STATES.IDLE, { onTransition } = {}) {
  const [state, setState] = useState(initialState)
  const [error, setError] = useState(null)

  const send = useCallback(
    (event, actor) => {
      try {
        const nextState = transition(state, event, actor)
        setState(nextState)
        setError(null)
        onTransition?.(nextState, { event, actor, previous: state })
        return true
      } catch (err) {
        if (err instanceof InvalidTransitionError) {
          setError(err)
          return false
        }
        throw err
      }
    },
    [state, onTransition],
  )

  const reset = useCallback(() => {
    setState(initialState)
    setError(null)
  }, [initialState])

  return {
    state,
    error,
    send,
    reset,
    isTerminal: isTerminalState(state),
    availableEvents: getAvailableEvents(state),
  }
}
