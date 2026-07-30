'use client'

import { AnimatePresence } from 'framer-motion'
import { BaseCard } from '@/components/layout/base-card'
import { useFavouritePairsContext } from '../../persistence/currency-persistence-provider'
import { TabEmptyState } from '../tab-empty-state'
import { FavouritePairRow } from './favourite-pair-row'
import styles from './favourites.module.scss'

export function Favourites() {
  const { pairs, isLoading, error, toggleFavourite } = useFavouritePairsContext()
  const favouritesLabel = pairs.length === 1 ? '1 pair' : `${pairs.length} pairs`
  const hasPairs = pairs.length > 0

  if (!isLoading && !error && !hasPairs) {
    return (
      <TabEmptyState
        title="No pinned pairs yet"
        description="Pin a pair to track its rate here. Tap the star icon on any conversion or comparison row."
      />
    )
  }

  return (
    <div className={styles.favourites}>
      <BaseCard level="level-1" className={styles.favouritesBaseCard}>
        <div className={styles.favouritesHeader}>
          <p className={styles.favouritesHeaderTitle}>Pinned Pairs</p>
          <p className={styles.favouritesHeaderCount}>{favouritesLabel}</p>
        </div>

        {isLoading ? <p className={styles.favouritesEmpty}>Loading favourites…</p> : null}
        {error ? <p className={styles.favouritesEmpty}>Failed to load favourites</p> : null}

        {!isLoading && !error && hasPairs ? (
          <div className={styles.favouritesContent}>
            <ul className={styles.favouritesList}>
              <AnimatePresence initial={false} mode="popLayout">
                {pairs.map((pair) => (
                  <FavouritePairRow key={pair.id} pair={pair} onToggleFavourite={toggleFavourite} />
                ))}
              </AnimatePresence>
            </ul>
          </div>
        ) : null}
      </BaseCard>
    </div>
  )
}
