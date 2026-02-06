import { useState } from 'react'
import { Card, Button } from '@/shared/components'
import { useMatch, matchActions } from '@/shared/context/MatchContext'
import { MatchTimer } from './MatchTimer'
import { EventRecorder } from './EventRecorder'
import { EventLog } from './EventLog'

type MatchControlPageProps = {
  onBackToLineup: () => void
}

type MatchPhase = 'pre-match' | 'playing' | 'paused' | 'finished'

function getPhase(isPlaying: boolean, startTime: number | null, elapsedTime: number): MatchPhase {
  if (startTime === null) return 'pre-match'
  if (isPlaying) return 'playing'
  if (elapsedTime > 0) return 'paused'
  return 'pre-match'
}

export function MatchControlPage({ onBackToLineup }: MatchControlPageProps) {
  const { state, dispatch } = useMatch()
  const [isFinished, setIsFinished] = useState(false)

  const phase: MatchPhase = isFinished
    ? 'finished'
    : getPhase(state.isPlaying, state.startTime, state.elapsedTime)

  const handleStart = () => {
    dispatch(matchActions.startMatch())
  }

  const handlePause = () => {
    dispatch(matchActions.pauseMatch())
  }

  const handleResume = () => {
    dispatch(matchActions.resumeMatch())
  }

  const handleSwitchHalf = () => {
    dispatch(matchActions.pauseMatch())
    dispatch(matchActions.switchHalf())
  }

  const handleEnd = () => {
    dispatch(matchActions.endMatch())
    setIsFinished(true)
  }

  const handleReset = () => {
    dispatch(matchActions.resetMatch())
    setIsFinished(false)
    onBackToLineup()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Control de partido</h1>
          {phase !== 'finished' && (
            <Button variant="ghost" size="sm" onClick={onBackToLineup}>
              Volver
            </Button>
          )}
        </div>

        {state.homeTeam && state.awayTeam && (
          <Card className="mb-6 text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="text-lg font-bold text-gray-900 flex-1 text-right">
                {state.homeTeam.name}
              </span>
              <span className="text-sm font-medium text-gray-400">vs</span>
              <span className="text-lg font-bold text-gray-900 flex-1 text-left">
                {state.awayTeam.name}
              </span>
            </div>

            <div className="py-6">
              <MatchTimer />
            </div>
          </Card>
        )}

        {(phase === 'playing' || phase === 'paused') && (
          <div className="space-y-6 mb-6">
            <EventRecorder />
            <EventLog />
          </div>
        )}

        {phase === 'finished' && state.events.length > 0 && (
          <div className="mb-6">
            <EventLog />
          </div>
        )}

        <Card>
          <div className="space-y-3">
            {phase === 'pre-match' && (
              <Button onClick={handleStart} fullWidth size="lg">
                Iniciar partido
              </Button>
            )}

            {phase === 'playing' && (
              <>
                <Button onClick={handlePause} variant="secondary" fullWidth size="lg">
                  Pausar
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={handleSwitchHalf} variant="outline">
                    {state.currentHalf === 1 ? 'Pasar a 2a parte' : 'Volver a 1a parte'}
                  </Button>
                  <Button onClick={handleEnd} variant="ghost">
                    Finalizar partido
                  </Button>
                </div>
              </>
            )}

            {phase === 'paused' && (
              <>
                <Button onClick={handleResume} fullWidth size="lg">
                  Reanudar
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={handleSwitchHalf} variant="outline">
                    {state.currentHalf === 1 ? 'Pasar a 2a parte' : 'Volver a 1a parte'}
                  </Button>
                  <Button onClick={handleEnd} variant="ghost">
                    Finalizar partido
                  </Button>
                </div>
              </>
            )}

            {phase === 'finished' && (
              <>
                <p className="text-center text-lg font-semibold text-primary-700 py-4">
                  Partido finalizado
                </p>
                <Button onClick={handleReset} variant="outline" fullWidth>
                  Nuevo partido
                </Button>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
