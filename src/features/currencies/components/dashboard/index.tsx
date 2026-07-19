'use client'

import { BaseCard } from '@/components/layout/base-card'
import CurrencyButton from '../currency-button/currency-button'
import styles from './dashboard.module.scss'
import { CurrenciesResponse } from '../../model/currency.types'
import { useCurrencies } from '../../hooks/use-currencies'
import { ForexTicker } from '../forex-ticker'

interface DashboardProps {
  currencies: CurrenciesResponse
}

export function Dashboard({ currencies }: DashboardProps) {
  const { currenciesMap, selectedCurrency, setSelectedCurrency } = useCurrencies({ currencies })

  return (
    <main className={styles.dashboard}>
      <ForexTicker />
      <div className={styles.dashboardContent}>
        <CurrencyButton
          selectedCode={selectedCurrency}
          currencyMap={currenciesMap}
          onSelect={(code) => setSelectedCurrency(code)}
        />
        <BaseCard title="Forex checker" level="level-2">
          <p>Forex checker</p>
        </BaseCard>
      </div>
    </main>
  )
}
