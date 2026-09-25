import type { Fixture } from '../types/data'

export type SideRecord = { w: number; d: number; l: number; gf: number; ga: number }
export type Outcome = 'V' | 'E' | 'D'

const byDate = (a: Fixture, b: Fixture) => a.date.localeCompare(b.date)

export const clubMatches = (fixtures: Fixture[], teamId: number): Fixture[] =>
  fixtures.filter((f) => f.homeId === teamId || f.awayId === teamId).sort(byDate)

export const isFinished = (f: Fixture): boolean =>
  f.status === 'finished' && f.homeGoals !== null && f.awayGoals !== null

/** Goals from the club's point of view. Only meaningful on finished fixtures. */
export function clubScore(f: Fixture, teamId: number): { gf: number; ga: number } {
  const [h, a] = [f.homeGoals ?? 0, f.awayGoals ?? 0]
  return f.homeId === teamId ? { gf: h, ga: a } : { gf: a, ga: h }
}

export function outcome(f: Fixture, teamId: number): Outcome {
  const { gf, ga } = clubScore(f, teamId)
  return gf > ga ? 'V' : gf === ga ? 'E' : 'D'
}

export function clubRecord(fixtures: Fixture[], teamId: number): { home: SideRecord; away: SideRecord } {
  const rec = { home: { w: 0, d: 0, l: 0, gf: 0, ga: 0 }, away: { w: 0, d: 0, l: 0, gf: 0, ga: 0 } }
  for (const f of fixtures) {
    if (!isFinished(f) || (f.homeId !== teamId && f.awayId !== teamId)) continue
    const side = rec[f.homeId === teamId ? 'home' : 'away']
    const { gf, ga } = clubScore(f, teamId)
    side.gf += gf
    side.ga += ga
    if (gf > ga) side.w++
    else if (gf === ga) side.d++
    else side.l++
  }
  return rec
}

export const lastMatch = (fixtures: Fixture[], teamId: number): Fixture | null =>
  clubMatches(fixtures, teamId).filter(isFinished).at(-1) ?? null

export const nextMatch = (fixtures: Fixture[], teamId: number): Fixture | null =>
  clubMatches(fixtures, teamId).find((f) => f.status === 'scheduled') ?? null

export const latestRound = (fixtures: Fixture[]): number =>
  Math.max(0, ...fixtures.filter(isFinished).map((f) => f.round))

export const roundFixtures = (fixtures: Fixture[], round: number): Fixture[] =>
  fixtures.filter((f) => f.round === round).sort(byDate)
