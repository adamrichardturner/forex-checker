'use client'

import { useQuery } from '@tanstack/react-query'
import { tickerRatesQueryOptions } from '../api/query-options'
import { TICKER_PAIRS } from '../model/ticker.constants'
import type { FrankfurterTimeSeries } from '../model/currency.types'
import type { TickerItem } from '../model/currency-ticker.types'
import { crossRate, toRatesLookup, type RatesLookup } from '../utils/cross-rate'
import { getTickerDateRange } from '../utils/date-range'

const ECB_BASE = 'EUR'

function groupRatesByDate(rows: FrankfurterTimeSeries): Map<string, RatesLookup> {
  const rowsByDate = new Map<string, FrankfurterTimeSeries>()

  for (const row of rows) {
    const existingRows = rowsByDate.get(row.date) ?? []
    existingRows.push(row)
    rowsByDate.set(row.date, existingRows)
  }

  return new Map(
    [...rowsByDate.entries()].map(([date, dateRows]) => [date, toRatesLookup(ECB_BASE, dateRows)]),
  )
}

function toTickerItems(rows: FrankfurterTimeSeries): TickerItem[] {
  const ratesByDate = groupRatesByDate(rows)

  const dates = [...ratesByDate.keys()].sort((a, b) => a.localeCompare(b))

  const currentDate = dates.at(-1)

  if (!currentDate) {
    return []
  }

  const previousDate = dates.at(-2)
  const currentRates = ratesByDate.get(currentDate)

  if (!currentRates) {
    return []
  }

  const previousRates = previousDate ? ratesByDate.get(previousDate) : undefined

  return TICKER_PAIRS.map(({ base, quote }) => {
    const rate = crossRate(currentRates, base, quote)

    const previousRate = previousRates ? crossRate(previousRates, base, quote) : null

    const change = previousRate === null ? null : rate - previousRate

    const changePct =
      previousRate === null || previousRate === 0 ? null : (change! / previousRate) * 100

    const direction = change === null || change === 0 ? 'flat' : change > 0 ? 'up' : 'down'

    return {
      base,
      quote,
      rate,
      previousRate,
      change,
      changePct,
      direction,
      date: currentDate,
    }
  })
}

export function useForexTicker() {
  const { start, end } = getTickerDateRange()

  return useQuery({
    ...tickerRatesQueryOptions(ECB_BASE, start, end),
    select: toTickerItems,
  })
}
