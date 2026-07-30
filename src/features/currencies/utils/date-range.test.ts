import { DateTime } from 'luxon'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { APP_TIMEZONE } from '../model/timezone.constants'
import { getTickerDateRange, rangeToDates } from './date-range'

describe('rangeToDates', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('computes each range preset in Europe/London', () => {
    vi.setSystemTime(DateTime.fromISO('2026-07-28T15:30:00', { zone: APP_TIMEZONE }).toJSDate())

    expect(rangeToDates('1D')).toEqual({
      start: '2026-07-27',
      end: '2026-07-28',
      includesToday: true,
    })
    expect(rangeToDates('1W')).toEqual({
      start: '2026-07-21',
      end: '2026-07-28',
      includesToday: true,
    })
    expect(rangeToDates('1M')).toEqual({
      start: '2026-06-28',
      end: '2026-07-28',
      includesToday: true,
    })
    expect(rangeToDates('3M')).toEqual({
      start: '2026-04-28',
      end: '2026-07-28',
      includesToday: true,
    })
    expect(rangeToDates('1Y')).toEqual({
      start: '2025-07-28',
      end: '2026-07-28',
      includesToday: true,
    })
    expect(rangeToDates('5Y')).toEqual({
      start: '2021-07-28',
      end: '2026-07-28',
      includesToday: true,
    })
  })

  it('uses London day boundaries across BST', () => {
    vi.setSystemTime(DateTime.fromISO('2026-03-30T00:30:00', { zone: APP_TIMEZONE }).toJSDate())

    expect(rangeToDates('1D')).toEqual({
      start: '2026-03-29',
      end: '2026-03-30',
      includesToday: true,
    })
  })

  it('uses London day boundaries across the autumn clock change', () => {
    vi.setSystemTime(DateTime.fromISO('2026-10-25T00:30:00', { zone: APP_TIMEZONE }).toJSDate())

    expect(rangeToDates('1W')).toEqual({
      start: '2026-10-18',
      end: '2026-10-25',
      includesToday: true,
    })
  })
})

describe('getTickerDateRange', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns a seven-day window ending today in London', () => {
    vi.setSystemTime(DateTime.fromISO('2026-07-28T12:00:00', { zone: APP_TIMEZONE }).toJSDate())

    expect(getTickerDateRange()).toEqual({
      start: '2026-07-21',
      end: '2026-07-28',
    })
  })
})
