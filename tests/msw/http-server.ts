import { createMiddleware } from '@mswjs/http-middleware'
import express from 'express'
import { http, HttpResponse } from 'msw'
import {
  CURRENCIES_FIXTURE,
  LATEST_RATES_EUR,
  TICKER_SERIES,
  TIME_SERIES_FIXTURE,
  filterRates,
} from '../fixtures/frankfurter'

const PORT = Number(process.env.MOCK_API_PORT ?? 4010)

let forceRatesError = false
let forceCurrenciesError = false

type RateRow = {
  date: string
  base: string
  quote: string
  rate: number
}

function dedupeRates(rows: RateRow[]): RateRow[] {
  const seen: Record<string, true> = {}
  const result: RateRow[] = []

  for (const row of rows) {
    const key = `${row.date}-${row.base}-${row.quote}`

    if (seen[key]) {
      continue
    }

    seen[key] = true
    result.push(row)
  }

  return result
}

const FIXTURE_BASE = 'EUR'

/**
 * Fixtures are EUR-based. Like the real Frankfurter API, serve any other base by
 * cross-rating through EUR for each date.
 */
function rebaseRates(rows: readonly RateRow[], base: string | null): RateRow[] {
  if (!base || base === FIXTURE_BASE) {
    return [...rows]
  }

  const baseRateByDate = new Map<string, number>()

  for (const row of rows) {
    if (row.base === FIXTURE_BASE && row.quote === base) {
      baseRateByDate.set(row.date, row.rate)
    }
  }

  const rebased: RateRow[] = []

  for (const [date, baseRate] of baseRateByDate) {
    rebased.push({ date, base, quote: FIXTURE_BASE, rate: Number((1 / baseRate).toFixed(6)) })
  }

  for (const row of rows) {
    const baseRate = baseRateByDate.get(row.date)

    if (row.base !== FIXTURE_BASE || row.quote === base || baseRate === undefined) {
      continue
    }

    rebased.push({
      date: row.date,
      base,
      quote: row.quote,
      rate: Number((row.rate / baseRate).toFixed(6)),
    })
  }

  return rebased
}

const handlers = [
  http.get('*/currencies', () => {
    if (forceCurrenciesError) {
      return HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }

    return HttpResponse.json(CURRENCIES_FIXTURE)
  }),

  http.get('*/rates', ({ request }) => {
    if (forceRatesError) {
      return HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }

    const url = new URL(request.url)
    const base = url.searchParams.get('base')
    const quotes = url.searchParams.get('quotes')
    const from = url.searchParams.get('from')
    const to = url.searchParams.get('to')

    if (from || to) {
      const series = dedupeRates(
        filterRates(rebaseRates(dedupeRates([...TICKER_SERIES, ...TIME_SERIES_FIXTURE]), base), {
          base,
          quotes,
          from,
          to,
        }),
      )

      return HttpResponse.json(series)
    }

    return HttpResponse.json(
      filterRates(rebaseRates(LATEST_RATES_EUR, base), {
        base,
        quotes,
      }),
    )
  }),
]

const app = express()
app.use(express.json())

// The app fetches rates from the browser, which is a different origin (port) to this
// mock. The real Frankfurter API allows any origin, so mirror that here.
app.use((request, response, next) => {
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (request.method === 'OPTIONS') {
    response.status(204).end()
    return
  }

  next()
})

app.get('/health', (_request, response) => {
  response.status(200).json({ ok: true })
})

app.post('/__test/errors', (request, response) => {
  const body = request.body as {
    rates?: boolean
    currencies?: boolean
  }

  if (typeof body.rates === 'boolean') {
    forceRatesError = body.rates
  }

  if (typeof body.currencies === 'boolean') {
    forceCurrenciesError = body.currencies
  }

  response.status(200).json({
    rates: forceRatesError,
    currencies: forceCurrenciesError,
  })
})

app.post('/__test/reset', (_request, response) => {
  forceRatesError = false
  forceCurrenciesError = false
  response.status(200).json({ ok: true })
})

app.use(createMiddleware(...handlers))

app.listen(PORT, '127.0.0.1', () => {
  console.log(`MSW HTTP mock listening on http://127.0.0.1:${PORT}`)
})
