import { EmptyState } from '../../../components/ui/EmptyState'
import { PersonCard } from '../../../components/ui/PersonCard'
import squads from '../../../data/squads.json'
import type { SquadPlayer, Squads, Team } from '../../../types/data'

const positions: Record<string, string> = {
  Goalkeeper: 'Goleiro',
  Defender: 'Defensor',
  Midfielder: 'Meio-campista',
  Attacker: 'Atacante',
}

const detail = (p: SquadPlayer): string =>
  [
    p.position && (positions[p.position] ?? p.position),
    p.number !== null && `Nº ${p.number}`,
    p.age !== null && `${p.age} anos`,
  ]
    .filter(Boolean)
    .join(', ')

export function Squad({ team }: { team: Team }) {
  const players = (squads as unknown as Squads)[team.id] ?? []
  if (players.length === 0) {
    return <EmptyState title="Elenco indisponível" message="Não há jogadores cadastrados para este clube." />
  }

  return (
    <ul className="grid gap-x-8 min-[600px]:grid-cols-2 min-[900px]:grid-cols-3">
      {players.map((p) => (
        <PersonCard key={p.id} name={p.name} photo={p.photo} detail={detail(p)} />
      ))}
    </ul>
  )
}
