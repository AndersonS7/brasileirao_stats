import { Avatar } from '../../components/ui/PersonCard'
import { Crest } from '../../components/ui/Crest'
import { teamById } from '../../lib/teams'
import type { PlayerRow } from '../../types/data'

type Props = { players: PlayerRow[]; value: (p: PlayerRow) => number; unit: string }

export function RankingList({ players, value, unit }: Props) {
  return (
    <ol>
      {players.map((p, i) => {
        const team = teamById.get(p.teamId)
        return (
          <li key={p.id} className="grid grid-cols-[2rem_auto_1fr_auto] items-center gap-x-3 border-b border-line py-3">
            <span className="text-right tabular-nums text-muted">
              <span className="sr-only">Posição </span>
              {i + 1}
            </span>
            <Avatar name={p.name} photo={p.photo} />
            <div className="min-w-0">
              <p className="truncate font-medium" title={p.name}>
                {p.name}
              </p>
              {team && (
                <p className="flex items-center gap-1.5 text-sm text-ink-2">
                  <Crest team={team} size={16} />
                  <span className="truncate">{team.name}</span>
                </p>
              )}
            </div>
            <span className="text-right text-xl font-bold tabular-nums">
              {value(p)}
              <span className="sr-only"> {unit}</span>
            </span>
          </li>
        )
      })}
    </ol>
  )
}
