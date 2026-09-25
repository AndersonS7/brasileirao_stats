export interface Season {
  season: number
  leagueId: number
  collectedAt: string
}

export type Zone = 'libertadores' | 'sudamericana' | 'relegation' | null

export interface Team {
  id: number
  slug: string
  name: string
  short: string
  founded: number | null
  city: string | null
  stadium: string | null
  capacity: number | null
  color: string
  badge: string
  venuePhoto: string | null
  description: string | null
}

export interface StandingRow {
  rank: number
  teamId: number
  played: number
  win: number
  draw: number
  lose: number
  goalsFor: number
  goalsAgainst: number
  goalDiff: number
  points: number
  /** Last 5 results, e.g. "VVDEV" */
  form: string
  zone: Zone
}

export interface Standings {
  all: StandingRow[]
  home: StandingRow[]
  away: StandingRow[]
}

export interface Fixture {
  id: number
  round: number
  date: string
  homeId: number
  awayId: number
  homeGoals: number | null
  awayGoals: number | null
  status: 'finished' | 'scheduled' | 'other'
}

export type Bin = '0-15' | '16-30' | '31-45' | '46-60' | '61-75' | '76-90' | '91-105' | '106-120'

export interface TeamStats {
  teamId: number
  goalsByMinute: Record<Bin, { for: number | null; against: number | null }>
  streak: { wins: number | null; draws: number | null; loses: number | null }
  cleanSheet: { home: number | null; away: number | null }
  formations: { formation: string; played: number }[]
  cards: { yellow: number | null; red: number | null }
}

export interface PlayerRow {
  id: number
  name: string
  teamId: number
  photo: string | null
  goals: number
  assists: number
  yellow: number
  red: number
}

export interface Rankings {
  scorers: PlayerRow[]
  assists: PlayerRow[]
  yellow: PlayerRow[]
  red: PlayerRow[]
}

export interface SquadPlayer {
  id: number
  name: string
  position: string | null
  number: number | null
  age: number | null
  photo: string | null
}

export type Squads = Record<number, SquadPlayer[]>
