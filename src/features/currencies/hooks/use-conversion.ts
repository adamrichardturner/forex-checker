'use client'

import { useQuery } from '@tanstack/react-query'
import { latestRatesQueryOptions } from '../api/query-options'
import { crossRate } from '../utils/cross-rate'

const ECB_BASE = 'EUR'

export function useConversion(base: string, quote: string, amount: number) {
  return useQuery({
    ...latestRatesQueryOptions(ECB_BASE),

    enabled: Boolean(base && quote && Number.isFinite(amount)),

    select: (data) => {
      const rates: Record<string, number> = {
        [ECB_BASE]: 1,
      }

      for (const item of data) {
        if (item.base === ECB_BASE) {
          rates[item.quote] = item.rate
        }
      }

      const rate = crossRate(rates, base, quote)
      const date = data.at(0)?.date ?? null

      return {
        rate,
        converted: amount * rate,
        date,
      }
    },
  })
}
