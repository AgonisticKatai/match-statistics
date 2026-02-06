import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MatchProvider } from './shared/context/MatchContext'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MatchProvider>
      <App />
    </MatchProvider>
  </StrictMode>,
)
