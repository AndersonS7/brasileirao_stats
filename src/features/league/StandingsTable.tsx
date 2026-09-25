import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Crest } from '../../components/ui/Crest'
import { FormBadges } from '../../components/ui/FormBadges'
import { SegmentedControl } from '../../components/ui/SegmentedControl'
import { buildStandings } from '../../lib/standings'
import fixtures from '../../data/fixtures.json'
import standingsApi from '../../data/standings-api.json'
import teams from '../../data/teams.json'
import type { Fixture, StandingRow, Team, Zone } from '../../types/data'

type Filter = 'all' | 'home' | 'away'

const options: { value: Filter; label: string }[] = [
  { value: 'all', label: 'Geral' },
  { value: 'home', label: 'Casa' },
  { value: 'away', label: 'Fora' },
]

const zoneMeta: Record<Exclude<Zone, null>, { label: string; bar: string }> = {
  libertadores: { label: 'Libertadores', bar: 'bg-green-700' },
  sudamericana: { label: 'Sul-Americana', bar: 'bg-sula' },
  relegation: { label: 'Rebaixamento', bar: 'bg-loss' },
}

const teamById = new Map((teams as Team[]).map((t) => [t.id, t]))
const standings = buildStandings(standingsApi as StandingRow[], fixtures as Fixture[])
// Zones describe the overall table, so Casa/Fora keep each club's Geral zone.
const zoneById = new Map(standings.all.map((r) => [r.teamId, r.zone]))

const num = 'w-12 px-2 py-3 text-right tabular-nums'
const opt = 'hidden min-[600px]:table-cell'

export function StandingsTable() {
  const [filter, setFilter] = useState<Filter>('all')
  const navigate = useNavigate()
  const rows = standings[filter]
  const filterLabel = options.find((o) => o.value === filter)?.label

  return (
    <section aria-labelledby="table-title">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 id="table-title" className="text-xl font-semibold leading-7 tracking-tight">
          Classificação
        </h2>
        <SegmentedControl options={options} value={filter} onChange={setFilter} label="Filtrar classificação" />
      </div>
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">Classificação do Brasileirão, filtro {filterLabel}</caption>
        <thead>
          <tr className="border-b border-line-strong text-xs font-medium text-muted">
            <th scope="col" className="w-10 py-2 pl-3 pr-2 text-right">
              <abbr title="Posição">Pos</abbr>
            </th>
            <th scope="col" className="w-full px-2 py-2 text-left">
              Clube
            </th>
            <th scope="col" className={num}>
              <abbr title="Jogos">J</abbr>
            </th>
            <th scope="col" className={`${num} ${opt}`}>
              <abbr title="Vitórias">V</abbr>
            </th>
            <th scope="col" className={`${num} ${opt}`}>
              <abbr title="Empates">E</abbr>
            </th>
            <th scope="col" className={`${num} ${opt}`}>
              <abbr title="Derrotas">D</abbr>
            </th>
            <th scope="col" className={num}>
              <abbr title="Saldo de gols">SG</abbr>
            </th>
            <th scope="col" className={num}>
              <abbr title="Pontos">Pts</abbr>
            </th>
            <th scope="col" className={`${opt} px-2 py-2 text-left`}>
              Últimos 5
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const team = teamById.get(r.teamId)
            if (!team) return null
            const zone = zoneById.get(r.teamId)
            return (
              <tr
                key={r.teamId}
                onClick={() => navigate(`/clubes/${team.slug}`)}
                className="cursor-pointer border-b border-line hover:bg-surface"
              >
                <td className="relative py-3 pl-3 pr-2 text-right tabular-nums">
                  {zone && (
                    <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-[3px] ${zoneMeta[zone].bar}`} />
                  )}
                  {r.rank}
                  {zone && <span className="sr-only">, {zoneMeta[zone].label}</span>}
                </td>
                <td className="max-w-0 px-2 py-3">
                  <Link to={`/clubes/${team.slug}`} className="flex items-center gap-2 font-medium" title={team.name}>
                    <Crest team={team} size={24} />
                    <span className="truncate">{team.name}</span>
                  </Link>
                </td>
                <td className={num}>{r.played}</td>
                <td className={`${num} ${opt}`}>{r.win}</td>
                <td className={`${num} ${opt}`}>{r.draw}</td>
                <td className={`${num} ${opt}`}>{r.lose}</td>
                <td className={num}>{r.goalDiff > 0 ? `+${r.goalDiff}` : r.goalDiff}</td>
                <td className={`${num} font-semibold`}>{r.points}</td>
                <td className={`${opt} px-2 py-3`}>
                  {filter === 'all' ? <FormBadges form={r.form} /> : <span className="text-muted">—</span>}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <ul aria-label="Legenda das zonas" className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-2">
        {Object.values(zoneMeta).map((z) => (
          <li key={z.label} className="flex items-center gap-2">
            <span aria-hidden="true" className={`h-4 w-[3px] ${z.bar}`} />
            {z.label}
          </li>
        ))}
      </ul>
    </section>
  )
}
