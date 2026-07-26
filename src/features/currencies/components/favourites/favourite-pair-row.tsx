'use client'

import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useConversion } from '../../hooks/use-conversion'
import type { FavouritePair } from '../../model/persistence.types'
import { formatExchangeRate } from '../../utils/amount-input'
import styles from './favourites.module.scss'

interface FavouritePairRowProps {
  pair: FavouritePair
  onRemove: (base: string, quote: string) => void
}

export function FavouritePairRow({ pair, onRemove }: FavouritePairRowProps) {
  const { data, isPending, isError } = useConversion(pair.base, pair.quote, 1)

  const rateLabel =
    data?.rate !== undefined
      ? `1 ${pair.base} = ${formatExchangeRate(data.rate)} ${pair.quote}`
      : null

  return (
    <li className={styles.favouritesItem}>
      <div className={styles.favouritesItemMain}>
        <p className={styles.favouritesPair}>
          {pair.base} → {pair.quote}
        </p>
        {isPending ? <p className={styles.favouritesMeta}>Loading latest rate…</p> : null}
        {isError ? <p className={styles.favouritesMeta}>Unable to load latest rate</p> : null}
        {!isPending && !isError && rateLabel ? (
          <p className={styles.favouritesRate}>{rateLabel}</p>
        ) : null}
        {!isPending && !isError && data?.date ? (
          <p className={styles.favouritesMeta}>Rate date: {data.date}</p>
        ) : null}
      </div>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        className={styles.favouritesRemoveButton}
        onClick={() => {
          onRemove(pair.base, pair.quote)
        }}
        aria-label={`Remove ${pair.base} to ${pair.quote} from favourites`}
      >
        <Trash2 />
      </Button>
    </li>
  )
}
