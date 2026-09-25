import type { Fixture, Rankings, Standings } from '../types/data'

export type Highlights = {
  scorer: { name: string; teamId: number; goals: number } | null
  assister: { name: string; teamId: number; assists: number } | null
  attack: { teamId: number; goals: number }
  defence: { teamId: number; goals: number }
  avgGoals: number
}

export function getHighlights(standings: Standings, rankings: Rankings, fixtures: Fixture[]): Highlights {
  const rows = standings.all
  const attack = rows.reduce((best, r) => (r.goalsFor > best.goalsFor ? r : best))
  const defence = rows.reduce((best, r) => (r.goalsAgainst < best.goalsAgainst ? r : best))
  const scorer = rankings.scorers.reduce<Rankings['scorers'][number] | null>(
    (best, p) => (!best || p.goals > best.goals ? p : best),
    null,
  )
  const assister = rankings.assists.reduce<Rankings['assists'][number] | null>(
    (best, p) => (!best || p.assists > best.assists ? p : best),
    null,
  )
  const finished = fixtures.filter((f) => f.status === 'finished' && f.homeGoals !== null && f.awayGoals !== null)
  const total = finished.reduce((sum, f) => sum + (f.homeGoals ?? 0) + (f.awayGoals ?? 0), 0)
  return {
    scorer: scorer && { name: scorer.name, teamId: scorer.teamId, goals: scorer.goals },
    assister: assister && { name: assister.name, teamId: assister.teamId, assists: assister.assists },
    attack: { teamId: attack.teamId, goals: attack.goalsFor },
    defence: { teamId: defence.teamId, goals: defence.goalsAgainst },
    avgGoals: finished.length ? total / finished.length : 0,
  }
}

/** `goals` is null for rounds with no finished match. */
export function goalsPerRound(fixtures: Fixture[]): { round: number; goals: number | null }[] {
  const byRound = new Map<number, number | null>()
  for (const f of fixtures) {
    if (!byRound.has(f.round)) byRound.set(f.round, null)
    if (f.status === 'finished' && f.homeGoals !== null && f.awayGoals !== null) {
      byRound.set(f.round, (byRound.get(f.round) ?? 0) + f.homeGoals + f.awayGoals)
    }
  }
  return [...byRound].map(([round, goals]) => ({ round, goals })).sort((a, b) => a.round - b.round)
}
