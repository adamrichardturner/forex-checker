export function withBase(base: string, rates: Record<string, number>): Record<string, number> {
  return { ...rates, [base]: 1 }
}

export function crossRate(rates: Record<string, number>, base: string, quote: string): number {
  if (base === quote) {
    return 1
  }
  const baseRate = rates[base]
  const quoteRate = rates[quote]
  if (baseRate === undefined || quoteRate === undefined) {
    throw new Error(`Missing rate for ${base} or ${quote}`)
  }
  return quoteRate / baseRate
}
