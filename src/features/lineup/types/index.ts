export type LineupPlayer = {
  id: string
  name: string
  number: number
  position?: string
  isStarter: boolean
}

export type LineupTeamData = {
  name: string
  players: LineupPlayer[]
}

export type ScrapedLineupData = {
  homeTeam: LineupTeamData
  awayTeam: LineupTeamData
}
