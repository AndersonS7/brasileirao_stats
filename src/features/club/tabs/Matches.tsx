import { MatchRow } from '../../../components/ui/MatchRow'
import { EmptyState } from '../../../components/ui/EmptyState'
import { clubMatches } from '../../../lib/club'
import fixtures from '../../../data/fixtures.json'
import type { Fixture, Team } from '../../../types/data'

export function Matches({ team }: { team: Team }) {
  const matches = clubMatches(fixtures as Fixture[], team.id)
  if (matches.length === 0) return <EmptyState title="Sem jogos" message="Nenhuma partida encontrada para este clube." />

  return (
    <section aria-label="Jogos do clube">
      <ul>
        {matches.map((f) => (
          <MatchRow key={f.id} fixture={f} perspectiveTeamId={team.id} />
        ))}
      </ul>
    </section>
  )
}
