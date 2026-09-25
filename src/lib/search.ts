import type { Team } from '../types/data'

const normalise = (s: string): string =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()

export function searchTeams(teams: Team[], query: string, limit = 6): Team[] {
  const q = normalise(query)
  if (!q) return []
  return teams
    .filter((t) => normalise(t.name).includes(q) || normalise(t.stadium ?? '').includes(q))
    .slice(0, limit)
}
