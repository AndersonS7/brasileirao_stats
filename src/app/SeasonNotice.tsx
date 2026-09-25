import season from '../data/season.json'
import type { Season } from '../types/data'

const { season: year } = season as Season

export function SeasonNotice() {
  return (
    <p className="border-b border-line bg-surface px-4 py-2 text-center text-sm text-ink-2">
      <strong className="font-semibold text-ink">Dados da temporada {year}.</strong> Amostra do plano gratuito, não é
      a temporada em andamento.
    </p>
  )
}
