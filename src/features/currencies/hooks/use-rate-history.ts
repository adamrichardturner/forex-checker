'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { timeSeriesQueryOptions } from '../api/query-options'
import type { FrankfurterTimeSeries } from '../model/currency.types'
import type { RangePreset, RateHistory } from '../model/rate-history.types'
import { rangeToDates } from '../utils/date-range'

function toHistory(series: FrankfurterTimeSeries, quote: string): RateHistory {
  const points = series
    .filter((item) => item.quote === quote)
    .map(({ date, rate }) => ({
      date,
      value: rate,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))

  const open = points.at(0)?.value ?? 0
  const last = points.at(-1)?.value ?? 0
  const change = last - open
  const changePct = open === 0 ? 0 : (change / open) * 100

  return {
    points,
    open,
    last,
    change,
    changePct,
  }
}

export function useRateHistory(base: string, quote: string, range: RangePreset) {
  const { start, end, includesToday } = rangeToDates(range)

  return useQuery({
    ...timeSeriesQueryOptions({
      base,
      quote,
      start,
      end,
      includesToday,
    }),
    placeholderData: keepPreviousData,
    select: (data) => toHistory(data, quote),
  })
}
