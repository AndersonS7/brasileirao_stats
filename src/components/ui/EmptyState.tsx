type Props = { title: string; message: string }

export function EmptyState({ title, message }: Props) {
  return (
    <div className="rounded-md border border-dashed border-line-strong px-6 py-10 text-center">
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-ink-2">{message}</p>
    </div>
  )
}
