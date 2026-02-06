# Context - Estado Global

## MatchContext

Context principal de la aplicación que maneja el estado del partido en curso.

### Uso

```tsx
import { MatchProvider, useMatch, matchActions } from '@/shared/context/MatchContext'

// Wrap your app
function App() {
  return (
    <MatchProvider>
      <YourComponents />
    </MatchProvider>
  )
}

// Use in any component
function MyComponent() {
  const { state, dispatch } = useMatch()

  const handleStart = () => {
    dispatch(matchActions.startMatch())
  }

  return (
    <div>
      <p>Playing: {state.isPlaying ? 'Yes' : 'No'}</p>
      <button onClick={handleStart}>Start Match</button>
    </div>
  )
}
```

### State Shape

```ts
{
  homeTeam: Team | null
  awayTeam: Team | null
  events: MatchEvent[]
  isPlaying: boolean
  startTime: number | null
  elapsedTime: number
  currentHalf: 1 | 2
}
```

### Actions

- `setHomeTeam(team)` - Establece equipo local
- `setAwayTeam(team)` - Establece equipo visitante
- `startMatch()` - Inicia el partido
- `pauseMatch()` - Pausa el partido
- `resumeMatch()` - Reanuda el partido
- `endMatch()` - Finaliza el partido
- `addEvent(event)` - Añade un evento (gol, tarjeta, etc.)
- `updateTime(time)` - Actualiza el tiempo transcurrido
- `switchHalf()` - Cambia de primera a segunda parte
- `resetMatch()` - Resetea todo el estado

## Arquitectura

```
User Action → Component → dispatch(action) → Reducer → New State → Re-render
```

## Persistencia

TODO: Añadir persistencia en LocalStorage/IndexedDB para no perder datos al recargar.
