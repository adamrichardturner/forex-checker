import { describe, expect, it } from 'vitest'
import { ZodError } from 'zod'
import { CURRENCIES_FIXTURE } from '../../../../tests/fixtures/frankfurter'
import { frankfurterErrorHandlers } from '../../../../tests/msw/handlers'
import { server } from '../../../../tests/msw/server'
import { getCurrencies } from './get-currencies'

describe('getCurrencies', () => {
  it('fetches and validates the currencies list', async () => {
    await expect(getCurrencies()).resolves.toEqual(CURRENCIES_FIXTURE)
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
