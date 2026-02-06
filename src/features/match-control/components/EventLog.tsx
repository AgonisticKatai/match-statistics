import { Card } from '@/shared/components'
import { useMatch } from '@/shared/context/MatchContext'
import type { MatchEvent } from '@/shared/types'

const EVENT_ICONS: Record<MatchEvent['type'], string> = {
  goal: 'GOL',
  'yellow-card': '🟡',
  'red-card': '🔴',
  substitution: '🔄',
  corner: 'COR',
  shot: 'TIR',
}

function formatMinute(ms: number): string {
  return `${Math.floor(ms / 60000)}'`
}

export function EventLog() {
  const { state } = useMatch()

  if (state.events.length === 0) return null

  const allPlayers = new Map<string, string>()
  const teamNames = new Map<string, string>()

  if (state.homeTeam) {
    teamNames.set(state.homeTeam.id, state.homeTeam.name)
    for (const p of state.homeTeam.players) {
      allPlayers.set(p.id, `${p.number} ${p.name}`)
    }
  }
  if (state.awayTeam) {
    teamNames.set(state.awayTeam.id, state.awayTeam.name)
    for (const p of state.awayTeam.players) {
      allPlayers.set(p.id, `${p.number} ${p.name}`)
    }
  }

  const sortedEvents = [...state.events].reverse()

  return (
    <Card title="Eventos">
      <div className="space-y-1">
        {sortedEvents.map(event => {
          const playerName = allPlayers.get(event.playerId) ?? '?'
          const teamName = teamNames.get(event.teamId) ?? '?'
          const secondPlayer = event.secondPlayerId ? allPlayers.get(event.secondPlayerId) : null

          return (
            <div key={event.id} className="flex items-center gap-2 text-sm p-2 rounded bg-gray-50">
              <span className="font-mono text-xs text-gray-500 w-8">
                {formatMinute(event.timestamp)}
              </span>
              <span className="w-8 text-center font-bold text-xs">{EVENT_ICONS[event.type]}</span>
              <span className="flex-1">
                {event.type === 'substitution' && secondPlayer ? (
                  <>
                    {playerName} <span className="text-gray-400">→</span> {secondPlayer}
                  </>
                ) : (
                  playerName
                )}
              </span>
              <span className="text-xs text-gray-400">{teamName}</span>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
