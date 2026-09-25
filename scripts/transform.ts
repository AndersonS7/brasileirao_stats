import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { LEAGUE_ID, SEASON_FILE } from './config.ts'
import { readCached } from './client.ts'
import { downloadFile, findTeam } from './sportsdb.ts'
import { TEAM_MAP } from './team-map.ts'
import type {
  Bin, Fixture, PlayerRow, Rankings, Season, SquadPlayer, Squads, StandingRow, Team, TeamStats, Zone,
} from '../src/types/data.ts'

const { season } = JSON.parse(readFileSync(SEASON_FILE, 'utf8')) as Season
const lp = { league: LEAGUE_ID, season }
const OUT = 'src/data'
const IMG = 'public/img'
const FALLBACK_COLOR = '#0B6B39'

function cached(path: string, params: Record<string, string | number>) {
  const res = readCached(path, params)
  if (!res) throw new Error(`Missing cache for ${path} ${JSON.stringify(params)}; run npm run data:collect`)
  return res.response as any[] // eslint-disable-line @typescript-eslint/no-explicit-any -- raw API payload, shaped field by field below
}

function write(name: string, data: unknown): void {
  writeFileSync(`${OUT}/${name}.json`, JSON.stringify(data) + '\n')
}

function contrastWithWhite(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 1.05 / (0.2126 * r + 0.7152 * g + 0.0722 * b + 0.05)
}

/** Header text is white, so pick the first club color that keeps at least 3:1 against it. */
function pickColor(...candidates: (string | null)[]): string {
  const ok = candidates.find((c) => c && /^#[0-9a-f]{6}$/i.test(c) && contrastWithWhite(c) >= 3)
  return ok ?? FALLBACK_COLOR
}

function zoneOf(description: string | null): Zone {
  if (!description) return null
  if (description.includes('Libertadores')) return 'libertadores'
  if (description.includes('Sudamericana')) return 'sudamericana'
  if (description.includes('Relegation')) return 'relegation'
  return null
}

const FORM: Record<string, string> = { W: 'V', D: 'E', L: 'D' }

function buildStandings(): StandingRow[] {
  const rows = cached('standings', lp)[0].league.standings[0]
  return rows.map((r: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
    rank: r.rank,
    teamId: r.team.id,
    played: r.all.played,
    win: r.all.win,
    draw: r.all.draw,
    lose: r.all.lose,
    goalsFor: r.all.goals.for,
    goalsAgainst: r.all.goals.against,
    goalDiff: r.goalsDiff,
    points: r.points,
    form: [...(r.form ?? '')].map((c) => FORM[c] ?? c).join(''),
    zone: zoneOf(r.description),
  }))
}

function buildFixtures(): Fixture[] {
  return cached('fixtures', lp)
    .map((f: any): Fixture => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
      id: f.fixture.id,
      round: Number(/(\d+)$/.exec(f.league.round)?.[1] ?? 0),
      date: f.fixture.date,
      homeId: f.teams.home.id,
      awayId: f.teams.away.id,
      homeGoals: f.goals.home,
      awayGoals: f.goals.away,
      status: f.fixture.status.short === 'FT' ? 'finished' : ['NS', 'TBD'].includes(f.fixture.status.short) ? 'scheduled' : 'other',
    }))
    .sort((a: Fixture, b: Fixture) => a.date.localeCompare(b.date) || a.id - b.id)
}

const BINS: Bin[] = ['0-15', '16-30', '31-45', '46-60', '61-75', '76-90', '91-105', '106-120']

function buildStats(teamId: number): TeamStats {
  const s = cached('teams/statistics', { ...lp, team: teamId }) as any // eslint-disable-line @typescript-eslint/no-explicit-any
  const minute = (side: 'for' | 'against', bin: Bin): number | null => s.goals[side].minute[bin]?.total ?? null
  const sum = (kind: 'yellow' | 'red'): number | null => {
    const parts = Object.values(s.cards[kind] as Record<string, { total: number | null }>)
    return parts.every((p) => p.total === null) ? null : parts.reduce((n, p) => n + (p.total ?? 0), 0)
  }
  return {
    teamId,
    goalsByMinute: Object.fromEntries(BINS.map((b) => [b, { for: minute('for', b), against: minute('against', b) }])) as TeamStats['goalsByMinute'],
    streak: { wins: s.biggest.streak.wins, draws: s.biggest.streak.draws, loses: s.biggest.streak.loses },
    cleanSheet: { home: s.clean_sheet.home, away: s.clean_sheet.away },
    formations: (s.lineups ?? []).map((l: { formation: string; played: number }) => ({ formation: l.formation, played: l.played })),
    cards: { yellow: sum('yellow'), red: sum('red') },
  }
}

