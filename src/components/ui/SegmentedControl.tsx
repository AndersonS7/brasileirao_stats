type Option<T extends string> = { value: T; label: string }
type Props<T extends string> = {
  options: Option<T>[]
  value: T
  onChange: (value: T) => void
  label: string
}

export function SegmentedControl<T extends string>({ options, value, onChange, label }: Props<T>) {
  return (
    <div role="group" aria-label={label} className="inline-flex rounded-full border border-line-strong p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={o.value === value}
          onClick={() => onChange(o.value)}
          className={`h-8 rounded-full px-4 text-sm font-medium ${
            o.value === value ? 'bg-green-700 text-white' : 'text-ink-2 hover:bg-surface'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
