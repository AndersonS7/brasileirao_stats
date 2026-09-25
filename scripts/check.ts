import { existsSync, readFileSync } from 'node:fs'
import { buildStandings } from '../src/lib/standings.ts'
import type { Fixture, Rankings, Squads, StandingRow, Team, TeamStats } from '../src/types/data.ts'

const read = <T>(name: string): T => JSON.parse(readFileSync(`src/data/${name}.json`, 'utf8')) as T
const errors: string[] = []
const warnings: string[] = []
const expect = (ok: boolean, msg: string): void => {
  if (!ok) errors.push(msg)
}

const teams = read<Team[]>('teams')
const api = read<StandingRow[]>('standings-api')
const fixtures = read<Fixture[]>('fixtures')
const stats = read<Record<number, TeamStats>>('team-stats')
const rankings = read<Rankings>('rankings')
const squads = read<Squads>('squads')
const standings = buildStandings(api, fixtures)

expect(teams.length === 20, `teams: expected 20, got ${teams.length}`)
expect(fixtures.length === 380, `fixtures: expected 380, got ${fixtures.length}`)
for (const k of ['all', 'home', 'away'] as const) {
  expect(standings[k].length === 20, `standings.${k}: expected 20 rows, got ${standings[k].length}`)
}

const ids = new Set(teams.map((t) => t.id))
const known = (id: number, where: string): void => expect(ids.has(id), `${where}: unknown teamId ${id}`)
api.forEach((r) => known(r.teamId, 'standings'))
fixtures.forEach((f) => (known(f.homeId, `fixture ${f.id}`), known(f.awayId, `fixture ${f.id}`)))
Object.values(rankings).flat().forEach((p) => known(p.teamId, `ranking ${p.name}`))
Object.keys(squads).forEach((id) => known(Number(id), 'squads'))

// Derived home + away must reproduce the API's overall totals.
for (const row of api) {
  const h = standings.home.find((r) => r.teamId === row.teamId)!
  const a = standings.away.find((r) => r.teamId === row.teamId)!
  const same = h.points + a.points === row.points && h.goalsFor + a.goalsFor === row.goalsFor && h.played + a.played === row.played
  expect(same, `standings: derived home+away differ from API for team ${row.teamId}`)
}

const files = (paths: (string | null)[], label: string): void => {
  for (const p of paths) {
    if (p && !existsSync(`public/img/${p}`)) warnings.push(`${label}: missing file ${p}`)
  }
}
for (const t of teams) {
  expect(existsSync(`public/img/${t.badge}`) && t.badge !== '', `badge missing for ${t.slug}`)
  if (!t.venuePhoto) warnings.push(`${t.slug}: no venue photo`)
  files([t.venuePhoto], t.slug)
}
files(Object.values(rankings).flat().map((p) => p.photo), 'ranking photo')
files(Object.values(squads).flat().map((p) => p.photo), 'squad photo')

for (const t of teams) {
  const s = stats[t.id]
  if (!s) warnings.push(`${t.slug}: no team statistics`)
  else if (s.formations.length === 0 || s.cards.yellow === null) warnings.push(`${t.slug}: incomplete statistics`)
}
for (const [k, v] of Object.entries(rankings)) if (v.length === 0) warnings.push(`rankings.${k}: empty`)

console.log(`teams ${teams.length}, fixtures ${fixtures.length}, standings ${standings.all.length}/${standings.home.length}/${standings.away.length}`)
console.log(`rankings: ${Object.entries(rankings).map(([k, v]) => `${k} ${v.length}`).join(', ')}`)
console.log(`squad players: ${Object.values(squads).flat().length}`)
for (const w of warnings) console.log(`WARN ${w}`)
for (const e of errors) console.error(`ERROR ${e}`)
process.exit(errors.length ? 1 : 0)
