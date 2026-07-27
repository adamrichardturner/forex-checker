'use client'

import { BaseCard } from '@/components/layout/base-card'
import { useFavouritePairsContext } from '../../persistence/currency-persistence-provider'
import { FavouritePairRow } from './favourite-pair-row'
import styles from './favourites.module.scss'

export function Favourites() {
  const { pairs, isLoading, error, removeFavourite } = useFavouritePairsContext()

  return (
    <div className={styles.favourites}>
      <BaseCard level="level-1" className={styles.favouritesBaseCard}>
        {isLoading ? <p className={styles.favouritesEmpty}>Loading favourites…</p> : null}
        {error ? <p className={styles.favouritesEmpty}>Failed to load favourites</p> : null}
        {!isLoading && !error && pairs.length === 0 ? (
          <p className={styles.favouritesEmpty}>
            Save a pair from the rate checker to see live rates here.
          </p>
        ) : null}
        {!isLoading && !error && pairs.length > 0 ? (
          <ul className={styles.favouritesList}>
            {pairs.map((pair) => (
              <FavouritePairRow
                key={pair.id}
                pair={pair}
                onRemove={(base, quote) => {
                  void removeFavourite(base, quote)
                }}
              />
            ))}
          </ul>
        ) : null}
      </BaseCard>
    </div>
  )
}
