'use client'

import styles from './dashboard.module.scss'
import { ForexTicker } from '../forex-ticker'
import { RateChecker } from '../rate-checker'

export function Dashboard() {
  return (
    <main className={styles.dashboard}>
      <ForexTicker />
      <div className={styles.dashboardContent}>
        <RateChecker />
      </div>
    </main>
  )
}
