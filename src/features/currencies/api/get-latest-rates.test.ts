import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { ZodError } from 'zod'
import { LATEST_RATES_EUR } from '../../../../tests/fixtures/frankfurter'
import { frankfurterErrorHandlers } from '../../../../tests/msw/handlers'
import { server } from '../../../../tests/msw/server'
import { getLatestRates } from './get-latest-rates'

describe('getLatestRates', () => {
  it('requests rates with the base query param', async () => {
    let requestedUrl = ''

    server.use(
      http.get('*/rates', ({ request }) => {
        requestedUrl = request.url
        return HttpResponse.json([...LATEST_RATES_EUR])
      }),
    )

    const rates = await getLatestRates('EUR')

    expect(new URL(requestedUrl).searchParams.get('base')).toBe('EUR')
    expect(rates).toEqual([...LATEST_RATES_EUR])
  })

  it('throws with status details on a non-OK response', async () => {
    server.use(frankfurterErrorHandlers.ratesServerError)

    await expect(getLatestRates('EUR')).rejects.toThrow('Failed to fetch latest rates: 500')
  })

  it('throws a Zod error for a malformed body', async () => {
    server.use(frankfurterErrorHandlers.ratesMalformed)

    await expect(getLatestRates('EUR')).rejects.toBeInstanceOf(ZodError)
  })
})
