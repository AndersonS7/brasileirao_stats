import { useSearchParams } from 'react-router-dom'
import { EmptyState } from '../../components/ui/EmptyState'
import { Tabs } from '../../components/ui/Tabs'
import rankingsData from '../../data/rankings.json'
import { allTeams } from '../../lib/teams'
import type { PlayerRow, Rankings } from '../../types/data'
import { RankingList } from './RankingList'

const rankings = rankingsData as Rankings

const tabs = [
  { value: 'gols', label: 'Gols', list: 'scorers', field: 'goals', unit: 'gols' },
  { value: 'assistencias', label: 'Assistências', list: 'assists', field: 'assists', unit: 'assistências' },
  { value: 'amarelos', label: 'Amarelos', list: 'yellow', field: 'yellow', unit: 'cartões amarelos' },
  { value: 'vermelhos', label: 'Vermelhos', list: 'red', field: 'red', unit: 'cartões vermelhos' },
] as const

const LIMIT = 20

export default function PlayersPage() {
  const [params, setParams] = useSearchParams()
  const tab = tabs.find((t) => t.value === params.get('aba')) ?? tabs[0]
  const askedClub = allTeams.find((t) => t.slug === params.get('clube'))

  const update = (next: { aba?: string; clube?: string }) => {
    const p = new URLSearchParams(params)
    for (const [k, v] of Object.entries(next)) {
      if (v) p.set(k, v)
      else p.delete(k)
    }
    setParams(p, { replace: true })
  }

  const value = (p: PlayerRow) => p[tab.field]
  const players = rankings[tab.list]
    .filter((p) => !askedClub || p.teamId === askedClub.id)
    .sort((a, b) => value(b) - value(a))
    .slice(0, LIMIT)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[28px] font-bold leading-[34px] tracking-tight">Jogadores</h1>
      <label className="flex items-center gap-2">
        <span className="text-ink-2">Clube</span>
        <select
          value={askedClub?.slug ?? ''}
          onChange={(e) => update({ clube: e.target.value })}
          className="h-10 min-w-0 max-w-full rounded-full border border-line-strong bg-white px-4 font-medium"
        >
          <option value="">Todos os clubes</option>
          {allTeams.map((t) => (
            <option key={t.id} value={t.slug}>
              {t.name}
            </option>
          ))}
        </select>
      </label>
      <Tabs
        tabs={tabs.map(({ value: v, label }) => ({ value: v, label }))}
        value={tab.value}
        onChange={(aba) => update({ aba })}
        label="Rankings de jogadores"
      >
        {players.length === 0 ? (
          <EmptyState
            title="Sem ranking"
            message={askedClub ? `Nenhum jogador de ${askedClub.name} nesta lista.` : 'A API não trouxe dados para esta lista.'}
          />
        ) : (
          <RankingList players={players} value={value} unit={tab.unit} />
        )}
      </Tabs>
    </div>
  )
}
