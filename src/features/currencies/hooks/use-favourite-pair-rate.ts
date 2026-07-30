'use client'

import { useQuery } from '@tanstack/react-query'
import { tickerRatesQueryOptions } from '../api/query-options'
import type { LatestRatesTimeSeries } from '../model/currency.types'
import { getTickerDateRange } from '../utils/date-range'
import { tryCrossRate, toRatesLookup, type RatesLookup } from '../utils/cross-rate'

const ECB_BASE = 'EUR'

export type FavouritePairRate = {
  rate: number
  changePct: number | null
}

function groupRatesByDate(rows: LatestRatesTimeSeries): Record<string, RatesLookup> {
  const rowsByDate: Record<string, LatestRatesTimeSeries> = {}

  for (const row of rows) {
    const existingRows = rowsByDate[row.date] ?? []
    existingRows.push(row)
    rowsByDate[row.date] = existingRows
  }

  const ratesByDate: Record<string, RatesLookup> = {}

  for (const date of Object.keys(rowsByDate)) {
    ratesByDate[date] = toRatesLookup(ECB_BASE, rowsByDate[date] ?? [])
  }

  return ratesByDate
}

function selectPairRate(
  rows: LatestRatesTimeSeries,
  base: string,
  quote: string,
): FavouritePairRate | null {
  const ratesByDate = groupRatesByDate(rows)
  const dates = Object.keys(ratesByDate).sort((a, b) => a.localeCompare(b))

  for (let index = dates.length - 1; index >= 0; index--) {
    const date = dates[index]

    if (!date) {
      continue
    }

    const currentRates = ratesByDate[date]

    if (!currentRates) {
      continue
    }

    const rate = tryCrossRate(currentRates, base, quote)

    if (rate === null) {
      continue
    }

    const previousDate = index > 0 ? dates[index - 1] : undefined
    const previousRates = previousDate ? ratesByDate[previousDate] : undefined
    const previousRate = previousRates ? tryCrossRate(previousRates, base, quote) : null
    const changePct =
      previousRate === null || previousRate === 0
        ? null
        : ((rate - previousRate) / previousRate) * 100

    return {
      rate,
      changePct,
    }
  }

  return null
}

export function useFavouritePairRate(base: string, quote: string) {
  const { start, end } = getTickerDateRange()

  return useQuery({
    ...tickerRatesQueryOptions(ECB_BASE, start, end),
    enabled: Boolean(base && quote),
    select: (rows) => selectPairRate(rows, base, quote),
  })
}
