import { FormBadges } from '../../../components/ui/FormBadges'
import { MatchRow } from '../../../components/ui/MatchRow'
import { StatTile } from '../../../components/ui/StatTile'
import { lastMatch, nextMatch } from '../../../lib/club'
import { img } from '../../../lib/assets'
import { formatNumber } from '../../../lib/format'
import fixtures from '../../../data/fixtures.json'
import standingsApi from '../../../data/standings-api.json'
import type { Fixture, StandingRow, Team } from '../../../types/data'

export function Summary({ team }: { team: Team }) {
  const row = (standingsApi as StandingRow[]).find((r) => r.teamId === team.id)
  const last = lastMatch(fixtures as Fixture[], team.id)
  const next = nextMatch(fixtures as Fixture[], team.id)

  return (
    <div className="flex flex-col gap-10">
      {row && (
        <section aria-label="Campanha" className="flex flex-col gap-4">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 min-[600px]:grid-cols-4">
            <StatTile label="Posição" value={`${row.rank}º`} />
            <StatTile label="Pontos" value={String(row.points)} />
            <StatTile label="Campanha" value={`${row.win}V ${row.draw}E ${row.lose}D`} />
            <StatTile label="Saldo de gols" value={row.goalDiff > 0 ? `+${row.goalDiff}` : String(row.goalDiff)} />
          </dl>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted">Últimos 5</span>
            <FormBadges form={row.form} />
          </div>
        </section>
      )}

      <section aria-labelledby="matches-title" className="grid gap-6 min-[600px]:grid-cols-2">
        <div>
          <h2 id="matches-title" className="text-xl font-semibold leading-7 tracking-tight">
            Último jogo
          </h2>
          <ul>{last ? <MatchRow fixture={last} perspectiveTeamId={team.id} /> : <li className="py-3 text-ink-2">Nenhum jogo disputado.</li>}</ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold leading-7 tracking-tight">Próximo jogo</h2>
          <ul>{next ? <MatchRow fixture={next} perspectiveTeamId={team.id} /> : <li className="py-3 text-ink-2">Nenhum jogo agendado.</li>}</ul>
        </div>
      </section>

      <section aria-labelledby="about-title" className="grid gap-6 min-[900px]:grid-cols-2">
        <div>
          <h2 id="about-title" className="text-xl font-semibold leading-7 tracking-tight">
            Sobre o clube
          </h2>
          {team.description ? (
            <p lang="en" className="mt-3 max-w-prose text-ink-2">
              {team.description}
            </p>
          ) : (
            <p className="mt-3 text-ink-2">Dados indisponíveis</p>
          )}
        </div>
        <figure>
          {team.venuePhoto && (
            <img
              src={img(team.venuePhoto)}
              alt={`Estádio ${team.stadium ?? ''}`.trim()}
              loading="lazy"
              className="aspect-video w-full rounded-md object-cover"
            />
          )}
          <figcaption className="mt-2 text-sm text-ink-2">
            {team.stadium ?? 'Estádio indisponível'}
            {team.capacity !== null ? `, capacidade ${formatNumber(team.capacity)}` : ''}
          </figcaption>
        </figure>
      </section>
    </div>
  )
}
