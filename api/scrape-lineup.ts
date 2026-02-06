import type { VercelRequest, VercelResponse } from '@vercel/node'
import * as cheerio from 'cheerio'

type Player = {
  id: string
  name: string
  number: number
  position?: string
  isStarter: boolean
}

type TeamData = {
  name: string
  players: Player[]
}

type ScrapedData = {
  homeTeam: TeamData
  awayTeam: TeamData
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { url } = req.body

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL is required' })
    }

    if (!url.includes('fcf.cat/acta')) {
      return res.status(400).json({ error: 'Invalid URL. Must be from fcf.cat/acta' })
    }

    // Fetch the HTML
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`)
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    // Extract team names from header
    const teamNames: string[] = []
    $('.acta-equip a span').each((_, el) => {
      const name = $(el).text().trim()
      if (name) {
        teamNames.push(name)
      }
    })

    if (teamNames.length !== 2) {
      return res.status(500).json({
        error: `Expected 2 team names, found ${teamNames.length}`,
      })
    }

    // Initialize teams
    const teams: TeamData[] = [
      { name: teamNames[0]!, players: [] },
      { name: teamNames[1]!, players: [] },
    ]

    let currentTeamIndex = 0
    let foundStartersForTeam = false

    // Find all tables with player data (only Titulars and Suplents)
    $('.acta-table').each((_, table) => {
      const $table = $(table)

      // Check if this is a Titulars or Suplents table
      const headerText = $table.find('thead th').first().text().trim()

      // Skip if not a player table
      if (headerText !== 'Titulars' && headerText !== 'Suplents') {
        return
      }

      const isStarter = headerText === 'Titulars'

      // If we find Titulars after having found Suplents, move to next team
      if (isStarter && foundStartersForTeam) {
        currentTeamIndex++
        foundStartersForTeam = false
      }

      if (isStarter) {
        foundStartersForTeam = true
      }

      // Stop if we've processed both teams
      if (currentTeamIndex >= 2) {
        return
      }

      // Extract players from tbody rows
      $table.find('tbody tr').each((_, row) => {
        const $row = $(row)

        // Get jersey number from first td
        const numberText = $row.find('td').first().find('.num-samarreta-acta2').text().trim()
        const number = numberText ? Number.parseInt(numberText, 10) : 0

        // Get player name from second td link
        const name = $row.find('td:nth-child(2) a').text().trim()

        if (name && number) {
          teams[currentTeamIndex]!.players.push({
            id: `${currentTeamIndex}-${number}-${Date.now()}-${Math.random()}`,
            name,
            number,
            isStarter,
          })
        }
      })
    })

    if (teams.length !== 2) {
      return res.status(500).json({
        error: `Expected 2 teams, found ${teams.length}. La página puede haber cambiado su estructura.`,
      })
    }

    const data: ScrapedData = {
      homeTeam: teams[0]!,
      awayTeam: teams[1]!,
    }

    return res.status(200).json(data)
  } catch (error) {
    console.error('Scraping error:', error)
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Error al procesar la página',
    })
  }
}
