import { useParams, useSearchParams } from 'react-router-dom'
import { Tabs } from '../../components/ui/Tabs'
import NotFound from '../../app/NotFound'
import { allTeams } from '../../lib/teams'
import { ClubHeader } from './ClubHeader'
import { Matches } from './tabs/Matches'
import { Squad } from './tabs/Squad'
import { Statistics } from './tabs/Statistics'
import { Summary } from './tabs/Summary'

const tabs = [
  { value: 'resumo', label: 'Resumo' },
  { value: 'jogos', label: 'Jogos' },
  { value: 'estatisticas', label: 'Estatísticas' },
  { value: 'elenco', label: 'Elenco' },
] as const

type TabValue = (typeof tabs)[number]['value']

const isTab = (v: string | null): v is TabValue => tabs.some((t) => t.value === v)

export default function ClubPage() {
  const { slug } = useParams()
  const [params, setParams] = useSearchParams()
  const team = allTeams.find((t) => t.slug === slug)
  if (!team) return <NotFound />

  const raw = params.get('aba')
  const tab: TabValue = isTab(raw) ? raw : 'resumo'

  return (
    <div className="flex flex-col gap-6">
      <ClubHeader team={team} />
      <div>
        <Tabs tabs={[...tabs]} value={tab} onChange={(aba) => setParams({ aba }, { replace: true })} label="Seções do clube">
          {tab === 'resumo' && <Summary team={team} />}
          {tab === 'jogos' && <Matches team={team} />}
          {tab === 'estatisticas' && <Statistics team={team} />}
          {tab === 'elenco' && <Squad team={team} />}
        </Tabs>
      </div>
    </div>
  )
}
