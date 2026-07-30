import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { ZodError } from 'zod'
import { TIME_SERIES_FIXTURE } from '../../../../tests/fixtures/frankfurter'
import { frankfurterErrorHandlers } from '../../../../tests/msw/handlers'
import { server } from '../../../../tests/msw/server'
import { getTimeSeries } from './get-time-series'

describe('getTimeSeries', () => {
  it('builds the expected query string', async () => {
    let requestedUrl = ''

    server.use(
      http.get('*/rates', ({ request }) => {
        requestedUrl = request.url
        return HttpResponse.json(TIME_SERIES_FIXTURE.filter((row) => row.quote === 'USD'))
      }),
    )

    const series = await getTimeSeries({
      base: 'EUR',
      quote: 'USD',
      start: '2026-07-01',
      end: '2026-07-28',
    })

    const params = new URL(requestedUrl).searchParams
    expect(params.get('base')).toBe('EUR')
    expect(params.get('quotes')).toBe('USD')
    expect(params.get('from')).toBe('2026-07-01')
    expect(params.get('to')).toBe('2026-07-28')
    expect(series.every((row) => row.quote === 'USD')).toBe(true)
  })

  it('throws with status details on a non-OK response', async () => {
    server.use(frankfurterErrorHandlers.ratesServerError)

    await expect(
      getTimeSeries({
        base: 'EUR',
        quote: 'USD',
        start: '2026-07-01',
        end: '2026-07-28',
      }),
    ).rejects.toThrow('Failed to fetch time series: 500')
  })

  it('throws a Zod error for a malformed body', async () => {
    server.use(frankfurterErrorHandlers.ratesMalformed)

    await expect(
      getTimeSeries({
        base: 'EUR',
        quote: 'USD',
        start: '2026-07-01',
        end: '2026-07-28',
      }),
    ).rejects.toBeInstanceOf(ZodError)
  })
})
