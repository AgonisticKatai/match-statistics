import type { ScrapedLineupData } from '../types'

type LineupManualProps = {
  onSaved: (data: ScrapedLineupData) => void
}

export function LineupManual({ onSaved: _onSaved }: LineupManualProps) {
  return (
    <div className="text-center py-8 text-gray-500">
      <p>Entrada manual de alineaciones</p>
      <p className="text-sm mt-2">Próximamente...</p>
    </div>
  )
}
