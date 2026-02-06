import { useState } from 'react'
import { Input, Button } from '@/shared/components'
import type { ScrapedLineupData, LineupPlayer } from '../types'

type LineupManualProps = {
  onSaved: (data: ScrapedLineupData) => void
}

type PlayerRow = {
  id: string
  number: string
  name: string
}

type TeamForm = {
  name: string
  starters: PlayerRow[]
  substitutes: PlayerRow[]
}

function createEmptyRow(): PlayerRow {
  return { id: crypto.randomUUID(), number: '', name: '' }
}

function createEmptyTeam(): TeamForm {
  return {
    name: '',
    starters: [createEmptyRow()],
    substitutes: [createEmptyRow()],
  }
}

function PlayerRowInput({
  player,
  onChange,
  onRemove,
  canRemove,
}: {
  player: PlayerRow
  onChange: (id: string, field: 'number' | 'name', value: string) => void
  onRemove: (id: string) => void
  canRemove: boolean
}) {
  return (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        placeholder="#"
        value={player.number}
        onChange={e => onChange(player.id, 'number', e.target.value)}
        className="w-16 text-center"
        min={0}
        max={99}
      />
      <Input
        placeholder="Nombre del jugador"
        value={player.name}
        onChange={e => onChange(player.id, 'name', e.target.value)}
        fullWidth
      />
      {canRemove && (
        <button
          type="button"
          onClick={() => onRemove(player.id)}
          className="text-red-400 hover:text-red-600 px-2 py-1 text-lg shrink-0"
          aria-label="Eliminar jugador"
        >
          &times;
        </button>
      )}
    </div>
  )
}

function TeamFormSection({
  label,
  team,
  onChange,
}: {
  label: string
  team: TeamForm
  onChange: (team: TeamForm) => void
}) {
  const updatePlayer = (
    group: 'starters' | 'substitutes',
    id: string,
    field: 'number' | 'name',
    value: string,
  ) => {
    onChange({
      ...team,
      [group]: team[group].map(p => (p.id === id ? { ...p, [field]: value } : p)),
    })
  }

  const addPlayer = (group: 'starters' | 'substitutes') => {
    onChange({
      ...team,
      [group]: [...team[group], createEmptyRow()],
    })
  }

  const removePlayer = (group: 'starters' | 'substitutes', id: string) => {
    onChange({
      ...team,
      [group]: team[group].filter(p => p.id !== id),
    })
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-primary-700">{label}</h3>

      <Input
        label="Nombre del equipo"
        placeholder="Ej: CF Barcelona"
        value={team.name}
        onChange={e => onChange({ ...team, name: e.target.value })}
        fullWidth
      />

      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-primary-600">Titulares</h4>
        {team.starters.map(player => (
          <PlayerRowInput
            key={player.id}
            player={player}
            onChange={(id, field, value) => updatePlayer('starters', id, field, value)}
            onRemove={id => removePlayer('starters', id)}
            canRemove={team.starters.length > 1}
          />
        ))}
        <Button variant="outline" size="sm" onClick={() => addPlayer('starters')}>
          + Titular
        </Button>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-primary-600">Suplentes</h4>
        {team.substitutes.map(player => (
          <PlayerRowInput
            key={player.id}
            player={player}
            onChange={(id, field, value) => updatePlayer('substitutes', id, field, value)}
            onRemove={id => removePlayer('substitutes', id)}
            canRemove={team.substitutes.length > 1}
          />
        ))}
        <Button variant="outline" size="sm" onClick={() => addPlayer('substitutes')}>
          + Suplente
        </Button>
      </div>
    </div>
  )
}

function buildPlayers(rows: PlayerRow[], isStarter: boolean): LineupPlayer[] {
  return rows
    .filter(r => r.name.trim() !== '')
    .map(r => ({
      id: r.id,
      name: r.name.trim(),
      number: Number(r.number) || 0,
      isStarter,
    }))
}

function validate(home: TeamForm, away: TeamForm): string | null {
  if (!home.name.trim()) return 'Introduce el nombre del equipo local'
  if (!away.name.trim()) return 'Introduce el nombre del equipo visitante'

  const homeStarters = home.starters.filter(r => r.name.trim())
  const awayStarters = away.starters.filter(r => r.name.trim())

  if (homeStarters.length === 0) return 'Añade al menos un titular al equipo local'
  if (awayStarters.length === 0) return 'Añade al menos un titular al equipo visitante'

  return null
}

export function LineupManual({ onSaved }: LineupManualProps) {
  const [homeTeam, setHomeTeam] = useState<TeamForm>(createEmptyTeam)
  const [awayTeam, setAwayTeam] = useState<TeamForm>(createEmptyTeam)
  const [error, setError] = useState<string | null>(null)

  const handleSave = () => {
    const validationError = validate(homeTeam, awayTeam)
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)

    const data: ScrapedLineupData = {
      homeTeam: {
        name: homeTeam.name.trim(),
        players: [
          ...buildPlayers(homeTeam.starters, true),
          ...buildPlayers(homeTeam.substitutes, false),
        ],
      },
      awayTeam: {
        name: awayTeam.name.trim(),
        players: [
          ...buildPlayers(awayTeam.starters, true),
          ...buildPlayers(awayTeam.substitutes, false),
        ],
      },
    }

    onSaved(data)
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <TeamFormSection label="Equipo Local" team={homeTeam} onChange={setHomeTeam} />

        <div className="border-t md:border-t-0 md:border-l border-gray-200 md:pl-6 pt-4 md:pt-0">
          <TeamFormSection label="Equipo Visitante" team={awayTeam} onChange={setAwayTeam} />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button onClick={handleSave} fullWidth>
        Guardar alineaciones
      </Button>
    </div>
  )
}
