import { useState } from 'react'
import { img } from '../../lib/assets'
import type { Team } from '../../types/data'

type Props = { team: Team; size?: number; labelled?: boolean }

export function Crest({ team, size = 24, labelled = false }: Props) {
  const [failed, setFailed] = useState(false)
  const box = { width: size, height: size }

  if (failed) {
    return (
      <span
        role={labelled ? 'img' : undefined}
        aria-label={labelled ? team.name : undefined}
        aria-hidden={labelled ? undefined : true}
        className="grid shrink-0 place-items-center rounded-full bg-green-50 font-semibold text-green-800"
        style={{ ...box, fontSize: Math.max(10, size * 0.36) }}
      >
        {team.short.slice(0, 3)}
      </span>
    )
  }

  return (
    <img
      src={img(team.badge)}
      alt={labelled ? team.name : ''}
      width={size}
      height={size}
      loading="lazy"
      onError={() => setFailed(true)}
      className="shrink-0 object-contain"
      style={box}
    />
  )
}
