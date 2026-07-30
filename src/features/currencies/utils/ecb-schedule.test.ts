import { DateTime } from 'luxon'
import { describe, expect, it } from 'vitest'
import { ECB_TIMEZONE } from '../model/timezone.constants'
import { msUntilNextEcbPublish, msUntilNextWorkingDayTime } from './ecb-schedule'

describe('msUntilNextWorkingDayTime', () => {
  it('returns the remaining ms before today publish time', () => {
    const now = DateTime.fromISO('2026-07-28T10:00:00', { zone: ECB_TIMEZONE }).toJSDate()
    const expected = DateTime.fromISO('2026-07-28T16:00:00', { zone: ECB_TIMEZONE }).toMillis()

    expect(msUntilNextWorkingDayTime({ hour: 16, timeZone: ECB_TIMEZONE }, now)).toBe(
      expected - now.getTime(),
    )
  })

  it('rolls to the next weekday after publish time', () => {
    const now = DateTime.fromISO('2026-07-28T16:00:00', { zone: ECB_TIMEZONE }).toJSDate()
    const expected = DateTime.fromISO('2026-07-29T16:00:00', { zone: ECB_TIMEZONE }).toMillis()

    expect(msUntilNextWorkingDayTime({ hour: 16, timeZone: ECB_TIMEZONE }, now)).toBe(
      expected - now.getTime(),
    )
  })

  it('rolls Friday afternoon to Monday', () => {
    const now = DateTime.fromISO('2026-07-31T17:00:00', { zone: ECB_TIMEZONE }).toJSDate()
    const expected = DateTime.fromISO('2026-08-03T16:00:00', { zone: ECB_TIMEZONE }).toMillis()

    expect(msUntilNextWorkingDayTime({ hour: 16, timeZone: ECB_TIMEZONE }, now)).toBe(
      expected - now.getTime(),
    )
  })

  it('skips Saturday and Sunday', () => {
    const saturday = DateTime.fromISO('2026-08-01T10:00:00', { zone: ECB_TIMEZONE }).toJSDate()
    const sunday = DateTime.fromISO('2026-08-02T10:00:00', { zone: ECB_TIMEZONE }).toJSDate()
    const monday = DateTime.fromISO('2026-08-03T16:00:00', { zone: ECB_TIMEZONE }).toMillis()

    expect(msUntilNextWorkingDayTime({ hour: 16, timeZone: ECB_TIMEZONE }, saturday)).toBe(
      monday - saturday.getTime(),
    )
    expect(msUntilNextWorkingDayTime({ hour: 16, timeZone: ECB_TIMEZONE }, sunday)).toBe(
      monday - sunday.getTime(),
    )
  })

  it('preserves local wall-clock time across the CET/CEST switch', () => {
    const beforeSwitch = DateTime.fromISO('2026-03-27T17:00:00', { zone: ECB_TIMEZONE }).toJSDate()
    const nextPublish = DateTime.fromISO('2026-03-30T16:00:00', { zone: ECB_TIMEZONE })

    expect(msUntilNextWorkingDayTime({ hour: 16, timeZone: ECB_TIMEZONE }, beforeSwitch)).toBe(
      nextPublish.toMillis() - beforeSwitch.getTime(),
    )
    expect(nextPublish.offset).toBe(120)
  })

  it('rejects invalid hour and minute values', () => {
    expect(() => msUntilNextWorkingDayTime({ hour: 24 })).toThrow(RangeError)
    expect(() => msUntilNextWorkingDayTime({ hour: 16, minute: 60 })).toThrow(RangeError)
  })

  it('rejects an invalid timezone', () => {
    expect(() =>
      msUntilNextWorkingDayTime({ hour: 16, timeZone: 'Not/AZone' }, new Date()),
    ).toThrow(RangeError)
  })
})

describe('msUntilNextEcbPublish', () => {
  it('delegates to the Berlin 16:00 schedule', () => {
    const now = DateTime.fromISO('2026-07-28T10:00:00', { zone: ECB_TIMEZONE }).toJSDate()
    const expected = msUntilNextWorkingDayTime({ hour: 16, timeZone: ECB_TIMEZONE }, now)

    expect(msUntilNextEcbPublish(now)).toBe(expected)
  })
})
