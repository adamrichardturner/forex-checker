import type { RangePreset } from '../model/rate-history.types'

type DateRange = {
  start: string
  end: string
  includesToday: boolean
}

const MS_PER_DAY = 24 * 60 * 60 * 1000

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
}

function subtractUtcDays(date: Date, days: number): Date {
  return new Date(date.getTime() - days * MS_PER_DAY)
}

function subtractUtcMonths(date: Date, months: number): Date {
  const year = date.getUTCFullYear()
  const month = date.getUTCMonth()
  const day = date.getUTCDate()

  const target = new Date(Date.UTC(year, month - months, 1))

  const lastDayOfTargetMonth = new Date(
    Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0),
  ).getUTCDate()

  target.setUTCDate(Math.min(day, lastDayOfTargetMonth))

  return target
}

function subtractUtcYears(date: Date, years: number): Date {
  const year = date.getUTCFullYear() - years
  const month = date.getUTCMonth()
  const day = date.getUTCDate()

  const target = new Date(Date.UTC(year, month, 1))

  const lastDayOfTargetMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()

  target.setUTCDate(Math.min(day, lastDayOfTargetMonth))

  return target
}

export function rangeToDates(range: RangePreset, now = new Date()): DateRange {
  const endDate = startOfUtcDay(now)

  const startDate = (() => {
    switch (range) {
      case '1W':
        return subtractUtcDays(endDate, 7)

      case '1M':
        return subtractUtcMonths(endDate, 1)

      case '3M':
        return subtractUtcMonths(endDate, 3)

      case '6M':
        return subtractUtcMonths(endDate, 6)

      case '1Y':
        return subtractUtcYears(endDate, 1)

      case '5Y':
        return subtractUtcYears(endDate, 5)

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
