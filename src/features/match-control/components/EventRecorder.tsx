import { useState } from 'react'
import { Button, Card } from '@/shared/components'
import { useMatch, matchActions } from '@/shared/context/MatchContext'
import type { MatchEvent, Player } from '@/shared/types'

type EventType = MatchEvent['type']
type SelectedTeam = 'home' | 'away'

const EVENT_LABELS: Record<EventType, string> = {
  goal: 'Gol',
  'yellow-card': 'Amarilla',
  'red-card': 'Roja',
  substitution: 'Cambio',
  corner: 'Corner',
  shot: 'Tiro',
}

const EVENT_COLORS: Record<EventType, string> = {
  goal: 'bg-primary-600 text-white hover:bg-primary-700',
  'yellow-card': 'bg-yellow-400 text-yellow-900 hover:bg-yellow-500',
  'red-card': 'bg-red-600 text-white hover:bg-red-700',
  substitution: 'bg-blue-600 text-white hover:bg-blue-700',
  corner: 'bg-gray-600 text-white hover:bg-gray-700',
  shot: 'bg-gray-600 text-white hover:bg-gray-700',
}

const EVENT_TYPES: EventType[] = [
  'goal',
  'yellow-card',
  'red-card',
  'substitution',
  'corner',
  'shot',
]

function PlayerList({
  players,
  onSelect,
  label,
}: {
  players: Player[]
  onSelect: (playerId: string) => void
  label: string
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <div className="grid grid-cols-2 gap-1">
        {players.map(player => (
          <button
            key={player.id}
            type="button"
            onClick={() => onSelect(player.id)}
            className="flex items-center gap-2 text-sm p-2 rounded border border-gray-200 hover:border-primary-400 hover:bg-primary-50 transition-colors text-left"
          >
            <span className="font-bold text-primary-600 w-6 text-right">{player.number}</span>
            <span className="truncate">{player.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export function EventRecorder() {
  const { state, dispatch } = useMatch()
  const [selectedTeam, setSelectedTeam] = useState<SelectedTeam>('home')
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null)
  const [subOutPlayerId, setSubOutPlayerId] = useState<string | null>(null)

  const team = selectedTeam === 'home' ? state.homeTeam : state.awayTeam
  if (!team) return null

  const teamId = team.id

  const handlePlayerSelect = (playerId: string) => {
    if (!selectedEvent) return

    if (selectedEvent === 'substitution' && subOutPlayerId === null) {
      setSubOutPlayerId(playerId)
      return
    }

    const event: MatchEvent = {
      id: crypto.randomUUID(),
      type: selectedEvent,
      timestamp: state.elapsedTime,
      playerId: selectedEvent === 'substitution' && subOutPlayerId ? subOutPlayerId : playerId,
      teamId,
      secondPlayerId: selectedEvent === 'substitution' ? playerId : undefined,
    }

    dispatch(matchActions.addEvent(event))
    setSelectedEvent(null)
    setSubOutPlayerId(null)
  }

  const handleEventSelect = (eventType: EventType) => {
    setSelectedEvent(selectedEvent === eventType ? null : eventType)
    setSubOutPlayerId(null)
  }

  const getSubstitutionLabel = (): string => {
    if (subOutPlayerId === null) return 'Selecciona jugador que SALE'
    const player = team.players.find(p => p.id === subOutPlayerId)
    return `Sale: ${player?.name ?? '?'} — Selecciona jugador que ENTRA`
  }

  return (
    <Card title="Registro de eventos">
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button
            variant={selectedTeam === 'home' ? 'primary' : 'outline'}
            onClick={() => {
              setSelectedTeam('home')
              setSelectedEvent(null)
              setSubOutPlayerId(null)
            }}
            fullWidth
            size="sm"
          >
            {state.homeTeam?.name ?? 'Local'}
          </Button>
          <Button
            variant={selectedTeam === 'away' ? 'primary' : 'outline'}
            onClick={() => {
              setSelectedTeam('away')
              setSelectedEvent(null)
              setSubOutPlayerId(null)
            }}
            fullWidth
            size="sm"
          >
            {state.awayTeam?.name ?? 'Visitante'}
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {EVENT_TYPES.map(type => (
            <button
              key={type}
              type="button"
              onClick={() => handleEventSelect(type)}
              className={`
                px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${
                  selectedEvent === type
                    ? EVENT_COLORS[type]
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {EVENT_LABELS[type]}
            </button>
          ))}
        </div>

        {selectedEvent && (
          <div className="border-t border-gray-200 pt-3">
            {selectedEvent === 'substitution' && (
              <p className="text-sm font-medium text-blue-600 mb-2">{getSubstitutionLabel()}</p>
            )}
            <PlayerList
              players={team.players}
              onSelect={handlePlayerSelect}
              label={
                selectedEvent === 'substitution' && subOutPlayerId !== null
                  ? 'Jugador que entra:'
                  : `Selecciona jugador para ${EVENT_LABELS[selectedEvent]}:`
              }
            />
          </div>
        )}
      </div>
    </Card>
  )
}
