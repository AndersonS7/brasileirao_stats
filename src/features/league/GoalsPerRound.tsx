import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useSyncExternalStore } from 'react'
import { goalsPerRound } from '../../lib/highlights'
import fixtures from '../../data/fixtures.json'
import type { Fixture } from '../../types/data'

const data = goalsPerRound(fixtures as Fixture[]).map((d) => ({ ...d, value: d.goals ?? 0 }))

const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
const subscribe = (cb: () => void) => {
  reducedQuery.addEventListener('change', cb)
  return () => reducedQuery.removeEventListener('change', cb)
}

export function GoalsPerRound() {
  const reduced = useSyncExternalStore(subscribe, () => reducedQuery.matches)
  return (
    <section aria-labelledby="goals-title">
      <h2 id="goals-title" className="mb-4 text-xl font-semibold leading-7 tracking-tight">
        Gols por rodada
      </h2>
      <div aria-hidden="true" className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
            <CartesianGrid vertical={false} stroke="var(--color-line)" />
            <XAxis
              dataKey="round"
              tickLine={false}
              axisLine={{ stroke: 'var(--color-line-strong)' }}
              tick={{ fill: 'var(--color-muted)', fontSize: 12 }}
              interval="preserveStartEnd"
              minTickGap={12}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--color-muted)', fontSize: 12 }}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: 'var(--color-surface)' }}
              formatter={(_v, _n, item) => [
                item.payload.goals === null ? 'sem jogos' : `${item.payload.goals} gols`,
                'Total',
              ]}
              labelFormatter={(round) => `Rodada ${round}`}
              contentStyle={{ borderRadius: 10, border: '1px solid var(--color-line)', fontSize: 14 }}
            />
            <Bar dataKey="value" fill="var(--color-green-700)" radius={[2, 2, 0, 0]} isAnimationActive={!reduced} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <table className="sr-only">
        <caption>Total de gols por rodada</caption>
        <thead>
          <tr>
            <th scope="col">Rodada</th>
            <th scope="col">Gols</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.round}>
              <td>{d.round}</td>
              <td>{d.goals ?? 'sem jogos'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
