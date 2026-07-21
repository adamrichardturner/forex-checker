'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useForexTicker } from '../../hooks/use-forex-ticker'
import type { TickerItem } from '../../model/currency-ticker.types'
import styles from './forex-ticker.module.scss'
import {
  formatChange,
  formatRate,
  getChangeClassName,
  getChangePrefix,
  TICKER_SKELETON_ITEM_COUNT,
} from './utils/ticker-utils'

function ForexTickerSkeletonItem() {
  return (
    <div className={styles.forexTickerItem}>
      <Skeleton className="h-3 w-12 max-md:h-2.5 max-md:w-10" />
      <Skeleton className="h-3 w-14 max-md:h-2.5 max-md:w-12" />
      <Skeleton className="h-3 w-16 max-md:h-2.5 max-md:w-14" />
    </div>
  )
}

function ForexTickerSkeleton() {
  const skeletonItems = []

  for (let index = 0; index < TICKER_SKELETON_ITEM_COUNT; index++) {
    skeletonItems.push(<ForexTickerSkeletonItem key={index} />)
  }

  return (
    <div className={styles.forexTicker} aria-busy="true" aria-label="Loading markets ticker">
      <div className={cn(styles.forexTickerLabel, 'w-[139.92px]')}>
        <Skeleton className="size-1.5 rounded-full bg-neutral-900/20" />
        <Skeleton className="h-3 w-[5.5rem] rounded bg-neutral-900/20 max-md:h-2.5 max-md:w-[4.5rem]" />
      </div>

      <div className={styles.forexTickerViewport}>
        <div className={styles.forexTickerTrack}>{skeletonItems}</div>
      </div>
    </div>
  )
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
    return <ForexTickerSkeleton />
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
