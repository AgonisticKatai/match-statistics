import { Card } from '@/shared/components'
import { useMatch } from '@/shared/context/MatchContext'
import type { MatchEvent } from '@/shared/types'

type EventType = MatchEvent['type']

const STAT_ROWS: { type: EventType; label: string }[] = [
  { type: 'goal', label: 'Goles' },
  { type: 'shot', label: 'Tiros' },
  { type: 'corner', label: 'Corners' },
  { type: 'yellow-card', label: 'Amarillas' },
  { type: 'red-card', label: 'Rojas' },
  { type: 'substitution', label: 'Cambios' },
]

function countByTeam(events: MatchEvent[], type: EventType, teamId: string): number {
  return events.filter(e => e.type === type && e.teamId === teamId).length
}

function StatBar({ home, away }: { home: number; away: number }) {
  const total = home + away
  if (total === 0) return <div className="h-2 rounded-full bg-gray-100" />

  const homePercent = (home / total) * 100

  return (
    <div className="h-2 rounded-full bg-gray-100 overflow-hidden flex">
      <div
        className="h-full bg-primary-500 transition-all duration-300"
        style={{ width: `${homePercent}%` }}
      />
      <div className="h-full bg-gray-400 flex-1" />
    </div>
  )
}

export function MatchStats() {
  const { state } = useMatch()

  if (!state.homeTeam || !state.awayTeam) return null

  const homeId = state.homeTeam.id
  const awayId = state.awayTeam.id

  return (
    <Card title="Estadísticas">
      <div className="space-y-3">
        {STAT_ROWS.map(({ type, label }) => {
          const home = countByTeam(state.events, type, homeId)
          const away = countByTeam(state.events, type, awayId)

          return (
            <div key={type}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-bold text-primary-700 w-8 text-center">{home}</span>
                <span className="text-gray-600 text-xs">{label}</span>
                <span className="font-bold text-gray-700 w-8 text-center">{away}</span>
              </div>
              <StatBar home={home} away={away} />
            </div>
          )
        })}
      </div>
    </Card>
  )
}
