import { DateTime } from 'luxon'
import { describe, expect, it } from 'vitest'
import { APP_TIMEZONE } from '../model/timezone.constants'
import { formatLogAge } from './format-log-age'

describe('formatLogAge', () => {
  const now = DateTime.fromISO('2026-07-28T15:00:00', { zone: APP_TIMEZONE })

  it('formats ages under one hour as minutes', () => {
    const timestamp = now.minus({ minutes: 12 }).toMillis()
    expect(formatLogAge(timestamp, now)).toBe('12M')
  })

  it('formats ages under one day as hours', () => {
    const timestamp = now.minus({ hours: 5 }).toMillis()
    expect(formatLogAge(timestamp, now)).toBe('5H')
  })

  it('uses the 60-minute and 24-hour boundaries', () => {
    expect(formatLogAge(now.minus({ minutes: 59 }).toMillis(), now)).toBe('59M')
    expect(formatLogAge(now.minus({ minutes: 60 }).toMillis(), now)).toBe('1H')
    expect(formatLogAge(now.minus({ hours: 23 }).toMillis(), now)).toBe('23H')
    expect(formatLogAge(now.minus({ hours: 24 }).toMillis(), now)).toBe('27 Jul')
  })

  it('clamps negative diffs to 0M', () => {
    expect(formatLogAge(now.plus({ minutes: 5 }).toMillis(), now)).toBe('0M')
  })

  it('returns an em dash for invalid timestamps', () => {
    expect(formatLogAge(Number.NaN, now)).toBe('—')
  })
})
