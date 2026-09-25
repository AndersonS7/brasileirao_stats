import https from 'node:https'
import { Resolver } from 'node:dns/promises'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { CACHE_DIR } from './config.ts'

const BASE = 'https://www.thesportsdb.com/api/v1/json/123'
const DIR = `${CACHE_DIR}/sportsdb`
const MIN_INTERVAL_MS = 2100

export interface SportsDbTeam {
  idTeam: string
  idAPIfootball: string | null
  strTeam: string
  strTeamShort: string | null
  strLocation: string | null
  strStadium: string | null
  strColour1: string | null
  strColour2: string | null
  strColour3: string | null
  strBadge: string | null
  strStadiumThumb: string | null
  strFanart1: string | null
  strDescriptionEN: string | null
}

let lastCall = 0

async function get<T>(endpoint: string, query: string): Promise<T> {
  mkdirSync(DIR, { recursive: true })
  const file = `${DIR}/${endpoint}-${query.replace(/\W+/g, '_')}.json`
  if (existsSync(file)) return JSON.parse(readFileSync(file, 'utf8')) as T
  for (let attempt = 0; ; attempt++) {
    const wait = lastCall + MIN_INTERVAL_MS - Date.now()
    if (wait > 0) await new Promise((r) => setTimeout(r, wait))
    lastCall = Date.now()
    const res = await fetch(`${BASE}/${endpoint}.php?${query}`)
    if ((res.status === 429 || res.status >= 500) && attempt < 2) continue
    if (!res.ok) throw new Error(`TheSportsDB ${endpoint}?${query} -> HTTP ${res.status}`)
    const body = (await res.json()) as T
    writeFileSync(file, JSON.stringify(body))
    return body
  }
}

/** Search by name, then confirm by the API-Football id the record carries. */
export async function findTeam(search: string, apiFootballId: number): Promise<SportsDbTeam | null> {
  const { teams } = await get<{ teams: SportsDbTeam[] | null }>('searchteams', `t=${encodeURIComponent(search)}`)
  return teams?.find((t) => t.idAPIfootball === String(apiFootballId)) ?? null
}

export async function downloadFile(url: string, dest: string, intervalMs = MIN_INTERVAL_MS): Promise<boolean> {
  if (existsSync(dest)) return true
  const wait = lastCall + intervalMs - Date.now()
  if (wait > 0) await new Promise((r) => setTimeout(r, wait))
  lastCall = Date.now()
  const body = await fetchBytes(url)
  if (!body) return false
  writeFileSync(dest, body)
  return true
}

const publicDns = new Resolver()
publicDns.setServers(['8.8.8.8', '1.1.1.1'])

/** Some local resolvers refuse media hosts; on DNS failure, retry resolving through public DNS. */
async function fetchBytes(url: string): Promise<Buffer | null> {
  try {
    const res = await fetch(url)
    return res.ok ? Buffer.from(await res.arrayBuffer()) : null
  } catch (e) {
    if ((e as { cause?: { code?: string } }).cause?.code !== 'ENOTFOUND') throw e
  }
  const { hostname } = new URL(url)
  const [address] = await publicDns.resolve4(hostname)
  return new Promise((resolve, reject) => {
    https
      .get(url, {
        // Node 20 may ask for all addresses (array form) or a single one
        lookup: (_h, opts, cb) =>
          (opts as { all?: boolean }).all
            ? (cb as unknown as (e: null, a: { address: string; family: number }[]) => void)(null, [{ address, family: 4 }])
            : cb(null, address, 4),
      }, (res) => {
        if (res.statusCode !== 200) return resolve(null)
        const chunks: Buffer[] = []
        res.on('data', (c: Buffer) => chunks.push(c))
        res.on('end', () => resolve(Buffer.concat(chunks)))
      })
      .on('error', reject)
  })
}
