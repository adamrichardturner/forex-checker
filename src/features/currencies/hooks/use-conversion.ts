'use client'

import { useQuery } from '@tanstack/react-query'
import { latestRatesQueryOptions } from '../api/query-options'
import { crossRate, toRatesLookup } from '../utils/cross-rate'

const ECB_BASE = 'EUR'

export function useConversion(base: string, quote: string, amount: number) {
  const query = useQuery({
    ...latestRatesQueryOptions(ECB_BASE),
    enabled: Boolean(base && quote),
    select: (data) => {
      const rates = toRatesLookup(ECB_BASE, data)
      const rate = crossRate(rates, base, quote)
      const date = data.at(0)?.date ?? null

      return {
        rate,
        date,
      }
    },
  })

  const rate = query.data?.rate
  const converted = rate !== undefined && Number.isFinite(amount) ? rate * amount : undefined

  return {
    ...query,
    data: query.data
      ? {
          rate: query.data.rate,
          date: query.data.date,
          converted,
        }
      : undefined,
  }
}
