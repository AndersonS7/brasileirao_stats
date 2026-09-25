import { allTeams } from '../../lib/teams'

type Props = { label: string; value: string; exclude: string; onChange: (slug: string) => void }

export function TeamPicker({ label, value, exclude, onChange }: Props) {
  return (
    <label className="flex min-w-0 flex-1 flex-col gap-1 min-[600px]:max-w-72">
      <span className="text-sm text-ink-2">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-full border border-line-strong bg-white px-4 font-medium"
      >
        <option value="">Escolher clube</option>
        {allTeams
          .filter((t) => t.slug !== exclude)
          .map((t) => (
            <option key={t.id} value={t.slug}>
              {t.name}
            </option>
          ))}
      </select>
    </label>
  )
}
