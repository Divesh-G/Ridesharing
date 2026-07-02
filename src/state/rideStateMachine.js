export const RIDE_STATES = {
  IDLE: 'IDLE',
  REQUESTING: 'REQUESTING',
  SEARCHING: 'SEARCHING',
  ACCEPTED: 'ACCEPTED',
  ARRIVING: 'ARRIVING',
  ONGOING: 'ONGOING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  REJECTED: 'REJECTED',
}

export const RIDE_EVENTS = {
  REQUEST_RIDE: 'REQUEST_RIDE',
  BEGIN_SEARCH: 'BEGIN_SEARCH',
  DRIVER_ACCEPT: 'DRIVER_ACCEPT',
  DRIVER_REJECT: 'DRIVER_REJECT',
  DRIVER_ARRIVING: 'DRIVER_ARRIVING',
  START_TRIP: 'START_TRIP',
  COMPLETE_TRIP: 'COMPLETE_TRIP',
  CANCEL_RIDE: 'CANCEL_RIDE',
  RESET: 'RESET',
}

export const RIDE_ACTORS = {
  RIDER: 'rider',
  DRIVER: 'driver',
  SYSTEM: 'system',
}

const {
  IDLE,
  REQUESTING,
  SEARCHING,
  ACCEPTED,
  ARRIVING,
  ONGOING,
  COMPLETED,
  CANCELLED,
  REJECTED,
} = RIDE_STATES
const E = RIDE_EVENTS
const A = RIDE_ACTORS

// The single source of truth for legal ride transitions. Each entry maps a
// state to the events it accepts, the state that event leads to, and which
// actor is allowed to trigger it ('system' transitions are actor-agnostic —
// e.g. automated matching, or a reset back to IDLE for a fresh ride).
const TRANSITIONS = {
  [IDLE]: {
    [E.REQUEST_RIDE]: { target: REQUESTING, actor: A.RIDER },
  },
  [REQUESTING]: {
    [E.BEGIN_SEARCH]: { target: SEARCHING, actor: A.SYSTEM },
    [E.CANCEL_RIDE]: { target: CANCELLED, actor: A.RIDER },
  },
  [SEARCHING]: {
    [E.DRIVER_ACCEPT]: { target: ACCEPTED, actor: A.DRIVER },
    [E.DRIVER_REJECT]: { target: REJECTED, actor: A.DRIVER },
    [E.CANCEL_RIDE]: { target: CANCELLED, actor: A.RIDER },
  },
  [ACCEPTED]: {
    [E.DRIVER_ARRIVING]: { target: ARRIVING, actor: A.DRIVER },
    [E.CANCEL_RIDE]: { target: CANCELLED, actor: A.RIDER },
  },
  [ARRIVING]: {
    [E.START_TRIP]: { target: ONGOING, actor: A.DRIVER },
    [E.CANCEL_RIDE]: { target: CANCELLED, actor: A.RIDER },
  },
  [ONGOING]: {
    [E.COMPLETE_TRIP]: { target: COMPLETED, actor: A.DRIVER },
  },
  [COMPLETED]: {
    [E.RESET]: { target: IDLE, actor: A.SYSTEM },
  },
  [CANCELLED]: {
    [E.RESET]: { target: IDLE, actor: A.SYSTEM },
  },
  [REJECTED]: {
    // A rejection only rules out the current driver — retry matching before
    // giving up and letting the rider/system reset the ride.
    [E.BEGIN_SEARCH]: { target: SEARCHING, actor: A.SYSTEM },
    [E.RESET]: { target: IDLE, actor: A.SYSTEM },
  },
}

export const TERMINAL_STATES = new Set([COMPLETED, CANCELLED, REJECTED])

export class InvalidTransitionError extends Error {
  constructor(state, event, actor) {
    super(
      `Cannot apply event "${event}" to state "${state}"${actor ? ` as actor "${actor}"` : ''}`,
    )
    this.name = 'InvalidTransitionError'
    this.state = state
    this.event = event
    this.actor = actor
  }
}

export function isValidState(state) {
  return Object.prototype.hasOwnProperty.call(RIDE_STATES, state)
}

// Events legal from `state`, regardless of actor — useful for rendering
// available actions in the UI.
export function getAvailableEvents(state) {
  return Object.keys(TRANSITIONS[state] ?? {})
}

export function isTerminalState(state) {
  return TERMINAL_STATES.has(state)
}

function getRule(state, event) {
  return TRANSITIONS[state]?.[event]
}

// Checks whether `event` may be applied to `state` by `actor`, without
// mutating anything. Pass no actor to check only that the transition exists.
export function canTransition(state, event, actor) {
  const rule = getRule(state, event)
  if (!rule) return false
  if (actor && rule.actor !== A.SYSTEM && rule.actor !== actor) return false
  return true
}

// Pure transition function: given the current state, an event, and the
// actor triggering it, returns the next state or throws InvalidTransitionError.
// Contains no I/O — callers own persistence (see rideService.js) and
// identity/ownership checks (see rideValidation.js).
export function transition(state, event, actor) {
  const rule = getRule(state, event)
  if (!rule || (actor && rule.actor !== A.SYSTEM && rule.actor !== actor)) {
    throw new InvalidTransitionError(state, event, actor)
  }
  return rule.target
}
