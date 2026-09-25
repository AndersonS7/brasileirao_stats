import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Skeleton } from '../components/ui/Skeleton'
import { Layout } from './Layout'

const NotFound = lazy(() => import('./NotFound'))
const ClubPage = lazy(() => import('../features/club/ClubPage'))
const FixturesPage = lazy(() => import('../features/fixtures/FixturesPage'))
const LeaguePage = lazy(() => import('../features/league/LeaguePage'))
const PlayersPage = lazy(() => import('../features/players/PlayersPage'))
const ComparePage = lazy(() => import('../features/compare/ComparePage'))

function PageSkeleton() {
  return (
    <div role="status" aria-label="Carregando" className="mx-auto max-w-6xl px-4 py-8">
      <Skeleton className="mb-8 h-8 w-64" />
      {Array.from({ length: 20 }, (_, i) => (
        <Skeleton key={i} className="mb-1 h-11 w-full" />
      ))}
    </div>
  )
}

export function App() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<LeaguePage />} />
          <Route path="jogos" element={<FixturesPage />} />
          <Route path="clubes/:slug" element={<ClubPage />} />
          <Route path="jogadores" element={<PlayersPage />} />
          <Route path="comparar" element={<ComparePage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
