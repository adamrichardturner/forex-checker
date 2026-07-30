import { DateTime } from 'luxon'

export function formatLogAge(timestamp: number, now = DateTime.now()): string {
  const createdAt = DateTime.fromMillis(timestamp)

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
