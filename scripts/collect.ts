import { mkdirSync, writeFileSync } from 'node:fs'
import { CANDIDATE_SEASONS, CACHE_DIR, LEAGUE_ID, SEASON_FILE } from './config.ts'
import { apiGet, BudgetExhausted, budgetUsed, requireKey, stats } from './client.ts'
import type { ApiResponse } from './client.ts'

requireKey()
mkdirSync(CACHE_DIR, { recursive: true })

const failures: string[] = []
const remaining: string[] = []

async function tryGet(label: string, path: string, params: Record<string, string | number>): Promise<ApiResponse | null> {
  try {
    return await apiGet(path, params)
  } catch (e) {
    if (e instanceof BudgetExhausted) throw e
    failures.push(`${label}: ${(e as Error).message}`)
    return null
  }
}

async function discoverSeason(): Promise<{ season: number; teamIds: number[] }> {
  const forced = process.env.SEASON ? [Number(process.env.SEASON)] : CANDIDATE_SEASONS
  for (const season of forced) {
    try {
      const res = await apiGet('standings', { league: LEAGUE_ID, season })
      const rows = (res.response[0] as { league: { standings: { team: { id: number } }[][] } } | undefined)?.league
        .standings[0]
      if (rows?.length) return { season, teamIds: rows.map((r) => r.team.id) }
      console.log(`season ${season}: no data`)
    } catch (e) {
      if (e instanceof BudgetExhausted) throw e
      console.error(`season ${season}: ${(e as Error).message}`)
    }
  }
  console.error('No season available on this plan; nothing written.')
  process.exit(1)
}

async function main(): Promise<void> {
  const { season, teamIds } = await discoverSeason()
  writeFileSync(
    SEASON_FILE,
    JSON.stringify({ season, leagueId: LEAGUE_ID, collectedAt: new Date().toISOString().slice(0, 10) }) + '\n',
  )
  console.log(`season ${season}: ${teamIds.length} teams in standings`)

  const lp = { league: LEAGUE_ID, season }
  await tryGet('teams', 'teams', lp)
  await tryGet('fixtures', 'fixtures', lp)
  for (const r of ['topscorers', 'topassists', 'topyellowcards', 'topredcards']) {
    await tryGet(r, `players/${r}`, lp)
  }
  for (const id of teamIds) await tryGet(`stats ${id}`, 'teams/statistics', { ...lp, team: id })
  for (const id of teamIds) await tryGet(`squad ${id}`, 'players/squads', { team: id })
}

try {
  await main()
} catch (e) {
  if (!(e instanceof BudgetExhausted)) throw e
  remaining.push('budget reached; run again tomorrow to finish')
}

console.log(`\nrequests: ${stats.network} network, ${stats.cached} cached, ${budgetUsed()} used today`)
for (const f of failures) console.log(`FAIL ${f}`)
for (const r of remaining) console.log(`REMAINING ${r}`)
