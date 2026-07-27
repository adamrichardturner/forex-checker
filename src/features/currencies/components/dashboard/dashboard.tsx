'use client'

import { CurrencyPersistenceProvider } from '../../persistence/currency-persistence-provider'
import { useCurrencyExchange } from '../../hooks/use-currency-exchange'
import { parseAmountInput } from '../../utils/amount-input'
import { ForexTicker } from '../forex-ticker'
import { NavigationTabs } from '../navigation-tabs'
import { RateChecker } from '../rate-checker'
import styles from './dashboard.module.scss'

function DashboardContent() {
  const exchange = useCurrencyExchange()

  return (
    <main className={styles.dashboard}>
      <ForexTicker />
      <div className={styles.dashboardContent}>
        <RateChecker {...exchange} />
        <NavigationTabs
          base={exchange.sendCurrency}
          quote={exchange.receiveCurrency}
          amount={parseAmountInput(exchange.sendAmount)}
          formattedAmount={exchange.sendAmount}
        />
      </div>
    </main>
  )
}

export function Dashboard() {
  return (
    <CurrencyPersistenceProvider>
      <DashboardContent />
    </CurrencyPersistenceProvider>
  )
}
