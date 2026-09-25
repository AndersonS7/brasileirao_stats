import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Skeleton } from '../components/ui/Skeleton'
import { Layout } from './Layout'
import { Stub } from './Stub'

const NotFound = lazy(() => import('./NotFound'))
const LeaguePage = lazy(() => import('../features/league/LeaguePage'))

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
          <Route path="jogos" element={<Stub title="Jogos" />} />
          <Route path="clubes/:slug" element={<Stub title="Clube" />} />
          <Route path="jogadores" element={<Stub title="Jogadores" />} />
          <Route path="comparar" element={<Stub title="Comparar" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
