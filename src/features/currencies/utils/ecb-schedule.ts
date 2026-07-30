import { DateTime } from 'luxon'
import { ECB_PUBLISH_HOUR, ECB_TIMEZONE } from '../model/timezone.constants'

export interface WorkingDayTimeOptions {
  hour: number
  minute?: number
  /**
   * IANA timezone for the wall-clock schedule.
   * Defaults to the browser/runtime timezone when omitted.
   */
  timeZone?: string
}

/**
 * Returns the milliseconds until the next Monday-Friday occurrence of a
 * wall-clock time.
 *
 * Calendar-day arithmetic preserves the configured local time across DST.
 */
export function msUntilNextWorkingDayTime(
  { hour, minute = 0, timeZone }: WorkingDayTimeOptions,
  now: Date = new Date(),
): number {
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
    throw new RangeError('hour must be an integer between 0 and 23')
  }

  if (!Number.isInteger(minute) || minute < 0 || minute > 59) {
    throw new RangeError('minute must be an integer between 0 and 59')
  }

  const current = DateTime.fromJSDate(now, {
    zone: timeZone,
  })

  if (!current.isValid) {
    throw new RangeError(current.invalidExplanation ?? 'Invalid date or timezone')
  }

  let nextPublish = current.set({
    hour,
    minute,
    second: 0,
    millisecond: 0,
  })

  // The current publication window has already started, so use tomorrow.
  if (nextPublish.toMillis() <= current.toMillis()) {
    nextPublish = nextPublish.plus({ days: 1 })
  }

  // Luxon weekdays are 1–7, with Saturday = 6 and Sunday = 7.
  while (nextPublish.weekday > 5) {
    nextPublish = nextPublish.plus({ days: 1 })
  }

  return nextPublish.toMillis() - current.toMillis()
}

export function msUntilNextEcbPublish(now: Date = new Date()): number {
  return msUntilNextWorkingDayTime(
    {
      hour: ECB_PUBLISH_HOUR,
      timeZone: ECB_TIMEZONE,
    },
    now,
  )
}
