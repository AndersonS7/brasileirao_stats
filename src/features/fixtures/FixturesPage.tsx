import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { EmptyState } from '../../components/ui/EmptyState'
import { MatchRow } from '../../components/ui/MatchRow'
import { latestRound, roundFixtures } from '../../lib/club'
import fixtures from '../../data/fixtures.json'
import type { Fixture } from '../../types/data'

const all = fixtures as Fixture[]
const rounds = [...new Set(all.map((f) => f.round))].sort((a, b) => a - b)
const fallback = latestRound(all)

const step =
  'inline-flex h-10 items-center gap-1 rounded-full border border-line-strong px-4 font-medium hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent'

export default function FixturesPage() {
  const [params, setParams] = useSearchParams()
  const asked = Number(params.get('rodada'))
  const round = rounds.includes(asked) ? asked : fallback
  const index = rounds.indexOf(round)
  const go = (r: number) => setParams({ rodada: String(r) }, { replace: true })
  const matches = roundFixtures(all, round)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[28px] font-bold leading-[34px] tracking-tight">Jogos</h1>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className={step} disabled={index <= 0} onClick={() => go(rounds[index - 1])}>
          <ChevronLeft size={18} strokeWidth={1.75} aria-hidden="true" />
          Anterior
        </button>
        <label className="flex items-center gap-2">
          <span className="text-ink-2">Rodada</span>
          <select
            value={round}
            onChange={(e) => go(Number(e.target.value))}
            className="h-10 rounded-full border border-line-strong bg-white px-4 font-medium tabular-nums"
          >
            {rounds.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className={step}
          disabled={index >= rounds.length - 1}
          onClick={() => go(rounds[index + 1])}
        >
          Próxima
          <ChevronRight size={18} strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>
      <section aria-labelledby="round-title">
        <h2 id="round-title" className="mb-2 text-xl font-semibold leading-7 tracking-tight">
          Rodada {round}
        </h2>
        {matches.length === 0 ? (
          <EmptyState title="Sem jogos" message="Nenhuma partida nesta rodada." />
        ) : (
          <ul>
            {matches.map((f) => (
              <MatchRow key={f.id} fixture={f} />
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
