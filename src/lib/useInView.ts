import { useEffect, useState, type RefObject } from 'react'

/** Turns true once the element is visible and stays true. */
export function useInView(ref: RefObject<Element | null>, threshold = 0.3): boolean {
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setSeen(true)
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, seen, threshold])

  return seen
}
