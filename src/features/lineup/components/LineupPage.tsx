import { useState } from 'react'
import { Card, Button } from '@/shared/components'
import { useMatch, matchActions } from '@/shared/context/MatchContext'
import { LineupImporter } from './LineupImporter'
import { LineupManual } from './LineupManual'
import type { ScrapedLineupData, LineupTeamData } from '../types'
import type { Team } from '@/shared/types'

type LineupPageProps = {
  onStartMatch: () => void
}

type LineupMode = 'import' | 'manual'

function toTeam(data: LineupTeamData): Team {
  return {
    id: crypto.randomUUID(),
    name: data.name,
    players: data.players.map(p => ({
      id: p.id,
      name: p.name,
      number: p.number,
      position: p.position,
    })),
  }
}

export function LineupPage({ onStartMatch }: LineupPageProps) {
  const [mode, setMode] = useState<LineupMode>('import')
  const [lineupData, setLineupData] = useState<ScrapedLineupData | null>(null)
  const { dispatch } = useMatch()

  const handleLineupImported = (data: ScrapedLineupData) => {
    setLineupData(data)
    dispatch(matchActions.setHomeTeam(toTeam(data.homeTeam)))
    dispatch(matchActions.setAwayTeam(toTeam(data.awayTeam)))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Alineaciones</h1>
          <p className="text-gray-600">
            Importa las alineaciones desde la FCF o introdúcelas manualmente
          </p>
        </div>

        <Card className="mb-6">
          <div className="flex gap-2 mb-4">
            <Button
              variant={mode === 'import' ? 'primary' : 'outline'}
              onClick={() => setMode('import')}
              fullWidth
            >
              Importar desde FCF
            </Button>
            <Button
              variant={mode === 'manual' ? 'primary' : 'outline'}
              onClick={() => setMode('manual')}
              fullWidth
            >
              Entrada manual
            </Button>
          </div>

          {mode === 'import' ? (
            <LineupImporter onImported={handleLineupImported} />
          ) : (
            <LineupManual onSaved={handleLineupImported} />
          )}
        </Card>

        {lineupData && (
          <>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <Card title={lineupData.homeTeam.name}>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-primary-700">
                    Titulares ({lineupData.homeTeam.players.filter(p => p.isStarter).length})
                  </h4>
                  {lineupData.homeTeam.players
                    .filter(p => p.isStarter)
                    .map(player => (
                      <div
                        key={player.id}
                        className="flex items-center gap-2 text-sm p-2 bg-gray-50 rounded"
                      >
                        <span className="font-bold text-primary-600 w-8">{player.number}</span>
                        <span>{player.name}</span>
                      </div>
                    ))}

                  <h4 className="font-semibold text-sm text-primary-700 mt-4">
                    Suplentes ({lineupData.homeTeam.players.filter(p => !p.isStarter).length})
                  </h4>
                  {lineupData.homeTeam.players
                    .filter(p => !p.isStarter)
                    .map(player => (
                      <div
                        key={player.id}
                        className="flex items-center gap-2 text-sm p-2 bg-gray-50 rounded"
                      >
                        <span className="font-bold text-gray-400 w-8">{player.number}</span>
                        <span>{player.name}</span>
                      </div>
                    ))}
                </div>
              </Card>

              <Card title={lineupData.awayTeam.name}>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-primary-700">
                    Titulares ({lineupData.awayTeam.players.filter(p => p.isStarter).length})
                  </h4>
                  {lineupData.awayTeam.players
                    .filter(p => p.isStarter)
                    .map(player => (
                      <div
                        key={player.id}
                        className="flex items-center gap-2 text-sm p-2 bg-gray-50 rounded"
                      >
                        <span className="font-bold text-primary-600 w-8">{player.number}</span>
                        <span>{player.name}</span>
                      </div>
                    ))}

                  <h4 className="font-semibold text-sm text-primary-700 mt-4">
                    Suplentes ({lineupData.awayTeam.players.filter(p => !p.isStarter).length})
                  </h4>
                  {lineupData.awayTeam.players
                    .filter(p => !p.isStarter)
                    .map(player => (
                      <div
                        key={player.id}
                        className="flex items-center gap-2 text-sm p-2 bg-gray-50 rounded"
                      >
                        <span className="font-bold text-gray-400 w-8">{player.number}</span>
                        <span>{player.name}</span>
                      </div>
                    ))}
                </div>
              </Card>
            </div>

            <Button onClick={onStartMatch} fullWidth size="lg">
              Empezar partido
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
