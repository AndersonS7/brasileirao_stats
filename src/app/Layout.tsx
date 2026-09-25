import { useEffect, useRef } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Logo } from '../components/ui/Logo'
import { SearchField } from '../components/ui/SearchField'
import { Footer } from './Footer'
import { SeasonNotice } from './SeasonNotice'

const links = [
  { to: '/', label: 'Liga' },
  { to: '/jogos', label: 'Jogos' },
  { to: '/jogadores', label: 'Jogadores' },
  { to: '/comparar', label: 'Comparar' },
]

export function Layout() {
  const search = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (e.key !== '/' || target.closest('input, textarea, select, [contenteditable]')) return
      e.preventDefault()
      search.current?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <a
        href="#main"
        onClick={(e) => {
          e.preventDefault()
          document.getElementById('main')?.focus()
        }}
        className="sr-only rounded-md bg-green-700 px-4 py-2 font-medium text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10"
      >
        Ir para o conteúdo
      </a>
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
          <Logo />
          <nav aria-label="Principal" className="order-last w-full overflow-x-auto md:order-none md:w-auto md:flex-1">
            <ul className="flex gap-1">
              {links.map(({ to, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) =>
                      `block whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium ${
                        isActive ? 'bg-green-50 text-green-800' : 'text-ink-2 hover:bg-surface'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="ml-auto">
            <SearchField ref={search} />
          </div>
        </div>
      </header>
      <SeasonNotice />
      <main id="main" tabIndex={-1} className="mx-auto max-w-6xl px-4 py-8 outline-none">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
