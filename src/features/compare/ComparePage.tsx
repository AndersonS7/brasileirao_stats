import { useSearchParams } from 'react-router-dom'
import { EmptyState } from '../../components/ui/EmptyState'
import standingsApi from '../../data/standings-api.json'
import teamStats from '../../data/team-stats.json'
import { buildComparison, seriesColors, type CompareSide } from '../../lib/compare'
import { allTeams } from '../../lib/teams'
import type { StandingRow, Team, TeamStats } from '../../types/data'
import { ComparisonRows } from './ComparisonRows'
import { HeadToHead } from './HeadToHead'
import { TeamPicker } from './TeamPicker'

const standings = standingsApi as StandingRow[]
const stats = teamStats as unknown as Record<number, TeamStats | undefined>

const side = (t: Team): CompareSide => ({ row: standings.find((r) => r.teamId === t.id), stats: stats[t.id] })
const bySlug = (slug: string | null): Team | undefined => allTeams.find((t) => t.slug === slug)

export default function ComparePage() {
  const [params, setParams] = useSearchParams()
  const a = bySlug(params.get('a'))
  const asked = bySlug(params.get('b'))
  const clash = a !== undefined && asked?.id === a.id
  const b = clash ? undefined : asked

  const set = (key: 'a' | 'b', slug: string) => {
    const p = new URLSearchParams(params)
    if (slug) p.set(key, slug)
    else p.delete(key)
    setParams(p, { replace: true })
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[28px] font-bold leading-[34px] tracking-tight">Comparar</h1>
      <div className="flex flex-col gap-4 min-[600px]:flex-row">
        <TeamPicker label="Clube A" value={a?.slug ?? ''} exclude={b?.slug ?? ''} onChange={(s) => set('a', s)} />
        <TeamPicker label="Clube B" value={b?.slug ?? ''} exclude={a?.slug ?? ''} onChange={(s) => set('b', s)} />
      </div>
      {clash && (
        <p role="alert" className="text-loss">
          O mesmo clube não pode estar nos dois lados. Escolha outro para o Clube B.
        </p>
      )}
      {a && b ? (
        <>
          <ComparisonRows a={a} b={b} colors={seriesColors(a, b)} rows={buildComparison(side(a), side(b))} />
          <HeadToHead a={a.id} b={b.id} />
        </>
      ) : (
        <EmptyState
          title="Escolha dois clubes para comparar"
          message="Os números aparecem lado a lado assim que os dois estiverem selecionados."
        />
      )}
    </div>
  )
}
