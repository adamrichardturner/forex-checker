'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Star } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useFavouritePairRate } from '../../hooks/use-favourite-pair-rate'
import type { FavouritePair } from '../../model/persistence.types'
import { formatExchangeRate } from '../../utils/amount-input'
import styles from './favourites.module.scss'

interface FavouritePairRowProps {
  pair: FavouritePair
  onToggleFavourite: (base: string, quote: string) => Promise<boolean>
}

function formatChangePct(changePct: number): string {
  const abs = Math.abs(changePct).toFixed(2)

  if (changePct > 0) {
    return `+${abs}%`
  }

  if (changePct < 0) {
    return `-${abs}%`
  }

  return `${abs}%`
}

function getChangeClassName(changePct: number | null): string {
  if (changePct === null || changePct === 0) {
    return styles.favouritesChangeFlat
  }

  if (changePct > 0) {
    return styles.favouritesChangePositive
  }

  return styles.favouritesChangeNegative
}

export function FavouritePairRow({ pair, onToggleFavourite }: FavouritePairRowProps) {
  const prefersReducedMotion = useReducedMotion()
  const { data, isPending, isError } = useFavouritePairRate(pair.base, pair.quote)
  const [isToggling, setIsToggling] = useState(false)

  const handleToggleFavourite = async () => {
    if (isToggling) {
      return
    }

    setIsToggling(true)

    try {
      await onToggleFavourite(pair.base, pair.quote)
    } finally {
      setIsToggling(false)
    }
  }

  const rateLabel = data ? formatExchangeRate(data.rate) : '—'
  const changePct = data?.changePct ?? null
  const changeLabel = changePct === null ? '—' : formatChangePct(changePct)
  const showChange = !isPending && !isError

  return (
    <motion.li
      layout={prefersReducedMotion ? false : 'position'}
      className={styles.favouritesItem}
      style={{ width: '100%' }}
      initial={prefersReducedMotion ? false : { opacity: 0, y: -14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={
        prefersReducedMotion
          ? undefined
          : {
              opacity: 0,
              x: 28,
              scale: 0.97,
              transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
            }
      }
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : {
              layout: { type: 'spring', stiffness: 480, damping: 38, mass: 0.75 },
              opacity: { duration: 0.2 },
              y: { type: 'spring', stiffness: 480, damping: 34 },
              scale: { type: 'spring', stiffness: 480, damping: 34 },
            }
      }
    >
      <p className={styles.favouritesPair}>
        <span>{pair.base}</span>
        <Image
          src="/ArrowIcon.svg"
          alt=""
          width={11}
          height={11}
          className={styles.favouritesPairArrow}
          aria-hidden="true"
        />
        <span>{pair.quote}</span>
      </p>

      <div className={styles.favouritesValues}>
        <p className={styles.favouritesRate}>{isPending || isError ? '—' : rateLabel}</p>
        {showChange ? (
          <p className={cn(styles.favouritesChange, getChangeClassName(changePct))}>
            {changeLabel}
          </p>
        ) : null}
      </div>

      <Button
        type="button"
        variant="outline"
        size="icon"
        className={styles.favouritesFavouriteButton}
        onClick={() => {
          void handleToggleFavourite()
        }}
        disabled={isToggling}
        aria-pressed={true}
        aria-label={`Remove ${pair.base} to ${pair.quote} from favourites`}
      >
        <Star fill="currentColor" />
      </Button>
    </motion.li>
  )
}
