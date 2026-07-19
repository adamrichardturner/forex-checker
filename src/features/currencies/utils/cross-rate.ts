import { Currency } from '../model/currency.types'

export type RatesLookup = Readonly<Record<Currency['iso_code'], number>>

export function crossRate(
  rates: RatesLookup,
  base: Currency['iso_code'],
  quote: Currency['iso_code'],
): number {
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
  ecbBase: Currency['iso_code'],
  rows: ReadonlyArray<{
    base: Currency['iso_code']
    quote: Currency['iso_code']
    rate: number
  }>,
): RatesLookup {
  const rates: Record<Currency['iso_code'], number> = {
    [ecbBase]: 1,
  }

  for (const row of rows) {
    if (row.base === ecbBase) {
      rates[row.quote] = row.rate
    }
  }

  return rates
}
