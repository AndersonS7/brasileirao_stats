import { useRef, type KeyboardEvent, type ReactNode } from 'react'

type Tab<T extends string> = { value: T; label: string }
type Props<T extends string> = {
  tabs: Tab<T>[]
  value: T
  onChange: (value: T) => void
  label: string
  children: ReactNode
}

export function Tabs<T extends string>({ tabs, value, onChange, label, children }: Props<T>) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})

  const onKeyDown = (e: KeyboardEvent) => {
    const i = tabs.findIndex((t) => t.value === value)
    const next =
      e.key === 'ArrowRight' ? (i + 1) % tabs.length
      : e.key === 'ArrowLeft' ? (i - 1 + tabs.length) % tabs.length
      : e.key === 'Home' ? 0
      : e.key === 'End' ? tabs.length - 1
      : -1
    if (next < 0) return
    e.preventDefault()
    onChange(tabs[next].value)
    refs.current[tabs[next].value]?.focus()
  }

  return (
    <>
      <div role="tablist" aria-label={label} onKeyDown={onKeyDown} className="flex overflow-x-auto border-b border-line">
        {tabs.map((t) => (
          <button
            key={t.value}
            ref={(el) => {
              refs.current[t.value] = el
            }}
            role="tab"
            type="button"
            id={`tab-${t.value}`}
            aria-selected={t.value === value}
            aria-controls={`panel-${t.value}`}
            tabIndex={t.value === value ? 0 : -1}
            onClick={() => onChange(t.value)}
            className={`-mb-px shrink-0 border-b-2 px-4 py-3 font-medium ${
              t.value === value ? 'border-green-700 text-green-800' : 'border-transparent text-ink-2 hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`panel-${value}`} aria-labelledby={`tab-${value}`} tabIndex={0} className="pt-6">
        {children}
      </div>
    </>
  )
}
