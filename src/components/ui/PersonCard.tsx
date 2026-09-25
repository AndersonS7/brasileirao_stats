import { useState } from 'react'
import { img } from '../../lib/assets'

type Props = { name: string; photo: string | null; detail: string }

const initials = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()

export function Avatar({ name, photo }: { name: string; photo: string | null }) {
  const [failed, setFailed] = useState(false)

  return photo && !failed ? (
    <img
      src={img(photo)}
      alt=""
      width={48}
      height={48}
      loading="lazy"
      onError={() => setFailed(true)}
      className="size-12 shrink-0 rounded-full bg-surface object-cover"
    />
  ) : (
    <span
      aria-hidden="true"
      className="grid size-12 shrink-0 place-items-center rounded-full bg-green-50 font-semibold text-green-800"
    >
      {initials(name)}
    </span>
  )
}

export function PersonCard({ name, photo, detail }: Props) {
  return (
    <li className="flex items-center gap-3 border-b border-line py-3">
      <Avatar name={name} photo={photo} />
      <div className="min-w-0">
        <p className="truncate font-medium">{name}</p>
        <p className="truncate text-sm text-ink-2">{detail}</p>
      </div>
    </li>
  )
}
