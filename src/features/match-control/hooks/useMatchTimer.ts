import { useEffect, useRef } from 'react'
import { useMatch, matchActions } from '@/shared/context/MatchContext'

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function useMatchTimer() {
  const { state, dispatch } = useMatch()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (state.isPlaying && state.startTime !== null) {
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - state.startTime!
        dispatch(matchActions.updateTime(elapsed))
      }, 1000)
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [state.isPlaying, state.startTime, dispatch])

  return {
    formatted: formatTime(state.elapsedTime),
    currentHalf: state.currentHalf,
    isPlaying: state.isPlaying,
    hasStarted: state.startTime !== null,
  }
}
