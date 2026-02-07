import { Button, Card } from '@/shared/components'
import { useMatch } from '@/shared/context/MatchContext'
import type { MatchEvent, Player } from '@/shared/types'

const EVENT_LABELS: Record<MatchEvent['type'], string> = {
  goal: 'Gol',
  'yellow-card': 'Tarjeta amarilla',
  'red-card': 'Tarjeta roja',
  substitution: 'Cambio',
  corner: 'Corner',
  shot: 'Tiro',
}

function download(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function formatMinute(ms: number): string {
  return `${Math.floor(ms / 60000)}'`
}

export function MatchExport() {
  const { state } = useMatch()

  if (!state.homeTeam || !state.awayTeam) return null

  const playerMap = new Map<string, Player>()
  const teamNameMap = new Map<string, string>()

  teamNameMap.set(state.homeTeam.id, state.homeTeam.name)
  teamNameMap.set(state.awayTeam.id, state.awayTeam.name)

  for (const p of state.homeTeam.players) playerMap.set(p.id, p)
  for (const p of state.awayTeam.players) playerMap.set(p.id, p)

  const handleExportJSON = () => {
    const data = {
      homeTeam: state.homeTeam,
      awayTeam: state.awayTeam,
      events: state.events,
      currentHalf: state.currentHalf,
      elapsedTime: state.elapsedTime,
    }
    const filename = `${state.homeTeam!.name}-vs-${state.awayTeam!.name}.json`
    download(JSON.stringify(data, null, 2), filename, 'application/json')
  }

  const handleExportCSV = () => {
    const header = 'Minuto,Tipo,Jugador,Dorsal,Equipo,Jugador 2,Dorsal 2'
    const rows = state.events.map(e => {
      const player = playerMap.get(e.playerId)
      const team = teamNameMap.get(e.teamId) ?? ''
      const secondPlayer = e.secondPlayerId ? playerMap.get(e.secondPlayerId) : null

      return [
        formatMinute(e.timestamp),
        EVENT_LABELS[e.type],
        player?.name ?? '',
        player?.number ?? '',
        team,
        secondPlayer?.name ?? '',
        secondPlayer?.number ?? '',
      ]
        .map(v => `"${v}"`)
        .join(',')
    })

    const csv = [header, ...rows].join('\n')
    const filename = `${state.homeTeam!.name}-vs-${state.awayTeam!.name}.csv`
    download(csv, filename, 'text/csv')
  }

  return (
    <Card title="Exportar">
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" onClick={handleExportJSON}>
          Descargar JSON
        </Button>
        <Button variant="outline" onClick={handleExportCSV}>
          Descargar CSV
        </Button>
      </div>
    </Card>
  )
}
