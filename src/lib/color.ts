/** Overlay opacity at the photo side; the strictest point, so contrast is checked here. */
const ALPHA = 0.75

function channel(v: number): number {
  const s = v / 255
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}

function luminance([r, g, b]: number[]): number {
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

const rgb = (hex: string): number[] => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))

/** Worst case: the overlay sits on a white photo, so blend over white. */
const overWhite = (c: number[]): number[] => c.map((v) => v * ALPHA + 255 * (1 - ALPHA))

const contrastWithWhite = (c: number[]): number => 1.05 / (luminance(c) + 0.05)

/** Darkens the club color toward black until white text has 4.5:1 on the overlay. */
export function headerTint(hex: string): { color: string; overlay: string; ratio: number } {
  const base = rgb(hex)
  let k = 1
  let c = base
  while (k > 0 && contrastWithWhite(overWhite(c)) < 4.5) {
    k -= 0.02
    c = base.map((v) => Math.round(v * k))
  }
  const color = `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`
  const stop = (a: number) => `${color}${Math.round(a * 255).toString(16).padStart(2, '0')}`
  return {
    color,
    overlay: `linear-gradient(90deg, ${stop(0.92)} 0%, ${stop(ALPHA)} 100%)`,
    ratio: contrastWithWhite(overWhite(c)),
  }
}
