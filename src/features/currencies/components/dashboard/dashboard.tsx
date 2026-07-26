'use client'

import styles from './dashboard.module.scss'
import { ForexTicker } from '../forex-ticker'
import { RateChecker } from '../rate-checker'
import { Favourites } from '../favourites'
import { ConversionHistory } from '../conversion-history'
import { CurrencyPersistenceProvider } from '../../persistence/currency-persistence-provider'

export function Dashboard() {
  return (
    <CurrencyPersistenceProvider>
      <main className={styles.dashboard}>
        <ForexTicker />
        <div className={styles.dashboardContent}>
          <RateChecker />
          <Favourites />
          <ConversionHistory />
        </div>
      </main>
    </CurrencyPersistenceProvider>
  )
}
