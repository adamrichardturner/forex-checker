export type RatesLookup = Readonly<Record<string, number>>

export function crossRate(rates: RatesLookup, base: string, quote: string): number {
  if (base === quote) {
    return 1
  }

  const baseRate = rates[base]
  const quoteRate = rates[quote]

  if (baseRate === undefined) {
    throw new Error(`Missing rate for ${base}`)
  }

  if (quoteRate === undefined) {
    throw new Error(`Missing rate for ${quote}`)
  }

  return quoteRate / baseRate
}

export function toRatesLookup(
  ecbBase: string,
  rows: ReadonlyArray<{
    base: string
    quote: string
    rate: number
  }>,
): RatesLookup {
  const rates: Record<string, number> = {
    [ecbBase]: 1,
  }

  for (const row of rows) {
    if (row.base === ecbBase) {
      rates[row.quote] = row.rate
    }
  }

  return rates
}
