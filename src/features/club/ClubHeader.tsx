import { img } from '../../lib/assets'
import { headerTint } from '../../lib/color'
import type { Team } from '../../types/data'

export function ClubHeader({ team }: { team: Team }) {
  const tint = headerTint(team.color)
  const meta = [team.stadium, team.city, team.founded && `Fundado em ${team.founded}`].filter(Boolean)

  return (
    <header className="relative overflow-hidden rounded-md text-white" style={{ backgroundColor: tint.color }}>
      {team.venuePhoto && (
        <img src={img(team.venuePhoto)} alt="" className="absolute inset-0 size-full object-cover" />
      )}
      <div aria-hidden="true" className="absolute inset-0" style={{ backgroundImage: tint.overlay }} />
      <div className="relative flex flex-col gap-4 p-6 min-[600px]:flex-row min-[600px]:items-center min-[600px]:gap-6 min-[600px]:p-8">
        <div className="grid size-20 shrink-0 place-items-center rounded-full bg-white">
          <img src={img(team.badge)} alt="" width={56} height={56} className="size-14 object-contain" />
        </div>
        <div className="min-w-0">
          <h1 className="text-[28px] font-bold leading-[34px] tracking-tight">{team.name}</h1>
          <p className="mt-1 max-w-prose">{meta.join(' — ')}</p>
        </div>
      </div>
    </header>
  )
}
