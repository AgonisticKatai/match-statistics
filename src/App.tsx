import { useState } from 'react'
import { LineupPage } from './features/lineup'
import { MatchControlPage } from './features/match-control'
import { useMatch } from './shared/context/MatchContext'

type Page = 'lineup' | 'match-control'

function App() {
  const { state } = useMatch()
  const hasTeams = state.homeTeam !== null && state.awayTeam !== null
  const [page, setPage] = useState<Page>(hasTeams ? 'match-control' : 'lineup')

  switch (page) {
    case 'lineup':
      return <LineupPage onStartMatch={() => setPage('match-control')} />
    case 'match-control':
      return <MatchControlPage onBackToLineup={() => setPage('lineup')} />
  }
}

export default App
