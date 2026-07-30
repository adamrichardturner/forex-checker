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
        filterRates([...TICKER_SERIES, ...TIME_SERIES_FIXTURE], {
          base,
          quotes,
          from,
          to,
        }),
      )

      return HttpResponse.json(series)
    }

    return HttpResponse.json(
      filterRates([...LATEST_RATES_EUR], {
        base,
        quotes,
      }),
    )
  }),
]

const app = express()
app.use(express.json())

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
