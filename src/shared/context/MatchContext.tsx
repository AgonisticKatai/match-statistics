import { createContext, useContext, useReducer, ReactNode } from 'react'
import type { MatchState, MatchEvent, Team } from '../types'

// Action types
type MatchAction =
  | { type: 'SET_HOME_TEAM'; payload: Team }
  | { type: 'SET_AWAY_TEAM'; payload: Team }
  | { type: 'START_MATCH' }
  | { type: 'PAUSE_MATCH' }
  | { type: 'RESUME_MATCH' }
  | { type: 'END_MATCH' }
  | { type: 'ADD_EVENT'; payload: MatchEvent }
  | { type: 'UPDATE_TIME'; payload: number }
  | { type: 'SWITCH_HALF' }
  | { type: 'RESET_MATCH' }

// Initial state
const initialState: MatchState = {
  homeTeam: null,
  awayTeam: null,
  events: [],
  isPlaying: false,
  startTime: null,
  elapsedTime: 0,
  currentHalf: 1,
}

// Reducer
function matchReducer(state: MatchState, action: MatchAction): MatchState {
  switch (action.type) {
    case 'SET_HOME_TEAM':
      return { ...state, homeTeam: action.payload }

    case 'SET_AWAY_TEAM':
      return { ...state, awayTeam: action.payload }

    case 'START_MATCH':
      return {
        ...state,
        isPlaying: true,
        startTime: Date.now(),
      }

    case 'PAUSE_MATCH':
      return { ...state, isPlaying: false }

    case 'RESUME_MATCH':
      return { ...state, isPlaying: true }

    case 'END_MATCH':
      return { ...state, isPlaying: false }

    case 'ADD_EVENT':
      return {
        ...state,
        events: [...state.events, action.payload],
      }

    case 'UPDATE_TIME':
      return { ...state, elapsedTime: action.payload }

    case 'SWITCH_HALF':
      return {
        ...state,
        currentHalf: state.currentHalf === 1 ? 2 : 1,
        elapsedTime: 0,
      }

    case 'RESET_MATCH':
      return initialState

    default:
      return state
  }
}

// Context type
type MatchContextType = {
  state: MatchState
  dispatch: React.Dispatch<MatchAction>
}

// Create context
const MatchContext = createContext<MatchContextType | undefined>(undefined)

// Provider component
export function MatchProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(matchReducer, initialState)

  return <MatchContext.Provider value={{ state, dispatch }}>{children}</MatchContext.Provider>
}

// Custom hook to use the context
export function useMatch() {
  const context = useContext(MatchContext)
  if (context === undefined) {
    throw new Error('useMatch must be used within a MatchProvider')
  }
  return context
}

// Export action creators for convenience
export const matchActions = {
  setHomeTeam: (team: Team): MatchAction => ({
    type: 'SET_HOME_TEAM',
    payload: team,
  }),
  setAwayTeam: (team: Team): MatchAction => ({
    type: 'SET_AWAY_TEAM',
    payload: team,
  }),
  startMatch: (): MatchAction => ({ type: 'START_MATCH' }),
  pauseMatch: (): MatchAction => ({ type: 'PAUSE_MATCH' }),
  resumeMatch: (): MatchAction => ({ type: 'RESUME_MATCH' }),
  endMatch: (): MatchAction => ({ type: 'END_MATCH' }),
  addEvent: (event: MatchEvent): MatchAction => ({
    type: 'ADD_EVENT',
    payload: event,
  }),
  updateTime: (time: number): MatchAction => ({
    type: 'UPDATE_TIME',
    payload: time,
  }),
  switchHalf: (): MatchAction => ({ type: 'SWITCH_HALF' }),
  resetMatch: (): MatchAction => ({ type: 'RESET_MATCH' }),
}
