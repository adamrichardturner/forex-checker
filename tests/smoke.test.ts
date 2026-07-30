import { describe, expect, it } from 'vitest'
import { FRANKFURTER_BASE_URL } from '@/features/currencies/model/currency.constants'
import { getCurrencies } from '@/features/currencies/api/get-currencies'
import { getLatestRates } from '@/features/currencies/api/get-latest-rates'
import { CURRENCIES_FIXTURE, LATEST_RATES_EUR } from './fixtures/frankfurter'

describe('test infrastructure', () => {
  it('defaults the frankfurter base url for unit tests', () => {
    expect(FRANKFURTER_BASE_URL).toBe('https://api.frankfurter.dev/v2')
  })

  it('serves currencies through MSW', async () => {
    const currencies = await getCurrencies()
    expect(currencies).toEqual(CURRENCIES_FIXTURE)
  })

  it('serves latest rates through MSW', async () => {
    const rates = await getLatestRates('EUR')
    expect(rates).toEqual([...LATEST_RATES_EUR])
  })
})
