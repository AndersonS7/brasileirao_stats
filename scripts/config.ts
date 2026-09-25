import { existsSync, readFileSync } from 'node:fs'

export const LEAGUE_ID = 71
export const CANDIDATE_SEASONS = [2024, 2023, 2022]
export const DAILY_BUDGET = 90 // free plan allows 100/day; keep a margin
export const MIN_INTERVAL_MS = 6500 // free plan allows 10 requests/minute
export const CACHE_DIR = 'scripts/.cache'
export const SEASON_FILE = 'src/data/season.json'

function loadEnv(): void {
  if (!existsSync('.env')) return
  for (const line of readFileSync('.env', 'utf8').split(/\r?\n/)) {
    const m = /^\s*([A-Z_][A-Z0-9_]*)\s*=\s*"?([^"]*?)"?\s*$/.exec(line)
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2]
  }
}

loadEnv()

export const API_KEY = process.env.API_FOOTBALL_KEY ?? ''
