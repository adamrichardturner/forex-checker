import { describe, expect, it } from 'vitest'
import { crossRate, toRatesLookup, tryCrossRate, type RatesLookup } from './cross-rate'

const rates: RatesLookup = {
  EUR: 1,
  USD: 1.1,
  GBP: 0.85,
  JPY: 160,
}

describe('tryCrossRate', () => {
  it('returns 1 when base equals quote', () => {
    expect(tryCrossRate(rates, 'USD', 'USD')).toBe(1)
  })

  it('derives EUR-based and cross rates', () => {
    expect(tryCrossRate(rates, 'EUR', 'USD')).toBeCloseTo(1.1)
    expect(tryCrossRate(rates, 'USD', 'GBP')).toBeCloseTo(0.85 / 1.1)
  })

  it('returns null when a rate is missing', () => {
    expect(tryCrossRate(rates, 'USD', 'AUD')).toBeNull()
    expect(tryCrossRate(rates, 'AUD', 'USD')).toBeNull()
  })
})

describe('crossRate', () => {
  it('returns the derived rate when available', () => {
    expect(crossRate(rates, 'EUR', 'JPY')).toBe(160)
  })

  it('throws when a required rate is missing', () => {
    expect(() => crossRate(rates, 'USD', 'AUD')).toThrow('Missing rate for AUD')
    expect(() => crossRate(rates, 'AUD', 'USD')).toThrow('Missing rate for AUD')
  })
})

describe('toRatesLookup', () => {
  it('seeds the ECB base at 1 and maps quote rows', () => {
    const lookup = toRatesLookup('EUR', [
      { base: 'EUR', quote: 'USD', rate: 1.1 },
      { base: 'EUR', quote: 'GBP', rate: 0.85 },
      { base: 'USD', quote: 'JPY', rate: 150 },
    ])

    expect(lookup).toEqual({
      EUR: 1,
      USD: 1.1,
      GBP: 0.85,
    })
  })
})
