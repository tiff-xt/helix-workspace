/** Deterministic PRNG (mulberry32) so the synthetic dataset is identical on every load. */
export function createRandom(seed: number) {
  let a = seed >>> 0
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  /** Standard normal via Box–Muller. */
  const normal = (mean = 0, sd = 1) => {
    const u = 1 - next()
    const v = next()
    return mean + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
  }
  const pick = <T>(items: readonly T[]): T => items[Math.floor(next() * items.length)]
  return { next, normal, pick }
}
