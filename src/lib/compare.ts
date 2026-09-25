import type { Fixture, StandingRow, Team, TeamStats } from '../types/data'

export type CompareKey = 'points' | 'wins' | 'goalsFor' | 'goalsAgainst' | 'winRate' | 'cleanSheets'

export type CompareRow = {
  key: CompareKey
  label: string
  unit: 'number' | 'percent'
  a: number | null
  b: number | null
  lead: 'a' | 'b' | 'tie' | null
  widthA: number
  widthB: number
}

export type CompareSide = { row: StandingRow | undefined; stats: TeamStats | undefined }

// green-700, then graphite when the first club is itself green (Palmeiras, Vitória, ...)
const FALLBACKS = ['#0B6B39', '#44524B']
const MIN_DISTANCE = 60

const metrics: { key: CompareKey; label: string; unit: CompareRow['unit']; lowWins?: boolean; get: (s: CompareSide) => number | null }[] = [
  { key: 'points', label: 'Pontos', unit: 'number', get: (s) => s.row?.points ?? null },
  { key: 'wins', label: 'Vitórias', unit: 'number', get: (s) => s.row?.win ?? null },
  { key: 'goalsFor', label: 'Gols marcados', unit: 'number', get: (s) => s.row?.goalsFor ?? null },
  { key: 'goalsAgainst', label: 'Gols sofridos', unit: 'number', lowWins: true, get: (s) => s.row?.goalsAgainst ?? null },
  {
    key: 'winRate',
    label: 'Aproveitamento de vitórias',
    unit: 'percent',
    get: (s) => (s.row && s.row.played > 0 ? Math.round((s.row.win / s.row.played) * 100) : null),
  },
  {
    key: 'cleanSheets',
    label: 'Jogos sem sofrer gol',
    unit: 'number',
    get: ({ stats }) =>
      stats && stats.cleanSheet.home !== null && stats.cleanSheet.away !== null
        ? stats.cleanSheet.home + stats.cleanSheet.away
        : null,
  },
]

export function buildComparison(a: CompareSide, b: CompareSide): CompareRow[] {
  return metrics.map(({ key, label, unit, lowWins, get }) => {
    const [va, vb] = [get(a), get(b)]
    if (va === null || vb === null) {
      return { key, label, unit, a: va, b: vb, lead: null, widthA: 0, widthB: 0 }
    }
    const max = Math.max(va, vb)
    const lead = va === vb ? 'tie' : (va > vb) !== Boolean(lowWins) ? 'a' : 'b'
    return {
      key,
      label,
      unit,
      a: va,
      b: vb,
      lead,
      widthA: max === 0 ? 0 : (va / max) * 100,
      widthB: max === 0 ? 0 : (vb / max) * 100,
    }
  })
}

export const headToHead = (fixtures: Fixture[], a: number, b: number): Fixture[] =>
  fixtures
    .filter((f) => (f.homeId === a && f.awayId === b) || (f.homeId === b && f.awayId === a))
    .sort((x, y) => x.date.localeCompare(y.date))

const rgb = (hex: string): number[] => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))

export const colorDistance = (x: string, y: string): number => Math.hypot(...rgb(x).map((v, i) => v - rgb(y)[i]))

export const seriesColors = (a: Team, b: Team): [string, string] => [
  a.color,
  [b.color, ...FALLBACKS].find((c) => colorDistance(a.color, c) >= MIN_DISTANCE) ?? FALLBACKS[1],
]
