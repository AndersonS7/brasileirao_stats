import { RotateCcw } from 'lucide-react'
import { useRef, useState } from 'react'
import { Crest } from '../../components/ui/Crest'
import type { CompareRow } from '../../lib/compare'
import { useInView } from '../../lib/useInView'
import type { Team } from '../../types/data'

type Props = { a: Team; b: Team; colors: [string, string]; rows: CompareRow[] }

const show = (v: number, unit: CompareRow['unit']) => (unit === 'percent' ? `${v}%` : String(v))

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

type BarProps = { width: number; color: string; faded: boolean; active: boolean; snap: boolean; side: 'a' | 'b' }

function Bar({ width, color, faded, active, snap, side }: BarProps) {
  return (
    <div className={`flex h-2 overflow-hidden rounded-full bg-surface ${side === 'a' ? 'justify-end' : ''}`} aria-hidden="true">
      <div
        className={`h-full ease-out ${snap ? '' : 'transition-[width] duration-[900ms]'}`}
        style={{ width: active ? `${width}%` : 0, background: color, opacity: faded ? 0.45 : 1 }}
      />
    </div>
  )
}

export function ComparisonRows({ a, b, colors, rows }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const [off, setOff] = useState(false)
  const active = reduced() || (inView && !off)

  const replay = () => {
    setOff(true)
    requestAnimationFrame(() => requestAnimationFrame(() => setOff(false)))
  }

  return (
    <section aria-label={`${a.name} contra ${b.name}`} className="flex flex-col gap-3">
      <div ref={ref} className="overflow-hidden rounded-md border border-line">
        <div className="grid grid-cols-2 gap-4 border-b border-line px-4 py-5">
          {[a, b].map((t, i) => (
            <div
              key={t.id}
              className={`flex min-w-0 flex-col items-center gap-2 text-center min-[600px]:flex-row min-[600px]:gap-3 min-[600px]:text-left ${
                i === 1 ? 'min-[600px]:flex-row-reverse min-[600px]:text-right' : ''
              }`}
            >
              <Crest team={t} size={40} labelled />
              <h2 className="min-w-0 text-lg font-semibold leading-6">{t.name}</h2>
            </div>
          ))}
        </div>
        <ul>
          {rows.map((r) => (
            <li key={r.key} className="border-t border-line px-4 pb-4 pt-3 first:border-t-0">
              <p className="mb-1.5 text-center text-sm text-ink-2">{r.label}</p>
              {r.lead === null ? (
                <p className="text-center text-sm text-muted">Dados indisponíveis</p>
              ) : (
                <div className="grid grid-cols-[3.5rem_1fr_1fr_3.5rem] items-center gap-x-2 tabular-nums">
                  <span className={`text-left ${r.lead === 'a' ? 'font-bold' : 'text-ink-2'}`}>{show(r.a ?? 0, r.unit)}</span>
                  <Bar side="a" width={r.widthA} color={colors[0]} faded={r.lead !== 'a'} active={active} snap={off} />
                  <Bar side="b" width={r.widthB} color={colors[1]} faded={r.lead !== 'b'} active={active} snap={off} />
                  <span className={`text-right ${r.lead === 'b' ? 'font-bold' : 'text-ink-2'}`}>{show(r.b ?? 0, r.unit)}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <button
        type="button"
        onClick={replay}
        className="inline-flex h-10 items-center gap-2 self-start rounded-full border border-line-strong px-4 font-medium hover:bg-surface"
      >
        <RotateCcw size={16} strokeWidth={1.75} aria-hidden="true" />
        Repetir animação
      </button>
    </section>
  )
}
