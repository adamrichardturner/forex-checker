'use client'

import { useQuery } from '@tanstack/react-query'
import { latestRatesQueryOptions } from '../api/query-options'
import { tryCrossRate, toRatesLookup } from '../utils/cross-rate'

const ECB_BASE = 'EUR'

export type CompareRateRow = {
  quote: string
  rate: number | null
  converted: number | null
}

export function useCompareRates(base: string, amount: number, quotes: string[]) {
  return useQuery({
    ...latestRatesQueryOptions(ECB_BASE),
    enabled: Boolean(base) && quotes.length > 0 && amount > 0,
    select: (data): CompareRateRow[] => {
      const rates = toRatesLookup(ECB_BASE, data)

      return quotes.map((quote) => {
        const rate = tryCrossRate(rates, base, quote)
        const converted = rate !== null && Number.isFinite(amount) ? rate * amount : null

        return {
          quote,
          rate,
          converted,
        }
      })
    },
  })
}
