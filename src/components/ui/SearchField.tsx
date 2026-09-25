import { forwardRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { searchTeams } from '../../lib/search'
import teams from '../../data/teams.json'
import type { Team } from '../../types/data'
import { Crest } from './Crest'

export const SearchField = forwardRef<HTMLInputElement>(function SearchField(_, ref) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)

  const results = searchTeams(teams as Team[], query)
  const showList = open && query.trim() !== ''

  const choose = (team: Team) => {
    setOpen(false)
    setQuery('')
    navigate(`/clubes/${team.slug}`)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false)
    } else if (e.key === 'ArrowDown' && results.length) {
      e.preventDefault()
      setOpen(true)
      setActive((active + 1) % results.length)
    } else if (e.key === 'ArrowUp' && results.length) {
      e.preventDefault()
      setActive((active - 1 + results.length) % results.length)
    } else if (e.key === 'Enter' && showList && results[active]) {
      e.preventDefault()
      choose(results[active])
    }
  }

  return (
    <div className="relative w-full sm:w-60" onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setOpen(false)}>
      <label className="relative block">
        <span className="sr-only">Buscar clube</span>
        <Search
          aria-hidden="true"
          strokeWidth={1.75}
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted"
        />
        <input
          ref={ref}
          type="search"
          placeholder="Buscar clube"
          role="combobox"
          aria-expanded={showList}
          aria-controls="search-results"
          aria-autocomplete="list"
          aria-activedescendant={showList && results[active] ? `search-opt-${results[active].id}` : undefined}
          autoComplete="off"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setActive(0)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="h-10 w-full rounded-full border border-line-strong bg-white pl-9 pr-9 text-sm placeholder:text-muted"
        />
        <kbd
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-sm border border-line px-1.5 text-xs font-medium text-muted"
        >
          /
        </kbd>
      </label>
      <div
        id="search-results"
        role="listbox"
        aria-label="Resultados da busca"
        hidden={!showList}
        className="absolute right-0 top-12 z-20 w-full min-w-64 overflow-hidden rounded-md border border-line bg-white py-1 shadow-lg"
      >
        {results.length === 0 ? (
          <p className="px-3 py-2 text-sm text-muted">Nenhum clube encontrado</p>
        ) : (
          results.map((t, i) => (
            <div
              key={t.id}
              id={`search-opt-${t.id}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => choose(t)}
              className={`flex cursor-pointer items-center gap-2 px-3 py-2 text-sm ${i === active ? 'bg-green-50' : ''}`}
            >
              <Crest team={t} size={20} />
              <span className="truncate">{t.name}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
})
