import { img } from '../../lib/assets'
import type { Team } from '../../types/data'

type Props = { team: Team; size?: number; labelled?: boolean }

export function Crest({ team, size = 24, labelled = false }: Props) {
  return (
    <img
      src={img(team.badge)}
      alt={labelled ? team.name : ''}
      width={size}
      height={size}
      loading="lazy"
      className="shrink-0 object-contain"
      style={{ width: size, height: size }}
    />
  )
}
