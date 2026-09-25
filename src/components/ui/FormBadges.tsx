const meta: Record<string, { label: string; cls: string }> = {
  V: { label: 'vitória', cls: 'bg-green-700 text-white' },
  E: { label: 'empate', cls: 'bg-draw-bg text-draw' },
  D: { label: 'derrota', cls: 'bg-loss-bg text-loss' },
}

export function FormBadges({ form }: { form: string }) {
  const results = form.slice(-5).split('').filter((c) => c in meta)
  return (
    <span
      role="img"
      aria-label={`Últimos ${results.length}: ${results.map((c) => meta[c].label).join(', ')}`}
      className="inline-flex gap-1"
    >
      {results.map((c, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`grid size-5 place-items-center rounded-sm text-xs font-semibold ${meta[c].cls}`}
        >
          {c}
        </span>
      ))}
    </span>
  )
}
