import type { Fixture, StandingRow, Standings } from '../types/data'

type Side = 'home' | 'away'

function empty(row: StandingRow): StandingRow {
  return { ...row, rank: 0, played: 0, win: 0, draw: 0, lose: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0 }
}

function tally(rows: StandingRow[], fixtures: Fixture[], side: Side): StandingRow[] {
  const byTeam = new Map(rows.map((r) => [r.teamId, empty(r)]))
  for (const f of fixtures) {
    if (f.status !== 'finished' || f.homeGoals === null || f.awayGoals === null) continue
    const id = side === 'home' ? f.homeId : f.awayId
    const row = byTeam.get(id)
    if (!row) continue
    const [gf, ga] = side === 'home' ? [f.homeGoals, f.awayGoals] : [f.awayGoals, f.homeGoals]
    row.played++
    row.goalsFor += gf
    row.goalsAgainst += ga
    if (gf > ga) row.win++
    else if (gf === ga) row.draw++
    else row.lose++
  }
  const sorted = [...byTeam.values()].map((r) => ({
    ...r,
    goalDiff: r.goalsFor - r.goalsAgainst,
    points: r.win * 3 + r.draw,
  }))
  sorted.sort((a, b) => b.points - a.points || b.win - a.win || b.goalDiff - a.goalDiff || b.goalsFor - a.goalsFor)
  return sorted.map((r, i) => ({ ...r, rank: i + 1 }))
}

/** `all` keeps the API rank (official tiebreakers); home and away are derived from fixtures. */
export function buildStandings(api: StandingRow[], fixtures: Fixture[]): Standings {
  return { all: api, home: tally(api, fixtures, 'home'), away: tally(api, fixtures, 'away') }
}
