import { DateTime } from 'luxon'
import { APP_TIMEZONE } from '../model/timezone.constants'
import type { RangePreset } from '../model/rate-history.types'

type DateRange = {
  start: string
  end: string
  includesToday: boolean
}

function startOfAppDay(now: Date): DateTime {
  return DateTime.fromJSDate(now, { zone: APP_TIMEZONE }).startOf('day')
}

function formatDate(date: DateTime): string {
  return date.toISODate() ?? ''
}

export function rangeToDates(range: RangePreset, now = new Date()): DateRange {
  const endDate = startOfAppDay(now)

  const startDate = (() => {
    switch (range) {
      case '1D':
        return endDate.minus({ days: 1 })

      case '1W':
        return endDate.minus({ days: 7 })

      case '1M':
        return endDate.minus({ months: 1 })

      case '3M':
        return endDate.minus({ months: 3 })

      case '1Y':
        return endDate.minus({ years: 1 })

      case '5Y':
        return endDate.minus({ years: 5 })

      default: {
        const exhaustiveCheck: never = range
        return exhaustiveCheck
      }
    }
  })()

  return {
    start: formatDate(startDate),
    end: formatDate(endDate),
    includesToday: true,
  }
}

export function getTickerDateRange(now = new Date()): {
  start: string
  end: string
} {
  const end = startOfAppDay(now)
  const start = end.minus({ days: 7 })

  return {
    start: formatDate(start),
    end: formatDate(end),
  }
}
