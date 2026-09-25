import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { API_KEY, CACHE_DIR, DAILY_BUDGET, MIN_INTERVAL_MS } from './config.ts'

const BASE = 'https://v3.football.api-sports.io'
const BUDGET_FILE = `${CACHE_DIR}/budget.json`

export class BudgetExhausted extends Error {}

export interface ApiResponse {
  errors: unknown
  results: number
  response: unknown[]
}

export const stats = { network: 0, cached: 0 }
let lastCall = 0

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

function readBudget(): { date: string; count: number } {
  if (existsSync(BUDGET_FILE)) {
    const b = JSON.parse(readFileSync(BUDGET_FILE, 'utf8')) as { date: string; count: number }
    if (b.date === today()) return b
  }
  return { date: today(), count: 0 }
}

export function budgetUsed(): number {
  return readBudget().count
}

function hasErrors(errors: unknown): boolean {
  return Array.isArray(errors) ? errors.length > 0 : !!errors && Object.keys(errors).length > 0
}

export function requireKey(): void {
  if (!API_KEY) {
    console.error('API_FOOTBALL_KEY is missing. Add it to .env (see .env.example).')
    process.exit(1)
  }
}

type Params = Record<string, string | number>

function locate(path: string, params: Params): { query: string; file: string } {
  const query = new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString()
  const hash = createHash('sha1').update(query).digest('hex').slice(0, 10)
  return { query, file: `${CACHE_DIR}/${path.replace('/', '_')}-${hash}.json` }
}

/** Cache-only read for offline steps; never touches the network. */
export function readCached(path: string, params: Params): ApiResponse | null {
  const { file } = locate(path, params)
  return existsSync(file) ? (JSON.parse(readFileSync(file, 'utf8')) as ApiResponse) : null
}

export async function apiGet(path: string, params: Params): Promise<ApiResponse> {
  requireKey()
  const { query, file } = locate(path, params)
  const url = `${BASE}/${path}?${query}`

  if (existsSync(file)) {
    stats.cached++
    return JSON.parse(readFileSync(file, 'utf8')) as ApiResponse
  }

  const budget = readBudget()
  if (budget.count >= DAILY_BUDGET) throw new BudgetExhausted(`Daily budget of ${DAILY_BUDGET} requests reached`)

  mkdirSync(CACHE_DIR, { recursive: true })
  for (let attempt = 0; ; attempt++) {
    const wait = lastCall + MIN_INTERVAL_MS - Date.now()
    if (wait > 0) await new Promise((r) => setTimeout(r, wait))
    lastCall = Date.now()
    const res = await fetch(url, { headers: { 'x-apisports-key': API_KEY } })
    budget.count++
    stats.network++
    writeFileSync(BUDGET_FILE, JSON.stringify(budget))
    if ((res.status === 429 || res.status >= 500) && attempt === 0) continue
    if (!res.ok) throw new Error(`${path}?${query} -> HTTP ${res.status}`)
    const body = (await res.json()) as ApiResponse
    if (hasErrors(body.errors)) throw new Error(`${path}?${query} -> ${JSON.stringify(body.errors)}`)
    writeFileSync(file, JSON.stringify(body))
    return body
  }
}
