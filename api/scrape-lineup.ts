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

    // Extract teams data
    const teams: TeamData[] = []

    // Find both team sections
    $('h2').each((_, element) => {
      const teamName = $(element).text().trim()

      if (!teamName) return

      // Get the next sections after the team name
      const nextElements = $(element).nextUntil('h2')

      const players: Player[] = []

      nextElements.each((_, el) => {
        const text = $(el).text()

        // Look for "Titulars" or "Suplents" sections
        if (text.includes('Titulars') || text.includes('Suplents')) {
          const isStarter = text.includes('Titulars')

          // Get list items after this section
          $(el)
            .find('li')
            .each((_, li) => {
              const playerText = $(li).text().trim()

              // Extract number and name
              // Format: "1. SURNAME, Name" or similar
              const match = playerText.match(/^(\d+)\.\s*(.+)$/)

              if (match) {
                const number = Number.parseInt(match[1] || '0', 10)
                const name = match[2]?.trim() || ''

                if (name) {
                  players.push({
                    id: `${teamName}-${number}-${Date.now()}`,
                    name,
                    number,
                    isStarter,
                  })
                }
              }
            })
        }
      })

      if (players.length > 0) {
        teams.push({
          name: teamName,
          players,
        })
      }
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
