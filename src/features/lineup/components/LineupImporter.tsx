import { useState } from 'react'
import { Input, Button } from '@/shared/components'
import type { ScrapedLineupData } from '../types'

type LineupImporterProps = {
  onImported: (data: ScrapedLineupData) => void
}

export function LineupImporter({ onImported }: LineupImporterProps) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImport = async () => {
    if (!url.trim()) {
      setError('Por favor introduce una URL')
      return
    }

    if (!url.includes('fcf.cat/acta')) {
      setError('La URL debe ser de fcf.cat/acta')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/scrape-lineup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      onImported(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al importar alineaciones')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Input
          type="url"
          placeholder="https://www.fcf.cat/acta/..."
          value={url}
          onChange={e => setUrl(e.target.value)}
          error={error || undefined}
          fullWidth
          disabled={loading}
        />
        <p className="mt-2 text-xs text-gray-500">
          Pega la URL del acta del partido de la Federación Catalana de Fútbol
        </p>
      </div>

      <Button onClick={handleImport} disabled={loading || !url.trim()} fullWidth>
        {loading ? 'Importando...' : 'Importar alineaciones'}
      </Button>

      {loading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      )}
    </div>
  )
}
