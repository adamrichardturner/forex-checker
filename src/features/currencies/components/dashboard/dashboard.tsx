'use client'

import styles from './dashboard.module.scss'
import { ForexTicker } from '../forex-ticker'
import { RateChecker } from '../rate-checker'
import { CurrencyPersistenceProvider } from '../../persistence/currency-persistence-provider'

export function Dashboard() {
  return (
    <CurrencyPersistenceProvider>
      <main className={styles.dashboard}>
        <ForexTicker />
        <div className={styles.dashboardContent}>
          <RateChecker />
        </div>
      </main>
    </CurrencyPersistenceProvider>
  )
}
