import { useMatchTimer } from '../hooks/useMatchTimer'

export function MatchTimer() {
  const { formatted, currentHalf, isPlaying } = useMatchTimer()

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-primary-600">
        {currentHalf === 1 ? '1a Parte' : '2a Parte'}
      </span>
      <span className="text-6xl font-bold tabular-nums text-gray-900">{formatted}</span>
      {isPlaying && (
        <span className="inline-flex items-center gap-1.5 text-xs text-primary-600">
          <span className="h-2 w-2 rounded-full bg-primary-500 animate-pulse" />
          En juego
        </span>
      )}
    </div>
  )
}
