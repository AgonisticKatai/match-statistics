import { useState } from 'react'
import { LineupPage } from './features/lineup'
import { MatchControlPage } from './features/match-control'

type Page = 'lineup' | 'match-control'

function App() {
  const [page, setPage] = useState<Page>('lineup')

  switch (page) {
    case 'lineup':
      return <LineupPage onStartMatch={() => setPage('match-control')} />
    case 'match-control':
      return <MatchControlPage onBackToLineup={() => setPage('lineup')} />
  }
}

export default App
