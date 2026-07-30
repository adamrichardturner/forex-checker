import { http, HttpResponse } from 'msw'
import {
  CURRENCIES_FIXTURE,
  LATEST_RATES_EUR,
  TICKER_SERIES,
  TIME_SERIES_FIXTURE,
  filterRates,
} from '../fixtures/frankfurter'

export const frankfurterHandlers = [
  http.get('*/currencies', () => {
    return HttpResponse.json(CURRENCIES_FIXTURE)
  }),

  http.get('*/rates', ({ request }) => {
    const url = new URL(request.url)
    const base = url.searchParams.get('base')
    const quotes = url.searchParams.get('quotes')
    const from = url.searchParams.get('from')
    const to = url.searchParams.get('to')

    if (from || to) {
      const series = filterRates([...TICKER_SERIES, ...TIME_SERIES_FIXTURE], {
        base,
        quotes,
        from,
        to,
      })

      return HttpResponse.json(series)
    }

    const latest = filterRates([...LATEST_RATES_EUR], {
      base,
      quotes,
    })

    return HttpResponse.json(latest)
  }),
]

export const frankfurterErrorHandlers = {
  currenciesServerError: http.get('*/currencies', () => {
    return HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }),

  ratesServerError: http.get('*/rates', () => {
    return HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }),

  ratesEmpty: http.get('*/rates', () => {
    return HttpResponse.json([])
  }),

  ratesMalformed: http.get('*/rates', () => {
    return HttpResponse.json([{ date: 'not-a-date', base: 'eur', quote: 'usd', rate: -1 }])
  }),

  currenciesMalformed: http.get('*/currencies', () => {
    return HttpResponse.json([{ iso_code: 'usd', name: '' }])
  }),
}
