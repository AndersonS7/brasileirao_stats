import { StatTile } from '../../components/ui/StatTile'
import { getHighlights } from '../../lib/highlights'
import { buildStandings } from '../../lib/standings'
import fixtures from '../../data/fixtures.json'
import rankings from '../../data/rankings.json'
import standingsApi from '../../data/standings-api.json'
import teams from '../../data/teams.json'
import type { Fixture, Rankings, StandingRow, Team } from '../../types/data'

const teamName = new Map((teams as Team[]).map((t) => [t.id, t.name]))
const h = getHighlights(
  buildStandings(standingsApi as StandingRow[], fixtures as Fixture[]),
  rankings as Rankings,
  fixtures as Fixture[],
)

export function Highlights() {
  return (
    <section aria-labelledby="highlights-title">
      <h2 id="highlights-title" className="mb-4 text-xl font-semibold leading-7 tracking-tight">
        Destaques
      </h2>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-5">
        <StatTile
          label="Artilheiro"
          value={h.scorer && `${h.scorer.goals} gols`}
          meta={h.scorer && `${h.scorer.name}, ${teamName.get(h.scorer.teamId)}`}
        />
        <StatTile
          label="Líder em assistências"
          value={h.assister && `${h.assister.assists} assist.`}
          meta={h.assister && `${h.assister.name}, ${teamName.get(h.assister.teamId)}`}
        />
        <StatTile label="Melhor ataque" value={`${h.attack.goals} gols`} meta={teamName.get(h.attack.teamId)} />
        <StatTile label="Melhor defesa" value={`${h.defence.goals} gols sofridos`} meta={teamName.get(h.defence.teamId)} />
        <StatTile label="Gols por jogo" value={h.avgGoals.toFixed(2).replace('.', ',')} meta="média da temporada" />
      </dl>
    </section>
  )
}
