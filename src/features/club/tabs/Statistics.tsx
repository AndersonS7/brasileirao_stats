import { EmptyState } from '../../../components/ui/EmptyState'
import { StatTile } from '../../../components/ui/StatTile'
import { clubRecord, type SideRecord } from '../../../lib/club'
import { GoalsByMinute } from '../GoalsByMinute'
import fixtures from '../../../data/fixtures.json'
import teamStats from '../../../data/team-stats.json'
import type { Fixture, Team, TeamStats } from '../../../types/data'

const stats = teamStats as unknown as Record<number, TeamStats | undefined>

const n = (v: number | null): string | null => (v === null ? null : String(v))

function RecordRow({ label, r }: { label: string; r: SideRecord }) {
  const cell = 'px-2 py-3 text-right tabular-nums'
  return (
    <tr className="border-b border-line">
      <th scope="row" className="py-3 pr-2 text-left font-medium">
        {label}
      </th>
      <td className={cell}>{r.w + r.d + r.l}</td>
      <td className={cell}>{r.w}</td>
      <td className={cell}>{r.d}</td>
      <td className={cell}>{r.l}</td>
      <td className={cell}>{r.gf}</td>
      <td className={cell}>{r.ga}</td>
    </tr>
  )
}

const h2 = 'mb-4 text-xl font-semibold leading-7 tracking-tight'

export function Statistics({ team }: { team: Team }) {
  const s = stats[team.id]
  if (!s) {
    return <EmptyState title="Sem estatísticas" message="Não há estatísticas disponíveis para este clube." />
  }
  const rec = clubRecord(fixtures as Fixture[], team.id)
  const head = 'px-2 py-2 text-right'

  return (
    <div className="flex flex-col gap-10">
      <section aria-labelledby="rec-title">
        <h2 id="rec-title" className={h2}>
          Casa e fora
        </h2>
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">Campanha em casa e fora</caption>
          <thead>
            <tr className="border-b border-line-strong text-xs font-medium text-muted">
              <th scope="col" className="py-2 pr-2 text-left">
                Local
              </th>
              <th scope="col" className={head}>
                <abbr title="Jogos">J</abbr>
              </th>
              <th scope="col" className={head}>
                <abbr title="Vitórias">V</abbr>
              </th>
              <th scope="col" className={head}>
                <abbr title="Empates">E</abbr>
              </th>
              <th scope="col" className={head}>
                <abbr title="Derrotas">D</abbr>
              </th>
              <th scope="col" className={head}>
                <abbr title="Gols marcados">GM</abbr>
              </th>
              <th scope="col" className={head}>
                <abbr title="Gols sofridos">GS</abbr>
              </th>
            </tr>
          </thead>
          <tbody>
            <RecordRow label="Casa" r={rec.home} />
            <RecordRow label="Fora" r={rec.away} />
          </tbody>
        </table>
      </section>

      <section aria-labelledby="goals-title">
        <h2 id="goals-title" className={h2}>
          Gols por minuto
        </h2>
        <GoalsByMinute stats={s} />
      </section>

      <section aria-labelledby="streak-title">
        <h2 id="streak-title" className={h2}>
          Maiores sequências e jogos sem sofrer gols
        </h2>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 min-[600px]:grid-cols-3 min-[900px]:grid-cols-5">
          <StatTile label="Vitórias seguidas" value={n(s.streak.wins)} />
          <StatTile label="Empates seguidos" value={n(s.streak.draws)} />
          <StatTile label="Derrotas seguidas" value={n(s.streak.loses)} />
          <StatTile label="Sem sofrer gols em casa" value={n(s.cleanSheet.home)} />
          <StatTile label="Sem sofrer gols fora" value={n(s.cleanSheet.away)} />
        </dl>
      </section>

      <section aria-labelledby="cards-title">
        <h2 id="cards-title" className={h2}>
          Cartões
        </h2>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 min-[600px]:max-w-md">
          <StatTile label="Amarelos" value={n(s.cards.yellow)} />
          <StatTile label="Vermelhos" value={n(s.cards.red)} />
        </dl>
      </section>

      <section aria-labelledby="form-title">
        <h2 id="form-title" className={h2}>
          Formações mais usadas
        </h2>
        {s.formations.length === 0 ? (
          <p className="text-ink-2">Dados indisponíveis</p>
        ) : (
          <table className="w-full max-w-md border-collapse text-sm">
            <caption className="sr-only">Formações e jogos disputados</caption>
            <thead>
              <tr className="border-b border-line-strong text-xs font-medium text-muted">
                <th scope="col" className="py-2 pr-2 text-left">
                  Formação
                </th>
                <th scope="col" className={head}>
                  Jogos
                </th>
              </tr>
            </thead>
            <tbody>
              {s.formations.slice(0, 5).map((f) => (
                <tr key={f.formation} className="border-b border-line">
                  <th scope="row" className="py-3 pr-2 text-left font-medium tabular-nums">
                    {f.formation}
                  </th>
                  <td className="px-2 py-3 text-right tabular-nums">{f.played}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}
