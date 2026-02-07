import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MatchProvider } from './shared/context/MatchContext'
import App from './App'
import './index.css'

// Auto-reload when a new Service Worker takes control (new deployment)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload()
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MatchProvider>
      <App />
    </MatchProvider>
  </StrictMode>,
)
