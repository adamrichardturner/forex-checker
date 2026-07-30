import type { Currency } from '@/features/currencies/model/currency.types'

export const FIXTURE_DATE = '2026-07-28'
export const FIXTURE_PREVIOUS_DATE = '2026-07-25'
export const FIXTURE_WEEK_START = '2026-07-21'

/** Stable EUR-based latest rates used across unit, integration, and E2E tests. */
export const LATEST_RATES_EUR = [
  { date: FIXTURE_DATE, base: 'EUR', quote: 'USD', rate: 1.1 },
  { date: FIXTURE_DATE, base: 'EUR', quote: 'GBP', rate: 0.85 },
  { date: FIXTURE_DATE, base: 'EUR', quote: 'JPY', rate: 160 },
  { date: FIXTURE_DATE, base: 'EUR', quote: 'CHF', rate: 0.95 },
  { date: FIXTURE_DATE, base: 'EUR', quote: 'CAD', rate: 1.5 },
  { date: FIXTURE_DATE, base: 'EUR', quote: 'AUD', rate: 1.65 },
  { date: FIXTURE_DATE, base: 'EUR', quote: 'NZD', rate: 1.8 },
  { date: FIXTURE_DATE, base: 'EUR', quote: 'SEK', rate: 11.2 },
  { date: FIXTURE_DATE, base: 'EUR', quote: 'NOK', rate: 11.5 },
  { date: FIXTURE_DATE, base: 'EUR', quote: 'DKK', rate: 7.46 },
  { date: FIXTURE_DATE, base: 'EUR', quote: 'PLN', rate: 4.3 },
  { date: FIXTURE_DATE, base: 'EUR', quote: 'HKD', rate: 8.6 },
  { date: FIXTURE_DATE, base: 'EUR', quote: 'SGD', rate: 1.48 },
  { date: FIXTURE_DATE, base: 'EUR', quote: 'CNY', rate: 7.9 },
  { date: FIXTURE_DATE, base: 'EUR', quote: 'ZAR', rate: 20.1 },
  { date: FIXTURE_DATE, base: 'EUR', quote: 'MXN', rate: 20.5 },
  { date: FIXTURE_DATE, base: 'EUR', quote: 'TRY', rate: 38 },
  { date: FIXTURE_DATE, base: 'EUR', quote: 'INR', rate: 92 },
  { date: FIXTURE_DATE, base: 'EUR', quote: 'BRL', rate: 6.1 },
  { date: FIXTURE_DATE, base: 'EUR', quote: 'KRW', rate: 1500 },
  { date: FIXTURE_DATE, base: 'EUR', quote: 'THB', rate: 38.5 },
  { date: FIXTURE_DATE, base: 'EUR', quote: 'ILS', rate: 4.1 },
  { date: FIXTURE_DATE, base: 'EUR', quote: 'CZK', rate: 25 },
  { date: FIXTURE_DATE, base: 'EUR', quote: 'HUF', rate: 395 },
  { date: FIXTURE_DATE, base: 'EUR', quote: 'BDT', rate: 132 },
] as const

const PREVIOUS_RATES_EUR = LATEST_RATES_EUR.map((row) => ({
  ...row,
  date: FIXTURE_PREVIOUS_DATE,
  rate: Number((row.rate * 0.99).toFixed(6)),
}))

const EARLIER_RATES_EUR = LATEST_RATES_EUR.map((row) => ({
  ...row,
  date: FIXTURE_WEEK_START,
  rate: Number((row.rate * 0.98).toFixed(6)),
}))

/** Multi-day series with a weekend gap (Sat/Sun omitted between 25 and 28 Jul). */
export const TICKER_SERIES = [
  ...EARLIER_RATES_EUR,
  ...PREVIOUS_RATES_EUR,
  ...LATEST_RATES_EUR,
] as const

export const CURRENCIES_FIXTURE: Currency[] = [
  { iso_code: 'EUR', name: 'Euro', symbol: '€' },
  { iso_code: 'USD', name: 'US Dollar', symbol: '$' },
  { iso_code: 'GBP', name: 'British Pound', symbol: '£' },
  { iso_code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { iso_code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { iso_code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { iso_code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { iso_code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
  { iso_code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { iso_code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
  { iso_code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
  { iso_code: 'PLN', name: 'Polish Zloty', symbol: 'zł' },
  { iso_code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
  { iso_code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { iso_code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { iso_code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { iso_code: 'MXN', name: 'Mexican Peso', symbol: '$' },
  { iso_code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
  { iso_code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { iso_code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { iso_code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { iso_code: 'THB', name: 'Thai Baht', symbol: '฿' },
  { iso_code: 'ILS', name: 'Israeli Shekel', symbol: '₪' },
  { iso_code: 'CZK', name: 'Czech Koruna', symbol: 'Kč' },
  { iso_code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft' },
  { iso_code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳' },
  { iso_code: 'XYZ', name: 'Test Currency', symbol: 'X' },
]

type RateRow = {
  date: string
  base: string
  quote: string
  rate: number
}

function buildLongTimeSeries(): RateRow[] {
  const rows: RateRow[] = []
  const quotes = ['USD', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD'] as const
  const start = new Date(`${FIXTURE_WEEK_START}T12:00:00Z`)

  for (let dayOffset = 0; dayOffset < 40; dayOffset++) {
    const date = new Date(start)
    date.setUTCDate(start.getUTCDate() + dayOffset)
    const isoDate = date.toISOString().slice(0, 10)
    const weekday = date.getUTCDay()

    if (weekday === 0 || weekday === 6) {
      continue
    }

    for (const quote of quotes) {
      const baseRate = LATEST_RATES_EUR.find((row) => row.quote === quote)?.rate ?? 1
      // Climb toward the latest fixture rate without overshooting it.
      const progress = dayOffset / 39
      rows.push({
        date: isoDate,
        base: 'EUR',
        quote,
        rate: Number((baseRate * (0.95 + progress * 0.05)).toFixed(6)),
      })
    }
  }

  return rows
}

export const TIME_SERIES_FIXTURE = buildLongTimeSeries()

export function filterRates(
  series: readonly RateRow[],
  options: {
    base?: string | null
    quotes?: string | null
    from?: string | null
    to?: string | null
  },
): RateRow[] {
  const quoteSet =
    options.quotes && options.quotes.length > 0
      ? new Set(
          options.quotes
            .split(',')
            .map((quote) => quote.trim())
            .filter(Boolean),
        )
      : null

  return series.filter((row) => {
    if (options.base && row.base !== options.base) {
      return false
    }

    if (quoteSet && !quoteSet.has(row.quote)) {
      return false
    }

    if (options.from && row.date < options.from) {
      return false
    }

    if (options.to && row.date > options.to) {
      return false
    }

    return true
  })
}
