import { Currency } from '../model/currency.types'

export type RatesLookup = Readonly<Record<Currency['iso_code'], number>>

export function tryCrossRate(
  rates: RatesLookup,
  base: Currency['iso_code'],
  quote: Currency['iso_code'],
): number | null {
  if (base === quote) {
    return 1
  }

  const baseRate = rates[base]
  const quoteRate = rates[quote]

  if (baseRate === undefined || quoteRate === undefined) {
    return null
  }

  return quoteRate / baseRate
}

export function crossRate(
  rates: RatesLookup,
  base: Currency['iso_code'],
  quote: Currency['iso_code'],
): number {
  const rate = tryCrossRate(rates, base, quote)

  if (rate === null) {
    const missing = rates[base] === undefined ? base : quote
    throw new Error(`Missing rate for ${missing}`)
  }

  return rate
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
