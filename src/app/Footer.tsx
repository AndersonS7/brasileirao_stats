const link = 'rounded-sm font-medium text-green-700 underline underline-offset-2'

export function Footer() {
  return (
    <footer className="mt-12 border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl space-y-2 px-4 py-8 text-sm text-ink-2">
        <p>
          Dados de{' '}
          <a className={link} href="https://www.api-football.com" target="_blank" rel="noreferrer">
            API-Football
          </a>{' '}
          (classificação, jogos, estatísticas, elencos) e{' '}
          <a className={link} href="https://www.thesportsdb.com" target="_blank" rel="noreferrer">
            TheSportsDB
          </a>{' '}
          (escudos, fotos, cores).
        </p>
        <p>
          Escudos são marcas registradas dos respectivos clubes. Projeto de demonstração, sem fins comerciais e sem
          afiliação com a CBF ou com os clubes.
        </p>
      </div>
    </footer>
  )
}
