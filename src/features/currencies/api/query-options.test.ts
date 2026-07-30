import { DateTime } from 'luxon'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ECB_TIMEZONE } from '../model/timezone.constants'
import { msUntilNextEcbPublish } from '../utils/ecb-schedule'
import {
  currenciesQueryOptions,
  latestRatesQueryOptions,
  tickerRatesQueryOptions,
  timeSeriesQueryOptions,
} from './query-options'

describe('query options', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(DateTime.fromISO('2026-07-28T10:00:00', { zone: ECB_TIMEZONE }).toJSDate())
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('keeps currencies fresh forever with a seven-day gcTime', () => {
    expect(currenciesQueryOptions.staleTime).toBe(Infinity)
    expect(currenciesQueryOptions.gcTime).toBe(7 * 24 * 60 * 60 * 1000)
  })

  it('uses the next ECB publish for latest rates staleTime', () => {
    const options = latestRatesQueryOptions('EUR')
    expect(options.staleTime).toBe(msUntilNextEcbPublish())
    expect(options.gcTime).toBe(24 * 60 * 60 * 1000)
  })

  it('switches time series staleTime based on includesToday', () => {
    const withToday = timeSeriesQueryOptions({
      base: 'EUR',
      quote: 'USD',
      start: '2026-07-01',
      end: '2026-07-28',
      includesToday: true,
    })
    const historic = timeSeriesQueryOptions({
      base: 'EUR',
      quote: 'USD',
      start: '2025-07-01',
      end: '2025-07-28',
      includesToday: false,
    })

    expect(withToday.staleTime).toBe(msUntilNextEcbPublish())
    expect(historic.staleTime).toBe(Infinity)
    expect(withToday.gcTime).toBe(7 * 24 * 60 * 60 * 1000)
  })

  it('uses the next ECB publish for ticker rates', () => {
    const options = tickerRatesQueryOptions('EUR', '2026-07-21', '2026-07-28')
    expect(options.staleTime).toBe(msUntilNextEcbPublish())
    expect(options.gcTime).toBe(24 * 60 * 60 * 1000)
  })
})
