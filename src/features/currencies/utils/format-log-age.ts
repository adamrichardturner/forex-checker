import { DateTime } from 'luxon'
import { APP_TIMEZONE } from '../model/timezone.constants'

export function formatLogAge(
  timestamp: number,
  now = DateTime.now().setZone(APP_TIMEZONE),
): string {
  const createdAt = DateTime.fromMillis(timestamp, { zone: APP_TIMEZONE })

  if (!createdAt.isValid) {
    return '—'
  }

  const diffMinutes = Math.floor(now.diff(createdAt, 'minutes').minutes)

  if (diffMinutes < 60) {
    return `${Math.max(0, diffMinutes)}M`
  }

  const diffHours = Math.floor(now.diff(createdAt, 'hours').hours)

  if (diffHours < 24) {
    return `${diffHours}H`
  }

  return createdAt.toFormat('d MMM')
}
