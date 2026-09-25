import { Link } from 'react-router-dom'

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 rounded-sm text-lg font-bold tracking-tight text-ink">
      <span
        aria-hidden="true"
        className="grid size-7 place-items-center rounded-full bg-green-700 text-sm text-white"
      >
        B
      </span>
      Brasileirão Stats
    </Link>
  )
}
