import teams from '../data/teams.json'
import type { Team } from '../types/data'

export const allTeams = teams as Team[]
export const teamById = new Map(allTeams.map((t) => [t.id, t]))
