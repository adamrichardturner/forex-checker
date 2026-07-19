'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useForexTicker } from '../../hooks/use-forex-ticker'
import type { TickerItem } from '../../model/currency-ticker.types'
import styles from './forex-ticker.module.scss'
import { cn } from '@/lib/utils'

function formatRate(rate: number): string {
  if (rate >= 100) {
    return rate.toFixed(2)
  }

  return rate.toFixed(4)
}

function formatChange(changePct: number | null): string {
  if (changePct === null) {
    return '—'
  }

  const prefix = changePct > 0 ? '+' : ''

  return `${prefix}${changePct.toFixed(2)}%`
}

function getChangeClassName(direction: TickerItem['direction']): string {
  if (direction === 'up') {
    return styles.forexTickerChangeUp
  }

  if (direction === 'down') {
    return styles.forexTickerChangeDown
  }

  return styles.forexTickerChangeFlat
}

function getChangePrefix(direction: TickerItem['direction']): string {
  if (direction === 'up') {
    return '▲ '
  }

  if (direction === 'down') {
    return '▼ '
  }

  return ''
}

function TickerItemRow({ item }: { item: TickerItem }) {
  return (
    <div className={styles.forexTickerItem}>
      <span className={styles.forexTickerPair}>
        {item.base}/{item.quote}
      </span>
      <strong className={styles.forexTickerRate}>{formatRate(item.rate)}</strong>
      <span className={cn(styles.forexTickerChange, getChangeClassName(item.direction))}>
        {getChangePrefix(item.direction)}
        {formatChange(item.changePct)}
      </span>
    </div>
  )
}

export function ForexTicker() {
  const { data = [], isPending, isError } = useForexTicker()
  const prefersReducedMotion = useReducedMotion()

  if (isPending) {
    return <div className={styles.forexTickerStatus}>Loading markets…</div>
  }

  if (isError) {
    return <div className={styles.forexTickerStatus}>Unable to load markets</div>
  }

  if (data.length === 0) {
    return <div className={styles.forexTickerStatus}>No market data</div>
  }

  const loopItems = [...data, ...data]
  const durationSeconds = Math.max(24, data.length * 4)

  return (
    <div className={styles.forexTicker} aria-label="Live markets ticker">
      <div className={styles.forexTickerLabel}>
        <span className={styles.forexTickerDot} aria-hidden="true" />
        Live markets
      </div>

      <div className={styles.forexTickerViewport}>
        <motion.div
          className={styles.forexTickerTrack}
          animate={prefersReducedMotion ? { x: 0 } : { x: ['0%', '-50%'] }}
          transition={
            prefersReducedMotion
              ? undefined
              : {
                  x: {
                    repeat: Infinity,
                    repeatType: 'loop',
                    duration: durationSeconds,
                    ease: 'linear',
                  },
                }
          }
        >
          {loopItems.map((item, index) => (
            <TickerItemRow key={`${item.base}-${item.quote}-${index}`} item={item} />
          ))}
        </motion.div>
      </div>
    </div>
  )
}
