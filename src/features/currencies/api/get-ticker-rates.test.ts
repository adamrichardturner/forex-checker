import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { ZodError } from 'zod'
import { TICKER_SERIES } from '../../../../tests/fixtures/frankfurter'
import { frankfurterErrorHandlers } from '../../../../tests/msw/handlers'
import { server } from '../../../../tests/msw/server'
import { getTickerRates } from './get-ticker-rates'

describe('getTickerRates', () => {
  it('builds the expected query string without quotes', async () => {
    let requestedUrl = ''

    server.use(
      http.get('*/rates', ({ request }) => {
        requestedUrl = request.url
        return HttpResponse.json([...TICKER_SERIES])
      }),
    )

    const series = await getTickerRates({
      base: 'EUR',
      start: '2026-07-21',
      end: '2026-07-28',
    })

    const params = new URL(requestedUrl).searchParams
    expect(params.get('base')).toBe('EUR')
    expect(params.get('from')).toBe('2026-07-21')
    expect(params.get('to')).toBe('2026-07-28')
    expect(params.get('quotes')).toBeNull()
    expect(series).toEqual([...TICKER_SERIES])
  })

  it('throws with status details on a non-OK response', async () => {
    server.use(frankfurterErrorHandlers.ratesServerError)

    await expect(
      getTickerRates({
        base: 'EUR',
        start: '2026-07-21',
        end: '2026-07-28',
      }),
    ).rejects.toThrow('Failed to fetch ticker rates: 500')
  })

  it('throws a Zod error for a malformed body', async () => {
    server.use(frankfurterErrorHandlers.ratesMalformed)

    await expect(
      getTickerRates({
        base: 'EUR',
        start: '2026-07-21',
        end: '2026-07-28',
      }),
    ).rejects.toBeInstanceOf(ZodError)
  })
})
