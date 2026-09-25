import { Crest } from './Crest'
import { clubScore, isFinished, outcome, type Outcome } from '../../lib/club'
import { formatDate, formatTime } from '../../lib/format'
import { teamById } from '../../lib/teams'
import type { Fixture } from '../../types/data'

const chip: Record<Outcome, { label: string; cls: string }> = {
  V: { label: 'vitória', cls: 'bg-green-700 text-white' },
  E: { label: 'empate', cls: 'bg-draw-bg text-draw' },
  D: { label: 'derrota', cls: 'bg-loss-bg text-loss' },
}

type Props = { fixture: Fixture; perspectiveTeamId?: number }

function Pending({ fixture }: { fixture: Fixture }) {
  return <span className="text-sm text-muted">{fixture.status === 'other' ? 'Adiado' : formatTime(fixture.date)}</span>
}

export function MatchRow({ fixture, perspectiveTeamId }: Props) {
  const home = teamById.get(fixture.homeId)
  const away = teamById.get(fixture.awayId)
  if (!home || !away) return null
  const finished = isFinished(fixture)

  if (perspectiveTeamId === undefined) {
    return (
      <li className="border-b border-line py-3">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-3">
          <span className="flex min-w-0 items-center justify-end gap-2">
            <span className="truncate text-right font-medium">{home.name}</span>
            <Crest team={home} size={24} />
          </span>
          <span className="min-w-14 text-center">
            {finished ? (
              <span className="font-semibold tabular-nums">
                {fixture.homeGoals} × {fixture.awayGoals}
              </span>
            ) : (
              <Pending fixture={fixture} />
            )}
          </span>
          <span className="flex min-w-0 items-center gap-2">
            <Crest team={away} size={24} />
            <span className="truncate font-medium">{away.name}</span>
          </span>
        </div>
        <p className="mt-1 text-center text-sm tabular-nums text-muted">
          {formatDate(fixture.date)}
          {!finished && fixture.status === 'other' && ` ${formatTime(fixture.date)}`}
        </p>
      </li>
    )
  }

  const isHome = fixture.homeId === perspectiveTeamId
  const opponent = isHome ? away : home
  const result = finished ? outcome(fixture, perspectiveTeamId) : null
  const score = finished ? clubScore(fixture, perspectiveTeamId) : null

  return (
    <li className="grid grid-cols-[2.5rem_1fr_auto_1.5rem] items-center gap-x-3 border-b border-line py-3 min-[600px]:grid-cols-[3rem_6rem_1fr_auto_1.5rem]">
      <span className="text-sm tabular-nums text-muted">
        <span className="sr-only">Rodada </span>
        {fixture.round}
      </span>
      <span className="hidden text-sm tabular-nums text-muted min-[600px]:block">{formatDate(fixture.date)}</span>
      <span className="flex min-w-0 items-center gap-2">
        <Crest team={opponent} size={24} />
        <span className="min-w-0">
          <span className="block truncate font-medium">{opponent.name}</span>
          <span className="block text-xs text-muted">
            {isHome ? 'Casa' : 'Fora'}
            <span className="min-[600px]:hidden"> — {formatDate(fixture.date)}</span>
          </span>
        </span>
      </span>
      <span className="text-right">
        {score ? (
          <span className="font-semibold tabular-nums">
            {score.gf} × {score.ga}
          </span>
        ) : (
          <Pending fixture={fixture} />
        )}
      </span>
      {result ? (
        <span
          role="img"
          aria-label={chip[result].label}
          className={`grid size-6 place-items-center rounded-sm text-xs font-semibold ${chip[result].cls}`}
        >
          <span aria-hidden="true">{result}</span>
        </span>
      ) : (
        <span />
      )}
    </li>
  )
}
