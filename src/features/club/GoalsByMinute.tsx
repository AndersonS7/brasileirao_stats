import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useSyncExternalStore } from 'react'
import type { Bin, TeamStats } from '../../types/data'

const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
const subscribe = (cb: () => void) => {
  reducedQuery.addEventListener('change', cb)
  return () => reducedQuery.removeEventListener('change', cb)
}

const bands = (stats: TeamStats) =>
  (Object.entries(stats.goalsByMinute) as [Bin, TeamStats['goalsByMinute'][Bin]][])
    .filter(([, v]) => v.for !== null || v.against !== null)
    .map(([bin, v]) => ({ bin: `${bin}'`, for: v.for, against: v.against }))

export function GoalsByMinute({ stats }: { stats: TeamStats }) {
  const reduced = useSyncExternalStore(subscribe, () => reducedQuery.matches)
  const data = bands(stats)
  if (data.length === 0) return <p className="text-ink-2">Dados indisponíveis</p>

  return (
    <div>
      <div aria-hidden="true" className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
            <CartesianGrid vertical={false} stroke="var(--color-line)" />
            <XAxis
              dataKey="bin"
              tickLine={false}
              axisLine={{ stroke: 'var(--color-line-strong)' }}
              tick={{ fill: 'var(--color-muted)', fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--color-muted)', fontSize: 12 }}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: 'var(--color-surface)' }}
              formatter={(v) => (v === undefined || v === null ? 'Dados indisponíveis' : `${v} gols`)}
              labelFormatter={(bin) => `Minutos ${bin}`}
              contentStyle={{ borderRadius: 10, border: '1px solid var(--color-line)', fontSize: 14 }}
            />
            <Legend iconType="square" wrapperStyle={{ fontSize: 14 }} />
            <Bar dataKey="for" name="Marcados" fill="var(--color-green-700)" radius={[2, 2, 0, 0]} isAnimationActive={!reduced} />
            <Bar dataKey="against" name="Sofridos" fill="var(--color-ink-2)" radius={[2, 2, 0, 0]} isAnimationActive={!reduced} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <table className="sr-only">
        <caption>Gols marcados e sofridos por faixa de minutos</caption>
        <thead>
          <tr>
            <th scope="col">Minutos</th>
            <th scope="col">Marcados</th>
            <th scope="col">Sofridos</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.bin}>
              <th scope="row">{d.bin}</th>
              <td>{d.for ?? 'Dados indisponíveis'}</td>
              <td>{d.against ?? 'Dados indisponíveis'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
