type Props = { label: string; value: string | null; meta?: string | null }

export function StatTile({ label, value, meta }: Props) {
  return (
    <div className="border-l-2 border-line-strong pl-4">
      <dt className="text-sm text-ink-2">{label}</dt>
      <dd className="mt-1">
        {value === null ? (
          <span className="text-sm text-muted">Dados indisponíveis</span>
        ) : (
          <>
            <span className="block text-[28px] font-bold leading-[34px] tracking-tight tabular-nums">{value}</span>
            {meta && <span className="block truncate text-sm text-muted">{meta}</span>}
          </>
        )}
      </dd>
    </div>
  )
}
