// Global types for the application

export type Player = {
  id: string
  name: string
  number: number
  position?: string
}

export type Team = {
  id: string
  name: string
  players: Player[]
}

export type MatchEvent = {
  id: string
  type: 'goal' | 'yellow-card' | 'red-card' | 'substitution' | 'corner' | 'shot'
  timestamp: number
  playerId: string
  teamId: string
  secondPlayerId?: string
  description?: string
}

export type MatchState = {
  homeTeam: Team | null
  awayTeam: Team | null
  events: MatchEvent[]
  isPlaying: boolean
  startTime: number | null
  elapsedTime: number
  currentHalf: 1 | 2
}
