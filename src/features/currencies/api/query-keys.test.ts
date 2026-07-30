import { describe, expect, it } from 'vitest'
import { currencyKeys } from './query-keys'

describe('currencyKeys', () => {
  it('builds stable list and latest keys', () => {
    expect(currencyKeys.list()).toEqual(['currencies', 'list'])
    expect(currencyKeys.latest('EUR')).toEqual(['rates', 'latest', 'EUR'])
  })

  it('keeps time series and ticker keys unique by params', () => {
    expect(currencyKeys.timeSeries('EUR', 'USD', '2026-01-01', '2026-01-31')).toEqual([
      'rates',
      'series',
      'EUR',
      'USD',
      '2026-01-01',
      '2026-01-31',
    ])

    expect(currencyKeys.ticker('EUR', '2026-07-21', '2026-07-28')).toEqual([
      'rates',
      'ticker',
      'EUR',
      '2026-07-21',
      '2026-07-28',
    ])

    expect(currencyKeys.timeSeries('EUR', 'USD', '2026-01-01', '2026-01-31')).not.toEqual(
      currencyKeys.timeSeries('EUR', 'GBP', '2026-01-01', '2026-01-31'),
    )
  })
})
