import { describe, expect, it } from 'vitest'
import { ZodError } from 'zod'
import { CURRENCIES_FIXTURE } from '../../../../tests/fixtures/frankfurter'
import { http, HttpResponse } from 'msw'
import { frankfurterErrorHandlers } from '../../../../tests/msw/handlers'
import { server } from '../../../../tests/msw/server'
import { getCurrencies } from './get-currencies'

describe('getCurrencies', () => {
  it('fetches and validates the currencies list', async () => {
    await expect(getCurrencies()).resolves.toEqual(CURRENCIES_FIXTURE)
  })

  it('keeps only fiat currencies from the v2 multi-asset list', async () => {
    server.use(
      http.get('*/currencies', () =>
        HttpResponse.json([
          { iso_code: 'AAVE', iso_numeric: null, name: 'Aave', symbol: 'AAVE', type: 'crypto' },
          { iso_code: 'EUR', iso_numeric: '978', name: 'Euro', symbol: '€', type: 'currency' },
          { iso_code: 'XAU', iso_numeric: '959', name: 'Gold', symbol: null, type: 'metal' },
          { iso_code: 'USDT', iso_numeric: null, name: 'Tether', symbol: '₮', type: 'crypto' },
        ]),
      ),
    )

    const currencies = await getCurrencies()

    expect(currencies.map((currency) => currency.iso_code)).toEqual(['EUR'])
  })

  it('throws with status details on a non-OK response', async () => {
    server.use(frankfurterErrorHandlers.currenciesServerError)

    await expect(getCurrencies()).rejects.toThrow('Failed to fetch currencies: 500')
  })

  it('throws a Zod error for a malformed body', async () => {
    server.use(frankfurterErrorHandlers.currenciesMalformed)

    await expect(getCurrencies()).rejects.toBeInstanceOf(ZodError)
  })
})
