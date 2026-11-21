'use client'

import { useQuery } from '@tanstack/react-query'
import { latestRatesQueryOptions } from '../api/query-options'
import { crossRate, toRatesLookup } from '../utils/cross-rate'

const ECB_BASE = 'EUR'

type RateRow = { date: string; base: string; quote: string }

/**
 * Rows in a v2 "latest" response can carry different dates per quote, so report the
 * date of the rows this pair was actually derived from (the older of the two legs).
 */
function getPairRateDate(
  rows: ReadonlyArray<RateRow>,
  ecbBase: string,
  base: string,
  quote: string,
): string | null {
  const legDates: string[] = []

  for (const row of rows) {
    if (row.base === ecbBase && (row.quote === base || row.quote === quote)) {
      legDates.push(row.date)
    }
  }

  if (legDates.length === 0) {
    return rows.at(0)?.date ?? null
  }

  return legDates.sort((a, b) => a.localeCompare(b))[0] ?? null
}

export function useConversion(base: string, quote: string, amount: number) {
  const query = useQuery({
    ...latestRatesQueryOptions(ECB_BASE),
    enabled: Boolean(base && quote),
    refetchOnMount: 'always',
    select: (data) => {
      const rates = toRatesLookup(ECB_BASE, data)
      const rate = crossRate(rates, base, quote)
      const date = getPairRateDate(data, ECB_BASE, base, quote)

      return {
        rate,
        date,
      }
    },
  })

  const canShowRates = query.isFetchedAfterMount
  const rate = canShowRates ? query.data?.rate : undefined
  const converted = rate !== undefined && Number.isFinite(amount) ? rate * amount : undefined

  return {
    ...query,
    isPending: query.isPending || !canShowRates,
    data:
      canShowRates && query.data
        ? {
            rate: query.data.rate,
            date: query.data.date,
            converted,
          }
        : undefined,
  }
}
