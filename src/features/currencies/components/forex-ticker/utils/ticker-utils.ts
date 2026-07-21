import type { TickerItem } from '../../../model/currency-ticker.types'
import styles from '../forex-ticker.module.scss'

export const TICKER_SKELETON_ITEM_COUNT = 10

export function formatRate(rate: number): string {
  if (rate >= 100) {
    return rate.toFixed(2)
  }

  return rate.toFixed(4)
}

export function formatChange(changePct: number | null): string {
  if (changePct === null) {
    return '—'
  }

  const prefix = changePct > 0 ? '+' : ''

  return `${prefix}${changePct.toFixed(2)}%`
}

export function getChangeClassName(direction: TickerItem['direction']): string {
  if (direction === 'up') {
    return styles.forexTickerChangeUp
  }

  if (direction === 'down') {
    return styles.forexTickerChangeDown
  }

  return styles.forexTickerChangeFlat
}

export function getChangePrefix(direction: TickerItem['direction']): string {
  if (direction === 'up') {
    return '▲ '
  }

  if (direction === 'down') {
    return '▼ '
  }

  return ''
}
