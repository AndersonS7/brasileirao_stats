import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="py-12">
      <h1 className="text-[28px] font-bold leading-[34px] tracking-tight">Página não encontrada</h1>
      <p className="mt-2 text-ink-2">O endereço não existe neste site.</p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-full bg-green-700 px-5 py-2.5 font-medium text-white hover:bg-green-800"
      >
        Ir para a Liga
      </Link>
    </section>
  )
}
