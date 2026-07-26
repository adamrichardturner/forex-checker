'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CurrencyFlag from '../currency-button/currency-flag'
import type { CompareRateRow } from '../../hooks/use-compare-rates'
import { formatConvertedAmount, formatExchangeRate } from '../../utils/amount-input'
import styles from './compare.module.scss'

type CompareRowProps = {
  base: string
  row: CompareRateRow
  currencyName: string
  isFavourite: boolean
  onToggleFavourite: (base: string, quote: string) => Promise<boolean>
}

export function CompareRow({
  base,
  row,
  currencyName,
  isFavourite,
  onToggleFavourite,
}: CompareRowProps) {
  const [isToggling, setIsToggling] = useState(false)

  const handleToggleFavourite = async () => {
    if (isToggling) {
      return
    }

    setIsToggling(true)

    try {
      await onToggleFavourite(base, row.quote)
    } finally {
      setIsToggling(false)
    }
  }

  return (
    <li className={styles.compareItem}>
      <div className={styles.compareIdentity}>
        <CurrencyFlag currencyCode={row.quote} className={styles.compareFlag} />
        <div className={styles.compareText}>
          <p className={styles.compareCode}>{row.quote}</p>
          <p className={styles.compareName}>{currencyName}</p>
        </div>
      </div>

      <div className={styles.compareValues}>
        <p className={styles.compareAmount}>
          {row.converted !== null ? formatConvertedAmount(row.converted) : '—'}
        </p>
        <p className={styles.compareRate}>
          {row.rate !== null ? `@ ${formatExchangeRate(row.rate)}` : '@ —'}
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        size="icon"
        className={styles.compareFavouriteButton}
        onClick={() => {
          void handleToggleFavourite()
        }}
        disabled={isToggling}
        aria-pressed={isFavourite}
        aria-label={
          isFavourite
            ? `Remove ${base} to ${row.quote} from favourites`
            : `Add ${base} to ${row.quote} to favourites`
        }
      >
        <Star fill={isFavourite ? 'currentColor' : 'none'} />
      </Button>
    </li>
  )
}
