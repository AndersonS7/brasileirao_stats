import { EmptyState } from '../../components/ui/EmptyState'
import { MatchRow } from '../../components/ui/MatchRow'
import fixtures from '../../data/fixtures.json'
import { headToHead } from '../../lib/compare'
import type { Fixture } from '../../types/data'

export function HeadToHead({ a, b }: { a: number; b: number }) {
  const matches = headToHead(fixtures as Fixture[], a, b)

  return (
    <section aria-labelledby="h2h-title">
      <h2 id="h2h-title" className="mb-2 text-xl font-semibold leading-7 tracking-tight">
        Confrontos na temporada
      </h2>
      {matches.length === 0 ? (
        <EmptyState title="Sem confrontos" message="Não se enfrentaram nesta temporada" />
      ) : (
        <ul>
          {matches.map((f) => (
            <MatchRow key={f.id} fixture={f} />
          ))}
        </ul>
      )}
    </section>
  )
}