const players = new Map<number, string>() // player id -> remote photo URL

function playerPhoto(id: number, url: string | null): string | null {
  if (!url) return null
  players.set(id, url)
  return `players/${id}.png`
}

function buildRankings(): Rankings {
  const rows = (endpoint: string): PlayerRow[] =>
    cached(`players/${endpoint}`, lp).map((r: any): PlayerRow => { // eslint-disable-line @typescript-eslint/no-explicit-any
      const st = r.statistics[0]
      return {
        id: r.player.id,
        name: r.player.name,
        teamId: st.team.id,
        photo: playerPhoto(r.player.id, r.player.photo),
        goals: st.goals.total ?? 0,
        assists: st.goals.assists ?? 0,
        yellow: st.cards.yellow ?? 0,
        red: st.cards.red ?? 0,
      }
    })
  return { scorers: rows('topscorers'), assists: rows('topassists'), yellow: rows('topyellowcards'), red: rows('topredcards') }
}

function buildSquads(teamIds: number[]): Squads {
  return Object.fromEntries(
    teamIds.map((id) => [
      id,
      (cached('players/squads', { team: id })[0]?.players ?? []).map((p: any): SquadPlayer => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
        id: p.id, name: p.name, position: p.position ?? null, number: p.number ?? null, age: p.age ?? null,
        photo: playerPhoto(p.id, p.photo),
      })),
    ]),
  )
}

async function buildTeams(): Promise<Team[]> {
  const api = new Map<number, any>(cached('teams', lp).map((t: any) => [t.team.id, t])) // eslint-disable-line @typescript-eslint/no-explicit-any
  mkdirSync(`${IMG}/teams`, { recursive: true })
  mkdirSync(`${IMG}/venues`, { recursive: true })
  const teams: Team[] = []
  for (const m of TEAM_MAP) {
    const a = api.get(m.apiFootballId)
    if (!a) throw new Error(`API-Football has no team ${m.apiFootballId} (${m.slug})`)
    const s = await findTeam(m.search, m.apiFootballId)
    if (!s) throw new Error(`TheSportsDB has no match for ${m.slug} (${m.search})`)
    const badge = s.strBadge ? await downloadFile(`${s.strBadge}/small`, `${IMG}/teams/${m.slug}.png`) : false
    const photo = s.strFanart1 ? await downloadFile(`${s.strFanart1}/medium`, `${IMG}/venues/${m.slug}.jpg`) : false
    teams.push({
      id: m.apiFootballId,
      slug: m.slug,
      name: m.name,
      short: m.short,
      founded: a.team.founded ?? null,
      city: a.venue.city ?? null,
      stadium: a.venue.name ?? null,
      capacity: a.venue.capacity ?? null,
      color: pickColor(s.strColour1, s.strColour2, s.strColour3),
      badge: badge ? `teams/${m.slug}.png` : '',
      venuePhoto: photo ? `venues/${m.slug}.jpg` : null,
      description: s.strDescriptionEN?.split(/\r?\n\r?\n/)[0]?.trim() || null,
    })
    console.log(`team ${m.slug}: badge ${badge ? 'ok' : 'MISSING'}, photo ${photo ? 'ok' : 'none'}`)
  }
  return teams
}

async function downloadPlayers(): Promise<void> {
  mkdirSync(`${IMG}/players`, { recursive: true })
  let ok = 0
  for (const [id, url] of players) if (await downloadFile(url, `${IMG}/players/${id}.png`, 250)) ok++
  console.log(`player photos: ${ok}/${players.size}`)
}

mkdirSync(OUT, { recursive: true })
const standings = buildStandings()
const teamIds = standings.map((r) => r.teamId)
write('standings-api', standings)
write('fixtures', buildFixtures())
write('team-stats', Object.fromEntries(teamIds.map((id) => [id, buildStats(id)])))
write('rankings', buildRankings())
write('squads', buildSquads(teamIds))
write('teams', await buildTeams())
await downloadPlayers()
console.log('transform done')
