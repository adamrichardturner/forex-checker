import { describe, expect, it } from 'vitest'
import {
  frankfurterCurrenciesSchema,
  frankfurterCurrencySchema,
  frankfurterLatestRatesSchema,
  frankfurterRateSchema,
} from './frankfurter.schemas'

describe('frankfurterCurrencySchema', () => {
  it('accepts a valid currency', () => {
    const result = frankfurterCurrencySchema.parse({
      iso_code: 'USD',
      name: 'US Dollar',
      symbol: '$',
      iso_numeric: '840',
      start_date: '1999-01-01',
      end_date: null,
    })

    expect(result.iso_code).toBe('USD')
  })

  it('allows nullable optional fields to be omitted', () => {
    expect(
      frankfurterCurrencySchema.parse({
        iso_code: 'EUR',
        name: 'Euro',
      }),
    ).toEqual({
      iso_code: 'EUR',
      name: 'Euro',
    })
  })

  it('rejects lowercase and non-three-letter codes', () => {
    expect(() => frankfurterCurrencySchema.parse({ iso_code: 'usd', name: 'US Dollar' })).toThrow()
    expect(() => frankfurterCurrencySchema.parse({ iso_code: 'USDT', name: 'Tether' })).toThrow()
  })

  it('rejects empty names', () => {
    expect(() => frankfurterCurrencySchema.parse({ iso_code: 'USD', name: '' })).toThrow()
  })
})

describe('frankfurterCurrenciesSchema', () => {
  it('accepts an array of currencies', () => {
    expect(
      frankfurterCurrenciesSchema.parse([
        { iso_code: 'USD', name: 'US Dollar' },
        { iso_code: 'EUR', name: 'Euro' },
      ]),
    ).toHaveLength(2)
  })
})

describe('frankfurterRateSchema', () => {
  it('accepts a valid rate row', () => {
    expect(
      frankfurterRateSchema.parse({
        date: '2026-07-28',
        base: 'EUR',
        quote: 'USD',
        rate: 1.1,
      }),
    ).toMatchObject({ rate: 1.1 })
  })

  it('rejects non-ISO dates and non-positive rates', () => {
    expect(() =>
      frankfurterRateSchema.parse({
        date: '28/07/2026',
        base: 'EUR',
        quote: 'USD',
        rate: 1.1,
      }),
    ).toThrow()

    expect(() =>
      frankfurterRateSchema.parse({
        date: '2026-07-28',
        base: 'EUR',
        quote: 'USD',
        rate: 0,
      }),
    ).toThrow()

    expect(() =>
      frankfurterRateSchema.parse({
        date: '2026-07-28',
        base: 'EUR',
        quote: 'USD',
        rate: -1,
      }),
    ).toThrow()
  })
})

describe('frankfurterLatestRatesSchema', () => {
  it('accepts an array of rate rows', () => {
    expect(
      frankfurterLatestRatesSchema.parse([
        { date: '2026-07-28', base: 'EUR', quote: 'USD', rate: 1.1 },
      ]),
    ).toHaveLength(1)
  })
})
