'use client'

import { useQuery } from '@tanstack/react-query'
import { tickerRatesQueryOptions } from '../api/query-options'
import { TICKER_PAIRS } from '../model/ticker.constants'
import type { LatestRatesTimeSeries } from '../model/currency.types'
import type { TickerItem } from '../model/currency-ticker.types'
import { tryCrossRate, toRatesLookup, type RatesLookup } from '../utils/cross-rate'
import { getTickerDateRange } from '../utils/date-range'

const ECB_BASE = 'EUR'

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

function getRequiredCodes(): string[] {
  const codes: Record<string, true> = {
    [ECB_BASE]: true,
  }

  for (const { base, quote } of TICKER_PAIRS) {
    codes[base] = true
    codes[quote] = true
  }

  return Object.keys(codes)
}

function hasRequiredRates(rates: RatesLookup, requiredCodes: string[]): boolean {
  for (const code of requiredCodes) {
    if (rates[code] === undefined) {
      return false
    }
  }

  return true
}

function resolveCurrentDate(
  dates: string[],
  ratesByDate: Record<string, RatesLookup>,
): string | null {
  const requiredCodes = getRequiredCodes()

  for (let index = dates.length - 1; index >= 0; index--) {
    const date = dates[index]

    if (!date) {
      continue
    }

    const rates = ratesByDate[date]

    if (!rates) {
      continue
    }

    if (hasRequiredRates(rates, requiredCodes)) {
      return date
    }
  }

  return dates.at(-1) ?? null
}

function toTickerItems(rows: LatestRatesTimeSeries): TickerItem[] {
  const ratesByDate = groupRatesByDate(rows)
  const dates = Object.keys(ratesByDate).sort((a, b) => a.localeCompare(b))
  const currentDate = resolveCurrentDate(dates, ratesByDate)

  if (!currentDate) {
    return []
  }

  const currentDateIndex = dates.indexOf(currentDate)
  const previousDate = currentDateIndex > 0 ? dates[currentDateIndex - 1] : undefined
  const currentRates = ratesByDate[currentDate]

  if (!currentRates) {
    return []
  }

  const previousRates = previousDate ? ratesByDate[previousDate] : undefined
  const items: TickerItem[] = []

  for (const { base, quote } of TICKER_PAIRS) {
    const rate = tryCrossRate(currentRates, base, quote)

    if (rate === null) {
      continue
    }

    const previousRate = previousRates ? tryCrossRate(previousRates, base, quote) : null
    const change = previousRate === null ? null : rate - previousRate
    const changePct =
      previousRate === null || previousRate === 0 || change === null
        ? null
        : (change / previousRate) * 100
    const direction = change === null || change === 0 ? 'flat' : change > 0 ? 'up' : 'down'

    items.push({
      base,
      quote,
      rate,
      previousRate,
      change,
      changePct,
      direction,
      date: currentDate,
    })
  }

  return items
}

export function useForexTicker() {
  const { start, end } = getTickerDateRange()

  return useQuery({
    ...tickerRatesQueryOptions(ECB_BASE, start, end),
    select: toTickerItems,
  })
}
