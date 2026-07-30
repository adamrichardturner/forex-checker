'use client'

import { useQuery } from '@tanstack/react-query'
import { BaseCard } from '@/components/layout/base-card'
import { currenciesQueryOptions } from '../../api/query-options'
import { useCompareRates } from '../../hooks/use-compare-rates'
import { COMPARE_CURRENCIES } from '../../model/currency.constants'
import { useFavouritePairsContext } from '../../persistence/currency-persistence-provider'
import { TabEmptyState } from '../tab-empty-state'
import { CompareRow } from './compare-row'
import styles from './compare.module.scss'

type CompareProps = {
  base: string
  quote: string
  amount: number
  formattedAmount: string
}

function getCompareQuotes(base: string, quote: string): string[] {
  const quotes: string[] = []

  for (const code of COMPARE_CURRENCIES) {
    if (code === base) {
      continue
    }

    if (code === quote) {
      continue
    }

    quotes.push(code)
  }

  return quotes
}

export function Compare({ base, quote, amount, formattedAmount }: CompareProps) {
  const compareQuotes = getCompareQuotes(base, quote)
  const hasAmount = amount > 0
  const { data: rows, isPending, isError } = useCompareRates(base, amount, compareQuotes)
  const { data: currencies } = useQuery({ ...currenciesQueryOptions })
  const { isFavourite, toggleFavourite } = useFavouritePairsContext()

  if (!hasAmount) {
    return (
      <TabEmptyState
        title="No comparison available"
        description="Enter an amount in SEND above to see what your money is worth in other currencies."
      />
    )
  }

  const currencyNames: Record<string, string> = {}

  if (currencies) {
    for (const currency of currencies) {
      currencyNames[currency.iso_code] = currency.name
    }
  }

  const amountDisplay = formattedAmount.length > 0 ? formattedAmount : '0'
  const pairCount = rows?.length ?? compareQuotes.length

  return (
    <div className={styles.compare}>
      <BaseCard level="level-1" className={styles.compareCard}>
        <div className={styles.compareHeader}>
          <p className={styles.compareHeaderLabel}>
            Multi-currency{' '}
            <span className={styles.compareHeaderEmphasis}>
              {amountDisplay} from {base}
            </span>
          </p>
          <p className={styles.compareHeaderCount}>
            <span>{pairCount}</span> pairs
          </p>
        </div>

        {isPending && !rows ? <p className={styles.compareStatus}>Loading comparisons…</p> : null}
        {isError && !rows ? (
          <p className={styles.compareStatus}>Failed to load comparisons</p>
        ) : null}
        {!isPending && !isError && compareQuotes.length === 0 ? (
          <p className={styles.compareStatus}>No comparison currencies available for this pair.</p>
        ) : null}
        {rows && rows.length > 0 ? (
          <ul className={styles.compareList}>
            {rows.map((row) => (
              <CompareRow
                key={row.quote}
                base={base}
                row={row}
                currencyName={currencyNames[row.quote] ?? row.quote}
                isFavourite={isFavourite(base, row.quote)}
                onToggleFavourite={toggleFavourite}
              />
            ))}
          </ul>
        ) : null}
      </BaseCard>
    </div>
  )
}
